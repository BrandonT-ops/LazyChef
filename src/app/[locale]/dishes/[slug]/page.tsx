import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getSection } from "@/data/sections";
import { getAllDishes, getDish, getDishesBySection, toSummary } from "@/lib/dishes";
import { ACCENT_BG } from "@/lib/ui";
import { DishCard } from "@/components/DishCard";
import { getCommunityForDish } from "@/lib/community";
import { CommunityPhotoGrid, CommunityRecipeGrid } from "@/components/community/CommunityBlocks";
import { IngredientList } from "@/components/IngredientList";
import { TreasureMap } from "@/components/TreasureMap";
import { LinkList, PhotoGallery, VideoPlayer } from "@/components/RecipeMedia";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { ArrowLeft, Map as MapIcon, MapPinned, NotebookPen, PlayCircle, ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MadeItButton, PhotoGrid } from "@/components/MadeIt";
import { AddToShoppingButton } from "@/components/Shopping";
import { SITE } from "@/config/site";
import { SectionIcon, TagIcon } from "@/components/icons";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const dishes = await getAllDishes();
  return routing.locales.flatMap((locale) => dishes.map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const dish = await getDish(slug);
  return dish ? { title: dish.name } : {};
}

export default async function DishPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const dish = await getDish(slug);
  if (!dish) notFound();
  const t = await getTranslations();
  const section = getSection(dish.section)!;
  const sectionName = t(`sections.${section.id}.name`);
  const recipe = dish.recipe;
  const lang = locale as Locale;
  const community = await getCommunityForDish(dish.slug);
  const more = (await getDishesBySection(section.id))
    .filter((d) => d.slug !== dish.slug)
    .sort((a, b) => Number(Boolean(b.recipe)) - Number(Boolean(a.recipe)))
    .slice(0, 4)
    .map(toSummary);

  return (
    <article className="container-page py-10">
      <Link href={`/sections/${section.id}`} className="no-print inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-tomato">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("dish.back", { section: sectionName })}
      </Link>

      <Reveal className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          aria-hidden
          className={`grid h-20 w-20 shrink-0 place-items-center rounded-3xl text-4xl ${ACCENT_BG[section.accent]}`}
        >
          <SectionIcon id={section.id} className="h-10 w-10" />
        </span>
        <div>
          <h1 className="heading text-3xl sm:text-5xl">{dish.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">{sectionName}</span>
            {dish.tags.map((tag) => (
              <Link key={tag} href={`/search?tag=${tag}`} className="chip gap-1.5 hover:border-tomato hover:text-tomato">
                <TagIcon tag={tag} className="h-3.5 w-3.5" />
                {t(`tags.${tag}`)}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="no-print mt-6 flex flex-wrap gap-3" delay={0.05}>
        <FavoriteButton slug={dish.slug} variant="button" />
        <ShareButton title={dish.name} text={t("share.dishText", { name: dish.name, site: SITE.name })} />
        <MadeItButton dishName={dish.name} dishSlug={dish.slug} />
        <AddToShoppingButton
          source={`dish:${dish.slug}`}
          group={dish.name}
          items={recipe ? recipe.ingredients[lang] : [t("shopping.ingredientsFor", { name: dish.name })]}
        />
        <Link href={`/markets?dish=${dish.slug}`} className="btn-ghost">
          <MapPinned className="h-4 w-4" aria-hidden />
          {t("markets.whereToBuy")}
        </Link>
      </Reveal>

      <div className="no-print mt-6">
        <PhotoGrid dishSlug={dish.slug} compact />
      </div>

      {recipe ? (
        <>
          <Reveal className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md" delay={0.05}>
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
          </Reveal>

          {recipe.media?.video && (
            <Reveal className="mt-12">
              <SectionTitle icon={<PlayCircle className="h-5 w-5 text-tomato" aria-hidden />} title={t("dish.watch")} />
              <VideoPlayer url={recipe.media.video} title={dish.name} />
            </Reveal>
          )}

          <div className="mt-12 grid gap-10 lg:grid-cols-[340px_1fr]">
            <Reveal>
              <div className="card p-5 lg:sticky lg:top-24">
                <h2 className="heading flex items-center gap-2 text-xl">
                  <ShoppingBasket className="h-5 w-5 text-mango" aria-hidden />
                  {t("dish.whatToBuy")}
                </h2>
                <p className="mb-3 mt-1 text-xs text-muted">{t("dish.checkHint")}</p>
                <IngredientList items={recipe.ingredients[lang]} />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SectionTitle icon={<MapIcon className="h-5 w-5 text-leaf" aria-hidden />} title={t("dish.howToCook")} subtitle={t("map.subtitle")} />
              <TreasureMap steps={recipe.steps[lang]} storageKey={`${dish.slug}-${locale}`} />
            </Reveal>
          </div>

          {(recipe.serving?.[lang]?.length || recipe.media?.images?.length) ? (
            <Reveal className="mt-14">
              <SectionTitle icon={<UtensilsCrossed className="h-5 w-5 text-hibiscus" aria-hidden />} title={t("dish.howToServe")} />
              <div className={`grid gap-8 ${recipe.media?.images?.length ? "lg:grid-cols-[1.4fr_1fr]" : ""}`}>
                {recipe.media?.images?.length ? <PhotoGallery images={recipe.media.images} title={dish.name} /> : null}
                {recipe.serving?.[lang]?.length ? (
                  <ul className="space-y-3">
                    {recipe.serving[lang].map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tomato" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
          ) : null}

          {recipe.sources?.length ? (
            <div className="mt-12 border-t border-line pt-6">
              <LinkList links={recipe.sources} heading={t("dish.sources")} />
              <p className="mt-3 text-xs text-muted">{t("dish.sourcesNote")}</p>
            </div>
          ) : null}
        </>
      ) : (
        <Reveal className="card mt-10 flex flex-col items-center gap-3 px-6 py-14 text-center" delay={0.05}>
          <NotebookPen className="h-12 w-12 text-mango" aria-hidden />
          <h2 className="heading text-2xl">{t("dish.comingSoon")}</h2>
          <p className="max-w-md text-muted">{t("dish.comingSoonText")}</p>
        </Reveal>
      )}

      {(community.recipes.length > 0 || community.photos.length > 0) && (
        <section className="no-print mt-16">
          <h2 className="heading text-2xl">{t("community.fromCommunity")}</h2>
          {community.recipes.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-muted">{t("community.versions")}</p>
              <CommunityRecipeGrid recipes={community.recipes} />
            </div>
          )}
          {community.photos.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-muted">{t("community.madeIt")}</p>
              <CommunityPhotoGrid photos={community.photos} />
            </div>
          )}
        </section>
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

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="heading flex items-center gap-2 text-xl">
        {icon}
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
