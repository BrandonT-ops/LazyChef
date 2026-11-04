"use client";

import { useTranslations } from "next-intl";
import { Map as MapIcon, ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { getSection } from "@/data/sections";
import type { RecipeLink, SectionId, Tag } from "@/data/types";
import { ACCENT_BG } from "@/lib/ui";
import { SectionIcon, TagIcon } from "./icons";
import { IngredientList } from "./IngredientList";
import { TreasureMap } from "./TreasureMap";
import { RecipeMedia } from "./RecipeMedia";

export interface ViewableRecipe {
  name: string;
  section: SectionId;
  tags: Tag[];
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  serving?: string[];
  video?: string;
  links: RecipeLink[];
}

/** Recipe layout for personal and shared recipes (same look as the site's own recipes). */
export function RecipeView({
  recipe,
  photoUrl,
  storageKey,
  badge,
  actions,
  below,
}: {
  recipe: ViewableRecipe;
  photoUrl?: string;
  storageKey: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  below?: React.ReactNode;
}) {
  const t = useTranslations();
  const section = getSection(recipe.section) ?? getSection("monday")!;
  const media = {
    images: photoUrl ? [photoUrl] : [],
    video: recipe.video || undefined,
    links: recipe.links.filter((l) => l.url),
  };

  return (
    <article>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span className={`grid h-20 w-20 shrink-0 place-items-center rounded-3xl ${ACCENT_BG[section.accent]}`}>
          <SectionIcon id={section.id} className="h-10 w-10" />
        </span>
        <div className="min-w-0">
          {badge}
          <h1 className="heading break-words text-3xl sm:text-5xl">{recipe.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">{t(`sections.${section.id}.name`)}</span>
            {recipe.tags.map((tag) => (
              <span key={tag} className="chip gap-1.5">
                <TagIcon tag={tag} className="h-3.5 w-3.5" />
                {t(`tags.${tag}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {actions && <div className="no-print mt-6 flex flex-wrap gap-3">{actions}</div>}

      <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md">
        {[
          { label: t("dish.prep"), value: t("dish.minutes", { count: recipe.prepMinutes }) },
          { label: t("dish.cook"), value: t("dish.minutes", { count: recipe.cookMinutes }) },
          { label: t("dish.servings"), value: String(recipe.servings) },
        ].map((s) => (
          <div key={s.label} className="card px-3 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{s.label}</p>
            <p className="heading mt-1 text-lg">{s.value}</p>
          </div>
        ))}
      </div>

      {(media.images.length > 0 || media.video || media.links.length > 0) && (
        <div className="mt-10">
          <RecipeMedia media={media} title={recipe.name} />
        </div>
      )}

      {below && <div className="mt-8">{below}</div>}

      <div className="mt-10 grid gap-10 lg:grid-cols-[320px_1fr]">
        <div className="card p-5 lg:sticky lg:top-24 lg:self-start">
          <h2 className="heading flex items-center gap-2 text-xl">
            <ShoppingBasket className="h-5 w-5 text-mango" aria-hidden />
            {t("dish.whatToBuy")}
          </h2>
          <p className="mb-3 mt-1 text-xs text-muted">{t("dish.checkHint")}</p>
          <IngredientList items={recipe.ingredients} />
        </div>
        <div>
          <h2 className="heading mb-1 flex items-center gap-2 text-xl">
            <MapIcon className="h-5 w-5 text-leaf" aria-hidden />
            {t("dish.howToCook")}
          </h2>
          <p className="mb-6 text-sm text-muted">{t("map.subtitle")}</p>
          {recipe.steps.length > 0 && <TreasureMap steps={recipe.steps} storageKey={storageKey} />}
        </div>
      </div>

      {recipe.serving && recipe.serving.length > 0 && (
        <section className="mt-14">
          <h2 className="heading mb-4 flex items-center gap-2 text-xl">
            <UtensilsCrossed className="h-5 w-5 text-hibiscus" aria-hidden />
            {t("dish.howToServe")}
          </h2>
          <ul className="space-y-3">
            {recipe.serving.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tomato" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
