import type { Tag } from "./types";

/**
 * Dishes that keep well for 2–4 days in the fridge, so they can be cooked ahead
 * in big batches (used by the planner's "cook ahead" mode).
 * First guess from the dish names; edit freely. Matching is on the slug.
 */
const KEEPS_WELL = [
  "sauce", "bouillon", "stew", "soup", "ndole", "eru", "okok-sale", "kondre",
  "koki", "mbongo", "ndomba", "riz-gras", "haricots", "-dg", "kedjenou",
  "ogbono", "ekwang", "met-de", "boulettes", "taro-sauce", "poulet-roti",
  "poulet-fume", "chevre-roti", "pate-d-arachide",
];

/** Fried or crispy things that are best eaten fresh, even if the name matches above. */
const EAT_FRESH = ["beignets", "pane", "snack"];

export function inferredTags(slug: string): Tag[] {
  const keeps = KEEPS_WELL.some((w) => slug.includes(w)) && !EAT_FRESH.some((w) => slug.includes(w));
  return keeps ? ["batch"] : [];
}
