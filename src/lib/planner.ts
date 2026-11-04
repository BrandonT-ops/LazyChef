import { WEEKDAY_SECTIONS } from "@/data/sections";
import type { DishSummary, SectionId } from "@/data/types";

export type Meal = "breakfast" | "lunch" | "supper";
export const MEALS: Meal[] = ["breakfast", "lunch", "supper"];

/** Monday to Sunday, as section ids. */
export const DAYS: SectionId[] = WEEKDAY_SECTIONS.map((s) => s.id);

export type Mode = "daily" | "batch";

export interface PlanState {
  v: 2;
  mode: Mode;
  breakfast: Partial<Record<SectionId, string | null>>;
  /** "Cook every day": lunch and supper follow each day's theme. */
  daily: Partial<Record<SectionId, { lunch: string | null; supper: string | null }>>;
  /** "Cook ahead": the days the person is free to cook. */
  cookDays: SectionId[];
  /** Dishes cooked on each cook day; their leftovers cover the following days. */
  batches: Partial<Record<SectionId, string[]>>;
  /** Kept slots, as "day:meal". Never changed by "new plan". */
  locked: string[];
}

export interface Cell {
  slug: string | null;
  /** In cook-ahead mode: the day this dish was cooked. */
  cookDay?: SectionId;
  isCookDay?: boolean;
}

export function emptyPlan(mode: Mode = "daily"): PlanState {
  return { v: 2, mode, breakfast: {}, daily: {}, cookDays: ["wednesday", "saturday"], batches: {}, locked: [] };
}

// ---------- picking ----------

function shuffle<T>(list: T[], rand: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Picks a dish from `pool`, preferring ones not in `used`, and marks it used. */
function pick(pool: DishSummary[], used: Set<string>, rand: () => number, avoid?: string | null): string | null {
  if (!pool.length) return null;
  const fresh = pool.filter((d) => !used.has(d.slug) && d.slug !== avoid);
  const from = fresh.length ? fresh : pool.filter((d) => d.slug !== avoid);
  const choice = (from.length ? from : pool)[Math.floor(rand() * (from.length || pool.length))];
  used.add(choice.slug);
  return choice.slug;
}

export function pools(dishes: DishSummary[]) {
  return {
    breakfast: dishes.filter((d) => d.section === "breakfast"),
    theme: (day: SectionId) => dishes.filter((d) => d.section === day),
    batch: dishes.filter((d) => d.tags.includes("batch")),
  };
}

// ---------- cook-ahead coverage ----------

/** For each day, the cook day whose leftovers feed it (the latest cook day at or before it, wrapping round the week). */
export function coverage(cookDays: SectionId[]): Partial<Record<SectionId, SectionId>> {
  const out: Partial<Record<SectionId, SectionId>> = {};
  if (!cookDays.length) return out;
  const idx = cookDays.map((d) => DAYS.indexOf(d)).sort((a, b) => a - b);
  DAYS.forEach((day, i) => {
    const before = idx.filter((c) => c <= i);
    out[day] = DAYS[before.length ? before[before.length - 1] : idx[idx.length - 1]];
  });
  return out;
}

/** Days fed by one cook day, in order, starting with the cook day itself. */
export function spanOf(cookDay: SectionId, cookDays: SectionId[]): SectionId[] {
  const cov = coverage(cookDays);
  const start = DAYS.indexOf(cookDay);
  const span: SectionId[] = [];
  for (let k = 0; k < 7; k++) {
    const day = DAYS[(start + k) % 7];
    if (cov[day] !== cookDay) break;
    span.push(day);
  }
  return span;
}

/** How many dishes to cook in one session: 2 for one or two days, 3 when it must last longer. */
export function batchSize(spanLength: number): number {
  return spanLength >= 3 ? 3 : 2;
}

// ---------- generating ----------

export function generate(state: PlanState, dishes: DishSummary[], rand = Math.random): PlanState {
  const p = pools(dishes);
  const used = new Set<string>();
  const isLocked = (day: SectionId, meal: Meal) => state.locked.includes(`${day}:${meal}`);
  const next: PlanState = { ...state, breakfast: {}, daily: {}, batches: {} };

  for (const day of DAYS) {
    next.breakfast[day] = isLocked(day, "breakfast")
      ? (state.breakfast[day] ?? null)
      : pick(p.breakfast, used, rand);
  }

  for (const day of DAYS) {
    const prev = state.daily[day];
    const lunch = isLocked(day, "lunch") ? (prev?.lunch ?? null) : pick(p.theme(day), used, rand);
    const supper = isLocked(day, "supper") ? (prev?.supper ?? null) : pick(p.theme(day), used, rand, lunch);
    next.daily[day] = { lunch, supper };
  }

  for (const cookDay of state.cookDays) {
    const size = batchSize(spanOf(cookDay, state.cookDays).length);
    const order = shuffle(p.batch, rand);
    const chosen: string[] = [];
    for (const d of order) {
      if (chosen.length === size) break;
      if (!used.has(d.slug)) {
        chosen.push(d.slug);
        used.add(d.slug);
      }
    }
    next.batches[cookDay] = chosen;
  }
  return next;
}

/** Swaps one cooked dish for another dish that keeps well. */
export function rerollBatchDish(state: PlanState, dishes: DishSummary[], cookDay: SectionId, index: number, rand = Math.random): PlanState {
  const current = state.batches[cookDay] ?? [];
  const used = new Set(Object.values(state.batches).flat());
  const slug = pick(pools(dishes).batch, used, rand, current[index]);
  const batch = [...current];
  batch[index] = slug ?? batch[index];
  return { ...state, batches: { ...state.batches, [cookDay]: batch } };
}

export function rerollCell(state: PlanState, dishes: DishSummary[], day: SectionId, meal: Meal, rand = Math.random): PlanState {
  const p = pools(dishes);
  const used = new Set<string>();
  if (meal === "breakfast") {
    const slug = pick(p.breakfast, used, rand, state.breakfast[day]);
    return { ...state, breakfast: { ...state.breakfast, [day]: slug } };
  }
  const cur = state.daily[day] ?? { lunch: null, supper: null };
  const other = meal === "lunch" ? cur.supper : cur.lunch;
  if (other) used.add(other);
  const slug = pick(p.theme(day), used, rand, cur[meal]);
  return { ...state, daily: { ...state.daily, [day]: { ...cur, [meal]: slug } } };
}

// ---------- reading ----------

/** What to eat each day and meal, whichever mode is on. */
export function cells(state: PlanState): Record<SectionId, Record<Meal, Cell>> {
  const cov = coverage(state.cookDays);
  const out = {} as Record<SectionId, Record<Meal, Cell>>;
  for (const day of DAYS) {
    const breakfast: Cell = { slug: state.breakfast[day] ?? null };
    if (state.mode === "daily" || !state.cookDays.length) {
      const d = state.daily[day];
      out[day] = { breakfast, lunch: { slug: d?.lunch ?? null }, supper: { slug: d?.supper ?? null } };
      continue;
    }
    const cookDay = cov[day]!;
    const batch = state.batches[cookDay] ?? [];
    const offset = spanOf(cookDay, state.cookDays).indexOf(day);
    const k = batch.length;
    const at = (n: number) => (k ? batch[n % k] : null);
    const extra = { cookDay, isCookDay: day === cookDay };
    out[day] = {
      breakfast,
      lunch: { slug: at(2 * offset), ...extra },
      supper: { slug: at(2 * offset + 1), ...extra },
    };
  }
  return out;
}

export function isEmpty(state: PlanState): boolean {
  return !Object.keys(state.breakfast).length;
}
