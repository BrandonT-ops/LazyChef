import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllSummaries, getPantryIndex } from "@/lib/dishes";
import { isSectionId } from "@/data/sections";
import { DiceRoller } from "@/components/DiceRoller";
import { Reveal } from "@/components/Reveal";
import { Dices } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string; pantry?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "random" });
  return { title: t("title") };
}

export default async function RandomPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { from, pantry } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("random");

  return (
    <div className="container-page py-12">
      <Reveal className="mb-8 text-center">
        <h1 className="heading flex flex-col items-center justify-center gap-2 text-3xl sm:flex-row sm:gap-3 sm:text-4xl">
          <Dices className="h-8 w-8 text-tomato" aria-hidden />
          {t("title")}
        </h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </Reveal>
      <DiceRoller
        dishes={await getAllSummaries()}
        pantryIndex={await getPantryIndex()}
        initialFrom={from && isSectionId(from) ? from : undefined}
        initialPantry={pantry === "1"}
      />
    </div>
  );
}
