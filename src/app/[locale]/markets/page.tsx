import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPinned, ShoppingBasket } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getDish } from "@/lib/dishes";
import { NearbyMap } from "@/components/NearbyMap";
import { IngredientList } from "@/components/IngredientList";
import { Reveal } from "@/components/Reveal";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ dish?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "markets" });
  return { title: t("title") };
}

export default async function MarketsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { dish: slug } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("markets");
  const dish = slug ? getDish(slug) : undefined;
  const shopping = dish?.recipe?.ingredients[locale as Locale];

  return (
    <div className="container-page py-12">
      <Reveal className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="heading flex flex-col items-center justify-center gap-2 text-3xl sm:flex-row sm:gap-3 sm:text-4xl">
          <MapPinned className="h-8 w-8 text-tomato" aria-hidden />
          {t("title")}
        </h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </Reveal>

      {dish && shopping && (
        <Reveal className="card mx-auto mb-6 max-w-2xl p-5">
          <h2 className="heading flex items-center gap-2 text-lg">
            <ShoppingBasket className="h-5 w-5 text-mango" aria-hidden />
            {t("shoppingFor")}{" "}
            <Link href={`/dishes/${dish.slug}`} className="text-tomato hover:underline">
              {dish.name}
            </Link>
          </h2>
          <div className="mt-2">
            <IngredientList items={shopping} />
          </div>
        </Reveal>
      )}

      <NearbyMap />
    </div>
  );
}
