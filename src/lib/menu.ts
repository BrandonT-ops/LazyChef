import { MENU } from "@/data/menu";
import { SECTIONS } from "@/data/sections";
import type { SectionId } from "@/data/types";
import { slugify } from "./text";

/** The family menu list as slug → name/section, without recipes (cheap and synchronous). */
const MENU_INDEX: Map<string, { name: string; section: SectionId }> = (() => {
  const map = new Map<string, { name: string; section: SectionId }>();
  for (const s of SECTIONS) {
    for (const name of MENU[s.id]) {
      let slug = slugify(name);
      if (map.has(slug)) slug = `${slug}-${s.id}`;
      map.set(slug, { name, section: s.id });
    }
  }
  return map;
})();

export function menuDish(slug: string) {
  return MENU_INDEX.get(slug);
}

export function menuSlugs(): string[] {
  return [...MENU_INDEX.keys()];
}
