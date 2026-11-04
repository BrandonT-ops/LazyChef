import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllSummaries } from "@/lib/dishes";
import { WeekPlanner } from "@/components/WeekPlanner";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "planner" });
  return { title: t("title") };
}

export default async function PlannerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("planner");

  return (
    <div className="container-page py-12">
      <Reveal className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="heading text-3xl sm:text-4xl">🗓️ {t("title")}</h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </Reveal>
      <WeekPlanner dishes={getAllSummaries()} />
    </div>
  );
}
