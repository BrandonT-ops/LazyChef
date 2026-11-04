import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Link } from "@/i18n/navigation";
import { SECTIONS } from "@/data/sections";
import { countBySection, getAllSummaries } from "@/lib/dishes";
import { TodayCard } from "@/components/TodayCard";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { ACCENT_BG } from "@/lib/ui";

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations();
  const counts = countBySection();
  const dishes = getAllSummaries();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-mango/25 blur-3xl" />
          <div className="absolute -right-16 top-40 h-72 w-72 rounded-full bg-tomato/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-leaf/15 blur-3xl" />
        </div>
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <Reveal>
            <p className="font-semibold text-leaf">{t("home.kicker")}</p>
            <h1 className="heading mt-3 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              {t("home.title")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{t("home.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/random" className="btn-primary">
                🎲 {t("home.rollCta")}
              </Link>
              <Link href="/planner" className="btn-ghost">
                🗓️ {t("home.planCta")}
              </Link>
            </div>
          </Reveal>
          <TodayCard dishes={dishes} />
        </div>
      </section>

      {/* Browse the week */}
      <section className="container-page py-12">
        <Reveal>
          <h2 className="heading text-3xl">{t("home.browseTitle")}</h2>
          <p className="mt-2 text-muted">{t("home.browseSubtitle")}</p>
        </Reveal>
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <StaggerItem key={s.id}>
              <Link
                href={`/sections/${s.id}`}
                className="card group flex items-center gap-4 p-5 transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span
                  aria-hidden
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl transition-transform group-hover:rotate-6 group-hover:scale-110 ${ACCENT_BG[s.accent]}`}
                >
                  {s.emoji}
                </span>
                <div className="min-w-0">
                  <h3 className="heading text-lg">{t(`sections.${s.id}.name`)}</h3>
                  <p className="truncate text-sm text-muted">{t(`sections.${s.id}.theme`)}</p>
                  <p className="mt-1 text-xs font-semibold text-tomato">
                    {t("home.dishCount", { count: counts[s.id] })}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Budget */}
      <section className="container-page py-8">
        <Reveal className="card flex flex-col items-start gap-4 bg-gradient-to-br from-mango/20 to-leaf/10 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="heading text-2xl">💰 {t("home.budgetTitle")}</h2>
            <p className="mt-1 text-muted">{t("home.budgetText")}</p>
          </div>
          <Link href="/search?tag=budget" className="btn-primary shrink-0">
            {t("home.budgetCta")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
