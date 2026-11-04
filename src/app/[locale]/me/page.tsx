import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChefHat } from "lucide-react";
import { getAllSummaries } from "@/lib/dishes";
import { MyKitchen, type KitchenTab } from "@/components/MyKitchen";
import { Reveal } from "@/components/Reveal";

const TABS: KitchenTab[] = ["favorites", "recipes", "photos", "shopping"];

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kitchen" });
  return { title: t("title") };
}

export default async function KitchenPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tab } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("kitchen");

  return (
    <div className="container-page py-12">
      <Reveal className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="heading flex flex-col items-center justify-center gap-2 text-3xl sm:flex-row sm:gap-3 sm:text-4xl">
          <ChefHat className="h-8 w-8 text-tomato" aria-hidden />
          {t("title")}
        </h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </Reveal>
      <MyKitchen dishes={getAllSummaries()} initialTab={TABS.find((x) => x === tab) ?? "favorites"} />
    </div>
  );
}
