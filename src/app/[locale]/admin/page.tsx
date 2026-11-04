import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllSummaries } from "@/lib/dishes";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="heading mt-2 text-3xl">{t("title")}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t("subtitle")}</p>
      </div>
      <AdminApp dishes={await getAllSummaries()} />
    </div>
  );
}
