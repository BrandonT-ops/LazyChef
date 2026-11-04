import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { SECTIONS, getSection, isSectionId } from "@/data/sections";
import { getDishesBySection, toSummary } from "@/lib/dishes";
import { DishCard } from "@/components/DishCard";
import { ACCENT_BG } from "@/lib/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { Dices } from "lucide-react";
import { SectionIcon } from "@/components/icons";

type Params = Promise<{ locale: string; id: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => SECTIONS.map((s) => ({ locale, id: s.id })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isSectionId(id)) return {};
  const t = await getTranslations({ locale, namespace: "sections" });
  return { title: t(`${id}.name`), description: t(`${id}.theme`) };
}

export default async function SectionPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const section = getSection(id);
  if (!section) notFound();
  const t = await getTranslations();
  const dishes = getDishesBySection(section.id).map(toSummary);

  return (
    <div className="container-page py-12">
      <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl ${ACCENT_BG[section.accent]}`}
          >
            <SectionIcon id={section.id} className="h-8 w-8" />
          </span>
          <div>
            <h1 className="heading text-3xl sm:text-4xl">{t(`sections.${section.id}.name`)}</h1>
            <p className="text-muted">{t(`sections.${section.id}.theme`)}</p>
          </div>
        </div>
        <Link href={`/random?from=${section.id}`} className="btn-ghost self-start sm:self-auto">
          <Dices className="h-4 w-4" aria-hidden />
          {t("random.title")}
        </Link>
      </Reveal>

      <p className="mt-6 text-sm font-semibold text-tomato">
        {t("home.dishCount", { count: dishes.length })}
      </p>
      <Stagger className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dishes.map((d) => (
          <StaggerItem key={d.slug}>
            <DishCard dish={d} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
