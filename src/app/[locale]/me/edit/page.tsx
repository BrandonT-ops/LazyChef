import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RecipeEditor } from "@/components/RecipeEditor";
import { getAllSummaries } from "@/lib/dishes";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ id?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "editor" });
  return { title: t("title") };
}

export default async function EditPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { id } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <div className="container-page py-10">
      <Link href="/me?tab=recipes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-tomato">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("kitchen.title")}
      </Link>
      <h1 className="heading mb-8 mt-4 text-3xl sm:text-4xl">{id ? t("editor.editTitle") : t("editor.title")}</h1>
      <RecipeEditor id={id} dishes={await getAllSummaries()} />
    </div>
  );
}
