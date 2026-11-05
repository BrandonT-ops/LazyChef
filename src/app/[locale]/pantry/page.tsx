import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Refrigerator } from "lucide-react";
import { getAllSummaries, getPantryIndex } from "@/lib/dishes";
import { PantryCook } from "@/components/PantryCook";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pantry" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function PantryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pantry");
  const [dishes, index] = await Promise.all([getAllSummaries(), getPantryIndex()]);

  return (
    <div className="container-page py-12">
      <Reveal className="mb-8">
        <h1 className="heading flex items-center gap-3 text-3xl sm:text-4xl">
          <Refrigerator className="h-8 w-8 text-tomato" aria-hidden />
          {t("title")}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">{t("subtitle")}</p>
      </Reveal>
      <PantryCook dishes={dishes} index={index} />
    </div>
  );
}
