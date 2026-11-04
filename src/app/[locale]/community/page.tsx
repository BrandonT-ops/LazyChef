import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Camera, NotebookPen, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCommunity } from "@/lib/community";
import { CommunityPhotoGrid, CommunityRecipeGrid } from "@/components/community/CommunityBlocks";
import { Reveal } from "@/components/Reveal";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "community" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("community");
  const { recipes, photos } = await getCommunity();
  return (
    <div className="container-page py-12">
      <Reveal className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="heading flex flex-col items-center justify-center gap-2 text-3xl sm:flex-row sm:gap-3 sm:text-4xl">
          <Users className="h-8 w-8 text-tomato" aria-hidden />
          {t("title")}
        </h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/me/edit" className="btn-primary">
            <NotebookPen className="h-4 w-4" aria-hidden />
            {t("shareRecipe")}
          </Link>
          <Link href="/browse" className="btn-ghost">
            <Camera className="h-4 w-4" aria-hidden />
            {t("sharePhoto")}
          </Link>
        </div>
      </Reveal>

      <section>
        <h2 className="heading text-2xl">{t("recipes")}</h2>
        <div className="mt-5">
          {recipes.length ? <CommunityRecipeGrid recipes={recipes} /> : <p className="card p-8 text-center text-muted">{t("noRecipes")}</p>}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="heading text-2xl">{t("photos")}</h2>
        <div className="mt-5">
          {photos.length ? <CommunityPhotoGrid photos={photos} showDish /> : <p className="card p-8 text-center text-muted">{t("noPhotos")}</p>}
        </div>
      </section>
    </div>
  );
}
