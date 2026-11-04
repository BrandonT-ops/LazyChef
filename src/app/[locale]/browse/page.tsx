import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllSummaries } from "@/lib/dishes";
import { Book } from "@/components/Book";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  return { title: t("title") };
}

export default async function BrowsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book");

  return (
    <div className="container-page py-10">
      <Reveal className="mb-8 text-center">
        <h1 className="heading text-3xl sm:text-4xl">📖 {t("title")}</h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </Reveal>
      <Book dishes={getAllSummaries()} />
    </div>
  );
}
