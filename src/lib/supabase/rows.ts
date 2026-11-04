import type { RecipeFile, RecipeLink, SectionId, Tag } from "@/data/types";

/** Row shapes of the Supabase tables (see supabase/migrations). */
export interface RecipeRow {
  slug: string;
  name: string | null;
  section: SectionId | null;
  tags: Tag[];
  prep_minutes: number;
  cook_minutes: number;
  servings: number;
  ingredients: { en: string[]; fr: string[] };
  steps: { en: string[]; fr: string[] };
  serving: { en: string[]; fr: string[] };
  images: string[];
  video: string | null;
  sources: RecipeLink[];
  published: boolean;
  updated_at?: string;
}

export type ReviewStatus = "private" | "submitted" | "approved" | "rejected";

export interface UserRecipeRow {
  id: string;
  owner_id: string;
  author_name: string | null;
  dish_slug: string | null;
  name: string;
  section: SectionId;
  tags: Tag[];
  prep_minutes: number;
  cook_minutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  serving: string[];
  lang: "en" | "fr";
  images: string[];
  video: string | null;
  links: RecipeLink[];
  status: ReviewStatus;
  review_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface MadePhotoRow {
  id: string;
  owner_id: string;
  author_name: string | null;
  dish_slug: string | null;
  user_recipe_id: string | null;
  dish_name: string;
  path: string;
  is_public: boolean;
  created_at: string;
}

export function rowToFile(r: RecipeRow): RecipeFile {
  return {
    ...(r.name ? { name: r.name } : {}),
    ...(r.section ? { section: r.section } : {}),
    tags: r.tags ?? [],
    prepMinutes: r.prep_minutes,
    cookMinutes: r.cook_minutes,
    servings: r.servings,
    ingredients: r.ingredients,
    steps: r.steps,
    serving: r.serving,
    images: r.images ?? [],
    video: r.video ?? "",
    sources: r.sources ?? [],
  };
}

export function fileToRow(slug: string, f: RecipeFile): Omit<RecipeRow, "published"> {
  return {
    slug,
    name: f.name ?? null,
    section: f.section ?? null,
    tags: f.tags ?? [],
    prep_minutes: f.prepMinutes,
    cook_minutes: f.cookMinutes,
    servings: f.servings,
    ingredients: f.ingredients,
    steps: f.steps,
    serving: f.serving ?? { en: [], fr: [] },
    images: f.images ?? [],
    video: f.video || null,
    sources: f.sources ?? [],
  };
}
