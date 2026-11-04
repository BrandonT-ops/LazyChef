import "server-only";
import { adminConfig } from "./config";

/** Minimal GitHub REST client using the server's repository token. */
async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { token } = adminConfig();
  // GITHUB_API_URL lets tests (or GitHub Enterprise) point elsewhere.
  const res = await fetch(`${process.env.GITHUB_API_URL || "https://api.github.com"}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GitHubError(res.status, `GitHub ${init.method ?? "GET"} ${path} failed: ${res.status} ${text.slice(0, 300)}`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export class GitHubError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

let branchCache: string | null = null;

export async function branch(): Promise<string> {
  const cfg = adminConfig();
  if (cfg.branch) return cfg.branch;
  if (!branchCache) branchCache = (await gh<{ default_branch: string }>(`/repos/${cfg.repo}`)).default_branch;
  return branchCache;
}

/** Reads a text file from the branch, or null when it doesn't exist. */
export async function readFile(path: string): Promise<string | null> {
  const { repo } = adminConfig();
  try {
    const f = await gh<{ content: string; encoding: string }>(
      `/repos/${repo}/contents/${path}?ref=${encodeURIComponent(await branch())}`,
    );
    return Buffer.from(f.content, f.encoding as BufferEncoding).toString("utf8");
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return null;
    throw e;
  }
}

export interface FileChange {
  path: string;
  /** Base64 file content. */
  base64: string;
}

/** Writes several files in one commit (git data API) and returns the commit's web URL. */
export async function commitFiles(files: FileChange[], message: string): Promise<string> {
  const { repo } = adminConfig();
  const ref = `heads/${await branch()}`;
  const head = await gh<{ object: { sha: string } }>(`/repos/${repo}/git/ref/${ref}`);
  const parent = await gh<{ tree: { sha: string } }>(`/repos/${repo}/git/commits/${head.object.sha}`);
  const tree = await Promise.all(
    files.map(async (f) => {
      const blob = await gh<{ sha: string }>(`/repos/${repo}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: f.base64, encoding: "base64" }),
      });
      return { path: f.path, mode: "100644", type: "blob", sha: blob.sha };
    }),
  );
  const newTree = await gh<{ sha: string }>(`/repos/${repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });
  const commit = await gh<{ sha: string; html_url: string }>(`/repos/${repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [head.object.sha] }),
  });
  await gh(`/repos/${repo}/git/refs/${ref}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });
  return commit.html_url;
}
