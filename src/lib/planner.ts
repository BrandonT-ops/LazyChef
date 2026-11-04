import { WEEKDAY_SECTIONS } from "@/data/sections";
import type { DishSummary, SectionId } from "@/data/types";
import { sidesFor, type SideId } from "@/data/sides";

export type Meal = "breakfast" | "lunch" | "supper";
export const MEALS: Meal[] = ["breakfast", "lunch", "supper"];

/** Monday to Sunday, as section ids. */
export const DAYS: SectionId[] = WEEKDAY_SECTIONS.map((s) => s.id);

export type Mode = "daily" | "batch";

/**
 * Two ways to plan a week:
 * - "daily": lunch and supper follow each day's theme.
 * - "batch" (cook ahead): on each free day you cook ONE dish that keeps well; it's the
 *   main meal (lunch) every day until the next cooking day. Breakfasts and light suppers
 *   are proposed, and long stretches get a "snack day" in the middle to take a break.
 */
export interface PlanState {
  v: 3;
  mode: Mode;
  breakfast: Partial<Record<SectionId, string | null>>;
  daily: Partial<Record<SectionId, { lunch: string | null; supper: string | null }>>;
  cookDays: SectionId[];
  /** The one dish cooked on each cooking day. */
  batch: Partial<Record<SectionId, string | null>>;
  /** Light supper proposed for each day (cook-ahead mode). */
  light: Partial<Record<SectionId, string | null>>;
  /** Snack proposed for each day, used when it's a snack day. */
  snack: Partial<Record<SectionId, string | null>>;
  /** Days where the main meal is a snack instead of leftovers. */
  snackDays: SectionId[];
  /** Kept slots, as "day:meal". Never changed by "new plan". */
  locked: string[];
  /** Side per dish: "day:lunch" / "day:supper" (every-day mode) or "batch:<cookDay>". */
  sides: Record<string, SideId | null>;
  /** How many people eat; used for quantities and costs. */
  people?: number;
}

export type CellKind = "breakfast" | "theme" | "batch" | "light" | "snack";

export interface Cell {
  slug: string | null;
  kind: CellKind;
  side: SideId | null;
  /** Key of this cell's side ("" when it has none). */
  sideKey: string;
  /** For cook-ahead main meals: the day the dish was cooked. */
  cookDay?: SectionId;
  isCookDay?: boolean;
}

export function emptyPlan(mode: Mode = "daily"): PlanState {
  return {
    v: 3,
    mode,
    breakfast: {},
    daily: {},
    cookDays: ["wednesday", "sunday"],
    batch: {},
    light: {},
    snack: {},
    snackDays: [],
    locked: [],
    sides: {},
    people: 2,
  };
}

// ---------- picking ----------

/** Picks a dish from `pool`, preferring ones not in `used`, and marks it used. */
function pick(pool: DishSummary[], used: Set<string>, rand: () => number, avoid?: string | null): string | null {
  if (!pool.length) return null;
  const fresh = pool.filter((d) => !used.has(d.slug) && d.slug !== avoid);
  const others = pool.filter((d) => d.slug !== avoid);
  const from = fresh.length ? fresh : others.length ? others : pool;
  const choice = from[Math.floor(rand() * from.length)];
  used.add(choice.slug);
  return choice.slug;
}

/** A side that suits the dish (none for dishes that already include their starch). */
export function pickSide(dish: DishSummary | undefined, rand = Math.random, avoid?: SideId | null): SideId | null {
  if (!dish) return null;
  const options = sidesFor(dish.slug, dish.section);
  if (!options.length) return null;
  const choices = options.length > 1 && avoid ? options.filter((s) => s !== avoid) : options;
  // Lean towards the classic pairing (listed first) without always choosing it.
  const i = rand() < 0.4 ? 0 : Math.floor(rand() * choices.length);
  return choices[i];
}

const LIGHT_WORDS = ["snack", "salade", "oeuf", "egg", "pizza", "shawarma", "meat-pie", "fish-roll", "nems", "toast", "avocat"];

export function pools(dishes: DishSummary[]) {
  return {
    breakfast: dishes.filter((d) => d.section === "breakfast"),
    theme: (day: SectionId) => dishes.filter((d) => d.section === day),
    batch: dishes.filter((d) => d.tags.includes("batch")),
    /** No-fuss things for a light supper or a snack day. */
    light: dishes.filter(
      (d) =>
        d.section === "monday" ||
        d.tags.includes("snack") ||
        (d.section !== "drinks" && d.section !== "breakfast" && LIGHT_WORDS.some((w) => d.slug.includes(w))),
    ),
  };
}

// ---------- cook-ahead coverage ----------

/** For each day, the cooking day whose dish feeds it (the latest one at or before it, wrapping round the week). */
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

/** Days fed by one cooking day, in order, starting with the cooking day itself. */
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

/** Cooking days in week order, starting from the first one after Monday's wrap. */
export function orderedCookDays(cookDays: SectionId[]): SectionId[] {
  return DAYS.filter((d) => cookDays.includes(d));
}

/** Suggested snack days: the middle of every stretch of 4 days or more. */
export function defaultSnackDays(cookDays: SectionId[]): SectionId[] {
  const out: SectionId[] = [];
  for (const cd of cookDays) {
    const span = spanOf(cd, cookDays);
    if (span.length >= 4) out.push(span[Math.floor(span.length / 2)]);
  }
  return out;
}

/** How many main meals a cooking session must cover (snack days don't count). */
export function mealsFrom(cookDay: SectionId, state: Pick<PlanState, "cookDays" | "snackDays">): SectionId[] {
  return spanOf(cookDay, state.cookDays).filter((d) => d === cookDay || !state.snackDays.includes(d));
}

// ---------- generating ----------

export function generate(
  state: PlanState,
  dishes: DishSummary[],
  opts: { resetSnackDays?: boolean } = {},
  rand = Math.random,
): PlanState {
  const p = pools(dishes);
  const used = new Set<string>();
  const isLocked = (day: SectionId, meal: Meal) => state.locked.includes(`${day}:${meal}`);
  const bySlug = new Map(dishes.map((d) => [d.slug, d]));
  const sideOf = (slug: string | null) => (slug ? pickSide(bySlug.get(slug), rand) : null);
  const next: PlanState = { ...state, breakfast: {}, daily: {}, batch: {}, light: {}, snack: {}, sides: {} };

  for (const day of DAYS) {
    next.breakfast[day] = isLocked(day, "breakfast") ? (state.breakfast[day] ?? null) : pick(p.breakfast, used, rand);
  }

  // Every-day mode.
  for (const day of DAYS) {
    const prev = state.daily[day];
    const lunch = isLocked(day, "lunch") ? (prev?.lunch ?? null) : pick(p.theme(day), used, rand);
    const supper = isLocked(day, "supper") ? (prev?.supper ?? null) : pick(p.theme(day), used, rand, lunch);
    next.daily[day] = { lunch, supper };
    for (const meal of ["lunch", "supper"] as const) {
      const key = `${day}:${meal}`;
      next.sides[key] = isLocked(day, meal) ? (state.sides[key] ?? null) : sideOf(next.daily[day]![meal]);
    }
  }

  // Cook-ahead mode: one dish per cooking day, light suppers, snacks.
  for (const cd of state.cookDays) {
    next.batch[cd] = pick(p.batch, used, rand);
    next.sides[`batch:${cd}`] = sideOf(next.batch[cd]!);
  }
  for (const day of DAYS) {
    next.light[day] = isLocked(day, "supper") ? (state.light[day] ?? null) : pick(p.light, used, rand);
    next.snack[day] = pick(p.light, used, rand);
  }
  next.snackDays = opts.resetSnackDays
    ? defaultSnackDays(state.cookDays)
    : state.snackDays.filter((d) => !state.cookDays.includes(d));
  return next;
}

/** Another dish that keeps well for one cooking day. */
export function rerollBatch(state: PlanState, dishes: DishSummary[], cookDay: SectionId, rand = Math.random): PlanState {
  const used = new Set(Object.values(state.batch).filter(Boolean) as string[]);
  const slug = pick(pools(dishes).batch, used, rand, state.batch[cookDay]);
  return {
    ...state,
    batch: { ...state.batch, [cookDay]: slug },
    sides: { ...state.sides, [`batch:${cookDay}`]: pickSide(dishes.find((d) => d.slug === slug), rand) },
  };
}

/** Another proposal for one cell, from the right pool for that kind of cell. */
export function rerollCell(state: PlanState, dishes: DishSummary[], day: SectionId, meal: Meal, kind: CellKind, rand = Math.random): PlanState {
  const p = pools(dishes);
  const used = new Set<string>();
  if (kind === "breakfast") {
    return { ...state, breakfast: { ...state.breakfast, [day]: pick(p.breakfast, used, rand, state.breakfast[day]) } };
  }
  if (kind === "light") {
    return { ...state, light: { ...state.light, [day]: pick(p.light, used, rand, state.light[day]) } };
  }
  if (kind === "snack") {
    return { ...state, snack: { ...state.snack, [day]: pick(p.light, used, rand, state.snack[day]) } };
  }
  if (kind === "batch") {
    const cd = coverage(state.cookDays)[day];
    return cd ? rerollBatch(state, dishes, cd, rand) : state;
  }
  const cur = state.daily[day] ?? { lunch: null, supper: null };
  if (meal === "breakfast") return state;
  const other = meal === "lunch" ? cur.supper : cur.lunch;
  if (other) used.add(other);
  const slug = pick(p.theme(day), used, rand, cur[meal]);
  return {
    ...state,
    daily: { ...state.daily, [day]: { ...cur, [meal]: slug } },
    sides: { ...state.sides, [`${day}:${meal}`]: pickSide(dishes.find((d) => d.slug === slug), rand) },
  };
}

/** Picks another side for the dish behind `key`. */
export function rerollSide(state: PlanState, dishes: DishSummary[], key: string, slug: string | null, rand = Math.random): PlanState {
  const side = pickSide(dishes.find((d) => d.slug === slug), rand, state.sides[key]);
  return { ...state, sides: { ...state.sides, [key]: side } };
}

export function toggleSnackDay(state: PlanState, day: SectionId): PlanState {
  if (state.cookDays.includes(day)) return state;
  const snackDays = state.snackDays.includes(day) ? state.snackDays.filter((d) => d !== day) : [...state.snackDays, day];
  return { ...state, snackDays };
}

// ---------- reading ----------

/** What to eat each day and meal, whichever mode is on. */
export function cells(state: PlanState): Record<SectionId, Record<Meal, Cell>> {
  const cov = coverage(state.cookDays);
  const out = {} as Record<SectionId, Record<Meal, Cell>>;
  const sideAt = (key: string) => state.sides[key] ?? null;
  for (const day of DAYS) {
    const breakfast: Cell = { slug: state.breakfast[day] ?? null, kind: "breakfast", side: null, sideKey: "" };

    if (state.mode === "daily" || !state.cookDays.length) {
      const d = state.daily[day];
      const cell = (meal: "lunch" | "supper"): Cell => ({
        slug: d?.[meal] ?? null,
        kind: "theme",
        side: sideAt(`${day}:${meal}`),
        sideKey: `${day}:${meal}`,
      });
      out[day] = { breakfast, lunch: cell("lunch"), supper: cell("supper") };
      continue;
    }

    const cd = cov[day]!;
    const isCookDay = day === cd;
    const lunch: Cell =
      !isCookDay && state.snackDays.includes(day)
        ? { slug: state.snack[day] ?? null, kind: "snack", side: null, sideKey: "" }
        : { slug: state.batch[cd] ?? null, kind: "batch", side: sideAt(`batch:${cd}`), sideKey: `batch:${cd}`, cookDay: cd, isCookDay };
    const supper: Cell = { slug: state.light[day] ?? null, kind: "light", side: null, sideKey: "" };
    out[day] = { breakfast, lunch, supper };
  }
  return out;
}

export function isEmpty(state: PlanState): boolean {
  return !Object.keys(state.breakfast).length;
}
