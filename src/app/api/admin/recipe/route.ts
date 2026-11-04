import { NextResponse, type NextRequest } from "next/server";
import { SECTIONS } from "@/data/sections";
import { TAGS, type RecipeFile } from "@/data/types";
import { GitHubError, commitFiles, readFile, type FileChange } from "@/lib/admin/github";
import { readSession, sameOrigin } from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_NAME = /^[a-z0-9-]+\.(jpg|jpeg|png|webp)$/;
const MAX_NEW_IMAGES = 6;
const MAX_IMAGE_BYTES = 1_500_000;

const recipePath = (slug: string) => `content/recipes/${slug}.json`;

/** The latest saved version of a recipe, straight from GitHub (so you always edit the newest copy). */
export async function GET(req: NextRequest) {
  if (!readSession(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!SLUG.test(slug)) return NextResponse.json({ error: "bad slug" }, { status: 400 });
  try {
    const text = await readFile(recipePath(slug));
    return NextResponse.json({ recipe: text ? (JSON.parse(text) as RecipeFile) : null });
  } catch (e) {
    return NextResponse.json({ error: errorText(e) }, { status: 502 });
  }
}

interface SaveBody {
  slug: string;
  recipe: RecipeFile;
  /** New photos: file name + base64 JPEG/PNG/WebP. They're saved under public/recipes/<slug>/. */
  uploads?: { name: string; base64: string }[];
}

/** Saves a recipe (and its new photos) as one commit; Vercel then republishes the site. */
export async function PUT(req: NextRequest) {
  const login = readSession(req);
  if (!login) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  let body: SaveBody;
  try {
    body = (await req.json()) as SaveBody;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const problem = validate(body);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const { slug, recipe, uploads = [] } = body;
  const files: FileChange[] = uploads.map((u) => ({ path: `public/recipes/${slug}/${u.name}`, base64: u.base64 }));
  files.push({ path: recipePath(slug), base64: Buffer.from(`${JSON.stringify(tidy(recipe), null, 2)}\n`).toString("base64") });

  try {
    const label = recipe.name || slug;
    const commitUrl = await commitFiles(files, `Recipe: update ${label} (via admin by @${login})`);
    return NextResponse.json({ ok: true, commitUrl });
  } catch (e) {
    return NextResponse.json({ error: errorText(e) }, { status: 502 });
  }
}

function errorText(e: unknown) {
  if (e instanceof GitHubError && (e.status === 401 || e.status === 403)) {
    return "GitHub refused the save: check that GITHUB_TOKEN can write to this repository.";
  }
  return "GitHub didn't answer. Please try again.";
}

const isList = (v: unknown) => Array.isArray(v) && v.every((x) => typeof x === "string" && x.length <= 600) && v.length <= 60;

function validate(b: SaveBody): string | null {
  if (!b || typeof b !== "object") return "missing body";
  if (!SLUG.test(b.slug ?? "") || b.slug.length > 80) return "invalid dish id";
  const r = b.recipe;
  if (!r || typeof r !== "object") return "missing recipe";
  for (const k of ["prepMinutes", "cookMinutes", "servings"] as const) {
    if (typeof r[k] !== "number" || r[k] < 0 || r[k] > 10000) return `invalid ${k}`;
  }
  for (const k of ["ingredients", "steps"] as const) {
    if (!r[k] || !isList(r[k].en) || !isList(r[k].fr)) return `invalid ${k}`;
  }
  if (!r.ingredients.en.length && !r.ingredients.fr.length) return "add at least one thing to buy";
  if (!r.steps.en.length && !r.steps.fr.length) return "add at least one step";
  if (r.serving && (!isList(r.serving.en) || !isList(r.serving.fr))) return "invalid serving";
  if (r.tags && (!Array.isArray(r.tags) || r.tags.some((t) => !TAGS.includes(t)))) return "invalid tags";
  if (r.section && !SECTIONS.some((s) => s.id === r.section)) return "invalid section";
  if (r.name !== undefined && (typeof r.name !== "string" || r.name.length > 120)) return "invalid name";
  if (r.video && (typeof r.video !== "string" || !/^https?:\/\//.test(r.video) || r.video.length > 500)) return "invalid video link";
  if (r.images && (!Array.isArray(r.images) || r.images.length > 12 || r.images.some((u) => typeof u !== "string" || !/^(\/recipes\/|https:\/\/)/.test(u)))) {
    return "invalid photos";
  }
  if (r.sources && (!Array.isArray(r.sources) || r.sources.length > 10 || r.sources.some((s) => !s || typeof s.url !== "string" || !/^https?:\/\//.test(s.url)))) {
    return "invalid sources";
  }
  const uploads = b.uploads ?? [];
  if (!Array.isArray(uploads) || uploads.length > MAX_NEW_IMAGES) return `up to ${MAX_NEW_IMAGES} new photos per save`;
  for (const u of uploads) {
    if (!IMAGE_NAME.test(u?.name ?? "") || typeof u.base64 !== "string") return "invalid photo";
    if ((u.base64.length * 3) / 4 > MAX_IMAGE_BYTES) return "a photo is too large";
  }
  return null;
}

/** Drops empty lines and fields so the saved file stays clean. */
function tidy(r: RecipeFile): RecipeFile {
  const list = (l?: string[]) => (l ?? []).map((s) => s.trim()).filter(Boolean);
  const out: RecipeFile = {
    ...(r.name ? { name: r.name.trim() } : {}),
    ...(r.section ? { section: r.section } : {}),
    tags: r.tags ?? [],
    prepMinutes: r.prepMinutes,
    cookMinutes: r.cookMinutes,
    servings: r.servings,
    ingredients: { en: list(r.ingredients.en), fr: list(r.ingredients.fr) },
    steps: { en: list(r.steps.en), fr: list(r.steps.fr) },
    serving: { en: list(r.serving?.en), fr: list(r.serving?.fr) },
    images: list(r.images),
    video: r.video?.trim() ?? "",
    sources: (r.sources ?? []).filter((s) => s.url).map((s) => ({ label: (s.label || s.url).trim(), url: s.url.trim() })),
  };
  return out;
}
