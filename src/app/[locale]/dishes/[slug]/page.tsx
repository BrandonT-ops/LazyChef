import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getSection } from "@/data/sections";
import { getAllDishes, getDish, getDishesBySection, toSummary } from "@/lib/dishes";
import { ACCENT_BG } from "@/lib/ui";
import { DishCard } from "@/components/DishCard";
import { IngredientList } from "@/components/IngredientList";
import { TreasureMap } from "@/components/TreasureMap";
import { RecipeMedia } from "@/components/RecipeMedia";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllDishes().map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const dish = getDish(slug);
  return dish ? { title: dish.name } : {};
}

export default async function DishPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const dish = getDish(slug);
  if (!dish) notFound();
  const t = await getTranslations();
  const section = getSection(dish.section)!;
  const sectionName = t(`sections.${section.id}.name`);
  const recipe = dish.recipe;
  const lang = locale as Locale;
  const more = getDishesBySection(section.id)
    .filter((d) => d.slug !== dish.slug)
    .sort((a, b) => Number(Boolean(b.recipe)) - Number(Boolean(a.recipe)))
    .slice(0, 4)
    .map(toSummary);

  return (
    <article className="container-page py-10">
      <Link href={`/sections/${section.id}`} className="no-print text-sm font-semibold text-muted hover:text-tomato">
        ← {t("dish.back", { section: sectionName })}
      </Link>

      <Reveal className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          aria-hidden
          className={`grid h-20 w-20 shrink-0 place-items-center rounded-3xl text-4xl ${ACCENT_BG[section.accent]}`}
        >
          {section.emoji}
        </span>
        <div>
          <h1 className="heading text-3xl sm:text-5xl">{dish.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">{sectionName}</span>
            {dish.tags.map((tag) => (
              <Link key={tag} href={`/search?tag=${tag}`} className="chip hover:border-tomato hover:text-tomato">
                {t(`tags.${tag}`)}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {recipe ? (
        <>
          <Reveal className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md" delay={0.05}>
            {[
              { label: t("dish.prep"), value: t("dish.minutes", { count: recipe.prepMinutes }) },
              { label: t("dish.cook"), value: t("dish.minutes", { count: recipe.cookMinutes }) },
              { label: t("dish.servings"), value: `🍽 ${recipe.servings}` },
            ].map((s) => (
              <div key={s.label} className="card px-3 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">{s.label}</p>
                <p className="heading mt-1 text-lg">{s.value}</p>
              </div>
            ))}
          </Reveal>

          {recipe.media && (
            <Reveal className="mt-10">
              <RecipeMedia media={recipe.media} title={dish.name} />
            </Reveal>
          )}

          <div className="mt-10 grid gap-10 lg:grid-cols-[320px_1fr]">
            <Reveal>
              <div className="card p-5 lg:sticky lg:top-24">
                <h2 className="heading text-xl">🧺 {t("dish.ingredients")}</h2>
                <p className="mb-3 mt-1 text-xs text-muted">{t("dish.checkHint")}</p>
                <IngredientList items={recipe.ingredients[lang]} />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="heading mb-1 text-xl">🗺️ {t("map.title")}</h2>
              <p className="mb-6 text-sm text-muted">{t("map.subtitle")}</p>
              <TreasureMap steps={recipe.steps[lang]} storageKey={`${dish.slug}-${locale}`} />
            </Reveal>
          </div>
        </>
      ) : (
        <Reveal className="card mt-10 flex flex-col items-center gap-3 px-6 py-14 text-center" delay={0.05}>
          <span aria-hidden className="text-5xl">📝</span>
          <h2 className="heading text-2xl">{t("dish.comingSoon")}</h2>
          <p className="max-w-md text-muted">{t("dish.comingSoonText")}</p>
        </Reveal>
      )}

      {more.length > 0 && (
        <section className="no-print mt-16">
          <h2 className="heading text-2xl">{t("dish.more", { section: sectionName })}</h2>
          <Stagger className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {more.map((d) => (
              <StaggerItem key={d.slug}>
                <DishCard dish={d} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </article>
  );
}
