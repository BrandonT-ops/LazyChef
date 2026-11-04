"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  CalendarDays,
  ChefHat,
  Dices,
  Lock,
  LockOpen,
  Moon,
  Refrigerator,
  Save,
  Sparkles,
  Sun,
  Sunrise,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getSection } from "@/data/sections";
import type { DishSummary, SectionId } from "@/data/types";
import { SITE } from "@/config/site";
import {
  DAYS,
  MEALS,
  cells,
  emptyPlan,
  generate,
  isEmpty,
  rerollBatchDish,
  rerollCell,
  spanOf,
  type Meal,
  type Mode,
  type PlanState,
} from "@/lib/planner";
import { SectionIcon } from "./icons";
import { ShareButton } from "./ShareButton";

const MEAL_ICON: Record<Meal, LucideIcon> = { breakfast: Sunrise, lunch: Sun, supper: Moon };
const STORAGE_KEY = "chop-plan-v2";

export function WeekPlanner({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations();
  const [plan, setPlan] = useState<PlanState>(() => emptyPlan());
  const [today, setToday] = useState<number | null>(null);
  const bySlug = useMemo(() => new Map(dishes.map((d) => [d.slug, d])), [dishes]);

  useEffect(() => {
    setToday(new Date().getDay());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as PlanState;
        if (saved?.v === 2) setPlan(saved);
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
  const batch = plan.mode === "batch";
  const grid = cells(plan);
  const dayName = (d: SectionId) => t(`sections.${d}.name`);
  const nameOf = (slug: string | null) => (slug ? bySlug.get(slug)?.name ?? "" : "");

  const setMode = (mode: Mode) => save(empty ? { ...plan, mode } : generate({ ...plan, mode }, dishes));
  const toggleCookDay = (day: SectionId) => {
    const cookDays = plan.cookDays.includes(day)
      ? plan.cookDays.filter((d) => d !== day)
      : DAYS.filter((d) => d === day || plan.cookDays.includes(d));
    const next = { ...plan, cookDays };
    save(empty || !cookDays.length ? next : generate(next, dishes));
  };
  const toggleLock = (day: SectionId, meal: Meal) => {
    const key = `${day}:${meal}`;
    const locked = plan.locked.includes(key) ? plan.locked.filter((k) => k !== key) : [...plan.locked, key];
    save({ ...plan, locked });
  };

  const shareText = () => {
    const lines = DAYS.map((d) => {
      const c = grid[d];
      return `${dayName(d)}: ${MEALS.map((m) => `${t(`planner.${m}`)} ${nameOf(c[m].slug) || "-"}`).join(" / ")}`;
    });
    return `${t("planner.shareTitle", { site: SITE.name })}\n\n${lines.join("\n")}`;
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
        {t(batch ? "planner.modeBatchHint" : "planner.modeDailyHint")}
      </p>

      {/* Free days picker */}
      <AnimatePresence initial={false}>
        {batch && (
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

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => save(generate(plan, dishes))}
          disabled={batch && !plan.cookDays.length}
          className="btn-primary"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          {empty ? t("planner.generate") : t("planner.regenerate")}
        </button>
        {!empty && (
          <>
            <ShareButton title={t("planner.shareTitle", { site: SITE.name })} text={shareText} label={t("planner.share")} />
            <button
              type="button"
              onClick={() => save({ ...emptyPlan(plan.mode), cookDays: plan.cookDays })}
              className="btn-ghost"
            >
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
          {/* Cooking sessions (cook-ahead mode) */}
          {batch && plan.cookDays.length > 0 && (
            <section className="mt-10">
              <h2 className="heading flex items-center gap-2 text-xl">
                <ChefHat className="h-5 w-5 text-tomato" aria-hidden />
                {t("planner.cookPlan")}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {plan.cookDays.map((cd) => {
                  const span = spanOf(cd, plan.cookDays);
                  return (
                    <motion.div key={cd} layout className="card border-tomato/30 p-5">
                      <p className="heading text-lg">{t("planner.cookOn", { day: dayName(cd) })}</p>
                      <p className="text-xs text-muted">
                        {span.length > 1
                          ? t("planner.covers", {
                              from: dayName(span[0]),
                              to: dayName(span[span.length - 1]),
                              count: span.length,
                            })
                          : t("planner.coversOne", { day: dayName(cd) })}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {(plan.batches[cd] ?? []).map((slug, i) => (
                          <li key={`${cd}-${i}`} className="flex items-center gap-2 rounded-xl bg-bg/60 px-3 py-2">
                            <Refrigerator className="h-4 w-4 shrink-0 text-leaf" aria-hidden />
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={slug}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="min-w-0 flex-1 truncate font-semibold"
                              >
                                <Link href={`/dishes/${slug}`} className="hover:text-tomato">
                                  {nameOf(slug)}
                                </Link>
                              </motion.span>
                            </AnimatePresence>
                            <IconButton label={t("planner.reroll")} onClick={() => save(rerollBatchDish(plan, dishes, cd, i))}>
                              <Dices className="h-4 w-4 text-muted" />
                            </IconButton>
                          </li>
                        ))}
                      </ul>
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
              return (
                <motion.section
                  key={day}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card min-w-0 p-5 ${isToday ? "ring-2 ring-tomato" : ""}`}
                >
                  <header className="mb-3 flex min-w-0 items-baseline justify-between gap-2">
                    <h3 className="heading flex shrink-0 items-center gap-2 text-lg">
                      <SectionIcon id={day} className="h-5 w-5 text-tomato" />
                      {dayName(day)}
                    </h3>
                    {batch ? (
                      grid[day].lunch.isCookDay && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-tomato/10 px-2 py-0.5 text-xs font-semibold text-tomato">
                          <ChefHat className="h-3 w-3" aria-hidden />
                          {t("planner.cookToday")}
                        </span>
                      )
                    ) : (
                      <span className="min-w-0 truncate text-xs text-muted">{t(`sections.${day}.theme`)}</span>
                    )}
                  </header>
                  <ul className="space-y-2">
                    {MEALS.map((meal) => {
                      const cell = grid[day][meal];
                      const MealIcon = MEAL_ICON[meal];
                      const fromBatch = batch && meal !== "breakfast";
                      const locked = plan.locked.includes(`${day}:${meal}`);
                      return (
                        <li key={meal} className="flex items-center gap-2 rounded-xl bg-bg/60 px-3 py-2">
                          <MealIcon className="h-4 w-4 shrink-0 text-mango" aria-hidden />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-muted">
                              {t(`planner.${meal}`)}
                              {fromBatch && cell.cookDay && !cell.isCookDay && (
                                <span className="ml-1.5 normal-case tracking-normal text-leaf">
                                  · {t("planner.leftovers", { day: dayName(cell.cookDay) })}
                                </span>
                              )}
                            </p>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={cell.slug ?? "none"}
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
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          {!fromBatch && (
                            <>
                              <IconButton
                                label={locked ? t("planner.unlock") : t("planner.lock")}
                                pressed={locked}
                                onClick={() => toggleLock(day, meal)}
                              >
                                {locked ? <Lock className="h-4 w-4 text-mango" /> : <LockOpen className="h-4 w-4 text-muted" />}
                              </IconButton>
                              <IconButton
                                label={t("planner.reroll")}
                                disabled={locked}
                                onClick={() => save(rerollCell(plan, dishes, day, meal))}
                              >
                                <Dices className="h-4 w-4 text-muted" />
                              </IconButton>
                            </>
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
