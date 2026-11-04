import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllSummaries } from "@/lib/dishes";
import { isSectionId } from "@/data/sections";
import { DiceRoller } from "@/components/DiceRoller";
import { Reveal } from "@/components/Reveal";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "random" });
  return { title: t("title") };
}

export default async function RandomPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { from } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("random");

  return (
    <div className="container-page py-12">
      <Reveal className="mb-8 text-center">
        <h1 className="heading text-3xl sm:text-4xl">🎲 {t("title")}</h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </Reveal>
      <DiceRoller dishes={getAllSummaries()} initialFrom={from && isSectionId(from) ? from : undefined} />
    </div>
  );
}
