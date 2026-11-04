import "server-only";
import { unstable_cache } from "next/cache";
import { supabaseConfigured, storageUrl } from "./supabase/env";
import { supabasePublic } from "./supabase/server";
import type { MadePhotoRow, UserRecipeRow } from "./supabase/rows";

export interface CommunityRecipeCard {
  id: string;
  name: string;
  author: string | null;
  section: UserRecipeRow["section"];
  dishSlug: string | null;
  cover: string | null;
  minutes: number;
}

export interface CommunityPhoto {
  id: string;
  url: string;
  author: string | null;
  dishName: string;
  dishSlug: string | null;
  createdAt: string;
}

const card = (r: UserRecipeRow): CommunityRecipeCard => ({
  id: r.id,
  name: r.name,
  author: r.author_name,
  section: r.section,
  dishSlug: r.dish_slug,
  cover: r.images?.[0] ?? null,
  minutes: r.prep_minutes + r.cook_minutes,
});

const photo = (p: MadePhotoRow): CommunityPhoto => ({
  id: p.id,
  url: storageUrl("photos", p.path),
  author: p.author_name,
  dishName: p.dish_name,
  dishSlug: p.dish_slug,
  createdAt: p.created_at,
});

/** Approved community recipes and public photos. Cached 2 minutes; empty when Supabase isn't set up. */
export const getCommunity = unstable_cache(
  async (): Promise<{ recipes: CommunityRecipeCard[]; photos: CommunityPhoto[] }> => {
    if (!supabaseConfigured) return { recipes: [], photos: [] };
    try {
      const sb = supabasePublic();
      const [r, p] = await Promise.all([
        sb.from("user_recipes").select("*").eq("status", "approved").order("updated_at", { ascending: false }).limit(200),
        sb.from("made_photos").select("*").eq("is_public", true).order("created_at", { ascending: false }).limit(300),
      ]);
      return {
        recipes: ((r.data ?? []) as UserRecipeRow[]).map(card),
        photos: ((p.data ?? []) as MadePhotoRow[]).map(photo),
      };
    } catch {
      return { recipes: [], photos: [] };
    }
  },
  ["community-v1"],
  { tags: ["community"], revalidate: 120 },
);

export async function getCommunityForDish(slug: string) {
  const { recipes, photos } = await getCommunity();
  return { recipes: recipes.filter((r) => r.dishSlug === slug), photos: photos.filter((p) => p.dishSlug === slug).slice(0, 12) };
}

/** One approved community recipe (full), or null. */
export const getCommunityRecipe = unstable_cache(
  async (id: string): Promise<UserRecipeRow | null> => {
    if (!supabaseConfigured || !/^[0-9a-f-]{36}$/.test(id)) return null;
    try {
      const { data } = await supabasePublic().from("user_recipes").select("*").eq("id", id).eq("status", "approved").maybeSingle();
      return (data as UserRecipeRow) ?? null;
    } catch {
      return null;
    }
  },
  ["community-recipe-v1"],
  { tags: ["community"], revalidate: 120 },
);
