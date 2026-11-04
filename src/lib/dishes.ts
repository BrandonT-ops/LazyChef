import "server-only";
import { unstable_cache } from "next/cache";
import { SECTIONS } from "@/data/sections";
import { inferredTags } from "@/data/traits";
import type { Dish, DishSummary, RecipeFile, SectionId } from "@/data/types";
import { loadRecipeFiles, toRecipe } from "./recipe-files";
import { menuDish, menuSlugs } from "./menu";
import { supabaseConfigured } from "./supabase/env";
import { supabasePublic } from "./supabase/server";
import { rowToFile, type RecipeRow } from "./supabase/rows";

export { slugify, searchKey } from "./text";

/**
 * Official recipes: from Supabase when it's set up, otherwise (or if it can't be reached)
 * from the files in content/recipes, so the site always has its recipes.
 */
async function loadOfficialRecipes(): Promise<Record<string, RecipeFile>> {
  if (supabaseConfigured) {
    try {
      const { data, error } = await supabasePublic().from("recipes").select("*").eq("published", true);
      if (error) throw error;
      if (data && data.length) return Object.fromEntries((data as RecipeRow[]).map((r) => [r.slug, rowToFile(r)]));
    } catch (e) {
      console.warn("Recipes: Supabase unavailable, using content/recipes files.", e);
    }
  }
  return loadRecipeFiles();
}

function buildDishes(files: Record<string, RecipeFile>): Dish[] {
  const dishes: Dish[] = [];
  for (const slug of menuSlugs()) {
    const { name, section } = menuDish(slug)!;
    const file = files[slug];
    dishes.push({
      slug,
      name,
      section,
      tags: [...new Set([...(file?.tags ?? []), ...inferredTags(slug)])],
      recipe: file ? toRecipe(file) : undefined,
    });
  }
  // Dishes added from the admin that aren't in the family list.
  const known = new Set(dishes.map((d) => d.slug));
  for (const [slug, file] of Object.entries(files)) {
    if (known.has(slug) || !file.name || !file.section) continue;
    dishes.push({
      slug,
      name: file.name,
      section: file.section,
      tags: [...new Set([...(file.tags ?? []), ...inferredTags(slug)])],
      recipe: toRecipe(file),
    });
  }
  // Keep the menu order inside each section.
  const order = new Map(SECTIONS.map((s, i) => [s.id, i]));
  return dishes.sort((a, b) => order.get(a.section)! - order.get(b.section)!);
}

/** Cached for 5 minutes; the admin refreshes it immediately after a save (tag "recipes"). */
const loadDishes = unstable_cache(async () => buildDishes(await loadOfficialRecipes()), ["dishes-v2"], {
  tags: ["recipes"],
  revalidate: 300,
});

export async function getAllDishes(): Promise<Dish[]> {
  return loadDishes();
}

export async function getDish(slug: string): Promise<Dish | undefined> {
  return (await loadDishes()).find((d) => d.slug === slug);
}

export async function getDishesBySection(section: SectionId): Promise<Dish[]> {
  return (await loadDishes()).filter((d) => d.section === section);
}

export async function countBySection(): Promise<Record<SectionId, number>> {
  const counts = Object.fromEntries(SECTIONS.map((s) => [s.id, 0])) as Record<SectionId, number>;
  for (const d of await loadDishes()) counts[d.section]++;
  return counts;
}

export function toSummary(d: Dish): DishSummary {
  return {
    slug: d.slug,
    name: d.name,
    section: d.section,
    tags: d.tags,
    hasRecipe: Boolean(d.recipe),
    cover: d.recipe?.media?.images?.[0],
  };
}

export async function getAllSummaries(): Promise<DishSummary[]> {
  return (await loadDishes()).map(toSummary);
}

export { youtubeEmbed } from "./media";
