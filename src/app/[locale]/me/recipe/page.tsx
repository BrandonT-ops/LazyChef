import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MyRecipePage } from "@/components/UserRecipes";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ id?: string }> };

export default async function UserRecipeRoute({ params, searchParams }: Props) {
  const { locale } = await params;
  const { id } = await searchParams;
  setRequestLocale(locale);
  if (!id) notFound();
  const t = await getTranslations("kitchen");
  return (
    <div className="container-page py-10">
      <Link href="/me?tab=recipes" className="no-print mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-tomato">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("title")}
      </Link>
      <MyRecipePage id={id} />
    </div>
  );
}
