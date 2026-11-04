import { useLocale, useTranslations } from "next-intl";
import { ChefHat, Cookie, Refrigerator, ShoppingBasket, PartyPopper } from "lucide-react";
import { getDish } from "@/lib/dishes";
import { CURRENCY } from "@/data/prices";

const fcfa = (n: number, locale: string) => `${new Intl.NumberFormat(locale).format(n)} ${CURRENCY}`;
const dishName = (slug: string, fallback: string) => getDish(slug)?.name ?? fallback;

type Row = { day: string; dish: string; side?: string; kind: "cook" | "left" | "snack" };

/** Hero visual: a week planned in cook-ahead mode, as it looks in the app. */
export function HeroPreview() {
  const t = useTranslations();
  const locale = useLocale();
  const ekwang = dishName("ekwang", "Ekwang");
  const ndomba = dishName("ndomba", "Ndomba");
  const snack = dishName("plantain-tape-snack", "Plantain tapé snack");
  const plantain = locale === "fr" ? "Plantain bouilli" : "Boiled plantain";
  const day = (id: string) => t(`sections.${id}.name`).slice(0, 3);
  const rows: Row[] = [
    { day: day("monday"), dish: ekwang, kind: "left" },
    { day: day("tuesday"), dish: ekwang, kind: "left" },
    { day: day("wednesday"), dish: ndomba, side: plantain, kind: "cook" },
    { day: day("thursday"), dish: ndomba, side: plantain, kind: "left" },
    { day: day("friday"), dish: snack, kind: "snack" },
    { day: day("saturday"), dish: ndomba, side: plantain, kind: "left" },
    { day: day("sunday"), dish: ekwang, kind: "cook" },
  ];
  const badge = {
    cook: { cls: "bg-tomato text-white", icon: ChefHat, label: t("landing.preview.cook") },
    left: { cls: "bg-leaf/10 text-leaf", icon: Refrigerator, label: t("landing.preview.leftovers") },
    snack: { cls: "bg-mango/15 text-mango", icon: Cookie, label: t("landing.preview.snack") },
  };

  return (
    <div className="relative">
      <div className="card overflow-hidden shadow-lift">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <p className="text-sm font-semibold">{t("landing.preview.title")}</p>
            <p className="text-xs text-muted">{t("landing.preview.subtitle")}</p>
          </div>
        </div>
        <ul className="divide-y divide-line">
          {rows.map((r) => {
            const b = badge[r.kind];
            return (
              <li key={r.day} className="flex items-center gap-4 px-5 py-3">
                <span className="w-9 shrink-0 text-xs font-semibold uppercase text-muted">{r.day}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{r.dish}</span>
                  {r.side && <span className="block truncate text-xs text-muted">+ {r.side}</span>}
                </span>
                <span className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${b.cls}`}>
                  <b.icon className="h-3 w-3" aria-hidden />
                  <span className="hidden sm:inline">{b.label}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-line bg-subtle px-5 py-3 text-right text-xs text-muted">{t("landing.preview.footer")}</p>
      </div>

      {/* Floating cards */}
      <div className="card absolute -bottom-7 -left-10 hidden w-56 items-center gap-3 p-3.5 shadow-lift lg:flex">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mango/10 text-mango">
          <ShoppingBasket className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-xs text-muted">{t("landing.preview.list")}</span>
          <span className="block text-sm font-semibold">~{fcfa(18500, locale)}</span>
        </span>
      </div>
      <div className="card absolute -right-8 -top-9 hidden w-56 items-center gap-3 p-3.5 shadow-lift lg:flex">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-hibiscus/10 text-hibiscus">
          <PartyPopper className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-xs text-muted">{t("landing.preview.event")}</span>
          <span className="block text-sm font-semibold">~{fcfa(66450, locale)}</span>
        </span>
      </div>
    </div>
  );
}

/** Showcase visual: one cooking session. */
export function CookAheadPreview() {
  const t = useTranslations();
  const locale = useLocale();
  const ndomba = dishName("ndomba", "Ndomba");
  const plantain = locale === "fr" ? "Plantain bouilli" : "Boiled plantain";
  const days = [
    { id: "wednesday", kind: "cook" },
    { id: "thursday", kind: "left" },
    { id: "friday", kind: "snack" },
    { id: "saturday", kind: "left" },
  ] as const;
  return (
    <div className="card p-6 shadow-lift">
      <p className="text-xs font-semibold uppercase tracking-wide text-tomato">
        {t("planner.cookOn", { day: t("sections.wednesday.name") })}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{ndomba}</p>
      <span className="mt-2 inline-flex rounded-md bg-leaf/10 px-2 py-1 text-sm font-medium text-leaf">
        {t("planner.with")} {plantain}
      </span>
      <ol className="mt-6 grid grid-cols-4 gap-2">
        {days.map((d) => (
          <li key={d.id} className="text-center">
            <span
              className={`mx-auto grid h-10 w-10 place-items-center rounded-full ${
                d.kind === "cook" ? "bg-tomato text-white" : d.kind === "snack" ? "bg-mango/15 text-mango" : "bg-leaf/10 text-leaf"
              }`}
            >
              {d.kind === "cook" ? (
                <ChefHat className="h-4 w-4" aria-hidden />
              ) : d.kind === "snack" ? (
                <Cookie className="h-4 w-4" aria-hidden />
              ) : (
                <Refrigerator className="h-4 w-4" aria-hidden />
              )}
            </span>
            <span className="mt-2 block text-xs font-medium text-muted">{t(`sections.${d.id}.name`).slice(0, 3)}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t border-line pt-4 text-sm text-muted">
        {t("planner.enoughFor", {
          count: 3,
          days: [t("sections.wednesday.name"), t("sections.thursday.name"), t("sections.saturday.name")].join(", "),
        })}
      </p>
    </div>
  );
}

/** Showcase visual: an event budget. */
export function EventPreview() {
  const t = useTranslations();
  const locale = useLocale();
  const rows: [string, number][] = [
    [t("events.courses.starters"), 18000],
    [t("events.courses.mains"), 32450],
    [t("events.courses.dessert"), 6000],
    [t("events.courses.drinks"), 10000],
  ];
  const total = rows.reduce((s, [, v]) => s + v, 0);
  return (
    <div className="card overflow-hidden shadow-lift">
      <div className="flex items-center gap-3 border-b border-line px-6 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-hibiscus/10 text-hibiscus">
          <PartyPopper className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold">{t("events.occasions.birthday.name")}</p>
          <p className="text-xs text-muted">{t("landing.preview.guests", { count: 20 })}</p>
        </div>
      </div>
      <ul className="space-y-3 px-6 py-5 text-sm">
        {rows.map(([label, v]) => (
          <li key={label} className="flex items-center justify-between gap-4">
            <span className="text-muted">{label}</span>
            <span className="font-medium tabular-nums">{fcfa(v, locale)}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-end justify-between gap-4 border-t border-line bg-subtle px-6 py-5">
        <div>
          <p className="text-xs text-muted">{t("events.total")}</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">~{fcfa(total, locale)}</p>
        </div>
        <p className="text-right text-xs text-muted">
          ~{fcfa(Math.round(total / 20), locale)}
          <br />
          {t("landing.preview.perGuest")}
        </p>
      </div>
    </div>
  );
}
