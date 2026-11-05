/**
 * Ingredients people can say they have at home, used by "Cook with what I have" and the dice.
 * Each one lists the words that find it in a recipe's shopping list, in English and French
 * (lowercase, without accents). Longer phrases are matched first, so "palm oil" doesn't count
 * as plain oil and "coconut milk" doesn't count as milk.
 */
export type PantryGroup = "starch" | "protein" | "veg" | "fruit" | "pantry" | "dairy";

export interface PantryItem {
  id: string;
  en: string;
  fr: string;
  group: PantryGroup;
  terms: string[];
  /** Most homes have it: counted as available unless the person turns "basics" off. */
  staple?: boolean;
}

export const PANTRY: PantryItem[] = [
  // Starches
  { id: "plantain", en: "Plantain", fr: "Plantain", group: "starch", terms: ["plantain", "plantains"] },
  { id: "rice", en: "Rice", fr: "Riz", group: "starch", terms: ["rice", "riz"] },
  { id: "cassava", en: "Cassava", fr: "Manioc", group: "starch", terms: ["cassava", "manioc", "gari", "tapioca"] },
  { id: "miondo", en: "Miondo / bobolo", fr: "Miondo / bâton de manioc", group: "starch", terms: ["miondo", "bobolo", "baton de manioc", "cassava stick", "cassava sticks"] },
  { id: "macabo", en: "Macabo (cocoyam)", fr: "Macabo", group: "starch", terms: ["macabo", "cocoyam", "taro"] },
  { id: "yam", en: "Yam", fr: "Igname", group: "starch", terms: ["yam", "igname"] },
  { id: "potato", en: "Potatoes", fr: "Pommes de terre", group: "starch", terms: ["potato", "potatoes", "pomme de terre", "pommes de terre", "irish potatoes"] },
  { id: "corn-flour", en: "Corn flour", fr: "Farine de maïs", group: "starch", terms: ["corn flour", "farine de mais", "cornmeal", "semoule de mais", "fufu flour", "farine de fufu"] },
  { id: "flour", en: "Wheat flour", fr: "Farine", group: "starch", terms: ["flour", "farine"] },
  { id: "bread", en: "Bread", fr: "Pain", group: "starch", terms: ["bread", "baguette", "pain", "buns", "rolls", "petits pains", "pain de mie"] },
  { id: "pasta", en: "Pasta", fr: "Pâtes", group: "starch", terms: ["pasta", "spaghetti", "lasagne sheets", "feuilles de lasagne", "pates"] },
  { id: "banana", en: "Banana", fr: "Banane", group: "fruit", terms: ["banana", "bananas", "banane", "bananes"] },
  // Proteins
  { id: "egg", en: "Eggs", fr: "Œufs", group: "protein", terms: ["egg", "eggs", "oeuf", "oeufs", "jaunes d'oeufs"] },
  { id: "chicken", en: "Chicken", fr: "Poulet", group: "protein", terms: ["chicken", "poulet", "drumsticks", "pilons"] },
  { id: "beef", en: "Beef", fr: "Bœuf", group: "protein", terms: ["beef", "boeuf", "steak", "steaks", "minced beef", "viande hachee", "mince"] },
  { id: "pork", en: "Pork", fr: "Porc", group: "protein", terms: ["pork", "porc", "bacon", "lardons"] },
  { id: "goat", en: "Goat", fr: "Chèvre", group: "protein", terms: ["goat", "chevre"] },
  { id: "fish", en: "Fresh fish", fr: "Poisson frais", group: "protein", terms: ["fish", "poisson", "tilapia", "carp", "carpe", "bar", "sea bass", "mackerel", "maquereau", "fillets", "filets"] },
  { id: "smoked-fish", en: "Smoked / dried fish", fr: "Poisson fumé / séché", group: "protein", terms: ["smoked fish", "poisson fume", "dried fish", "poisson seche", "stockfish"] },
  { id: "shrimp", en: "Shrimp", fr: "Crevettes", group: "protein", terms: ["shrimp", "crevettes", "prawns"] },
  { id: "crayfish", en: "Crayfish (dried)", fr: "Écrevisses séchées", group: "protein", terms: ["crayfish", "ecrevisses"] },
  { id: "sardines", en: "Tinned sardines", fr: "Sardines en boîte", group: "protein", terms: ["sardines", "sardine"] },
  { id: "sausage", en: "Sausages / ham", fr: "Saucisses / jambon", group: "protein", terms: ["sausage", "sausages", "saucisse", "saucisses", "ham", "jambon", "saucisson", "salami", "hot dogs"] },
  { id: "beans", en: "Beans", fr: "Haricots", group: "protein", terms: ["beans", "haricots", "cornille", "niebe", "black-eyed"] },
  { id: "peanuts", en: "Peanuts / peanut paste", fr: "Arachides / pâte d'arachide", group: "protein", terms: ["peanut", "peanuts", "arachide", "arachides", "pate d'arachide", "peanut paste"] },
  { id: "egusi", en: "Egusi (pistache)", fr: "Pistache (egusi)", group: "protein", terms: ["egusi", "pistache", "melon seeds", "graines de melon"] },
  { id: "soy", en: "Soy chunks", fr: "Soja", group: "protein", terms: ["soy chunks", "soja"] },
  { id: "snails", en: "Snails", fr: "Escargots", group: "protein", terms: ["snails", "escargots"] },
  { id: "offal", en: "Tripe / cow skin", fr: "Tripes / peau de bœuf", group: "protein", terms: ["tripe", "tripes", "cow skin", "peau de boeuf", "kanda", "cow foot", "pied de boeuf", "gizzards", "gesiers"] },
  // Vegetables
  { id: "onion", en: "Onions", fr: "Oignons", group: "veg", terms: ["onion", "onions", "oignon", "oignons", "shallots", "echalotes"] },
  { id: "tomato", en: "Tomatoes", fr: "Tomates", group: "veg", terms: ["tomato", "tomatoes", "tomate", "tomates", "tomato paste", "concentre", "tomato puree", "coulis", "crushed tomatoes", "tomates concassees"] },
  { id: "garlic", en: "Garlic", fr: "Ail", group: "veg", terms: ["garlic", "ail"] },
  { id: "ginger", en: "Ginger", fr: "Gingembre", group: "veg", terms: ["ginger", "gingembre"] },
  { id: "chili", en: "Hot pepper", fr: "Piment", group: "veg", terms: ["hot pepper", "hot peppers", "piment", "piments", "scotch bonnet", "scotch bonnets", "chili", "chilli"] },
  { id: "bell-pepper", en: "Bell pepper", fr: "Poivron", group: "veg", terms: ["bell pepper", "bell peppers", "green pepper", "green peppers", "poivron", "poivrons"] },
  { id: "carrot", en: "Carrots", fr: "Carottes", group: "veg", terms: ["carrot", "carrots", "carotte", "carottes"] },
  { id: "cabbage", en: "Cabbage", fr: "Chou", group: "veg", terms: ["cabbage", "chou"] },
  { id: "greens", en: "Leafy greens (spinach, njama-njama…)", fr: "Légumes verts (épinards, njama-njama…)", group: "veg", terms: ["spinach", "epinards", "greens", "legumes verts", "amaranth", "amarante", "njama-njama", "huckleberry", "morelle", "lettuce", "salade", "romaine", "laitue", "waterleaf", "ugu"] },
  { id: "ndole", en: "Ndolé leaves", fr: "Feuilles de ndolé", group: "veg", terms: ["ndole"] },
  { id: "cassava-leaves", en: "Cassava leaves", fr: "Feuilles de manioc", group: "veg", terms: ["cassava leaves", "feuilles de manioc"] },
  { id: "okok", en: "Okok / eru leaves", fr: "Feuilles d'okok / eru", group: "veg", terms: ["okok", "eru", "gnetum"] },
  { id: "okra", en: "Okra", fr: "Gombo", group: "veg", terms: ["okra", "gombo", "okro"] },
  { id: "banana-leaves", en: "Banana leaves", fr: "Feuilles de bananier", group: "veg", terms: ["banana leaves", "feuilles de bananier"] },
  { id: "mushroom", en: "Mushrooms", fr: "Champignons", group: "veg", terms: ["mushroom", "mushrooms", "champignon", "champignons"] },
  { id: "zucchini", en: "Zucchini", fr: "Courgette", group: "veg", terms: ["zucchini", "courgette", "courgettes"] },
  { id: "green-beans", en: "Green beans", fr: "Haricots verts", group: "veg", terms: ["green beans", "haricots verts"] },
  { id: "avocado", en: "Avocado", fr: "Avocat", group: "veg", terms: ["avocado", "avocados", "avocat", "avocats"] },
  { id: "herbs", en: "Parsley / celery / leek", fr: "Persil / céleri / poireau", group: "veg", terms: ["parsley", "persil", "celery", "celeri", "leek", "poireau", "basil", "basilic", "coriander", "coriandre", "mint", "menthe", "chives", "ciboulette"] },
  // Fruit
  { id: "mango", en: "Mango", fr: "Mangue", group: "fruit", terms: ["mango", "mangoes", "mangue", "mangues"] },
  { id: "pineapple", en: "Pineapple", fr: "Ananas", group: "fruit", terms: ["pineapple", "ananas"] },
  { id: "papaya", en: "Papaya", fr: "Papaye", group: "fruit", terms: ["papaya", "papaye"] },
  { id: "orange", en: "Oranges", fr: "Oranges", group: "fruit", terms: ["orange", "oranges"] },
  { id: "lime", en: "Lime / lemon", fr: "Citron", group: "fruit", terms: ["lime", "limes", "lemon", "lemons", "citron", "citrons"] },
  { id: "passion", en: "Passion fruit", fr: "Fruit de la passion", group: "fruit", terms: ["passion fruit", "passion fruits", "fruit de la passion", "fruits de la passion", "passion"] },
  { id: "soursop", en: "Soursop", fr: "Corossol", group: "fruit", terms: ["soursop", "corossol"] },
  { id: "guava", en: "Guava", fr: "Goyave", group: "fruit", terms: ["guava", "guavas", "goyave", "goyaves"] },
  { id: "coconut", en: "Coconut / coconut milk", fr: "Coco / lait de coco", group: "fruit", terms: ["coconut milk", "lait de coco", "coconut", "coco"] },
  { id: "strawberry", en: "Strawberries", fr: "Fraises", group: "fruit", terms: ["strawberries", "fraises"] },
  { id: "grapefruit", en: "Grapefruit", fr: "Pamplemousse", group: "fruit", terms: ["grapefruit", "grapefruits", "pamplemousse", "pamplemousses"] },
  { id: "safou", en: "Safou (African plums)", fr: "Safous (prunes)", group: "fruit", terms: ["safou", "safous", "african plums", "prunes africaines", "plums", "prunes"] },
  { id: "tiger-nuts", en: "Tiger nuts", fr: "Souchet", group: "fruit", terms: ["tiger nuts", "tiger nut", "souchet", "noix tigrees"] },
  { id: "apple", en: "Apples", fr: "Pommes", group: "fruit", terms: ["apple", "apples"] },
  // Dairy
  { id: "milk", en: "Milk", fr: "Lait", group: "dairy", terms: ["milk", "lait", "powdered milk", "lait en poudre", "condensed milk", "lait concentre"] },
  { id: "butter", en: "Butter / margarine", fr: "Beurre / margarine", group: "dairy", terms: ["butter", "beurre", "margarine"] },
  { id: "cheese", en: "Cheese", fr: "Fromage", group: "dairy", terms: ["cheese", "fromage", "mozzarella", "parmesan", "emmental", "gouda"] },
  { id: "cream", en: "Cream / yogurt", fr: "Crème / yaourt", group: "dairy", terms: ["cream", "creme", "yogurt", "yaourt"] },
  { id: "mayo", en: "Mayonnaise", fr: "Mayonnaise", group: "dairy", terms: ["mayonnaise", "mayo"] },
  // Pantry
  { id: "palm-oil", en: "Palm oil / palm nuts", fr: "Huile de palme / noix de palme", group: "pantry", terms: ["palm oil", "huile de palme", "palm nuts", "noix de palme", "palm-nut", "palm nut cream", "palm-nut cream", "palm-nut juice", "creme de noix de palme"] },
  { id: "chocolate", en: "Chocolate / cocoa", fr: "Chocolat / cacao", group: "pantry", terms: ["chocolate", "chocolat", "cocoa", "cacao"] },
  { id: "yeast", en: "Yeast / baking powder", fr: "Levure", group: "pantry", terms: ["yeast", "levure", "baking powder"] },
  { id: "njansang", en: "Njansang / local spices", fr: "Djansang / épices locales", group: "pantry", terms: ["njansang", "djansang", "pebe", "rondelle", "country onion", "kanwa", "nkui", "pepper-soup spice", "yellow-sauce spices", "epices"] },
  // Staples most kitchens have
  { id: "oil", en: "Cooking oil", fr: "Huile", group: "pantry", terms: ["oil", "huile"], staple: true },
  { id: "salt", en: "Salt", fr: "Sel", group: "pantry", terms: ["salt", "sel"], staple: true },
  { id: "sugar", en: "Sugar / honey", fr: "Sucre / miel", group: "pantry", terms: ["sugar", "sucre", "honey", "miel"], staple: true },
  { id: "cube", en: "Stock cubes", fr: "Cubes", group: "pantry", terms: ["stock cube", "stock cubes", "cube", "cubes"], staple: true },
  { id: "spice", en: "Pepper, thyme, dried spices", fr: "Poivre, thym, épices sèches", group: "pantry", terms: ["black pepper", "poivre", "white pepper", "poivre blanc", "thyme", "thym", "nutmeg", "muscade", "paprika", "cumin", "oregano", "origan", "cinnamon", "cannelle", "vanilla", "vanille", "bay leaf", "laurier", "garlic powder", "ail en poudre"], staple: true },
  { id: "water", en: "Water / ice", fr: "Eau / glaçons", group: "pantry", terms: ["water", "eau", "ice", "glacons"], staple: true },
];

export const PANTRY_BY_ID = new Map(PANTRY.map((p) => [p.id, p]));
export const STAPLE_IDS = PANTRY.filter((p) => p.staple).map((p) => p.id);
export const PANTRY_GROUPS: PantryGroup[] = ["starch", "protein", "veg", "fruit", "dairy", "pantry"];

/** What a dish needs, as pantry ids: `need` for the main lines, `opt` for "(optional)" lines. */
export interface DishNeeds {
  need: string[];
  opt: string[];
  /** "A or B" lines: any one of each group will do. */
  alt?: string[][];
}

export function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’`]/g, "'");
}

// Every term, longest first, so a long phrase is found (and removed) before its shorter parts.
const TERMS = PANTRY.flatMap((p) => p.terms.map((term) => ({ id: p.id, term: normalize(term) }))).sort(
  (a, b) => b.term.length - a.term.length,
);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TERM_RE = TERMS.map(({ id, term }) => ({ id, re: new RegExp(`(^|[^a-z])${escape(term)}(?=[^a-z]|$)`, "g") }));

/** Pantry ids mentioned in a piece of text. */
export function findItems(text: string): string[] {
  let s = ` ${normalize(text)} `;
  const found = new Set<string>();
  for (const { id, re } of TERM_RE) {
    re.lastIndex = 0;
    if (re.test(s)) {
      found.add(id);
      re.lastIndex = 0;
      s = s.replace(re, "$1 ");
    }
  }
  return [...found];
}

/** Reads a recipe's shopping list (both languages, line by line) into pantry ids. */
export function dishNeeds(en: string[], fr: string[]): DishNeeds {
  const need = new Set<string>();
  const opt = new Set<string>();
  const alt = new Map<string, string[]>();
  // Work on comma-separated parts, so "fennel (optional)" doesn't make the whole line optional.
  for (const raw of [...en, ...fr]) {
    // "Sauce: 300 g peanuts…": the words before the colon are a label, not an ingredient.
    const line = raw.includes(":") ? raw.slice(raw.indexOf(":") + 1) : raw;
    const parts = line.split(/[,;]/);
    // "½ tomato and ½ onion, chopped (optional)": the note at the end covers the whole line.
    const last = parts[parts.length - 1];
    const wholeOptional = parts.length <= 2 && /optional|facultatif/i.test(last) && !findItems(last).length;
    for (const part of parts) {
      const items = findItems(part);
      if (!items.length) continue;
      if (wholeOptional || /optional|facultatif/i.test(part)) items.forEach((id) => opt.add(id));
      else if (items.length > 1 && /\b(or|ou)\b/i.test(part)) alt.set([...items].sort().join("|"), items);
      else items.forEach((id) => need.add(id));
    }
  }
  for (const id of need) opt.delete(id);
  const groups = [...alt.values()].filter((g) => !g.some((id) => need.has(id)));
  groups.flat().forEach((id) => opt.delete(id));
  return { need: [...need], opt: [...opt], ...(groups.length ? { alt: groups } : {}) };
}

export interface PantryMatch {
  slug: string;
  have: string[];
  missing: string[];
}

/**
 * How well each dish fits what's at home. Staples count as available when `basics` is on.
 * Only dishes that use at least one of the person's (non-staple) ingredients are returned,
 * best first: fewest missing, then most used.
 */
export function matchPantry(index: Record<string, DishNeeds>, pantry: string[], basics = true): PantryMatch[] {
  const mine = new Set(pantry);
  if (basics) STAPLE_IDS.forEach((id) => mine.add(id));
  const out: PantryMatch[] = [];
  for (const [slug, { need, alt = [] }] of Object.entries(index)) {
    const have = need.filter((id) => mine.has(id));
    const missing = need.filter((id) => !mine.has(id));
    for (const group of alt) {
      const got = group.find((id) => mine.has(id));
      if (got) have.push(got);
      else missing.push(group[0]);
    }
    const used = have.filter((id) => pantry.includes(id));
    if (!used.length) continue;
    out.push({ slug, have, missing });
  }
  return out.sort(
    (a, b) =>
      a.missing.length - b.missing.length ||
      b.have.filter((id) => !STAPLE_IDS.includes(id)).length - a.have.filter((id) => !STAPLE_IDS.includes(id)).length,
  );
}
