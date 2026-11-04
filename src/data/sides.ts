import type { Localized, SectionId } from "./types";

/** Sides served with a main dish. Names are shown in the visitor's language. */
export const SIDES = {
  rice: { en: "White rice", fr: "Riz blanc" },
  "plantain-ripe": { en: "Fried ripe plantain", fr: "Plantain mûr frit" },
  "plantain-boiled": { en: "Boiled plantain", fr: "Plantain bouilli" },
  bobolo: { en: "Bobolo (cassava stick)", fr: "Bâton de manioc" },
  miondo: { en: "Miondo", fr: "Miondo" },
  "corn-couscous": { en: "Corn couscous", fr: "Couscous de maïs" },
  fufu: { en: "Water fufu", fr: "Water fufu" },
  garri: { en: "Garri", fr: "Gari" },
  yam: { en: "Boiled yam", fr: "Igname bouillie" },
  macabo: { en: "Boiled macabo", fr: "Macabo bouilli" },
  fries: { en: "Fries", fr: "Frites" },
  potatoes: { en: "Boiled potatoes", fr: "Pommes de terre vapeur" },
  bread: { en: "Bread", fr: "Pain" },
  salad: { en: "Green salad", fr: "Salade verte" },
} satisfies Record<string, Localized<string>>;

export type SideId = keyof typeof SIDES;

/**
 * Smart matching, checked in this order (all on the dish slug):
 * 1. NO_SIDE: the dish already has its starch, or it's a snack, pastry, salad or egg dish.
 * 2. PAIRINGS: classic matches (ndolé with plantain or miondo, eru with fufu…).
 * 3. Families: sauces and stews, then grills and roasts.
 * 4. Anything else gets rice, plantain or potatoes.
 * Edit freely: these are first guesses.
 */
const NO_SIDE = [
  "riz", "risotto", "rice", "couscous", "pile", "fufu", "tapioca", "kwanzap", "chap", "rape",
  "sanga", "ekwang", "kondre", "-dg", "taro", "pomme", "igname", "macabo", "manioc", "cassava",
  "plantain", "banane", "pattes", "pates", "gratin", "pizza", "burger", "shawarma", "meat-pie",
  "nems", "galette", "beignet", "gateau", "biscuit", "toast", "pain", "bread", "kumba", "salade",
  "crackers", "churros", "hot-dog", "irish-balls", "scotch-eggs", "snack", "oeuf", "egg",
  "crockettes", "fish-roll", "corn-chaff",
];

const PAIRINGS: [string, SideId[]][] = [
  ["ndole", ["plantain-ripe", "miondo", "bobolo", "plantain-boiled"]],
  ["eru", ["fufu", "garri"]],
  ["ogbono", ["fufu", "garri"]],
  ["calabar", ["fufu", "garri"]],
  ["okok", ["bobolo", "miondo"]],
  ["koki", ["plantain-boiled", "bobolo"]],
  ["mbongo", ["plantain-boiled", "rice"]],
  ["ndomba", ["plantain-boiled", "bobolo"]],
  ["met-de", ["plantain-boiled", "bobolo"]],
  ["haricots", ["plantain-ripe", "bread", "rice"]],
  ["ofada", ["rice"]],
  ["christmas-stew", ["rice", "plantain-ripe"]],
  ["kedjenou", ["rice", "plantain-ripe"]],
  ["bouillon", ["plantain-boiled", "yam", "macabo", "bread"]],
  ["sauce-tomate", ["rice", "plantain-ripe", "potatoes"]],
];

const SAUCE_WORDS = ["sauce", "stew", "soup", "saute", "crevettes", "champignons", "boulettes", "mayo", "hache", "gesier", "peau", "choux", "legumes", "beafteak"];
const SAUCE_SIDES: SideId[] = ["rice", "plantain-boiled", "plantain-ripe", "bobolo", "corn-couscous", "yam", "macabo"];

const GRILL_WORDS = ["braise", "brochettes", "roti", "four", "fume", "pane", "pilons", "pilli", "poulet", "poisson", "chevre", "porc", "escargots", "tripes", "soja", "sliced"];
const GRILL_SIDES: SideId[] = ["plantain-ripe", "fries", "bobolo", "miondo", "potatoes", "salad"];

const DEFAULT_SIDES: SideId[] = ["rice", "plantain-ripe", "potatoes"];

/** Sides that go with a dish, best first. Empty when it needs none. */
export function sidesFor(slug: string, section: SectionId): SideId[] {
  if (section === "breakfast" || section === "drinks" || section === "wednesday") return [];
  if (NO_SIDE.some((w) => slug.includes(w))) return [];
  const pairing = PAIRINGS.find(([w]) => slug.includes(w));
  if (pairing) return pairing[1];
  if (SAUCE_WORDS.some((w) => slug.includes(w))) return SAUCE_SIDES;
  if (GRILL_WORDS.some((w) => slug.includes(w))) return GRILL_SIDES;
  return DEFAULT_SIDES;
}
