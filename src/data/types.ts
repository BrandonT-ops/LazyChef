import type { Locale } from "@/i18n/routing";

export type SectionId =
  | "breakfast"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
  | "drinks";

export type Tag = "budget" | "quick" | "kids" | "snack" | "vegetarian" | "occasion" | "batch";

export const TAGS: Tag[] = ["budget", "quick", "kids", "snack", "vegetarian", "occasion", "batch"];

export type Localized<T> = Record<Locale, T>;

export interface RecipeLink {
  label: string;
  url: string;
}

export interface RecipeMedia {
  /** Photo URLs (first one is the cover). */
  images?: string[];
  /** Preview video: a YouTube link or a direct video file (.mp4/.webm). */
  video?: string;
  /** Helpful external links (original source, technique videos, shops…). */
  links?: RecipeLink[];
}

export interface Recipe {
  media?: RecipeMedia;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredients: Localized<string[]>;
  steps: Localized<string[]>;
}

export interface Dish {
  slug: string;
  /** The dish's own name, kept as written (most names are proper nouns). */
  name: string;
  /** Optional translated names when the original isn't understood by everyone. */
  altNames?: Partial<Localized<string>>;
  section: SectionId;
  tags: Tag[];
  /** Absent = "recipe coming soon". */
  recipe?: Recipe;
}

export interface Section {
  id: SectionId;
  /** JS Date#getDay() value for weekday sections (0 = Sunday). */
  weekday?: number;
  /** Tailwind accent token used for this section's color. */
  accent: "tomato" | "mango" | "leaf" | "hibiscus";
}

/** Lightweight dish shape sent to client components (no recipe body). */
export interface DishSummary {
  slug: string;
  name: string;
  section: SectionId;
  tags: Tag[];
  hasRecipe: boolean;
  cover?: string;
}
