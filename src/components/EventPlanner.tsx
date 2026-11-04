"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  Baby,
  Cake,
  Dices,
  Flower2,
  HeartHandshake,
  House,
  ListPlus,
  MapPinned,
  Minus,
  PartyPopper,
  Plus,
  Sparkles,
  Trash2,
  TreePine,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { SIDES } from "@/data/sides";
import type { DishSummary } from "@/data/types";
import type { Locale } from "@/i18n/routing";
import { SITE } from "@/config/site";
import { useLocal, useShopping } from "@/lib/local";
import { dishKey, sideKey, usePrices } from "@/lib/prices";
import {
  BUDGETS,
  COURSES,
  OCCASIONS,
  addItem,
  proposeMenu,
  removeItem,
  servingsFor,
  swapItem,
  type Budget,
  type EventPlan,
  type Occasion,
} from "@/lib/events";
import { ShareButton } from "./ShareButton";
import { PriceField } from "./PriceField";

const OCCASION_ICON: Record<Occasion, LucideIcon> = {
  birthday: Cake,
  wedding: HeartHandshake,
  holidays: TreePine,
  baptism: Baby,
  funeral: Flower2,
  family: House,
  party: PartyPopper,
};

const STORAGE_KEY = "chop-event-v1";

export function EventPlanner({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations("events");
  const tAll = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const shopping = useShopping();
  const { unit, setUnit, isCustom, money } = usePrices(dishes);
  const bySlug = useMemo(() => new Map(dishes.map((d) => [d.slug, d])), [dishes]);

  const [occasion, setOccasion] = useState<Occasion>("birthday");
  const [guests, setGuests] = useState(20);
  const [budget, setBudget] = useState<Budget>("comfortable");
  // Saved on the device (and synced to the account when signed in).
  const [stored, setStored] = useLocal<EventPlan | null>(STORAGE_KEY, null);
  const plan = stored?.v === 1 ? stored : null;

  // Show the saved event's settings (also when it arrives from another device).
  useEffect(() => {
    if (!plan) return;
    setOccasion(plan.occasion);
    setGuests(plan.guests);
    setBudget(plan.budget);
  }, [plan]);

  const save = (next: EventPlan | null) => setStored(next);

  const setGuestCount = (n: number) => {
    const g = Math.max(1, Math.min(2000, Math.round(n) || 1));
    setGuests(g);
    if (plan) save({ ...plan, guests: g });
  };

  const name = (slug: string) => bySlug.get(slug)?.name ?? slug;

  // Cost of every line, so totals and the shopping list agree.
  const lines = useMemo(() => {
    if (!plan) return [];
    return plan.items.map((i) => {
      const servings = servingsFor(plan, i.course);
      const dishCost = unit(dishKey(i.slug)) * servings;
      const sideCost = i.side ? unit(sideKey(i.side)) * servings : 0;
      return { item: i, servings, dishCost, sideCost, total: dishCost + sideCost };
    });
  }, [plan, unit]);
  const total = lines.reduce((s, l) => s + l.total, 0);

  const toShopping = () => {
    if (!plan) return;
    const items = lines.flatMap((l) => {
      const group = t(`courses.${l.item.course}`);
      const out = [{ text: name(l.item.slug), group, priceKey: dishKey(l.item.slug), qty: l.servings }];
      if (l.item.side) out.push({ text: SIDES[l.item.side][locale], group, priceKey: sideKey(l.item.side), qty: l.servings });
      return out;
    });
    shopping.replaceSource("event", items);
    router.push("/me?tab=shopping");
  };

  const shareText = () =>
    plan
      ? `${t("shareTitle", { occasion: t(`occasions.${plan.occasion}.name`), guests: plan.guests, site: SITE.name })}\n\n${COURSES.map((c) => {
          const rows = lines.filter((l) => l.item.course === c);
          return rows.length
            ? `${t(`courses.${c}`)}\n${rows
                .map((l) => `- ${name(l.item.slug)}${l.item.side ? ` + ${SIDES[l.item.side][locale]}` : ""} (${t("servings", { count: l.servings })})`)
                .join("\n")}`
            : "";
        })
          .filter(Boolean)
          .join("\n\n")}\n\n${t("total")}: ~${money(total)}`
      : "";

  return (
    <div>
      {/* 1. Occasion */}
      <section>
        <h2 className="heading mb-3 text-center text-lg">{t("whatOccasion")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {OCCASIONS.map((o) => {
            const Icon = OCCASION_ICON[o];
            const on = occasion === o;
            return (
              <motion.button
                key={o}
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOccasion(o)}
                aria-pressed={on}
                className={`card flex flex-col items-center gap-2 p-4 text-center transition-colors ${on ? "border-tomato bg-tomato/5" : ""}`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${on ? "bg-tomato text-white" : "bg-mango/15 text-mango"}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-sm font-semibold leading-tight">{t(`occasions.${o}.name`)}</span>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-sm text-muted">{t(`occasions.${occasion}.hint`)}</p>
      </section>

      {/* 2. Guests and budget */}
      <section className="card mx-auto mt-6 flex max-w-2xl flex-col items-center gap-5 p-5 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-tomato" aria-hidden />
          <span className="font-semibold">{t("guests")}</span>
          <div className="flex items-center rounded-full border border-line">
            <button type="button" onClick={() => setGuestCount(guests - (guests > 20 ? 5 : 1))} aria-label={t("fewer")} className="grid h-9 w-9 place-items-center">
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={guests}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              aria-label={t("guests")}
              className="w-14 bg-transparent text-center font-bold outline-none"
            />
            <button type="button" onClick={() => setGuestCount(guests + (guests >= 20 ? 5 : 1))} aria-label={t("more")} className="grid h-9 w-9 place-items-center">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              aria-pressed={budget === b}
              className={`chip ${budget === b ? "chip-active" : "hover:border-tomato"}`}
            >
              {t(`budgets.${b}`)}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => save(proposeMenu(dishes, occasion, guests, budget))} className="btn-primary">
          <Sparkles className="h-4 w-4" aria-hidden />
          {plan ? t("proposeAgain") : t("propose")}
        </button>
        {plan && (
          <>
            <button type="button" onClick={toShopping} className="btn-ghost">
              <ListPlus className="h-4 w-4" aria-hidden />
              {t("toShopping")}
            </button>
            <ShareButton title={t(`occasions.${plan.occasion}.name`)} text={shareText} label={t("share")} />
            <button type="button" onClick={() => save(null)} className="btn-ghost">
              {t("clear")}
            </button>
          </>
        )}
      </div>

      {/* 3. The menu */}
      <AnimatePresence mode="wait">
        {plan && (
          <motion.div
            key={`${plan.occasion}-${plan.budget}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]"
          >
            <div className="min-w-0 space-y-5">
              {COURSES.map((course) => {
                const rows = lines.filter((l) => l.item.course === course);
                return (
                  <section key={course} className="card min-w-0 p-5">
                    <header className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="heading text-lg">{t(`courses.${course}`)}</h3>
                      <button type="button" onClick={() => save(addItem(plan, dishes, course))} className="chip gap-1 hover:border-tomato hover:text-tomato">
                        <Plus className="h-3.5 w-3.5" aria-hidden />
                        {t("add")}
                      </button>
                    </header>
                    {rows.length === 0 && <p className="text-sm text-muted">{t("none")}</p>}
                    <ul className="space-y-2">
                      <AnimatePresence initial={false}>
                        {rows.map((l) => (
                          <motion.li
                            key={l.item.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="rounded-xl bg-bg/60 px-3 py-2.5"
                          >
                            <div className="flex items-center gap-2">
                              <div className="min-w-0 flex-1">
                                <Link href={`/dishes/${l.item.slug}`} className="block truncate font-semibold hover:text-tomato">
                                  {name(l.item.slug)}
                                </Link>
                                <p className="text-xs text-muted">
                                  {t("servings", { count: l.servings })} ·{" "}
                                  <PriceField
                                    value={unit(dishKey(l.item.slug))}
                                    custom={isCustom(dishKey(l.item.slug))}
                                    onChange={(v) => setUnit(dishKey(l.item.slug), v)}
                                    suffix={t("perServing")}
                                  />
                                </p>
                              </div>
                              <span className="shrink-0 text-sm font-semibold">{money(l.dishCost)}</span>
                              <IconBtn label={t("swap")} onClick={() => save(swapItem(plan, dishes, l.item.id))}>
                                <Dices className="h-4 w-4" />
                              </IconBtn>
                              <IconBtn label={t("remove")} onClick={() => save(removeItem(plan, l.item.id))}>
                                <Trash2 className="h-4 w-4" />
                              </IconBtn>
                            </div>
                            {l.item.side && (
                              <div className="mt-1.5 flex items-center gap-2 border-t border-line/70 pt-1.5 text-sm">
                                <span className="min-w-0 flex-1 truncate text-leaf">
                                  + {SIDES[l.item.side][locale]}{" "}
                                  <span className="text-xs text-muted">
                                    ·{" "}
                                    <PriceField
                                      value={unit(sideKey(l.item.side))}
                                      custom={isCustom(sideKey(l.item.side))}
                                      onChange={(v) => setUnit(sideKey(l.item.side!), v)}
                                      suffix={t("perServing")}
                                    />
                                  </span>
                                </span>
                                <span className="shrink-0 text-sm font-semibold">{money(l.sideCost)}</span>
                                <span className="w-[72px] shrink-0" aria-hidden />
                              </div>
                            )}
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </section>
                );
              })}
            </div>

            {/* Budget summary */}
            <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-br from-tomato to-mango p-5 text-white">
                  <p className="text-sm font-semibold opacity-90">{t("total")}</p>
                  <motion.p key={total} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="heading text-3xl">
                    ~{money(total)}
                  </motion.p>
                  <p className="mt-1 text-sm opacity-90">
                    {t("perGuest", { amount: money(total / Math.max(1, plan.guests)), guests: plan.guests })}
                  </p>
                </div>
                <ul className="space-y-1.5 p-5 text-sm">
                  {COURSES.map((c) => {
                    const sum = lines.filter((l) => l.item.course === c).reduce((s, l) => s + l.total, 0);
                    return (
                      <li key={c} className="flex justify-between">
                        <span className="text-muted">{t(`courses.${c}`)}</span>
                        <span className="font-semibold">{money(sum)}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="border-t border-line px-5 py-4 text-xs text-muted">{t("estimateNote")}</p>
                <div className="px-5 pb-5">
                  <Link href="/markets" className="btn-ghost w-full">
                    <MapPinned className="h-4 w-4" aria-hidden />
                    {tAll("markets.whereToBuy")}
                  </Link>
                </div>
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.85 }}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-line/60 hover:text-tomato"
    >
      {children}
    </motion.button>
  );
}

