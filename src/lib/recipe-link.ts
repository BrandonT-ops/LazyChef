import type { RecipeLink, SectionId, Tag } from "@/data/types";

/**
 * A personal recipe packed into a link: /r#<data>. The part after # never
 * reaches the server, so sharing works with no backend and stays private.
 * Photos are not included (too big for a link).
 */
export interface SharedRecipe {
  name: string;
  section: SectionId;
  tags: Tag[];
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  video?: string;
  links: RecipeLink[];
  lang: string;
}

function toBase64Url(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

/** "z" + deflated data when the browser can compress, otherwise "p" + plain data. */
export async function encodeRecipe(r: SharedRecipe): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(r));
  if (typeof CompressionStream !== "undefined") {
    return `z${toBase64Url(await pipe(json, new CompressionStream("deflate-raw")))}`;
  }
  return `p${toBase64Url(json)}`;
}

export async function decodeRecipe(data: string): Promise<SharedRecipe | null> {
  try {
    const kind = data[0];
    let bytes = fromBase64Url(data.slice(1));
    if (kind === "z") bytes = await pipe(bytes, new DecompressionStream("deflate-raw"));
    else if (kind !== "p") return null;
    const r = JSON.parse(new TextDecoder().decode(bytes)) as SharedRecipe;
    return r && typeof r.name === "string" && Array.isArray(r.steps) ? r : null;
  } catch {
    return null;
  }
}
