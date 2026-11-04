import type { SectionId } from "./types";
import type { SideId } from "./sides";

export const CURRENCY = "FCFA";

/**
 * Rough cost of ONE homemade serving, in FCFA (Cameroon prices, first guesses).
 * People can change any price in the app; their prices are remembered and used instead.
 * Rules are checked in order on the dish slug; the first match wins.
 */
const DRINK_RULES: [string[], number][] = [
  [["whisky"], 1500],
  [["cocktail", "bora-bora"], 700],
  [["fanta", "conserve"], 500],
  [["matango", "tiger-nuts"], 300],
];
const DRINK_DEFAULT = 250; // homemade juice, per glass

const FOOD_RULES: [string[], number][] = [
  // Fritters and cakes first, so "beignets banane" or "gâteau de manioc" aren't priced as plantain or cassava.
  [["beignet"], 150],
  [["gateau", "biscuit", "crepes", "galettes", "churros", "crackers", "sucettes", "gummies"], 300],
  [["poisson-braise", "poisson-roti", "poisson-au-four", "poisson-a-la-poele", "crevettes", "poisson-dg"], 2500],
  [["chevre"], 2500],
  [["escargots"], 2000],
  [["poulet", "pilons", "kedjenou"], 1800],
  [["porc", "boeuf", "beafteak", "peau-de-boeuf", "tripes", "gesier", "kondre", "viande", "hache"], 1500],
  [["ndole", "eru", "okok", "mbongo", "ndomba", "ogbono", "calabar", "mbanga", "ekwang", "koki"], 1200],
  [["sauce", "stew", "bouillon", "soup"], 1000],
  [["shawarma", "burger", "pizza", "meat-pie", "fish-roll", "nems", "scotch"], 800],
  [["riz", "risotto", "rice", "couscous", "fufu", "pile", "taro", "tapioca", "chap", "kwanzap", "rape"], 700],
  [["brochettes", "soja", "sliced"], 700],
  [["haricots", "met-de", "pate-d-arachide", "pattes"], 500],
  [["salade"], 400],
  [["plantain", "manioc", "cassava", "banane", "macabo", "igname", "pomme"], 400],
  [["oeuf", "egg"], 300],
  [["pain", "bread", "toast"], 300],
];

const SECTION_DEFAULT: Record<SectionId, number> = {
  breakfast: 300,
  monday: 600,
  tuesday: 1000,
  wednesday: 400,
  thursday: 1800,
  friday: 800,
  saturday: 1200,
  sunday: 1000,
  drinks: DRINK_DEFAULT,
};

export function estimateDishPrice(slug: string, section: SectionId): number {
  const rules = section === "drinks" ? DRINK_RULES : FOOD_RULES;
  const hit = rules.find(([words]) => words.some((w) => slug.includes(w)));
  return hit ? hit[1] : SECTION_DEFAULT[section];
}

/** Per serving, in FCFA. */
export const SIDE_PRICE: Record<SideId, number> = {
  rice: 150,
  "plantain-ripe": 250,
  "plantain-boiled": 200,
  bobolo: 200,
  miondo: 200,
  "corn-couscous": 150,
  fufu: 200,
  garri: 100,
  yam: 300,
  macabo: 250,
  fries: 350,
  potatoes: 300,
  bread: 150,
  salad: 200,
};
