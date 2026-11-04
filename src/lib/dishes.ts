import { MENU } from "@/data/menu";
import { loadRecipeFiles, toRecipe } from "./recipe-files";
import { SECTIONS } from "@/data/sections";
import { inferredTags } from "@/data/traits";
import type { Dish, DishSummary, SectionId } from "@/data/types";

import { slugify } from "./text";

export { slugify, searchKey } from "./text";

function buildDishes(): Dish[] {
  const files = loadRecipeFiles();
  const seen = new Set<string>();
  const dishes: Dish[] = [];
  for (const section of SECTIONS) {
    for (const name of MENU[section.id]) {
      let slug = slugify(name);
      if (seen.has(slug)) slug = `${slug}-${section.id}`;
      seen.add(slug);
      const file = files[slug];
      dishes.push({
        slug,
        name,
        section: section.id,
        tags: [...new Set([...(file?.tags ?? []), ...inferredTags(slug)])],
        recipe: file ? toRecipe(file) : undefined,
      });
    }
  }
  // Dishes added from the admin that aren't in the family list yet.
  for (const [slug, file] of Object.entries(files)) {
    if (seen.has(slug) || !file.name || !file.section) continue;
    seen.add(slug);
    dishes.push({
      slug,
      name: file.name,
      section: file.section,
      tags: [...new Set([...(file.tags ?? []), ...inferredTags(slug)])],
      recipe: toRecipe(file),
    });
  }
  return dishes;
}

// Phase 1 data source. Phase 2 swaps this module's internals for database
// queries while keeping the same function signatures.
const DISHES = buildDishes();

export function getAllDishes(): Dish[] {
  return DISHES;
}

export function getDish(slug: string): Dish | undefined {
  return DISHES.find((d) => d.slug === slug);
}

export function getDishesBySection(section: SectionId): Dish[] {
  return DISHES.filter((d) => d.section === section);
}

export function countBySection(): Record<SectionId, number> {
  const counts = Object.fromEntries(SECTIONS.map((s) => [s.id, 0])) as Record<SectionId, number>;
  for (const d of DISHES) counts[d.section]++;
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

export function getAllSummaries(): DishSummary[] {
  return DISHES.map(toSummary);
}

export { youtubeEmbed } from "./media";
