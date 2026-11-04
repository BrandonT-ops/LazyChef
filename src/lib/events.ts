import type { DishSummary } from "@/data/types";
import type { SideId } from "@/data/sides";
import { estimateDishPrice } from "@/data/prices";
import { pickSide } from "./planner";
import { newId } from "./id";

export type Occasion = "birthday" | "wedding" | "holidays" | "baptism" | "funeral" | "family" | "party";
export const OCCASIONS: Occasion[] = ["birthday", "wedding", "holidays", "baptism", "funeral", "family", "party"];

export type Budget = "small" | "comfortable" | "generous";
export const BUDGETS: Budget[] = ["small", "comfortable", "generous"];

export type Course = "starters" | "mains" | "dessert" | "drinks";
export const COURSES: Course[] = ["starters", "mains", "dessert", "drinks"];

export interface EventItem {
  id: string;
  course: Course;
  slug: string;
  side: SideId | null;
}

export interface EventPlan {
  v: 1;
  occasion: Occasion;
  guests: number;
  budget: Budget;
  items: EventItem[];
}

/**
 * What suits each occasion, as keywords matched on dish slugs. First guesses based
 * on how these events are usually catered; edit freely.
 */
const POOLS: Record<Occasion, Record<Course, string[]>> = {
  birthday: {
    starters: ["nems", "scotch", "pilli", "crockettes", "boulettes", "meat-pie", "fish-roll", "brochettes", "corn-hot", "egg-cups", "plantain-cups", "mimosa"],
    mains: ["poulet-roti", "poulet-dg", "riz-gras", "porc-braise", "poisson-braise", "poulet-pane", "shawarma", "coconut-rice", "pizza"],
    dessert: ["gateau", "biscuits", "salade-de-fruits", "crepes"],
    drinks: ["cocktails", "bora-bora", "limonade", "coro", "fanta", "passion", "mangue", "fraise"],
  },
  wedding: {
    starters: ["beignets", "brochettes", "plantain-tape", "meat-pie", "nems", "boulettes", "pilons"],
    mains: ["ndole", "eru", "koki", "okok", "mbongo", "kondre", "poulet-dg", "chevre-dg", "ekwang", "taro", "poisson-braise", "riz-gras", "porc-dg", "boeuf-dg"],
    dessert: ["gateau", "salade-de-fruits"],
    drinks: ["matango", "tiger-nuts", "limonade", "cocktails", "coro", "passion", "citron"],
  },
  holidays: {
    starters: ["salade-de-cuit", "mimosa", "nems", "crockettes", "scotch", "brochettes", "toast"],
    mains: ["christmas-stew", "poulet-roti", "poulet-fume", "riz-gras", "coconut-rice", "poisson-au-four", "gratin", "chevre-roti", "porc-braise", "risotto"],
    dessert: ["gateau", "salade-de-fruits", "biscuits", "crepes"],
    drinks: ["cocktails", "whisky", "limonade", "bora-bora", "coro", "ananas-passion", "mangue-passion"],
  },
  baptism: {
    starters: ["beignets", "nems", "brochettes", "crockettes", "egg-cups", "plantain-cups", "mimosa"],
    mains: ["poulet-pane", "riz-saute", "riz-gras", "poulet-dg", "pilons", "poisson-au-four", "coconut-rice"],
    dessert: ["gateau", "salade-de-fruits", "biscuits"],
    drinks: ["limonade", "fraise-banane", "carotte-banane", "coro", "passion", "mangue"],
  },
  funeral: {
    starters: ["beignets", "plantain-tape"],
    mains: ["ndole", "eru", "haricots", "riz-gras", "bouillon", "koki", "okok", "mbongo", "pile", "sauce-d-arachide", "sauce-tomate", "couscous"],
    dessert: [],
    drinks: ["matango", "citron", "tiger-nuts", "jus"],
  },
  family: {
    starters: ["salade", "avocat", "beignets", "mimosa"],
    mains: ["ndole", "eru", "koki", "okok", "kondre", "taro", "mbongo", "ekwang", "pile", "couscous", "ndomba", "met-de"],
    dessert: ["salade-de-fruits", "gateau"],
    drinks: ["jus", "citron", "mangue", "ananas", "passion"],
  },
  party: {
    starters: ["brochettes", "soja", "pilli", "plantain-tape", "nems", "beignets", "cassava-sticks", "pilons"],
    mains: ["poisson-braise", "porc-braise", "poulet-braise", "brochettes-de-boeuf", "shawarma", "sliced"],
    dessert: [],
    drinks: ["cocktails", "bora-bora", "fanta", "matango", "whisky", "limonade"],
  },
};

/** How many dishes per course for each budget. */
const COUNTS: Record<Budget, Record<Course, number>> = {
  small: { starters: 1, mains: 1, dessert: 0, drinks: 1 },
  comfortable: { starters: 2, mains: 2, dessert: 1, drinks: 2 },
  generous: { starters: 3, mains: 3, dessert: 2, drinks: 3 },
};

export function pool(dishes: DishSummary[], occasion: Occasion, course: Course, budget: Budget): DishSummary[] {
  const words = POOLS[occasion][course];
  const fits = (d: DishSummary) =>
    course === "drinks" ? d.section === "drinks" : d.section !== "drinks" && (course === "dessert" || d.section !== "breakfast");
  let list = dishes.filter((d) => fits(d) && words.some((w) => d.slug.includes(w)));
  if (!list.length && course === "dessert") list = dishes.filter((d) => /gateau|salade-de-fruits/.test(d.slug));
  // Budget shapes the choice: small keeps the cheaper half, comfortable drops the priciest fifth.
  const sorted = [...list].sort((a, b) => estimateDishPrice(a.slug, a.section) - estimateDishPrice(b.slug, b.section));
  if (budget === "small" && sorted.length > 2) return sorted.slice(0, Math.ceil(sorted.length / 2));
  if (budget === "comfortable" && sorted.length > 4) return sorted.slice(0, Math.ceil(sorted.length * 0.8));
  return sorted;
}

function pickFrom(list: DishSummary[], taken: Set<string>, rand: () => number): DishSummary | null {
  const free = list.filter((d) => !taken.has(d.slug));
  const from = free.length ? free : list;
  if (!from.length) return null;
  const d = from[Math.floor(rand() * from.length)];
  taken.add(d.slug);
  return d;
}

export function proposeMenu(
  dishes: DishSummary[],
  occasion: Occasion,
  guests: number,
  budget: Budget,
  rand = Math.random,
): EventPlan {
  const taken = new Set<string>();
  const items: EventItem[] = [];
  for (const course of COURSES) {
    const list = pool(dishes, occasion, course, budget);
    for (let i = 0; i < COUNTS[budget][course]; i++) {
      const d = pickFrom(list, taken, rand);
      if (d) items.push({ id: newId(), course, slug: d.slug, side: course === "mains" ? pickSide(d, rand) : null });
    }
  }
  return { v: 1, occasion, guests, budget, items };
}

export function swapItem(plan: EventPlan, dishes: DishSummary[], id: string, rand = Math.random): EventPlan {
  const item = plan.items.find((i) => i.id === id);
  if (!item) return plan;
  const taken = new Set(plan.items.map((i) => i.slug));
  const d = pickFrom(pool(dishes, plan.occasion, item.course, plan.budget).filter((x) => x.slug !== item.slug), taken, rand);
  if (!d) return plan;
  return {
    ...plan,
    items: plan.items.map((i) => (i.id === id ? { ...i, slug: d.slug, side: i.course === "mains" ? pickSide(d, rand) : null } : i)),
  };
}

export function addItem(plan: EventPlan, dishes: DishSummary[], course: Course, rand = Math.random): EventPlan {
  const taken = new Set(plan.items.map((i) => i.slug));
  const d = pickFrom(pool(dishes, plan.occasion, course, "generous"), taken, rand);
  if (!d) return plan;
  return { ...plan, items: [...plan.items, { id: newId(), course, slug: d.slug, side: course === "mains" ? pickSide(d, rand) : null }] };
}

export function removeItem(plan: EventPlan, id: string): EventPlan {
  return { ...plan, items: plan.items.filter((i) => i.id !== id) };
}

/**
 * Servings to make for one dish:
 * starters and dessert, one portion per guest each;
 * mains, everyone eats one main plus 10% extra, shared across the mains;
 * drinks, two glasses per guest, shared across the drinks.
 */
export function servingsFor(plan: EventPlan, course: Course): number {
  const n = Math.max(1, plan.items.filter((i) => i.course === course).length);
  const g = Math.max(1, plan.guests);
  if (course === "mains") return Math.ceil((g * 1.1) / n);
  if (course === "drinks") return Math.ceil((g * 2) / n);
  return g;
}
