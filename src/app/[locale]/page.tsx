import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Dices,
  MapPinned,
  PartyPopper,
  Refrigerator,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SECTIONS } from "@/data/sections";
import { countBySection, getAllSummaries } from "@/lib/dishes";
import { OCCASIONS } from "@/lib/events";
import { TodayCard } from "@/components/TodayCard";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionIcon } from "@/components/icons";
import { CookAheadPreview, EventPreview, HeroPreview } from "@/components/Landing";

const FEATURES: { key: string; icon: LucideIcon; href: string }[] = [
  { key: "planner", icon: CalendarDays, href: "/planner" },
  { key: "batch", icon: Refrigerator, href: "/planner" },
  { key: "events", icon: PartyPopper, href: "/events" },
  { key: "shopping", icon: ShoppingBasket, href: "/me?tab=shopping" },
  { key: "markets", icon: MapPinned, href: "/markets" },
  { key: "cookbook", icon: BookOpen, href: "/browse" },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [counts, dishes] = await Promise.all([countBySection(), getAllSummaries()]);

  const stats = [
    { value: dishes.length, label: t("landing.stats.dishes") },
    { value: 9, label: t("landing.stats.themes") },
    { value: OCCASIONS.length, label: t("landing.stats.occasions") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="container-page grid items-center gap-14 pb-16 pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
              {t("landing.hero.badge")}
            </p>
            <h1 className="heading mt-6 text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-[3.6rem]">{t("landing.hero.title")}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              {t("landing.hero.subtitle", { count: dishes.length })}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/planner" className="btn-primary btn-lg">
                {t("landing.hero.primary")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/browse" className="btn-ghost btn-lg">
                {t("landing.hero.secondary")}
              </Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
                  <dd className="text-sm text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1} className="lg:pl-6">
            <HeroPreview />
          </Reveal>
        </div>
        <div className="container-page pb-16">
          <TodayCard dishes={dishes} />
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-line bg-subtle py-20 lg:py-24">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{t("landing.features.eyebrow")}</p>
            <h2 className="heading mt-3 text-3xl sm:text-4xl">{t("landing.features.title")}</h2>
            <p className="mt-4 text-lg text-muted">{t("landing.features.subtitle")}</p>
          </Reveal>
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <StaggerItem key={f.key} className="h-full">
                <Link
                  href={f.href}
                  className="group flex h-full flex-col rounded-xl2 border border-line bg-surface p-6 transition-shadow hover:shadow-lift"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-line text-tomato">
                    <f.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-semibold">{t(`landing.features.items.${f.key}.title`)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t(`landing.features.items.${f.key}.text`)}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ink">
                    {t("landing.features.open")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-24">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{t("landing.how.eyebrow")}</p>
            <h2 className="heading mt-3 text-3xl sm:text-4xl">{t("landing.how.title")}</h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <StaggerItem key={n} className="border-t border-line pt-6">
                <span className="text-sm font-semibold tabular-nums text-tomato">0{n}</span>
                <h3 className="mt-3 text-lg font-semibold">{t(`landing.how.steps.${n}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(`landing.how.steps.${n}.text`)}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Showcases */}
      <section className="pb-20 lg:pb-24">
        <div className="container-page space-y-20 lg:space-y-28">
          <Showcase
            eyebrow={t("landing.batch.eyebrow")}
            title={t("landing.batch.title")}
            text={t("landing.batch.text")}
            bullets={[t("landing.batch.b1"), t("landing.batch.b2"), t("landing.batch.b3")]}
            cta={{ href: "/planner", label: t("landing.batch.cta") }}
            visual={<CookAheadPreview />}
          />
          <Showcase
            reverse
            eyebrow={t("landing.events.eyebrow")}
            title={t("landing.events.title")}
            text={t("landing.events.text")}
            bullets={[t("landing.events.b1"), t("landing.events.b2"), t("landing.events.b3")]}
            cta={{ href: "/events", label: t("landing.events.cta") }}
            visual={<EventPreview />}
          />
        </div>
      </section>

      {/* Days */}
      <section className="border-t border-line bg-subtle py-20 lg:py-24">
        <div className="container-page">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">{t("landing.days.eyebrow")}</p>
              <h2 className="heading mt-3 text-3xl sm:text-4xl">{t("landing.days.title")}</h2>
              <p className="mt-4 text-lg text-muted">{t("landing.days.subtitle")}</p>
            </div>
            <Link href="/browse" className="btn-ghost shrink-0 self-start sm:self-auto">
              <BookOpen className="h-4 w-4" aria-hidden />
              {t("landing.days.cta")}
            </Link>
          </Reveal>
          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s) => (
              <StaggerItem key={s.id} className="bg-surface">
                <Link href={`/sections/${s.id}`} className="group flex h-full items-center gap-4 p-5 transition-colors hover:bg-subtle">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-subtle text-ink group-hover:bg-surface">
                    <SectionIcon id={s.id} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{t(`sections.${s.id}.name`)}</span>
                    <span className="block truncate text-sm text-muted">{t(`sections.${s.id}.theme`)}</span>
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-muted">{counts[s.id]}</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Final call to action */}
      <section className="pt-20 lg:pt-24">
        <div className="container-page">
          <Reveal className="relative overflow-hidden rounded-2xl bg-ink px-6 py-14 text-center text-bg sm:px-12 lg:py-20">
            <h2 className="heading relative mx-auto max-w-2xl text-3xl sm:text-4xl">{t("landing.cta.title")}</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg opacity-70">{t("landing.cta.text")}</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/planner" className="btn-primary btn-lg">
                {t("landing.cta.primary")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/random" className="btn btn-lg border border-bg/20 text-bg hover:bg-bg/10">
                <Dices className="h-4 w-4" aria-hidden />
                {t("landing.cta.secondary")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Showcase({
  eyebrow,
  title,
  text,
  bullets,
  cta,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  bullets: string[];
  cta: { href: string; label: string };
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal className={reverse ? "lg:order-2" : ""}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="heading mt-3 text-3xl sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">{text}</p>
        <ul className="mt-6 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-tomato/10 text-tomato">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <Link href={cta.href} className="btn-ghost mt-8">
          {cta.label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Reveal>
      <Reveal delay={0.1} className={`mx-auto w-full max-w-md ${reverse ? "lg:order-1" : ""}`}>
        {visual}
      </Reveal>
    </div>
  );
}
