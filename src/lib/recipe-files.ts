import fs from "node:fs";
import path from "node:path";
import type { Recipe, RecipeFile } from "@/data/types";

/** Recipes live as JSON files in content/recipes/<slug>.json; the admin commits them there. */
export const RECIPES_DIR = path.join(process.cwd(), "content", "recipes");

export function loadRecipeFiles(): Record<string, RecipeFile> {
  const out: Record<string, RecipeFile> = {};
  let files: string[] = [];
  try {
    files = fs.readdirSync(RECIPES_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return out;
  }
  for (const f of files) {
    try {
      out[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(RECIPES_DIR, f), "utf8")) as RecipeFile;
    } catch (e) {
      console.warn(`Skipping invalid recipe file ${f}:`, e);
    }
  }
  return out;
}

const clean = (list?: string[]) => (list ?? []).map((s) => s.trim()).filter(Boolean);

export function toRecipe(f: RecipeFile): Recipe {
  const images = clean(f.images);
  const video = f.video?.trim() || undefined;
  return {
    prepMinutes: f.prepMinutes,
    cookMinutes: f.cookMinutes,
    servings: f.servings,
    ingredients: { en: clean(f.ingredients?.en), fr: clean(f.ingredients?.fr) },
    steps: { en: clean(f.steps?.en), fr: clean(f.steps?.fr) },
    serving: f.serving ? { en: clean(f.serving.en), fr: clean(f.serving.fr) } : undefined,
    sources: (f.sources ?? []).filter((s) => s.url),
    media: images.length || video ? { images, video } : undefined,
  };
}
