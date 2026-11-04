import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCommunityRecipe } from "@/lib/community";
import { RecipeView } from "@/components/RecipeView";
import { ShareButton } from "@/components/ShareButton";
import { MadeItButton } from "@/components/MadeIt";
import { AddToShoppingButton } from "@/components/Shopping";
import { SITE } from "@/config/site";

export const revalidate = 120;

type Params = Promise<{ locale: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const r = await getCommunityRecipe(id);
  return r ? { title: r.name } : {};
}

export default async function CommunityRecipePage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const r = await getCommunityRecipe(id);
  if (!r) notFound();
  const t = await getTranslations();
  return (
    <div className="container-page py-10">
      <Link href="/community" className="no-print mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-tomato">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("community.title")}
      </Link>
      <RecipeView
        recipe={{
          name: r.name,
          section: r.section,
          tags: r.tags,
          prepMinutes: r.prep_minutes,
          cookMinutes: r.cook_minutes,
          servings: r.servings,
          ingredients: r.ingredients,
          steps: r.steps,
          serving: r.serving,
          video: r.video ?? undefined,
          links: r.links ?? [],
        }}
        photoUrl={r.images?.[0]}
        storageKey={`community-${r.id}`}
        badge={
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-hibiscus">
            {r.author_name ? t("community.by", { name: r.author_name }) : t("community.anonymous")}
          </p>
        }
        actions={
          <>
            <ShareButton title={r.name} text={t("share.dishText", { name: r.name, site: SITE.name })} />
            <MadeItButton dishName={r.name} dishSlug={r.dish_slug ?? undefined} />
            <AddToShoppingButton source={`community:${r.id}`} group={r.name} items={r.ingredients} />
            {r.dish_slug && (
              <Link href={`/dishes/${r.dish_slug}`} className="btn-ghost">
                {t("community.seeDish")}
              </Link>
            )}
          </>
        }
      />
    </div>
  );
}
