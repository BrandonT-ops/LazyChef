import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllSummaries } from "@/lib/dishes";
import { isSectionId } from "@/data/sections";
import { TAGS } from "@/data/types";
import { SearchView } from "@/components/SearchView";
import { Reveal } from "@/components/Reveal";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; section?: string; tag?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return { title: t("title") };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("search");

  return (
    <div className="container-page py-12">
      <Reveal className="mb-8 text-center">
        <h1 className="heading text-3xl sm:text-4xl">{t("title")}</h1>
      </Reveal>
      <SearchView
        dishes={await getAllSummaries()}
        initial={{
          q: sp.q,
          section: sp.section && isSectionId(sp.section) ? sp.section : undefined,
          tag: TAGS.find((x) => x === sp.tag),
        }}
      />
    </div>
  );
}
