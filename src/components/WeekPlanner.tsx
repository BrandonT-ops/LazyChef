"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WEEKDAY_SECTIONS } from "@/data/sections";
import type { DishSummary, SectionId } from "@/data/types";
import { pickRandom } from "@/lib/random";

type Slot = "breakfast" | "main" | "drink";
const SLOTS: Slot[] = ["breakfast", "main", "drink"];
const SLOT_ICON: Record<Slot, string> = { breakfast: "☕", main: "🍽️", drink: "🥤" };

interface DayPlan {
  breakfast: string | null;
  main: string | null;
  drink: string | null;
  locked: Slot[];
}
type Plan = Record<string, DayPlan>; // keyed by weekday section id

const STORAGE_KEY = "lc-plan-v1";

function slotSection(slot: Slot, day: SectionId): SectionId {
  return slot === "breakfast" ? "breakfast" : slot === "drink" ? "drinks" : day;
}

/** One breakfast, one main (from the day's theme) and one drink per day. Saved on this device. */
export function WeekPlanner({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [today, setToday] = useState<number | null>(null);
  const bySlug = useMemo(() => new Map(dishes.map((d) => [d.slug, d])), [dishes]);

  useEffect(() => {
    setToday(new Date().getDay());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlan(JSON.parse(raw));
    } catch {
      /* ignore broken or unavailable storage */
    }
  }, []);

  const save = (next: Plan | null) => {
    setPlan(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const pick = (slot: Slot, day: SectionId, avoid?: string | null) => {
    const pool = dishes.filter((d) => d.section === slotSection(slot, day));
    return pool.length ? pickRandom(pool, avoid).slug : null;
  };

  const generate = () => {
    const next: Plan = {};
    for (const s of WEEKDAY_SECTIONS) {
      const prev = plan?.[s.id];
      const locked = prev?.locked ?? [];
      next[s.id] = {
        breakfast: locked.includes("breakfast") ? prev!.breakfast : pick("breakfast", s.id),
        main: locked.includes("main") ? prev!.main : pick("main", s.id),
        drink: locked.includes("drink") ? prev!.drink : pick("drink", s.id),
        locked,
      };
    }
    save(next);
  };

  const reroll = (day: SectionId, slot: Slot) => {
    if (!plan) return;
    save({ ...plan, [day]: { ...plan[day], [slot]: pick(slot, day, plan[day][slot]) } });
  };

  const toggleLock = (day: SectionId, slot: Slot) => {
    if (!plan) return;
    const locked = plan[day].locked.includes(slot)
      ? plan[day].locked.filter((s) => s !== slot)
      : [...plan[day].locked, slot];
    save({ ...plan, [day]: { ...plan[day], locked } });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={generate} className="btn-primary">
          ✨ {plan ? t("planner.regenerate") : t("planner.generate")}
        </button>
        {plan && (
          <button type="button" onClick={() => save(null)} className="btn-ghost">
            {t("planner.clear")}
          </button>
        )}
      </div>
      {plan && <p className="mt-3 text-center text-xs text-muted">💾 {t("planner.saved")}</p>}

      {!plan ? (
        <div className="card mx-auto mt-10 max-w-md p-10 text-center text-muted">
          <span className="mb-3 block text-5xl" aria-hidden>🗓️</span>
          {t("planner.empty")}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {WEEKDAY_SECTIONS.map((s, i) => {
            const day = plan[s.id];
            const isToday = s.weekday === today;
            return (
              <motion.section
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`card p-5 ${isToday ? "ring-2 ring-tomato" : ""}`}
              >
                <header className="mb-3 flex items-baseline justify-between">
                  <h2 className="heading text-lg">
                    {s.emoji} {t(`sections.${s.id}.name`)}
                  </h2>
                  <span className="truncate pl-2 text-xs text-muted">{t(`sections.${s.id}.theme`)}</span>
                </header>
                <ul className="space-y-2">
                  {SLOTS.map((slot) => {
                    const dish = day?.[slot] ? bySlug.get(day[slot]!) : undefined;
                    const locked = day?.locked.includes(slot);
                    return (
                      <li key={slot} className="flex items-center gap-2 rounded-xl bg-bg/60 px-3 py-2">
                        <span aria-hidden title={t(`planner.${slot}`)}>{SLOT_ICON[slot]}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{t(`planner.${slot}`)}</p>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={dish?.slug ?? "none"}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.2 }}
                            >
                              {dish ? (
                                <Link href={`/dishes/${dish.slug}`} className="block truncate font-semibold hover:text-tomato">
                                  {dish.name}
                                </Link>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleLock(s.id, slot)}
                          aria-pressed={locked}
                          title={locked ? t("planner.unlock") : t("planner.lock")}
                          aria-label={locked ? t("planner.unlock") : t("planner.lock")}
                          className={`grid h-8 w-8 place-items-center rounded-full text-sm transition-colors ${
                            locked ? "bg-mango/20" : "hover:bg-line/60"
                          }`}
                        >
                          {locked ? "🔒" : "🔓"}
                        </button>
                        <motion.button
                          type="button"
                          onClick={() => reroll(s.id, slot)}
                          disabled={locked}
                          title={t("planner.reroll")}
                          aria-label={t("planner.reroll")}
                          className="grid h-8 w-8 place-items-center rounded-full text-sm hover:bg-line/60 disabled:opacity-30"
                          whileTap={{ rotate: 180 }}
                        >
                          🎲
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </motion.section>
            );
          })}
        </div>
      )}
    </div>
  );
}
