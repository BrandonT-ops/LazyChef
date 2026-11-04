import "server-only";

/**
 * Admin settings, all from environment variables (set them in Vercel, never in code):
 * - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET: a GitHub OAuth App, only used to know who is signing in.
 * - ADMIN_GITHUB_USERS: comma-separated GitHub usernames allowed into the admin.
 * - GITHUB_TOKEN: a fine-grained token with "Contents: read and write" on this repository only.
 * - SESSION_SECRET: a long random string used to sign the admin session cookie.
 * - GITHUB_REPO (optional, default BrandonT-ops/LazyChef) and GITHUB_BRANCH (optional, default: the repo's default branch).
 */
const REQUIRED = ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "GITHUB_TOKEN", "ADMIN_GITHUB_USERS", "SESSION_SECRET"] as const;

export function adminConfig() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32 && !missing.includes("SESSION_SECRET")) {
    missing.push("SESSION_SECRET");
  }
  return {
    configured: missing.length === 0,
    missing: [...missing],
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    token: process.env.GITHUB_TOKEN ?? "",
    secret: process.env.SESSION_SECRET ?? "",
    repo: process.env.GITHUB_REPO || "BrandonT-ops/LazyChef",
    branch: process.env.GITHUB_BRANCH || "",
    admins: (process.env.ADMIN_GITHUB_USERS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  };
}
