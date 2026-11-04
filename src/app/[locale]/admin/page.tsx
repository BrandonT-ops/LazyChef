import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllSummaries } from "@/lib/dishes";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ error?: string }> };

export default async function AdminPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="heading mt-2 text-3xl">{t("title")}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t("subtitle")}</p>
      </div>
      <AdminApp dishes={getAllSummaries()} error={error} />
    </div>
  );
}
