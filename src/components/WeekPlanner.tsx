"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  CalendarDays,
  ChefHat,
  Cookie,
  Dices,
  ListPlus,
  Lock,
  LockOpen,
  Minus,
  Plus,
  Users,
  Moon,
  Refrigerator,
  Save,
  Sparkles,
  Sun,
  Sunrise,
  type LucideIcon,
} from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { getSection } from "@/data/sections";
import { SIDES, type SideId } from "@/data/sides";
import type { DishSummary, SectionId } from "@/data/types";
import type { Locale } from "@/i18n/routing";
import { SITE } from "@/config/site";
import { useShopping } from "@/lib/local";
import { dishKey, sideKey } from "@/lib/prices";
import {
  DAYS,
  MEALS,
  cells,
  emptyPlan,
  generate,
  isEmpty,
  mealsFrom,
  orderedCookDays,
  rerollBatch,
  rerollCell,
  rerollSide,
  toggleSnackDay,
  type Cell,
  type Meal,
  type Mode,
  type PlanState,
} from "@/lib/planner";
import { SectionIcon } from "./icons";
import { ShareButton } from "./ShareButton";

const MEAL_ICON: Record<Meal, LucideIcon> = { breakfast: Sunrise, lunch: Sun, supper: Moon };
const STORAGE_KEY = "chop-plan-v3";

export function WeekPlanner({ dishes, ingredients }: { dishes: DishSummary[]; ingredients: Record<string, string[]> }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const shopping = useShopping();
  const [plan, setPlan] = useState<PlanState>(() => emptyPlan());
  const [today, setToday] = useState<number | null>(null);
  const bySlug = useMemo(() => new Map(dishes.map((d) => [d.slug, d])), [dishes]);

  useEffect(() => {
    setToday(new Date().getDay());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as PlanState;
        if (saved?.v === 3) setPlan(saved);
      }
    } catch {
      /* ignore broken or unavailable storage */
    }
  }, []);

  const save = (next: PlanState) => {
    setPlan(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const empty = isEmpty(plan);
  const batch = plan.mode === "batch" && plan.cookDays.length > 0;
  const grid = cells(plan);
  const dayName = (d: SectionId) => t(`sections.${d}.name`);
  const nameOf = (slug: string | null) => (slug ? (bySlug.get(slug)?.name ?? "") : "");
  const sideName = (s: SideId | null) => (s ? SIDES[s][locale] : "");

  const setMode = (mode: Mode) => save({ ...plan, mode });
  const toggleCookDay = (day: SectionId) => {
    const cookDays = plan.cookDays.includes(day)
      ? plan.cookDays.filter((d) => d !== day)
      : DAYS.filter((d) => d === day || plan.cookDays.includes(d));
    const next = { ...plan, cookDays };
    save(empty || !cookDays.length ? next : generate(next, dishes, { resetSnackDays: true }));
  };
  const toggleLock = (day: SectionId, meal: Meal) => {
    const key = `${day}:${meal}`;
    const locked = plan.locked.includes(key) ? plan.locked.filter((k) => k !== key) : [...plan.locked, key];
    save({ ...plan, locked });
  };

  const describe = (c: Cell) => [nameOf(c.slug), sideName(c.side)].filter(Boolean).join(` ${t("planner.with")} `);

  const shareText = () => {
    const lines = DAYS.map((d) => {
      const c = grid[d];
      return `${dayName(d)}: ${MEALS.map((m) => `${t(`planner.${m}`)} ${describe(c[m]) || "-"}`).join(" / ")}`;
    });
    return `${t("planner.shareTitle", { site: SITE.name })}\n\n${lines.join("\n")}`;
  };

  const people = plan.people ?? 2;
  const setPeople = (n: number) => save({ ...plan, people: Math.max(1, Math.min(30, n)) });

  /** Turns the week into a shopping list (replacing the previous week's items), with servings for everyone. */
  const toShopping = () => {
    const dishMeals = new Map<string, number>();
    const sideMeals = new Map<SideId, number>();
    for (const d of DAYS) {
      for (const m of MEALS) {
        const c = grid[d][m];
        if (c.slug) dishMeals.set(c.slug, (dishMeals.get(c.slug) ?? 0) + 1);
        if (c.side) sideMeals.set(c.side, (sideMeals.get(c.side) ?? 0) + 1);
      }
    }
    const items: { text: string; group: string; priceKey?: string; qty?: number }[] = [];
    dishMeals.forEach((meals, slug) => {
      const ing = ingredients[slug];
      if (ing?.length) ing.forEach((text) => items.push({ text, group: nameOf(slug) }));
      else items.push({ text: nameOf(slug), group: t("shopping.noRecipeGroup"), priceKey: dishKey(slug), qty: meals * people });
    });
    sideMeals.forEach((meals, side) =>
      items.push({ text: sideName(side), group: t("shopping.sides"), priceKey: sideKey(side), qty: meals * people }),
    );
    shopping.replaceSource("week", items);
    router.push("/me?tab=shopping");
  };

  return (
    <div>
      {/* Mode switch */}
      <div className="mx-auto flex max-w-md rounded-full border border-line bg-surface p-1 shadow-soft">
        {(["daily", "batch"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={plan.mode === m}
            className={`relative flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              plan.mode === m ? "text-white" : "text-muted hover:text-ink"
            }`}
          >
            {plan.mode === m && <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-tomato" />}
            <span className="relative inline-flex items-center gap-2">
              {m === "daily" ? <CalendarDays className="h-4 w-4" /> : <Refrigerator className="h-4 w-4" />}
              {t(m === "daily" ? "planner.modeDaily" : "planner.modeBatch")}
            </span>
          </button>
        ))}
      </div>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted">
        {t(plan.mode === "batch" ? "planner.modeBatchHint" : "planner.modeDailyHint")}
      </p>

      {/* Free days picker */}
      <AnimatePresence initial={false}>
        {plan.mode === "batch" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card mx-auto mt-6 max-w-2xl p-5 text-center">
              <p className="font-semibold">{t("planner.freeDays")}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {DAYS.map((d) => {
                  const on = plan.cookDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleCookDay(d)}
                      className={`chip gap-1.5 ${on ? "chip-active" : "hover:border-tomato"}`}
                    >
                      {on && <ChefHat className="h-3.5 w-3.5" aria-hidden />}
                      {dayName(d)}
                    </button>
                  );
                })}
              </div>
              {!plan.cookDays.length && <p className="mt-3 text-sm text-tomato">{t("planner.pickDays")}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Household size */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <Users className="h-5 w-5 text-tomato" aria-hidden />
        <span className="text-sm font-semibold">{t("planner.people")}</span>
        <div className="flex items-center rounded-full border border-line bg-surface">
          <button type="button" onClick={() => setPeople(people - 1)} aria-label={t("events.fewer")} className="grid h-9 w-9 place-items-center">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-bold" aria-live="polite">{people}</span>
          <button type="button" onClick={() => setPeople(people + 1)} aria-label={t("events.more")} className="grid h-9 w-9 place-items-center">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => save(generate(plan, dishes, { resetSnackDays: empty }))}
          disabled={plan.mode === "batch" && !plan.cookDays.length}
          className="btn-primary"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          {empty ? t("planner.generate") : t("planner.regenerate")}
        </button>
        {!empty && (
          <>
            <button type="button" onClick={toShopping} className="btn-ghost">
              <ListPlus className="h-4 w-4" aria-hidden />
              {t("planner.toShopping")}
            </button>
            <ShareButton title={t("planner.shareTitle", { site: SITE.name })} text={shareText} label={t("planner.share")} />
            <button type="button" onClick={() => save({ ...emptyPlan(plan.mode), cookDays: plan.cookDays })} className="btn-ghost">
              {t("planner.clear")}
            </button>
          </>
        )}
      </div>
      {!empty && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
          <Save className="h-3.5 w-3.5" aria-hidden />
          {t("planner.saved")}
        </p>
      )}

      {empty ? (
        <div className="card mx-auto mt-10 max-w-md p-10 text-center text-muted">
          <CalendarDays className="mx-auto mb-3 h-12 w-12 text-tomato" aria-hidden />
          {t("planner.empty")}
        </div>
      ) : (
        <>
          {/* Cooking sessions */}
          {batch && (
            <section className="mt-10">
              <h2 className="heading flex items-center gap-2 text-xl">
                <ChefHat className="h-5 w-5 text-tomato" aria-hidden />
                {t("planner.cookPlan")}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {orderedCookDays(plan.cookDays).map((cd) => {
                  const slug = plan.batch[cd] ?? null;
                  const side = plan.sides[`batch:${cd}`] ?? null;
                  const meals = mealsFrom(cd, plan);
                  return (
                    <motion.div key={cd} layout className="card relative overflow-hidden p-5">
                      <div aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-tomato" />
                      <p className="text-xs font-bold uppercase tracking-wider text-tomato">
                        {t("planner.cookOn", { day: dayName(cd) })}
                      </p>
                      <div className="mt-1 flex items-start gap-2">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={slug ?? "none"}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="min-w-0 flex-1"
                          >
                            {slug && (
                              <Link href={`/dishes/${slug}`} className="heading block text-2xl hover:text-tomato">
                                {nameOf(slug)}
                              </Link>
                            )}
                          </motion.div>
                        </AnimatePresence>
                        <IconButton label={t("planner.reroll")} onClick={() => save(rerollBatch(plan, dishes, cd))}>
                          <Dices className="h-4 w-4 text-muted" />
                        </IconButton>
                      </div>
                      {side && (
                        <SideChip
                          label={`${t("planner.with")} ${sideName(side)}`}
                          rerollLabel={t("planner.otherSide")}
                          onReroll={() => save(rerollSide(plan, dishes, `batch:${cd}`, slug))}
                        />
                      )}
                      <p className="mt-3 text-sm text-muted">
                        {t("planner.enoughFor", { count: meals.length, days: meals.map(dayName).join(", ") })}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* The week */}
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {DAYS.map((day, i) => {
              const s = getSection(day)!;
              const isToday = s.weekday === today;
              const isCookDay = batch && plan.cookDays.includes(day);
              const isSnackDay = batch && !isCookDay && plan.snackDays.includes(day);
              return (
                <motion.section
                  key={day}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card min-w-0 p-5 ${isToday ? "ring-2 ring-tomato" : ""}`}
                >
                  <header className="mb-3 flex min-w-0 items-center justify-between gap-2">
                    <h3 className="heading flex shrink-0 items-center gap-2 text-lg">
                      <SectionIcon id={day} className="h-5 w-5 text-tomato" />
                      {dayName(day)}
                    </h3>
                    {batch ? (
                      isCookDay ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-tomato px-2.5 py-1 text-xs font-semibold text-white">
                          <ChefHat className="h-3.5 w-3.5" aria-hidden />
                          {t("planner.cookToday")}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => save(toggleSnackDay(plan, day))}
                          aria-pressed={isSnackDay}
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                            isSnackDay ? "border-mango bg-mango text-ink" : "border-line text-muted hover:border-mango"
                          }`}
                        >
                          <Cookie className="h-3.5 w-3.5" aria-hidden />
                          {t("planner.snackDay")}
                        </button>
                      )
                    ) : (
                      <span className="min-w-0 truncate text-xs text-muted">{t(`sections.${day}.theme`)}</span>
                    )}
                  </header>
                  <ul className="space-y-2">
                    {MEALS.map((meal) => {
                      const cell = grid[day][meal];
                      const MealIcon = MEAL_ICON[meal];
                      const locked = plan.locked.includes(`${day}:${meal}`);
                      const leftovers = cell.kind === "batch" && !cell.isCookDay;
                      const canLock = cell.kind !== "batch" && cell.kind !== "snack";
                      const canReroll = cell.kind !== "batch";
                      return (
                        <li
                          key={meal}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                            cell.kind === "batch" ? "bg-tomato/10" : cell.kind === "snack" ? "bg-mango/15" : "bg-bg/60"
                          }`}
                        >
                          <MealIcon className="h-4 w-4 shrink-0 text-mango" aria-hidden />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-muted">
                              {t(`planner.${meal}`)}
                              {cell.kind === "light" && (
                                <span className="ml-1.5 normal-case tracking-normal">· {t("planner.light")}</span>
                              )}
                              {cell.kind === "snack" && (
                                <span className="ml-1.5 normal-case tracking-normal text-ink">· {t("planner.snackLabel")}</span>
                              )}
                              {leftovers && cell.cookDay && (
                                <span className="ml-1.5 normal-case tracking-normal text-leaf">
                                  · {t("planner.leftovers", { day: dayName(cell.cookDay) })}
                                </span>
                              )}
                              {cell.kind === "batch" && cell.isCookDay && (
                                <span className="ml-1.5 normal-case tracking-normal text-tomato">· {t("planner.freshToday")}</span>
                              )}
                            </p>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`${cell.slug}-${cell.side}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                              >
                                {cell.slug ? (
                                  <Link href={`/dishes/${cell.slug}`} className="block truncate font-semibold hover:text-tomato">
                                    {nameOf(cell.slug)}
                                  </Link>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                                {cell.side &&
                                  (cell.kind === "theme" ? (
                                    <button
                                      type="button"
                                      onClick={() => save(rerollSide(plan, dishes, cell.sideKey, cell.slug))}
                                      title={t("planner.otherSide")}
                                      className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-muted hover:text-tomato"
                                    >
                                      + {sideName(cell.side)}
                                      <Dices className="h-3 w-3 shrink-0" aria-hidden />
                                    </button>
                                  ) : (
                                    <span className="block truncate text-xs text-muted">+ {sideName(cell.side)}</span>
                                  ))}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          {canLock && (
                            <IconButton
                              label={locked ? t("planner.unlock") : t("planner.lock")}
                              pressed={locked}
                              onClick={() => toggleLock(day, meal)}
                            >
                              {locked ? <Lock className="h-4 w-4 text-mango" /> : <LockOpen className="h-4 w-4 text-muted" />}
                            </IconButton>
                          )}
                          {canReroll && (
                            <IconButton
                              label={t("planner.reroll")}
                              disabled={locked}
                              onClick={() => save(rerollCell(plan, dishes, day, meal, cell.kind))}
                            >
                              <Dices className="h-4 w-4 text-muted" />
                            </IconButton>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function SideChip({ label, rerollLabel, onReroll }: { label: string; rerollLabel: string; onReroll: () => void }) {
  return (
    <button
      type="button"
      onClick={onReroll}
      title={rerollLabel}
      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-3 py-1 text-sm font-medium text-leaf transition-colors hover:bg-leaf/20"
    >
      {label}
      <Dices className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      whileTap={{ scale: 0.85 }}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-line/60 disabled:opacity-30"
    >
      {children}
    </motion.button>
  );
}
