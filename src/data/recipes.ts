import type { Recipe, Tag } from "./types";

/**
 * Written recipes, keyed by dish slug. Phase 1 keeps them in code;
 * Phase 2 moves them to the database behind the admin / submission flow.
 */
export const RECIPES: Record<string, { recipe: Recipe; tags?: Tag[] }> = {
  "oeuf-bouillie": {
    tags: ["budget", "quick", "kids", "vegetarian"],
    recipe: {
      prepMinutes: 1,
      cookMinutes: 10,
      servings: 1,
      ingredients: {
        en: ["2 eggs", "Water", "A pinch of salt"],
        fr: ["2 œufs", "De l'eau", "Une pincée de sel"],
      },
      steps: {
        en: [
          "Put the eggs in a small pot and cover them with cold water.",
          "Bring to a boil, then lower the heat: 6 minutes for soft, 10 minutes for hard.",
          "Cool the eggs in cold water for 1 minute, peel and season.",
        ],
        fr: [
          "Mettez les œufs dans une petite casserole et couvrez-les d'eau froide.",
          "Portez à ébullition puis baissez le feu : 6 minutes pour mollets, 10 minutes pour durs.",
          "Refroidissez les œufs 1 minute dans l'eau froide, écalez et assaisonnez.",
        ],
      },
    },
  },
  "pain-perdu": {
    tags: ["budget", "quick", "kids", "vegetarian"],
    recipe: {
      prepMinutes: 5,
      cookMinutes: 10,
      servings: 2,
      ingredients: {
        en: ["4 slices of bread (day-old is best)", "2 eggs", "150 ml milk", "2 tbsp sugar", "1 pinch of cinnamon or vanilla", "1 tbsp butter or oil"],
        fr: ["4 tranches de pain (rassis, c'est mieux)", "2 œufs", "150 ml de lait", "2 c. à soupe de sucre", "1 pincée de cannelle ou de vanille", "1 c. à soupe de beurre ou d'huile"],
      },
      steps: {
        en: [
          "Whisk the eggs, milk, sugar and cinnamon in a shallow dish.",
          "Soak each slice of bread a few seconds on each side.",
          "Cook in a hot buttered pan for 2–3 minutes per side until golden.",
          "Serve warm, plain or with fruit.",
        ],
        fr: [
          "Fouettez les œufs, le lait, le sucre et la cannelle dans un plat creux.",
          "Trempez chaque tranche de pain quelques secondes de chaque côté.",
          "Faites dorer dans une poêle chaude beurrée 2 à 3 minutes par face.",
          "Servez tiède, nature ou avec des fruits.",
        ],
      },
    },
  },
  "salade-de-fruits": {
    tags: ["quick", "kids", "vegetarian", "occasion"],
    recipe: {
      prepMinutes: 15,
      cookMinutes: 0,
      servings: 4,
      ingredients: {
        en: ["1 ripe mango", "1/4 pineapple", "2 bananas", "1 orange", "1 passion fruit (optional)", "1 tbsp sugar or honey (optional)"],
        fr: ["1 mangue mûre", "1/4 d'ananas", "2 bananes", "1 orange", "1 fruit de la passion (facultatif)", "1 c. à soupe de sucre ou de miel (facultatif)"],
      },
      steps: {
        en: [
          "Peel and cut the mango, pineapple and bananas into bite-size pieces.",
          "Squeeze half of the orange over the fruit and cut the other half into pieces.",
          "Add the passion fruit pulp and sugar, mix gently and chill 15 minutes.",
        ],
        fr: [
          "Épluchez et coupez la mangue, l'ananas et les bananes en morceaux.",
          "Pressez la moitié de l'orange sur les fruits et coupez l'autre moitié en morceaux.",
          "Ajoutez la pulpe de passion et le sucre, mélangez doucement et réservez 15 minutes au frais.",
        ],
      },
    },
  },
};
