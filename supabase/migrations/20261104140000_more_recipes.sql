-- 51 recipes from content/recipes. Existing rows are left untouched.
insert into public.recipes
  (slug, name, section, tags, prep_minutes, cook_minutes, servings, ingredients, steps, serving, images, video, sources)
select
  r.key,
  nullif(r.value ->> 'name', ''),
  nullif(r.value ->> 'section', ''),
  array(select jsonb_array_elements_text(coalesce(r.value -> 'tags', '[]'::jsonb))),
  coalesce((r.value ->> 'prepMinutes')::int, 0),
  coalesce((r.value ->> 'cookMinutes')::int, 0),
  coalesce((r.value ->> 'servings')::int, 4),
  r.value -> 'ingredients',
  r.value -> 'steps',
  coalesce(r.value -> 'serving', '{"en": [], "fr": []}'::jsonb),
  array(select jsonb_array_elements_text(coalesce(r.value -> 'images', '[]'::jsonb))),
  nullif(r.value ->> 'video', ''),
  coalesce(r.value -> 'sources', '[]'::jsonb)
from jsonb_each($chop$
{
 "ananas-passion": {
  "tags": [
   "vegetarian",
   "occasion"
  ],
  "prepMinutes": 15,
  "cookMinutes": 0,
  "servings": 6,
  "ingredients": {
   "en": [
    "½ ripe pineapple",
    "6 passion fruits",
    "1 litre cold water",
    "Sugar to taste",
    "Ice"
   ],
   "fr": [
    "½ ananas bien mûr",
    "6 fruits de la passion",
    "1 litre d'eau froide",
    "Du sucre à votre goût",
    "Des glaçons"
   ]
  },
  "steps": {
   "en": [
    "Peel and chop the pineapple.",
    "Scoop out the passion fruit pulp.",
    "Blend the pineapple with half the water, then add the passion fruit pulp and pulse briefly (don't crush the seeds).",
    "Strain, add the rest of the water and sweeten.",
    "Chill and serve with ice."
   ],
   "fr": [
    "Épluchez et coupez l'ananas.",
    "Récupérez la pulpe des fruits de la passion.",
    "Mixez l'ananas avec la moitié de l'eau, puis ajoutez la pulpe de passion et mixez brièvement (sans écraser les graines).",
    "Filtrez, ajoutez le reste de l'eau et sucrez.",
    "Mettez au frais et servez avec des glaçons."
   ]
  },
  "serving": {
   "en": [
    "A favorite for parties and hot afternoons."
   ],
   "fr": [
    "Un incontournable des fêtes et des après-midi chauds."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "banane-malaxee": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 6,
  "ingredients": {
   "en": [
    "8 green or half-ripe plantains",
    "300 g smoked fish or dried shrimps",
    "2 tomatoes",
    "1 onion",
    "100 ml red palm oil",
    "1 hot pepper",
    "A handful of spinach or bitter leaves (optional)",
    "2 stock cubes, salt"
   ],
   "fr": [
    "8 plantains verts ou mi-mûrs",
    "300 g de poisson fumé ou de crevettes séchées",
    "2 tomates",
    "1 oignon",
    "100 ml d'huile de palme rouge",
    "1 piment",
    "Une poignée d'épinards ou de feuilles de ndolé (facultatif)",
    "2 cubes, sel"
   ]
  },
  "steps": {
   "en": [
    "Peel the plantains and cut them into pieces.",
    "Blend the tomatoes, onion and pepper.",
    "Warm the palm oil, add the blended mix and cook 5 minutes.",
    "Add the plantains, smoked fish, stock cubes, salt and enough water to almost cover. Cook 25 to 30 minutes until the plantains are very soft.",
    "Mash them roughly into the sauce (that's the 'malaxé'), stir in the leaves and cook 5 more minutes."
   ],
   "fr": [
    "Épluchez les plantains et coupez-les en morceaux.",
    "Mixez les tomates, l'oignon et le piment.",
    "Chauffez l'huile de palme, ajoutez le mélange mixé et laissez cuire 5 minutes.",
    "Ajoutez les plantains, le poisson fumé, les cubes, le sel et presque assez d'eau pour couvrir. Laissez cuire 25 à 30 minutes jusqu'à ce que les plantains soient très tendres.",
    "Écrasez-les grossièrement dans la sauce (c'est le « malaxé »), ajoutez les feuilles et laissez cuire encore 5 minutes."
   ]
  },
  "serving": {
   "en": [
    "A one-pot meal: serve hot in deep plates."
   ],
   "fr": [
    "Un plat complet : servez chaud dans des assiettes creuses."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "beignets-banane": {
  "tags": [
   "snack",
   "kids",
   "vegetarian",
   "budget"
  ],
  "prepMinutes": 15,
  "cookMinutes": 20,
  "servings": 6,
  "ingredients": {
   "en": [
    "4 very ripe bananas",
    "250 g flour",
    "3 tbsp sugar",
    "1 tsp dry yeast (or 1 tsp baking powder)",
    "1 pinch of salt and nutmeg",
    "A little warm water if needed",
    "Oil for deep-frying"
   ],
   "fr": [
    "4 bananes bien mûres",
    "250 g de farine",
    "3 c. à soupe de sucre",
    "1 c. à café de levure sèche (ou 1 c. à café de levure chimique)",
    "1 pincée de sel et de muscade",
    "Un peu d'eau tiède si besoin",
    "De l'huile pour la friture"
   ]
  },
  "steps": {
   "en": [
    "Mash the bananas until smooth.",
    "Mix in the flour, sugar, yeast, salt and nutmeg to make a thick, sticky batter (add a little warm water only if it's too stiff).",
    "Cover and leave 30 to 45 minutes if using yeast.",
    "Heat the oil and drop in spoonfuls of batter.",
    "Fry, turning, until deep golden (about 4 minutes), then drain."
   ],
   "fr": [
    "Écrasez les bananes en purée lisse.",
    "Ajoutez la farine, le sucre, la levure, le sel et la muscade pour obtenir une pâte épaisse et collante (un peu d'eau tiède seulement si elle est trop ferme).",
    "Couvrez et laissez reposer 30 à 45 minutes si vous utilisez de la levure de boulanger.",
    "Chauffez l'huile et déposez la pâte par cuillerées.",
    "Faites frire en retournant jusqu'à ce qu'ils soient bien dorés (environ 4 minutes), puis égouttez."
   ]
  },
  "serving": {
   "en": [
    "Eat warm, plain or with bouillie, tea or coffee."
   ],
   "fr": [
    "À manger tiède, nature ou avec de la bouillie, du thé ou du café."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "bouillon-de-poulet": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 15,
  "cookMinutes": 50,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 chicken (about 1.3 kg), in pieces (a local or hard chicken is ideal)",
    "1 onion",
    "4 cloves garlic",
    "1 thumb of ginger",
    "1 tbsp pepper-soup spices (njansang, pebe…)",
    "1 hot pepper",
    "1 leek or a few celery stalks",
    "A handful of basil or scent leaves",
    "2 stock cubes, salt",
    "2 litres water"
   ],
   "fr": [
    "1 poulet (environ 1,3 kg) en morceaux (un poulet du village est idéal)",
    "1 oignon",
    "4 gousses d'ail",
    "1 morceau de gingembre",
    "1 c. à soupe d'épices pour bouillon (njansang, pèbè…)",
    "1 piment",
    "1 poireau ou quelques branches de céleri",
    "Une poignée de basilic ou de massep",
    "2 cubes, sel",
    "2 litres d'eau"
   ]
  },
  "steps": {
   "en": [
    "Clean the chicken pieces and put them in a pot.",
    "Blend the onion, garlic, ginger, pepper and leek, and add them with the spices, stock cubes and salt.",
    "Leave 15 minutes, then add the water.",
    "Bring to a boil, then simmer 40 to 50 minutes (longer for a village chicken) until the meat is tender.",
    "Add the chopped basil or scent leaves 2 minutes before the end."
   ],
   "fr": [
    "Nettoyez les morceaux de poulet et mettez-les dans une marmite.",
    "Mixez l'oignon, l'ail, le gingembre, le piment et le poireau, et ajoutez-les avec les épices, les cubes et le sel.",
    "Laissez reposer 15 minutes, puis ajoutez l'eau.",
    "Portez à ébullition, puis laissez mijoter 40 à 50 minutes (plus pour un poulet du village) jusqu'à ce que la viande soit tendre.",
    "Ajoutez le basilic ou le massep haché 2 minutes avant la fin."
   ]
  },
  "serving": {
   "en": [
    "Serve hot in bowls with boiled plantain, yam or bread."
   ],
   "fr": [
    "Servez chaud dans des bols avec du plantain bouilli, de l'igname ou du pain."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "boulettes-de-boeuf": {
  "tags": [
   "kids"
  ],
  "prepMinutes": 20,
  "cookMinutes": 35,
  "servings": 6,
  "ingredients": {
   "en": [
    "600 g minced beef",
    "1 onion, finely chopped",
    "2 cloves garlic",
    "1 small bunch of parsley, chopped",
    "1 egg",
    "3 tbsp breadcrumbs",
    "1 stock cube, salt, pepper, chili",
    "For the sauce: 4 tomatoes, 1 onion, 2 tbsp oil, 1 stock cube"
   ],
   "fr": [
    "600 g de bœuf haché",
    "1 oignon finement haché",
    "2 gousses d'ail",
    "1 petite botte de persil haché",
    "1 œuf",
    "3 c. à soupe de chapelure",
    "1 cube, sel, poivre, piment",
    "Pour la sauce : 4 tomates, 1 oignon, 2 c. à soupe d'huile, 1 cube"
   ]
  },
  "steps": {
   "en": [
    "Mix the beef with the onion, garlic, parsley, egg, breadcrumbs and seasoning.",
    "Roll into balls the size of a walnut.",
    "Brown them in a little oil on all sides and set aside.",
    "In the same pan, fry the second onion, add the blended tomatoes and stock cube, and cook 10 minutes.",
    "Add the meatballs and simmer 15 minutes."
   ],
   "fr": [
    "Mélangez le bœuf avec l'oignon, l'ail, le persil, l'œuf, la chapelure et l'assaisonnement.",
    "Formez des boulettes de la taille d'une noix.",
    "Faites-les dorer de tous côtés dans un peu d'huile et réservez.",
    "Dans la même poêle, faites revenir le second oignon, ajoutez les tomates mixées et le cube, et laissez cuire 10 minutes.",
    "Ajoutez les boulettes et laissez mijoter 15 minutes."
   ]
  },
  "serving": {
   "en": [
    "Serve with rice, spaghetti, potatoes or plantain."
   ],
   "fr": [
    "Servez avec du riz, des spaghettis, des pommes de terre ou du plantain."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "brochettes-de-poulet": {
  "tags": [
   "snack",
   "occasion",
   "kids"
  ],
  "prepMinutes": 25,
  "cookMinutes": 20,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg chicken breast or thigh, in cubes",
    "1 green and 1 red bell pepper, in squares",
    "1 onion, in squares",
    "3 cloves garlic",
    "1 thumb of ginger",
    "1 tsp paprika",
    "Juice of 1 lemon",
    "3 tbsp oil",
    "1 stock cube, salt, pepper",
    "Skewers"
   ],
   "fr": [
    "1 kg de blanc ou de haut de cuisse de poulet en cubes",
    "1 poivron vert et 1 poivron rouge en carrés",
    "1 oignon en carrés",
    "3 gousses d'ail",
    "1 morceau de gingembre",
    "1 c. à café de paprika",
    "Le jus d'un citron",
    "3 c. à soupe d'huile",
    "1 cube, sel, poivre",
    "Des brochettes"
   ]
  },
  "steps": {
   "en": [
    "Mix the garlic, ginger, paprika, lemon juice, oil, crushed stock cube, salt and pepper.",
    "Coat the chicken and leave 30 minutes or more.",
    "Thread the chicken onto skewers, alternating with bell pepper and onion.",
    "Grill over charcoal or in a hot pan 12 to 15 minutes, turning, until cooked through and golden."
   ],
   "fr": [
    "Mélangez l'ail, le gingembre, le paprika, le jus de citron, l'huile, le cube écrasé, le sel et le poivre.",
    "Enrobez le poulet et laissez reposer 30 minutes ou plus.",
    "Enfilez le poulet sur les brochettes en alternant avec le poivron et l'oignon.",
    "Faites griller sur la braise ou dans une poêle bien chaude 12 à 15 minutes en retournant, jusqu'à ce qu'elles soient cuites et dorées."
   ]
  },
  "serving": {
   "en": [
    "Serve with fried plantain, fries or a salad, and a dipping sauce."
   ],
   "fr": [
    "Servez avec du plantain frit, des frites ou une salade, et une sauce."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "carotte-banane-lait": {
  "tags": [
   "vegetarian",
   "kids",
   "quick"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 3,
  "ingredients": {
   "en": [
    "3 carrots, peeled and chopped",
    "2 ripe bananas",
    "500 ml cold milk",
    "2 tbsp sugar or honey",
    "1 pinch of cinnamon or vanilla",
    "Ice"
   ],
   "fr": [
    "3 carottes épluchées et coupées",
    "2 bananes mûres",
    "500 ml de lait froid",
    "2 c. à soupe de sucre ou de miel",
    "1 pincée de cannelle ou de vanille",
    "Des glaçons"
   ]
  },
  "steps": {
   "en": [
    "Blend the carrots with half the milk until very smooth.",
    "Add the bananas, the rest of the milk, sugar and cinnamon, and blend again.",
    "Strain if you prefer it very smooth.",
    "Serve cold with ice."
   ],
   "fr": [
    "Mixez les carottes avec la moitié du lait jusqu'à ce que ce soit très lisse.",
    "Ajoutez les bananes, le reste du lait, le sucre et la cannelle, et mixez à nouveau.",
    "Filtrez si vous l'aimez très lisse.",
    "Servez frais avec des glaçons."
   ]
  },
  "serving": {
   "en": [
    "Best on the day: a filling breakfast drink."
   ],
   "fr": [
    "Meilleur le jour même : une boisson nourrissante pour le petit-déjeuner."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "chevre-roti": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 120,
  "servings": 8,
  "ingredients": {
   "en": [
    "1.5 kg goat meat (leg or shoulder), in large pieces",
    "2 onions",
    "5 cloves garlic",
    "1 thumb of ginger",
    "1 tsp each of pebe and white pepper (optional)",
    "1 small bunch of parsley and celery",
    "1 hot pepper",
    "2 stock cubes, salt",
    "4 tbsp oil"
   ],
   "fr": [
    "1,5 kg de viande de chèvre (gigot ou épaule) en gros morceaux",
    "2 oignons",
    "5 gousses d'ail",
    "1 morceau de gingembre",
    "1 c. à café de pèbè et de poivre blanc (facultatif)",
    "1 petite botte de persil et de céleri",
    "1 piment",
    "2 cubes, sel",
    "4 c. à soupe d'huile"
   ]
  },
  "steps": {
   "en": [
    "Blend 1 onion with the garlic, ginger, spices, herbs, pepper, stock cubes and salt.",
    "Coat the meat and leave at least 2 hours (overnight is best).",
    "Simmer the meat with its marinade and a little water for about 1 hour, until nearly tender (goat is firm, so this step matters).",
    "Heat the oven to 200 °C. Put the meat in a dish with the second onion, sliced, and the oil.",
    "Roast 40 to 50 minutes, turning once and basting with the cooking juices, until well browned."
   ],
   "fr": [
    "Mixez 1 oignon avec l'ail, le gingembre, les épices, les herbes, le piment, les cubes et le sel.",
    "Enrobez la viande et laissez reposer au moins 2 heures (une nuit, c'est mieux).",
    "Faites mijoter la viande avec sa marinade et un peu d'eau environ 1 heure, jusqu'à ce qu'elle soit presque tendre (la chèvre est ferme, cette étape compte).",
    "Préchauffez le four à 200 °C. Mettez la viande dans un plat avec le second oignon émincé et l'huile.",
    "Faites rôtir 40 à 50 minutes en retournant une fois et en arrosant de jus, jusqu'à ce qu'elle soit bien dorée."
   ]
  },
  "serving": {
   "en": [
    "Serve with fried plantain, bobolo or fries and a fresh pepper sauce."
   ],
   "fr": [
    "Servez avec du plantain frit, du bâton de manioc ou des frites et un piment frais."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "choux-saute": {
  "tags": [
   "budget",
   "quick",
   "vegetarian"
  ],
  "prepMinutes": 15,
  "cookMinutes": 20,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 small cabbage, finely sliced",
    "2 carrots, cut in thin sticks",
    "1 green bell pepper, sliced",
    "1 onion, sliced",
    "2 tomatoes, chopped",
    "2 cloves garlic",
    "3 tbsp oil",
    "1 stock cube, salt, pepper"
   ],
   "fr": [
    "1 petit chou émincé finement",
    "2 carottes en bâtonnets fins",
    "1 poivron vert émincé",
    "1 oignon émincé",
    "2 tomates hachées",
    "2 gousses d'ail",
    "3 c. à soupe d'huile",
    "1 cube, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Heat the oil and fry the onion and garlic for 2 minutes.",
    "Add the tomatoes and cook 5 minutes.",
    "Add the cabbage, carrots and bell pepper and stir-fry on medium-high heat 8 to 10 minutes. Keep the cabbage a little crunchy.",
    "Season with the stock cube, salt and pepper."
   ],
   "fr": [
    "Chauffez l'huile et faites revenir l'oignon et l'ail 2 minutes.",
    "Ajoutez les tomates et laissez cuire 5 minutes.",
    "Ajoutez le chou, les carottes et le poivron et faites sauter à feu moyen-vif 8 à 10 minutes. Gardez le chou un peu croquant.",
    "Assaisonnez avec le cube, le sel et le poivre."
   ]
  },
  "serving": {
   "en": [
    "Serve with rice, boiled plantain or as a side to grilled meat."
   ],
   "fr": [
    "Servez avec du riz, du plantain bouilli ou en accompagnement de viande grillée."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "christmas-stew": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 90,
  "servings": 10,
  "ingredients": {
   "en": [
    "1.5 kg mixed meat (beef, goat and chicken)",
    "1 kg tomatoes",
    "3 red bell peppers",
    "3 onions",
    "6 cloves garlic",
    "1 thumb of ginger",
    "2 hot peppers",
    "3 tbsp tomato paste",
    "150 ml oil",
    "2 bay leaves, 1 tsp thyme, 1 tsp curry powder",
    "3 stock cubes, salt"
   ],
   "fr": [
    "1,5 kg de viandes mélangées (bœuf, chèvre et poulet)",
    "1 kg de tomates",
    "3 poivrons rouges",
    "3 oignons",
    "6 gousses d'ail",
    "1 morceau de gingembre",
    "2 piments",
    "3 c. à soupe de concentré de tomate",
    "150 ml d'huile",
    "2 feuilles de laurier, 1 c. à café de thym, 1 c. à café de curry",
    "3 cubes, sel"
   ]
  },
  "steps": {
   "en": [
    "Season the meats with 1 onion, half the garlic and ginger, thyme, curry, a stock cube and salt, and cook in a little water until tender (chicken last, it's quicker). Keep the broth.",
    "Fry the drained meat until browned and set aside.",
    "Blend the tomatoes, bell peppers, 1 onion, the rest of the garlic and ginger, and the hot peppers.",
    "In the meat oil, fry the last onion and the tomato paste, then add the blended mix and bay leaves. Cook uncovered 30 to 40 minutes until thick and darker red.",
    "Add the meat, a cup of broth and the remaining stock cubes and simmer 15 minutes."
   ],
   "fr": [
    "Assaisonnez les viandes avec 1 oignon, la moitié de l'ail et du gingembre, le thym, le curry, un cube et du sel, et faites-les cuire dans un peu d'eau jusqu'à ce qu'elles soient tendres (le poulet en dernier, il cuit plus vite). Gardez le bouillon.",
    "Faites dorer les viandes égouttées et réservez.",
    "Mixez les tomates, les poivrons, 1 oignon, le reste de l'ail et du gingembre, et les piments.",
    "Dans l'huile de la viande, faites revenir le dernier oignon et le concentré, puis ajoutez le mélange mixé et le laurier. Laissez cuire à découvert 30 à 40 minutes jusqu'à ce que ce soit épais et d'un rouge plus foncé.",
    "Ajoutez la viande, une tasse de bouillon et les derniers cubes et laissez mijoter 15 minutes."
   ]
  },
  "serving": {
   "en": [
    "Serve with rice, jollof rice or fried plantain at Christmas and New Year.",
    "Make it a day ahead: it tastes even better."
   ],
   "fr": [
    "Servez avec du riz, du riz gras ou du plantain frit à Noël et au Nouvel An.",
    "Préparez-le la veille : il n'en est que meilleur."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "coconut-rice": {
  "tags": [
   "occasion",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "400 g long-grain rice",
    "400 ml coconut milk",
    "300 ml water",
    "1 small onion, finely chopped",
    "1 tbsp oil",
    "1 bay leaf",
    "1 tsp salt",
    "Grated coconut to garnish (optional)"
   ],
   "fr": [
    "400 g de riz long grain",
    "400 ml de lait de coco",
    "300 ml d'eau",
    "1 petit oignon finement haché",
    "1 c. à soupe d'huile",
    "1 feuille de laurier",
    "1 c. à café de sel",
    "De la noix de coco râpée pour décorer (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Rinse the rice until the water runs clear.",
    "Soften the onion in the oil for 2 minutes.",
    "Add the rice and stir for 1 minute.",
    "Pour in the coconut milk, water, salt and bay leaf, bring to a boil, then cover and cook on low heat about 18 minutes.",
    "Turn off the heat and leave covered 5 minutes, then fluff with a fork."
   ],
   "fr": [
    "Rincez le riz jusqu'à ce que l'eau soit claire.",
    "Faites revenir l'oignon dans l'huile 2 minutes.",
    "Ajoutez le riz et remuez 1 minute.",
    "Versez le lait de coco, l'eau, le sel et le laurier, portez à ébullition, puis couvrez et laissez cuire à feu doux environ 18 minutes.",
    "Éteignez le feu et laissez reposer 5 minutes à couvert, puis égrenez à la fourchette."
   ]
  },
  "serving": {
   "en": [
    "Serve with grilled fish, chicken or a spicy sauce."
   ],
   "fr": [
    "Servez avec du poisson grillé, du poulet ou une sauce relevée."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "corn-chaff": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 15,
  "cookMinutes": 120,
  "servings": 8,
  "ingredients": {
   "en": [
    "500 g dried corn kernels, soaked overnight",
    "500 g dried beans (red or black-eyed), soaked overnight",
    "150 ml red palm oil",
    "2 onions, sliced",
    "2 tomatoes, chopped (optional)",
    "1 hot pepper",
    "2 stock cubes, salt",
    "Dried fish or crayfish (optional)"
   ],
   "fr": [
    "500 g de grains de maïs secs trempés la veille",
    "500 g de haricots secs (rouges ou cornille) trempés la veille",
    "150 ml d'huile de palme rouge",
    "2 oignons émincés",
    "2 tomates hachées (facultatif)",
    "1 piment",
    "2 cubes, sel",
    "Du poisson séché ou du crayfish (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Boil the soaked corn in plenty of water for about 1 hour.",
    "Add the soaked beans and cook together until both are soft, about 1 hour more. Drain off most of the water.",
    "In another pot, warm the palm oil and fry the onions (and tomatoes) with the pepper for 5 minutes.",
    "Add the corn and beans, stock cubes, salt and the fish if using, and stir well.",
    "Simmer 10 minutes so everything soaks up the oil."
   ],
   "fr": [
    "Faites bouillir le maïs trempé dans beaucoup d'eau pendant environ 1 heure.",
    "Ajoutez les haricots trempés et faites cuire ensemble jusqu'à ce que tout soit tendre, environ 1 heure de plus. Videz la plus grande partie de l'eau.",
    "Dans une autre marmite, chauffez l'huile de palme et faites revenir les oignons (et les tomates) avec le piment 5 minutes.",
    "Ajoutez le maïs et les haricots, les cubes, le sel et le poisson si vous en mettez, et mélangez bien.",
    "Laissez mijoter 10 minutes pour que tout prenne l'huile."
   ]
  },
  "serving": {
   "en": [
    "Serve hot on its own, or with ripe plantain or avocado."
   ],
   "fr": [
    "Servez chaud tel quel, ou avec du plantain mûr ou de l'avocat."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "coro-ananas": {
  "tags": [
   "vegetarian",
   "occasion"
  ],
  "prepMinutes": 20,
  "cookMinutes": 0,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 ripe soursop (corossol), about 1 kg",
    "½ pineapple",
    "1.2 litres cold water",
    "Sugar to taste",
    "1 pinch of nutmeg or vanilla (optional)",
    "Ice"
   ],
   "fr": [
    "1 corossol bien mûr, environ 1 kg",
    "½ ananas",
    "1,2 litre d'eau froide",
    "Du sucre à votre goût",
    "1 pincée de muscade ou de vanille (facultatif)",
    "Des glaçons"
   ]
  },
  "steps": {
   "en": [
    "Peel the soursop and remove all the black seeds (they must not be blended).",
    "Peel the pineapple and cut it into pieces.",
    "Blend the soursop pulp and pineapple with half the water.",
    "Strain through a fine sieve or cloth, pressing well, then add the rest of the water.",
    "Sweeten, add nutmeg if you like, and chill."
   ],
   "fr": [
    "Épluchez le corossol et retirez toutes les graines noires (elles ne doivent pas être mixées).",
    "Épluchez l'ananas et coupez-le en morceaux.",
    "Mixez la pulpe de corossol et l'ananas avec la moitié de l'eau.",
    "Filtrez dans une passoire fine ou un linge en pressant bien, puis ajoutez le reste de l'eau.",
    "Sucrez, ajoutez la muscade si vous voulez, et mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold. Keeps 1 to 2 days in the fridge."
   ],
   "fr": [
    "Servez bien frais. Se garde 1 à 2 jours au frais."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "crepes": {
  "tags": [
   "budget",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 20,
  "servings": 4,
  "ingredients": {
   "en": [
    "250 g flour",
    "3 eggs",
    "500 ml milk",
    "2 tbsp sugar",
    "1 pinch of salt",
    "2 tbsp melted butter or oil",
    "1 tsp vanilla (optional)"
   ],
   "fr": [
    "250 g de farine",
    "3 œufs",
    "500 ml de lait",
    "2 c. à soupe de sucre",
    "1 pincée de sel",
    "2 c. à soupe de beurre fondu ou d'huile",
    "1 c. à café de vanille (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Whisk the flour, sugar and salt, then add the eggs.",
    "Pour in the milk little by little, whisking, until the batter is smooth and runny.",
    "Stir in the melted butter and vanilla. Let it rest 15 minutes if you have time.",
    "Lightly oil a hot pan, pour in a small ladle of batter and tilt to spread it thinly.",
    "Cook about 1 minute per side until lightly golden. Repeat with the rest."
   ],
   "fr": [
    "Mélangez la farine, le sucre et le sel, puis ajoutez les œufs.",
    "Versez le lait petit à petit en fouettant jusqu'à obtenir une pâte lisse et fluide.",
    "Ajoutez le beurre fondu et la vanille. Laissez reposer 15 minutes si vous avez le temps.",
    "Huilez légèrement une poêle chaude, versez une petite louche de pâte et inclinez pour bien l'étaler.",
    "Faites cuire environ 1 minute de chaque côté jusqu'à ce qu'elles soient dorées. Recommencez avec le reste."
   ]
  },
  "serving": {
   "en": [
    "Fill with sugar, honey, chocolate spread, jam or fruit.",
    "Fold in four and serve warm."
   ],
   "fr": [
    "Garnissez de sucre, de miel, de pâte à tartiner, de confiture ou de fruits.",
    "Pliez en quatre et servez tiède."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "crockettes-de-poisson": {
  "tags": [
   "snack",
   "kids",
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 20,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g cooked fish (mackerel or hake), flaked",
    "500 g potatoes, boiled and mashed",
    "1 onion, finely chopped",
    "2 cloves garlic",
    "1 small bunch of parsley, chopped",
    "2 eggs",
    "100 g breadcrumbs",
    "1 stock cube, salt, pepper, chili",
    "Oil for frying"
   ],
   "fr": [
    "500 g de poisson cuit (maquereau ou merlu) émietté",
    "500 g de pommes de terre cuites et écrasées",
    "1 oignon finement haché",
    "2 gousses d'ail",
    "1 petite botte de persil haché",
    "2 œufs",
    "100 g de chapelure",
    "1 cube, sel, poivre, piment",
    "De l'huile pour la friture"
   ]
  },
  "steps": {
   "en": [
    "Remove all bones from the fish.",
    "Mix the fish, mashed potatoes, onion, garlic, parsley, 1 egg and the seasoning.",
    "Shape into small logs or balls.",
    "Dip each one in the second beaten egg, then roll in breadcrumbs.",
    "Fry in hot oil 3 to 4 minutes until golden, then drain on paper towels."
   ],
   "fr": [
    "Retirez toutes les arêtes du poisson.",
    "Mélangez le poisson, la purée, l'oignon, l'ail, le persil, 1 œuf et l'assaisonnement.",
    "Formez de petits boudins ou des boulettes.",
    "Passez chacune dans le second œuf battu, puis dans la chapelure.",
    "Faites frire 3 à 4 minutes dans l'huile chaude jusqu'à ce qu'elles soient dorées, puis égouttez sur du papier absorbant."
   ]
  },
  "serving": {
   "en": [
    "Serve warm with pepper sauce or mayonnaise.",
    "Great for parties and lunch boxes."
   ],
   "fr": [
    "Servez tiède avec du piment ou de la mayonnaise.",
    "Parfait pour les fêtes et les boîtes à goûter."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "fufu-gombo": {
  "tags": [],
  "prepMinutes": 20,
  "cookMinutes": 50,
  "servings": 6,
  "ingredients": {
   "en": [
    "For the okra soup: 500 g fresh okra, chopped or grated",
    "500 g beef or cow skin",
    "300 g smoked fish",
    "2 tbsp ground crayfish",
    "100 ml red palm oil",
    "1 onion",
    "1 hot pepper",
    "2 stock cubes, salt",
    "A handful of spinach or bitter leaves (optional)",
    "For the fufu: 500 g cassava fufu flour (or water fufu)"
   ],
   "fr": [
    "Pour la sauce gombo : 500 g de gombo frais haché ou râpé",
    "500 g de bœuf ou de peau de bœuf",
    "300 g de poisson fumé",
    "2 c. à soupe de crayfish moulu",
    "100 ml d'huile de palme rouge",
    "1 oignon",
    "1 piment",
    "2 cubes, sel",
    "Une poignée d'épinards ou de feuilles de ndolé (facultatif)",
    "Pour le fufu : 500 g de farine de fufu de manioc (ou water fufu)"
   ]
  },
  "steps": {
   "en": [
    "Cook the meat with the onion, salt and a stock cube until tender, about 40 minutes.",
    "Add the smoked fish, crayfish, pepper and palm oil and simmer 5 minutes.",
    "Stir in the okra and cook only 5 to 8 minutes so it stays green and draws (stretchy).",
    "Add the leaves and the second stock cube and season.",
    "For the fufu: bring water to a boil, sprinkle in the flour while stirring hard with a wooden spoon, and keep stirring and folding until smooth and stretchy. Shape into balls."
   ],
   "fr": [
    "Faites cuire la viande avec l'oignon, du sel et un cube jusqu'à ce qu'elle soit tendre, environ 40 minutes.",
    "Ajoutez le poisson fumé, le crayfish, le piment et l'huile de palme et laissez mijoter 5 minutes.",
    "Ajoutez le gombo et laissez cuire seulement 5 à 8 minutes pour qu'il reste vert et gluant.",
    "Ajoutez les feuilles et le second cube et rectifiez l'assaisonnement.",
    "Pour le fufu : portez de l'eau à ébullition, versez la farine en pluie en remuant vigoureusement avec une spatule en bois, et continuez à remuer et à replier jusqu'à ce que ce soit lisse et élastique. Formez des boules."
   ]
  },
  "serving": {
   "en": [
    "Serve each person a ball of fufu with a bowl of okra soup.",
    "Eat with your hands, scooping the soup with small pieces of fufu."
   ],
   "fr": [
    "Servez à chacun une boule de fufu avec un bol de sauce gombo.",
    "Se mange à la main en saisissant la sauce avec de petits morceaux de fufu."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "gateaux-au-citron": {
  "tags": [
   "vegetarian",
   "occasion"
  ],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 8,
  "ingredients": {
   "en": [
    "200 g flour",
    "180 g sugar",
    "3 eggs",
    "100 g butter, melted",
    "1 small pot of yogurt (125 g)",
    "2 lemons (zest and juice)",
    "1 sachet (11 g) baking powder",
    "100 g icing sugar for the glaze"
   ],
   "fr": [
    "200 g de farine",
    "180 g de sucre",
    "3 œufs",
    "100 g de beurre fondu",
    "1 petit pot de yaourt (125 g)",
    "2 citrons (zeste et jus)",
    "1 sachet (11 g) de levure chimique",
    "100 g de sucre glace pour le glaçage"
   ]
  },
  "steps": {
   "en": [
    "Heat the oven to 180 °C and grease a loaf tin.",
    "Whisk the eggs and sugar until pale, then add the melted butter, yogurt, lemon zest and the juice of 1 lemon.",
    "Fold in the flour and baking powder.",
    "Bake 35 to 40 minutes, until golden and a knife comes out clean.",
    "Mix the icing sugar with the juice of the second lemon and pour over the cooled cake."
   ],
   "fr": [
    "Préchauffez le four à 180 °C et beurrez un moule à cake.",
    "Fouettez les œufs et le sucre jusqu'à ce que le mélange blanchisse, puis ajoutez le beurre fondu, le yaourt, les zestes et le jus d'un citron.",
    "Incorporez la farine et la levure.",
    "Faites cuire 35 à 40 minutes, jusqu'à ce qu'il soit doré et qu'un couteau ressorte propre.",
    "Mélangez le sucre glace avec le jus du second citron et nappez le gâteau refroidi."
   ]
  },
  "serving": {
   "en": [
    "Serve in slices once the glaze has set."
   ],
   "fr": [
    "Servez en tranches une fois le glaçage pris."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "gateaux-au-yaourt": {
  "tags": [
   "kids",
   "vegetarian",
   "budget"
  ],
  "prepMinutes": 15,
  "cookMinutes": 35,
  "servings": 8,
  "ingredients": {
   "en": [
    "1 pot of plain yogurt (125 g), used as the measure",
    "3 pots of flour",
    "2 pots of sugar",
    "½ pot of oil",
    "3 eggs",
    "1 sachet (11 g) baking powder",
    "1 tsp vanilla or lemon zest"
   ],
   "fr": [
    "1 pot de yaourt nature (125 g), qui sert de mesure",
    "3 pots de farine",
    "2 pots de sucre",
    "½ pot d'huile",
    "3 œufs",
    "1 sachet (11 g) de levure chimique",
    "1 c. à café de vanille ou de zeste de citron"
   ]
  },
  "steps": {
   "en": [
    "Heat the oven to 180 °C and grease a cake tin.",
    "Empty the yogurt into a bowl, then use the empty pot to measure the rest.",
    "Mix in the eggs and sugar, then the oil and vanilla.",
    "Add the flour and baking powder and mix until just smooth.",
    "Pour into the tin and bake 30 to 35 minutes, until a knife comes out clean."
   ],
   "fr": [
    "Préchauffez le four à 180 °C et beurrez un moule.",
    "Videz le yaourt dans un saladier, puis utilisez le pot vide pour mesurer le reste.",
    "Ajoutez les œufs et le sucre, puis l'huile et la vanille.",
    "Ajoutez la farine et la levure et mélangez juste ce qu'il faut.",
    "Versez dans le moule et faites cuire 30 à 35 minutes, jusqu'à ce qu'un couteau ressorte propre."
   ]
  },
  "serving": {
   "en": [
    "Serve in slices with tea, coffee or juice.",
    "Keeps 3 days wrapped."
   ],
   "fr": [
    "Servez en parts avec du thé, du café ou un jus.",
    "Se garde 3 jours emballé."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "gateaux-de-mais": {
  "tags": [
   "vegetarian",
   "snack"
  ],
  "prepMinutes": 30,
  "cookMinutes": 60,
  "servings": 8,
  "ingredients": {
   "en": [
    "10 ears of fresh corn (not too dry)",
    "100 ml oil or 100 g butter, melted",
    "3 tbsp sugar (or 1 tsp salt for a savory version)",
    "1 pinch of salt",
    "Fresh corn husks or banana leaves for wrapping"
   ],
   "fr": [
    "10 épis de maïs frais (pas trop secs)",
    "100 ml d'huile ou 100 g de beurre fondu",
    "3 c. à soupe de sucre (ou 1 c. à café de sel pour une version salée)",
    "1 pincée de sel",
    "Des feuilles de maïs fraîches ou de bananier pour emballer"
   ]
  },
  "steps": {
   "en": [
    "Remove the husks carefully and keep the best ones for wrapping.",
    "Grate or blend the corn kernels into a thick paste (a little water only if needed).",
    "Mix in the oil, sugar and salt.",
    "Spoon the paste into husks or banana leaves, fold and tie.",
    "Steam on a bed of husks with a little water for about 1 hour, until firm."
   ],
   "fr": [
    "Retirez les feuilles délicatement et gardez les plus belles pour emballer.",
    "Râpez ou mixez les grains de maïs en une pâte épaisse (un peu d'eau seulement si besoin).",
    "Ajoutez l'huile, le sucre et le sel.",
    "Déposez la pâte dans les feuilles de maïs ou de bananier, pliez et ficelez.",
    "Faites cuire à la vapeur sur un lit de feuilles avec un peu d'eau pendant environ 1 heure, jusqu'à ce qu'ils soient fermes."
   ]
  },
  "serving": {
   "en": [
    "Eat warm as a snack or with a sauce, or for breakfast with tea."
   ],
   "fr": [
    "À manger tiède en en-cas ou avec une sauce, ou au petit-déjeuner avec du thé."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "gateaux-de-manioc-frais": {
  "tags": [
   "vegetarian",
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 50,
  "servings": 8,
  "ingredients": {
   "en": [
    "1 kg fresh cassava, peeled and finely grated",
    "200 ml coconut milk",
    "150 g sugar",
    "2 eggs",
    "50 g butter, melted",
    "1 tsp vanilla",
    "1 pinch of nutmeg",
    "1 pinch of salt"
   ],
   "fr": [
    "1 kg de manioc frais épluché et finement râpé",
    "200 ml de lait de coco",
    "150 g de sucre",
    "2 œufs",
    "50 g de beurre fondu",
    "1 c. à café de vanille",
    "1 pincée de muscade",
    "1 pincée de sel"
   ]
  },
  "steps": {
   "en": [
    "Heat the oven to 180 °C and grease a baking dish.",
    "Squeeze the grated cassava in a cloth to remove some of its liquid.",
    "Mix with the coconut milk, sugar, eggs, melted butter, vanilla, nutmeg and salt.",
    "Pour into the dish and smooth the top.",
    "Bake 45 to 50 minutes, until golden and firm."
   ],
   "fr": [
    "Préchauffez le four à 180 °C et beurrez un plat.",
    "Pressez le manioc râpé dans un linge pour retirer une partie de son jus.",
    "Mélangez-le avec le lait de coco, le sucre, les œufs, le beurre fondu, la vanille, la muscade et le sel.",
    "Versez dans le plat et lissez le dessus.",
    "Faites cuire 45 à 50 minutes, jusqu'à ce qu'il soit doré et ferme."
   ]
  },
  "serving": {
   "en": [
    "Let it cool before cutting into squares."
   ],
   "fr": [
    "Laissez refroidir avant de couper en carrés."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "gesier-saute": {
  "tags": [
   "snack",
   "occasion"
  ],
  "prepMinutes": 15,
  "cookMinutes": 50,
  "servings": 4,
  "ingredients": {
   "en": [
    "800 g chicken gizzards, cleaned",
    "2 onions, sliced",
    "1 green bell pepper, sliced",
    "2 tomatoes, chopped",
    "3 cloves garlic",
    "1 thumb of ginger",
    "1 hot pepper",
    "2 stock cubes, salt",
    "3 tbsp oil"
   ],
   "fr": [
    "800 g de gésiers de poulet nettoyés",
    "2 oignons émincés",
    "1 poivron vert émincé",
    "2 tomates hachées",
    "3 gousses d'ail",
    "1 morceau de gingembre",
    "1 piment",
    "2 cubes, sel",
    "3 c. à soupe d'huile"
   ]
  },
  "steps": {
   "en": [
    "Boil the gizzards with half an onion, garlic, ginger, a stock cube and salt until tender, about 35 minutes. Drain and slice them.",
    "Fry the sliced gizzards in the oil until golden at the edges.",
    "Add the onions, bell pepper, tomatoes and pepper and stir-fry 8 minutes.",
    "Add the second stock cube and a splash of the cooking water, and cook until it coats the gizzards."
   ],
   "fr": [
    "Faites bouillir les gésiers avec un demi-oignon, l'ail, le gingembre, un cube et du sel jusqu'à ce qu'ils soient tendres, environ 35 minutes. Égouttez et coupez-les en lamelles.",
    "Faites dorer les gésiers dans l'huile.",
    "Ajoutez les oignons, le poivron, les tomates et le piment et faites sauter 8 minutes.",
    "Ajoutez le second cube et un peu d'eau de cuisson, et laissez cuire jusqu'à ce que la sauce enrobe les gésiers."
   ]
  },
  "serving": {
   "en": [
    "Serve as a snack with cold drinks, or with fried plantain or fries."
   ],
   "fr": [
    "Servez à l'apéritif avec des boissons fraîches, ou avec du plantain frit ou des frites."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "haricots-rouges-frit": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 15,
  "cookMinutes": 90,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g red beans, soaked overnight",
    "150 ml red palm oil or vegetable oil",
    "2 onions, sliced",
    "3 tomatoes, chopped",
    "2 cloves garlic",
    "1 thumb of ginger",
    "1 hot pepper",
    "2 stock cubes, salt"
   ],
   "fr": [
    "500 g de haricots rouges trempés la veille",
    "150 ml d'huile de palme rouge ou d'huile végétale",
    "2 oignons émincés",
    "3 tomates hachées",
    "2 gousses d'ail",
    "1 morceau de gingembre",
    "1 piment",
    "2 cubes, sel"
   ]
  },
  "steps": {
   "en": [
    "Cook the soaked beans in fresh water until soft, about 1 hour. Drain, keeping a cup of the water.",
    "Heat the oil and fry the onions until golden.",
    "Add the garlic, ginger, pepper and tomatoes and cook 10 minutes into a thick sauce.",
    "Add the beans, stock cubes, salt and a little of the cooking water.",
    "Simmer 15 minutes, stirring gently, until the beans soak up the sauce."
   ],
   "fr": [
    "Faites cuire les haricots trempés dans de l'eau propre jusqu'à ce qu'ils soient tendres, environ 1 heure. Égouttez en gardant une tasse d'eau.",
    "Chauffez l'huile et faites dorer les oignons.",
    "Ajoutez l'ail, le gingembre, le piment et les tomates et laissez cuire 10 minutes pour obtenir une sauce épaisse.",
    "Ajoutez les haricots, les cubes, le sel et un peu d'eau de cuisson.",
    "Laissez mijoter 15 minutes en remuant doucement, jusqu'à ce que les haricots prennent la sauce."
   ]
  },
  "serving": {
   "en": [
    "Serve with fried ripe plantain, bread, rice or beignets."
   ],
   "fr": [
    "Servez avec du plantain mûr frit, du pain, du riz ou des beignets."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "jus-d-ananas": {
  "tags": [
   "vegetarian",
   "kids",
   "quick"
  ],
  "prepMinutes": 15,
  "cookMinutes": 0,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 ripe pineapple",
    "1 litre cold water",
    "1 thumb of ginger (optional)",
    "Sugar or honey to taste",
    "Ice"
   ],
   "fr": [
    "1 ananas bien mûr",
    "1 litre d'eau froide",
    "1 morceau de gingembre (facultatif)",
    "Du sucre ou du miel à votre goût",
    "Des glaçons"
   ]
  },
  "steps": {
   "en": [
    "Peel the pineapple and cut the flesh into pieces (keep the core, it adds flavor).",
    "Blend with half the water and the ginger.",
    "Strain through a fine sieve, pressing well.",
    "Add the rest of the water and sweeten to taste.",
    "Chill and serve with ice."
   ],
   "fr": [
    "Épluchez l'ananas et coupez la chair en morceaux (gardez le cœur, il donne du goût).",
    "Mixez avec la moitié de l'eau et le gingembre.",
    "Filtrez dans une passoire fine en pressant bien.",
    "Ajoutez le reste de l'eau et sucrez à votre goût.",
    "Mettez au frais et servez avec des glaçons."
   ]
  },
  "serving": {
   "en": [
    "Keeps 2 days in the fridge; shake before serving."
   ],
   "fr": [
    "Se garde 2 jours au frais ; secouez avant de servir."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "jus-de-goyave": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 15,
  "cookMinutes": 0,
  "servings": 6,
  "ingredients": {
   "en": [
    "8 ripe guavas",
    "1 litre cold water",
    "Juice of 1 lime",
    "Sugar to taste",
    "Ice"
   ],
   "fr": [
    "8 goyaves bien mûres",
    "1 litre d'eau froide",
    "Le jus d'un citron vert",
    "Du sucre à votre goût",
    "Des glaçons"
   ]
  },
  "steps": {
   "en": [
    "Wash the guavas, cut off the ends and cut them into pieces.",
    "Blend with half the water.",
    "Strain through a fine sieve to remove the hard seeds, pressing well.",
    "Add the rest of the water, the lime juice and sugar.",
    "Chill and serve with ice."
   ],
   "fr": [
    "Lavez les goyaves, coupez les extrémités et coupez-les en morceaux.",
    "Mixez avec la moitié de l'eau.",
    "Filtrez dans une passoire fine pour retirer les graines dures, en pressant bien.",
    "Ajoutez le reste de l'eau, le jus de citron et le sucre.",
    "Mettez au frais et servez avec des glaçons."
   ]
  },
  "serving": {
   "en": [
    "Keeps 2 days in the fridge."
   ],
   "fr": [
    "Se garde 2 jours au frais."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "kati-kati": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 20,
  "cookMinutes": 50,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 chicken (a village chicken is traditional), in pieces",
    "150 ml red palm oil",
    "1 onion",
    "3 cloves garlic",
    "1 thumb of ginger",
    "1 hot pepper",
    "2 stock cubes, salt",
    "For serving: corn fufu (corn couscous) and njama-njama (huckleberry leaves) or spinach"
   ],
   "fr": [
    "1 poulet (un poulet du village est traditionnel) en morceaux",
    "150 ml d'huile de palme rouge",
    "1 oignon",
    "3 gousses d'ail",
    "1 morceau de gingembre",
    "1 piment",
    "2 cubes, sel",
    "Pour servir : couscous de maïs et njama-njama (morelle) ou épinards"
   ]
  },
  "steps": {
   "en": [
    "Season the chicken with salt and grill it over charcoal (or roast it) until browned and nearly cooked.",
    "Blend the onion, garlic, ginger and pepper.",
    "In a pot, warm the palm oil, add the blended mix and cook 5 minutes.",
    "Add the grilled chicken, stock cubes and a splash of water, and simmer 20 to 30 minutes until the chicken is tender and coated in the red oil sauce.",
    "Meanwhile, prepare the corn fufu and sauté the njama-njama with a little onion and oil."
   ],
   "fr": [
    "Salez le poulet et faites-le griller sur la braise (ou rôtir) jusqu'à ce qu'il soit doré et presque cuit.",
    "Mixez l'oignon, l'ail, le gingembre et le piment.",
    "Dans une marmite, chauffez l'huile de palme, ajoutez le mélange mixé et laissez cuire 5 minutes.",
    "Ajoutez le poulet grillé, les cubes et un peu d'eau, et laissez mijoter 20 à 30 minutes jusqu'à ce que le poulet soit tendre et enrobé de sauce rouge.",
    "Pendant ce temps, préparez le couscous de maïs et faites sauter le njama-njama avec un peu d'oignon et d'huile."
   ]
  },
  "serving": {
   "en": [
    "Serve the chicken with corn fufu and njama-njama on the side."
   ],
   "fr": [
    "Servez le poulet avec le couscous de maïs et le njama-njama à côté."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "kedjenou": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 20,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 chicken (about 1.5 kg), in pieces",
    "3 tomatoes, chopped",
    "2 onions, sliced",
    "1 aubergine, diced (optional)",
    "3 cloves garlic",
    "1 thumb of ginger",
    "1 hot pepper",
    "1 bay leaf, a few thyme sprigs",
    "1 stock cube, salt"
   ],
   "fr": [
    "1 poulet (environ 1,5 kg) en morceaux",
    "3 tomates hachées",
    "2 oignons émincés",
    "1 aubergine en dés (facultatif)",
    "3 gousses d'ail",
    "1 morceau de gingembre",
    "1 piment",
    "1 feuille de laurier, quelques brins de thym",
    "1 cube, sel"
   ]
  },
  "steps": {
   "en": [
    "Put the chicken in a heavy pot with all the other ingredients. No water or oil is needed: the chicken and vegetables cook in their own juices.",
    "Cover tightly (traditionally the lid is sealed with a banana leaf).",
    "Cook on low heat for about 1 hour.",
    "Do not open the pot: instead, shake it firmly every 10 minutes so nothing sticks.",
    "It's ready when the chicken is very tender and the sauce is thick."
   ],
   "fr": [
    "Mettez le poulet dans une marmite épaisse avec tous les autres ingrédients. Pas besoin d'eau ni d'huile : le poulet et les légumes cuisent dans leur jus.",
    "Fermez bien le couvercle (traditionnellement scellé avec une feuille de bananier).",
    "Laissez cuire à feu doux environ 1 heure.",
    "N'ouvrez pas : secouez plutôt la marmite énergiquement toutes les 10 minutes pour que rien n'attache.",
    "C'est prêt quand le poulet est très tendre et la sauce épaisse."
   ]
  },
  "serving": {
   "en": [
    "Serve with attiéké, rice or fried plantain."
   ],
   "fr": [
    "Servez avec de l'attiéké, du riz ou du plantain frit."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "kondre-de-poulet": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 70,
  "servings": 8,
  "ingredients": {
   "en": [
    "1 chicken (about 1.5 kg), in pieces",
    "8 green (unripe) plantains",
    "2 onions",
    "3 tomatoes",
    "4 cloves garlic",
    "1 thumb of ginger",
    "1 tsp each of white pepper, pebe and njansang (or kondre spice mix)",
    "1 leek or a few celery stalks",
    "1 hot pepper",
    "4 tbsp oil",
    "2 stock cubes, salt"
   ],
   "fr": [
    "1 poulet (environ 1,5 kg) en morceaux",
    "8 plantains verts",
    "2 oignons",
    "3 tomates",
    "4 gousses d'ail",
    "1 morceau de gingembre",
    "1 c. à café de poivre blanc, de pèbè et de njansang (ou mélange pour kondre)",
    "1 poireau ou quelques branches de céleri",
    "1 piment",
    "4 c. à soupe d'huile",
    "2 cubes, sel"
   ]
  },
  "steps": {
   "en": [
    "Season the chicken with garlic, ginger, a stock cube and salt and leave 15 minutes.",
    "Blend the onions, tomatoes, leek and spices.",
    "Cook the chicken with the blended spices and oil for 15 minutes.",
    "Peel the plantains, cut each into 3 or 4 pieces, and add them with enough water to just cover.",
    "Cover and cook on medium heat 30 to 40 minutes until the plantains are soft and the sauce has thickened. Stir gently once or twice and season."
   ],
   "fr": [
    "Assaisonnez le poulet avec l'ail, le gingembre, un cube et du sel et laissez reposer 15 minutes.",
    "Mixez les oignons, les tomates, le poireau et les épices.",
    "Faites cuire le poulet avec les épices mixées et l'huile 15 minutes.",
    "Épluchez les plantains, coupez chacun en 3 ou 4 morceaux et ajoutez-les avec juste assez d'eau pour les couvrir.",
    "Couvrez et laissez cuire à feu moyen 30 à 40 minutes jusqu'à ce que les plantains soient tendres et la sauce épaissie. Remuez délicatement une ou deux fois et rectifiez l'assaisonnement."
   ]
  },
  "serving": {
   "en": [
    "A one-pot meal: no side needed."
   ],
   "fr": [
    "Un plat complet en une marmite : pas besoin d'accompagnement."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "limonade-bresilienne": {
  "tags": [
   "vegetarian",
   "quick",
   "occasion"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "4 limes",
    "1 litre cold water",
    "100 g sugar",
    "4 tbsp sweetened condensed milk",
    "Ice"
   ],
   "fr": [
    "4 citrons verts",
    "1 litre d'eau froide",
    "100 g de sucre",
    "4 c. à soupe de lait concentré sucré",
    "Des glaçons"
   ]
  },
  "steps": {
   "en": [
    "Wash the limes well, cut off the ends and cut each into 8 pieces (with the peel).",
    "Blend the limes with the water and sugar for only 10 to 15 seconds (longer makes it bitter).",
    "Strain straight away through a fine sieve.",
    "Stir in the condensed milk.",
    "Serve immediately over ice."
   ],
   "fr": [
    "Lavez bien les citrons, coupez les extrémités et coupez chacun en 8 morceaux (avec la peau).",
    "Mixez les citrons avec l'eau et le sucre seulement 10 à 15 secondes (plus longtemps, ça devient amer).",
    "Filtrez aussitôt dans une passoire fine.",
    "Ajoutez le lait concentré et mélangez.",
    "Servez tout de suite sur des glaçons."
   ]
  },
  "serving": {
   "en": [
    "Drink it fresh: it turns bitter if it waits."
   ],
   "fr": [
    "À boire tout de suite : elle devient amère en attendant."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "mbanga-soup": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 75,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg fresh palm nuts (or 800 ml palm nut cream)",
    "500 g fish (fresh or smoked) or meat",
    "300 g dried shrimps or crayfish",
    "1 onion",
    "1 tbsp mbanga soup spices (country onion, njansang, bush pepper…)",
    "1 hot pepper",
    "A handful of scent leaves or basil",
    "2 stock cubes, salt"
   ],
   "fr": [
    "1 kg de noix de palme fraîches (ou 800 ml de crème de noix de palme)",
    "500 g de poisson (frais ou fumé) ou de viande",
    "300 g de crevettes séchées ou de crayfish",
    "1 oignon",
    "1 c. à soupe d'épices pour mbanga soup (esèsè, njansang, poivre sauvage…)",
    "1 piment",
    "Une poignée de massep ou de basilic",
    "2 cubes, sel"
   ]
  },
  "steps": {
   "en": [
    "Boil the palm nuts about 30 minutes until soft, then pound them and squeeze them in warm water to extract the cream. Strain out the fibres and kernels.",
    "Bring the palm cream to a boil and cook 20 minutes, stirring now and then.",
    "Add the onion, spices, pepper and stock cubes and simmer 10 minutes.",
    "Add the fish (or cooked meat) and shrimps and simmer 15 minutes until the soup thickens and the oil rises a little.",
    "Add the scent leaves and adjust the salt."
   ],
   "fr": [
    "Faites bouillir les noix de palme environ 30 minutes jusqu'à ce qu'elles soient tendres, puis pilez-les et pressez-les dans de l'eau tiède pour extraire la crème. Filtrez les fibres et les noyaux.",
    "Portez la crème de palme à ébullition et laissez cuire 20 minutes en remuant de temps en temps.",
    "Ajoutez l'oignon, les épices, le piment et les cubes et laissez mijoter 10 minutes.",
    "Ajoutez le poisson (ou la viande cuite) et les crevettes et laissez mijoter 15 minutes jusqu'à ce que la sauce épaississe et que l'huile remonte un peu.",
    "Ajoutez le massep et rectifiez le sel."
   ]
  },
  "serving": {
   "en": [
    "Serve with boiled plantain, garri, water fufu or rice."
   ],
   "fr": [
    "Servez avec du plantain bouilli, du gari, du water fufu ou du riz."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "meat-pie": {
  "tags": [
   "snack",
   "occasion"
  ],
  "prepMinutes": 40,
  "cookMinutes": 30,
  "servings": 12,
  "ingredients": {
   "en": [
    "For the pastry: 500 g flour, 250 g cold butter or margarine, 1 tsp baking powder, ½ tsp salt, 1 egg, about 100 ml cold water",
    "For the filling: 400 g minced beef",
    "2 potatoes, finely diced",
    "1 carrot, finely diced",
    "1 onion, chopped",
    "1 tsp thyme and curry powder",
    "1 stock cube, salt, pepper",
    "1 tbsp flour mixed in 100 ml water",
    "1 egg yolk to glaze"
   ],
   "fr": [
    "Pour la pâte : 500 g de farine, 250 g de beurre ou de margarine froids, 1 c. à café de levure chimique, ½ c. à café de sel, 1 œuf, environ 100 ml d'eau froide",
    "Pour la farce : 400 g de bœuf haché",
    "2 pommes de terre en petits dés",
    "1 carotte en petits dés",
    "1 oignon haché",
    "1 c. à café de thym et de curry",
    "1 cube, sel, poivre",
    "1 c. à soupe de farine délayée dans 100 ml d'eau",
    "1 jaune d'œuf pour dorer"
   ]
  },
  "steps": {
   "en": [
    "Rub the butter into the flour, baking powder and salt until it looks like breadcrumbs. Add the egg and just enough cold water to make a dough. Chill 20 minutes.",
    "Brown the beef with the onion, add the potato, carrot, thyme, curry and seasoning, and cook 10 minutes. Stir in the flour-water to thicken. Let it cool.",
    "Roll out the pastry and cut circles about 12 cm wide.",
    "Put a spoonful of filling on each, fold into half-moons, press the edges with a fork and brush with egg yolk.",
    "Bake at 180 °C for 25 to 30 minutes until golden."
   ],
   "fr": [
    "Sablez le beurre avec la farine, la levure et le sel. Ajoutez l'œuf et juste assez d'eau froide pour former une pâte. Réservez 20 minutes au frais.",
    "Faites dorer le bœuf avec l'oignon, ajoutez la pomme de terre, la carotte, le thym, le curry et l'assaisonnement, et laissez cuire 10 minutes. Ajoutez la farine délayée pour épaissir. Laissez refroidir.",
    "Étalez la pâte et découpez des disques d'environ 12 cm.",
    "Déposez une cuillerée de farce sur chacun, pliez en demi-lune, soudez les bords à la fourchette et dorez au jaune d'œuf.",
    "Faites cuire à 180 °C pendant 25 à 30 minutes jusqu'à ce qu'ils soient dorés."
   ]
  },
  "serving": {
   "en": [
    "Serve warm or cold as a snack, with a cold drink."
   ],
   "fr": [
    "Servez chaud ou froid en en-cas, avec une boisson fraîche."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "met-de-pistache": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 90,
  "servings": 8,
  "ingredients": {
   "en": [
    "500 g ground pistachio seeds (egusi)",
    "300 g smoked fish, flaked",
    "200 g dried shrimps or crayfish",
    "1 onion",
    "1 hot pepper",
    "2 stock cubes, salt",
    "About 200 ml warm water",
    "Banana leaves and string for wrapping"
   ],
   "fr": [
    "500 g de graines de pistache (egusi) moulues",
    "300 g de poisson fumé émietté",
    "200 g de crevettes séchées ou de crayfish",
    "1 oignon",
    "1 piment",
    "2 cubes, sel",
    "Environ 200 ml d'eau tiède",
    "Des feuilles de bananier et de la ficelle"
   ]
  },
  "steps": {
   "en": [
    "Blend the onion and pepper and mix them into the ground pistachio.",
    "Add the smoked fish, shrimps, crushed stock cubes and salt, then enough warm water to make a thick, soft paste.",
    "Soften the banana leaves over a flame, put a few spoonfuls of paste in the middle of each, fold into tight parcels and tie.",
    "Steam the parcels in a pot on a bed of stalks with a little water for about 1½ hours, adding water as needed.",
    "It's ready when the met is firm."
   ],
   "fr": [
    "Mixez l'oignon et le piment et mélangez-les à la pistache moulue.",
    "Ajoutez le poisson fumé, les crevettes, les cubes écrasés et le sel, puis assez d'eau tiède pour obtenir une pâte épaisse et souple.",
    "Assouplissez les feuilles de bananier au-dessus d'une flamme, déposez quelques cuillerées de pâte au centre de chacune, fermez en papillotes bien serrées et ficelez.",
    "Faites cuire les papillotes à la vapeur dans une marmite sur un lit de tiges avec un peu d'eau pendant environ 1 h 30, en rajoutant de l'eau si besoin.",
    "C'est prêt quand le met est ferme."
   ]
  },
  "serving": {
   "en": [
    "Serve with boiled plantain, bobolo or macabo."
   ],
   "fr": [
    "Servez avec du plantain bouilli, du bâton de manioc ou du macabo."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "nems": {
  "tags": [
   "snack",
   "occasion"
  ],
  "prepMinutes": 40,
  "cookMinutes": 20,
  "servings": 6,
  "ingredients": {
   "en": [
    "20 spring roll wrappers (rice or wheat)",
    "300 g minced beef or chicken",
    "50 g glass noodles, soaked",
    "2 carrots, grated",
    "¼ cabbage, finely sliced",
    "1 onion, finely chopped",
    "2 cloves garlic",
    "1 egg",
    "2 tbsp soy sauce, salt, pepper",
    "Oil for frying"
   ],
   "fr": [
    "20 galettes pour nems (riz ou blé)",
    "300 g de viande hachée de bœuf ou de poulet",
    "50 g de vermicelles de soja trempés",
    "2 carottes râpées",
    "¼ de chou émincé finement",
    "1 oignon finement haché",
    "2 gousses d'ail",
    "1 œuf",
    "2 c. à soupe de sauce soja, sel, poivre",
    "De l'huile pour la friture"
   ]
  },
  "steps": {
   "en": [
    "Cut the soaked noodles short and mix them with the meat, vegetables, onion, garlic, egg, soy sauce, salt and pepper.",
    "If using rice paper, dip each sheet in warm water for a few seconds to soften it.",
    "Put a spoonful of filling near the bottom, fold the sides in and roll up tightly.",
    "Fry in medium-hot oil 6 to 8 minutes, turning, until golden and crisp.",
    "Drain on paper towels."
   ],
   "fr": [
    "Coupez les vermicelles et mélangez-les avec la viande, les légumes, l'oignon, l'ail, l'œuf, la sauce soja, le sel et le poivre.",
    "Si vous utilisez des galettes de riz, trempez chaque feuille quelques secondes dans l'eau tiède pour l'assouplir.",
    "Déposez une cuillerée de farce en bas, rabattez les côtés et roulez bien serré.",
    "Faites frire dans l'huile moyennement chaude 6 à 8 minutes en retournant, jusqu'à ce qu'ils soient dorés et croustillants.",
    "Égouttez sur du papier absorbant."
   ]
  },
  "serving": {
   "en": [
    "Serve hot with lettuce leaves, fresh mint and a sweet chili or soy dipping sauce."
   ],
   "fr": [
    "Servez chaud avec des feuilles de salade, de la menthe fraîche et une sauce aigre-douce ou soja."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "oeuf-frit": {
  "tags": [
   "budget",
   "quick",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 2,
  "cookMinutes": 5,
  "servings": 1,
  "ingredients": {
   "en": [
    "2 eggs",
    "1 tbsp oil or butter",
    "Salt and pepper",
    "½ tomato and ½ onion, chopped (optional)"
   ],
   "fr": [
    "2 œufs",
    "1 c. à soupe d'huile ou de beurre",
    "Sel et poivre",
    "½ tomate et ½ oignon hachés (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Heat the oil in a frying pan over medium heat.",
    "If you like, soften the onion and tomato for 2 minutes first.",
    "Crack in the eggs and cook 2 to 3 minutes, until the white is set; flip for 30 seconds if you prefer them well done.",
    "Season with salt and pepper."
   ],
   "fr": [
    "Chauffez l'huile dans une poêle à feu moyen.",
    "Si vous voulez, faites revenir l'oignon et la tomate 2 minutes d'abord.",
    "Cassez les œufs et laissez cuire 2 à 3 minutes jusqu'à ce que le blanc soit pris ; retournez-les 30 secondes si vous les aimez bien cuits.",
    "Salez et poivrez."
   ]
  },
  "serving": {
   "en": [
    "Serve with bread, fried plantain or avocado."
   ],
   "fr": [
    "Servez avec du pain, du plantain frit ou de l'avocat."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "oeufs-mimosa-rose": {
  "tags": [
   "occasion",
   "vegetarian",
   "snack"
  ],
  "prepMinutes": 20,
  "cookMinutes": 12,
  "servings": 6,
  "ingredients": {
   "en": [
    "6 eggs",
    "1 small cooked beetroot",
    "3 tbsp mayonnaise",
    "1 tsp mustard",
    "Salt and pepper",
    "Parsley or chives to decorate"
   ],
   "fr": [
    "6 œufs",
    "1 petite betterave cuite",
    "3 c. à soupe de mayonnaise",
    "1 c. à café de moutarde",
    "Sel et poivre",
    "Du persil ou de la ciboulette pour décorer"
   ]
  },
  "steps": {
   "en": [
    "Boil the eggs for 10 minutes, cool them in cold water and peel.",
    "Blend or grate the beetroot and soak the peeled eggs in its juice for 10 to 20 minutes to turn the whites pink.",
    "Halve the eggs and scoop out the yolks.",
    "Mash the yolks with the mayonnaise, mustard, salt and pepper.",
    "Fill the whites with the yolk mixture and decorate with herbs."
   ],
   "fr": [
    "Faites cuire les œufs 10 minutes, refroidissez-les dans l'eau froide et écalez-les.",
    "Mixez ou râpez la betterave et laissez tremper les œufs dans son jus 10 à 20 minutes pour que le blanc devienne rose.",
    "Coupez les œufs en deux et retirez les jaunes.",
    "Écrasez les jaunes avec la mayonnaise, la moutarde, le sel et le poivre.",
    "Garnissez les blancs de cette crème et décorez d'herbes."
   ]
  },
  "serving": {
   "en": [
    "Serve chilled as a starter or party snack."
   ],
   "fr": [
    "Servez frais en entrée ou à l'apéritif."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "ogbono-soup": {
  "tags": [],
  "prepMinutes": 15,
  "cookMinutes": 45,
  "servings": 6,
  "ingredients": {
   "en": [
    "150 g ground ogbono seeds",
    "500 g beef or goat meat",
    "300 g smoked or dried fish",
    "2 tbsp ground crayfish",
    "100 ml red palm oil",
    "1 onion",
    "1 hot pepper",
    "A handful of spinach or bitter leaves",
    "2 stock cubes, salt"
   ],
   "fr": [
    "150 g de graines d'ogbono (mangue sauvage) moulues",
    "500 g de bœuf ou de chèvre",
    "300 g de poisson fumé ou séché",
    "2 c. à soupe de crayfish moulu",
    "100 ml d'huile de palme rouge",
    "1 oignon",
    "1 piment",
    "Une poignée d'épinards ou de feuilles de ndolé",
    "2 cubes, sel"
   ]
  },
  "steps": {
   "en": [
    "Cook the meat with the onion, salt and a stock cube until tender. Keep about 1 litre of broth.",
    "Warm the palm oil on low heat (don't let it smoke), stir in the ground ogbono until it dissolves.",
    "Add the broth little by little, stirring, until the soup draws (becomes stretchy).",
    "Add the meat, fish, crayfish, pepper and second stock cube, and simmer 10 to 15 minutes, stirring often so it doesn't stick.",
    "Stir in the leaves and cook 3 more minutes."
   ],
   "fr": [
    "Faites cuire la viande avec l'oignon, du sel et un cube jusqu'à ce qu'elle soit tendre. Gardez environ 1 litre de bouillon.",
    "Chauffez doucement l'huile de palme (sans la faire fumer) et ajoutez l'ogbono moulu en remuant jusqu'à ce qu'il fonde.",
    "Ajoutez le bouillon petit à petit en remuant, jusqu'à ce que la sauce devienne gluante.",
    "Ajoutez la viande, le poisson, le crayfish, le piment et le second cube, et laissez mijoter 10 à 15 minutes en remuant souvent pour que ça n'attache pas.",
    "Ajoutez les feuilles et laissez cuire encore 3 minutes."
   ]
  },
  "serving": {
   "en": [
    "Serve with water fufu, garri or pounded yam."
   ],
   "fr": [
    "Servez avec du water fufu, du gari ou de l'igname pilée."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pilons-poulet": {
  "tags": [
   "kids",
   "snack",
   "occasion"
  ],
  "prepMinutes": 15,
  "cookMinutes": 40,
  "servings": 4,
  "ingredients": {
   "en": [
    "8 chicken drumsticks",
    "3 cloves garlic, crushed",
    "1 thumb of ginger, grated",
    "1 tsp paprika",
    "1 tbsp mustard",
    "1 stock cube, salt, pepper",
    "3 tbsp oil",
    "1 tbsp honey (optional)"
   ],
   "fr": [
    "8 pilons de poulet",
    "3 gousses d'ail écrasées",
    "1 morceau de gingembre râpé",
    "1 c. à café de paprika",
    "1 c. à soupe de moutarde",
    "1 cube, sel, poivre",
    "3 c. à soupe d'huile",
    "1 c. à soupe de miel (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Mix the garlic, ginger, paprika, mustard, crushed stock cube, salt, pepper, oil and honey.",
    "Coat the drumsticks and leave at least 30 minutes.",
    "Bake at 200 °C for 35 to 40 minutes, turning halfway, until golden and the juices run clear. They can also be grilled or fried."
   ],
   "fr": [
    "Mélangez l'ail, le gingembre, le paprika, la moutarde, le cube écrasé, le sel, le poivre, l'huile et le miel.",
    "Enrobez les pilons et laissez reposer au moins 30 minutes.",
    "Faites cuire au four à 200 °C pendant 35 à 40 minutes en retournant à mi-cuisson, jusqu'à ce qu'ils soient dorés et que le jus soit clair. On peut aussi les griller ou les frire."
   ]
  },
  "serving": {
   "en": [
    "Serve with fries, fried plantain or a salad."
   ],
   "fr": [
    "Servez avec des frites, du plantain frit ou une salade."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "poisson-au-four": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 20,
  "cookMinutes": 35,
  "servings": 4,
  "ingredients": {
   "en": [
    "4 fish steaks or 2 whole fish (bar, carp, mackerel)",
    "4 potatoes, thinly sliced",
    "2 tomatoes, sliced",
    "1 onion, sliced",
    "1 bell pepper, sliced",
    "3 cloves garlic",
    "1 small bunch of parsley",
    "Juice of 1 lemon",
    "4 tbsp oil",
    "1 stock cube, salt, pepper"
   ],
   "fr": [
    "4 darnes ou 2 poissons entiers (bar, carpe, maquereau)",
    "4 pommes de terre en fines rondelles",
    "2 tomates en rondelles",
    "1 oignon émincé",
    "1 poivron émincé",
    "3 gousses d'ail",
    "1 petite botte de persil",
    "Le jus d'un citron",
    "4 c. à soupe d'huile",
    "1 cube, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Heat the oven to 200 °C.",
    "Blend the garlic, parsley, lemon juice, oil, stock cube, salt and pepper, and coat the fish.",
    "Line a dish with the potato slices, season, and add a splash of water. Bake 10 minutes.",
    "Lay the fish on top with the tomatoes, onion and bell pepper around it.",
    "Bake 20 to 25 minutes until the fish flakes and the potatoes are tender."
   ],
   "fr": [
    "Préchauffez le four à 200 °C.",
    "Mixez l'ail, le persil, le jus de citron, l'huile, le cube, le sel et le poivre, et enrobez-en le poisson.",
    "Tapissez un plat de rondelles de pommes de terre, assaisonnez et ajoutez un filet d'eau. Faites cuire 10 minutes.",
    "Posez le poisson dessus avec les tomates, l'oignon et le poivron autour.",
    "Faites cuire 20 à 25 minutes jusqu'à ce que le poisson se détache et que les pommes de terre soient tendres."
   ]
  },
  "serving": {
   "en": [
    "A complete dish; add a green salad if you like."
   ],
   "fr": [
    "Un plat complet ; ajoutez une salade verte si vous voulez."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "poisson-roti": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 15,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "2 whole fish (bar, carp or tilapia), cleaned and scaled",
    "1 onion",
    "3 cloves garlic",
    "1 thumb of ginger",
    "1 small bunch of parsley and basil",
    "1 hot pepper",
    "Juice of 1 lime",
    "3 tbsp oil",
    "1 stock cube, salt",
    "2 tomatoes and 1 onion, sliced"
   ],
   "fr": [
    "2 poissons entiers (bar, carpe ou tilapia) vidés et écaillés",
    "1 oignon",
    "3 gousses d'ail",
    "1 morceau de gingembre",
    "1 petite botte de persil et de basilic",
    "1 piment",
    "Le jus d'un citron vert",
    "3 c. à soupe d'huile",
    "1 cube, sel",
    "2 tomates et 1 oignon en rondelles"
   ]
  },
  "steps": {
   "en": [
    "Make deep cuts on both sides of the fish and rub with lime juice.",
    "Blend the onion, garlic, ginger, herbs, pepper, oil, stock cube and salt.",
    "Fill the cuts and coat the fish with the paste.",
    "Heat the oven to 200 °C. Lay the fish on the sliced tomatoes and onion in a dish.",
    "Roast 25 to 30 minutes until the flesh flakes easily."
   ],
   "fr": [
    "Faites des entailles profondes des deux côtés du poisson et frottez-le de jus de citron.",
    "Mixez l'oignon, l'ail, le gingembre, les herbes, le piment, l'huile, le cube et le sel.",
    "Remplissez les entailles et enrobez le poisson de cette pâte.",
    "Préchauffez le four à 200 °C. Posez le poisson sur les rondelles de tomate et d'oignon dans un plat.",
    "Faites rôtir 25 à 30 minutes jusqu'à ce que la chair se détache facilement."
   ]
  },
  "serving": {
   "en": [
    "Serve with bobolo, miondo, fried plantain or rice, and the vegetables from the dish."
   ],
   "fr": [
    "Servez avec du bâton de manioc, du miondo, du plantain frit ou du riz, et les légumes du plat."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "porc-braise": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 6,
  "ingredients": {
   "en": [
    "1.5 kg pork (ribs, belly or shoulder), in pieces",
    "2 onions",
    "5 cloves garlic",
    "1 thumb of ginger",
    "1 small bunch of parsley and celery",
    "1 tsp pebe or white pepper",
    "1 hot pepper",
    "1 tbsp mustard",
    "2 stock cubes, salt",
    "3 tbsp oil"
   ],
   "fr": [
    "1,5 kg de porc (travers, poitrine ou échine) en morceaux",
    "2 oignons",
    "5 gousses d'ail",
    "1 morceau de gingembre",
    "1 petite botte de persil et de céleri",
    "1 c. à café de pèbè ou de poivre blanc",
    "1 piment",
    "1 c. à soupe de moutarde",
    "2 cubes, sel",
    "3 c. à soupe d'huile"
   ]
  },
  "steps": {
   "en": [
    "Blend 1 onion with the garlic, ginger, herbs, spices, pepper, mustard, stock cubes, salt and oil.",
    "Coat the pork and leave at least 1 hour (overnight is best).",
    "Boil the pork in a little water with its marinade for 20 minutes so it cooks through.",
    "Grill over medium charcoal 15 to 20 minutes, turning and brushing with the leftover juices, until well browned and crisp at the edges.",
    "Serve with the second onion, sliced into rings."
   ],
   "fr": [
    "Mixez 1 oignon avec l'ail, le gingembre, les herbes, les épices, le piment, la moutarde, les cubes, le sel et l'huile.",
    "Enrobez le porc et laissez reposer au moins 1 heure (une nuit, c'est mieux).",
    "Faites bouillir le porc dans un peu d'eau avec sa marinade 20 minutes pour qu'il soit bien cuit.",
    "Faites griller sur une braise moyenne 15 à 20 minutes en retournant et en badigeonnant du jus restant, jusqu'à ce qu'il soit bien doré et croustillant sur les bords.",
    "Servez avec le second oignon en rondelles."
   ]
  },
  "serving": {
   "en": [
    "Serve with fried plantain, bobolo, miondo or fries, and pepper sauce."
   ],
   "fr": [
    "Servez avec du plantain frit, du bâton de manioc, du miondo ou des frites, et du piment."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "poulet-pane": {
  "tags": [
   "kids"
  ],
  "prepMinutes": 20,
  "cookMinutes": 25,
  "servings": 4,
  "ingredients": {
   "en": [
    "600 g chicken breast, in thin slices or strips",
    "2 eggs",
    "100 g flour",
    "150 g breadcrumbs",
    "2 cloves garlic, crushed",
    "1 tsp paprika",
    "1 stock cube, salt, pepper",
    "Oil for frying"
   ],
   "fr": [
    "600 g de blanc de poulet en fines escalopes ou en lanières",
    "2 œufs",
    "100 g de farine",
    "150 g de chapelure",
    "2 gousses d'ail écrasées",
    "1 c. à café de paprika",
    "1 cube, sel, poivre",
    "De l'huile pour la friture"
   ]
  },
  "steps": {
   "en": [
    "Season the chicken with the garlic, paprika, crushed stock cube, salt and pepper.",
    "Set out three plates: flour, beaten eggs, breadcrumbs.",
    "Coat each piece in flour, then egg, then breadcrumbs, pressing so it sticks.",
    "Fry in medium-hot oil 3 to 4 minutes per side until golden and cooked through.",
    "Drain on paper towels."
   ],
   "fr": [
    "Assaisonnez le poulet avec l'ail, le paprika, le cube écrasé, le sel et le poivre.",
    "Préparez trois assiettes : farine, œufs battus, chapelure.",
    "Passez chaque morceau dans la farine, puis l'œuf, puis la chapelure en appuyant pour que ça tienne.",
    "Faites frire dans l'huile moyennement chaude 3 à 4 minutes de chaque côté jusqu'à ce qu'il soit doré et cuit.",
    "Égouttez sur du papier absorbant."
   ]
  },
  "serving": {
   "en": [
    "Serve with fries, rice or salad, and ketchup or mayonnaise."
   ],
   "fr": [
    "Servez avec des frites, du riz ou une salade, et du ketchup ou de la mayonnaise."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "poulet-roti": {
  "tags": [
   "occasion",
   "kids"
  ],
  "prepMinutes": 15,
  "cookMinutes": 75,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 whole chicken (about 1.5 kg)",
    "4 cloves garlic",
    "1 thumb of ginger",
    "1 small bunch of parsley",
    "1 tbsp mustard",
    "Juice of 1 lemon",
    "3 tbsp oil",
    "1 stock cube, salt, pepper",
    "2 onions, quartered"
   ],
   "fr": [
    "1 poulet entier (environ 1,5 kg)",
    "4 gousses d'ail",
    "1 morceau de gingembre",
    "1 petite botte de persil",
    "1 c. à soupe de moutarde",
    "Le jus d'un citron",
    "3 c. à soupe d'huile",
    "1 cube, sel, poivre",
    "2 oignons en quartiers"
   ]
  },
  "steps": {
   "en": [
    "Blend the garlic, ginger, parsley, mustard, lemon juice, oil, stock cube, salt and pepper.",
    "Rub the chicken inside and out with the paste and leave 1 hour (or overnight in the fridge).",
    "Heat the oven to 200 °C. Put the chicken in a dish on the onions with a glass of water.",
    "Roast about 1 hour 15 minutes, basting with the juices every 20 minutes, until golden and the juices run clear.",
    "Rest 10 minutes before carving."
   ],
   "fr": [
    "Mixez l'ail, le gingembre, le persil, la moutarde, le jus de citron, l'huile, le cube, le sel et le poivre.",
    "Frottez le poulet de cette pâte, dedans et dehors, et laissez reposer 1 heure (ou une nuit au frais).",
    "Préchauffez le four à 200 °C. Posez le poulet dans un plat sur les oignons avec un verre d'eau.",
    "Faites rôtir environ 1 h 15 en arrosant de jus toutes les 20 minutes, jusqu'à ce qu'il soit doré et que le jus soit clair.",
    "Laissez reposer 10 minutes avant de découper."
   ]
  },
  "serving": {
   "en": [
    "Serve with fries, potatoes, fried plantain or rice, and the roasting juices."
   ],
   "fr": [
    "Servez avec des frites, des pommes de terre, du plantain frit ou du riz, et le jus de cuisson."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "puree-d-avocat": {
  "tags": [
   "quick",
   "vegetarian",
   "budget"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 2,
  "ingredients": {
   "en": [
    "2 ripe avocados",
    "Juice of ½ lime",
    "½ small onion, finely chopped",
    "½ tomato, diced",
    "1 pinch of chili (optional)",
    "Salt"
   ],
   "fr": [
    "2 avocats mûrs",
    "Le jus d'un demi citron vert",
    "½ petit oignon finement haché",
    "½ tomate en dés",
    "1 pincée de piment (facultatif)",
    "Sel"
   ]
  },
  "steps": {
   "en": [
    "Halve the avocados, remove the stones and scoop the flesh into a bowl.",
    "Mash with a fork, leaving it a little chunky.",
    "Stir in the lime juice, onion, tomato, chili and salt.",
    "Taste and add more lime or salt if needed."
   ],
   "fr": [
    "Coupez les avocats en deux, retirez les noyaux et mettez la chair dans un bol.",
    "Écrasez à la fourchette en gardant quelques morceaux.",
    "Ajoutez le jus de citron, l'oignon, la tomate, le piment et le sel.",
    "Goûtez et rajoutez du citron ou du sel si besoin."
   ]
  },
  "serving": {
   "en": [
    "Spread on bread or toast, or eat with boiled eggs.",
    "Make it just before eating so it stays green."
   ],
   "fr": [
    "Tartinez sur du pain ou des toasts, ou mangez avec des œufs durs.",
    "Préparez-la juste avant de manger pour qu'elle reste bien verte."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "riz-saute": {
  "tags": [
   "quick",
   "kids"
  ],
  "prepMinutes": 15,
  "cookMinutes": 20,
  "servings": 4,
  "ingredients": {
   "en": [
    "600 g cooked rice (cold, ideally from the day before)",
    "2 eggs",
    "250 g chicken or shrimp, in small pieces",
    "2 carrots, diced",
    "100 g green beans or peas",
    "1 onion, chopped",
    "2 cloves garlic",
    "3 tbsp soy sauce",
    "3 tbsp oil",
    "Spring onions, salt, pepper"
   ],
   "fr": [
    "600 g de riz cuit (froid, idéalement de la veille)",
    "2 œufs",
    "250 g de poulet ou de crevettes en petits morceaux",
    "2 carottes en dés",
    "100 g de haricots verts ou de petits pois",
    "1 oignon haché",
    "2 gousses d'ail",
    "3 c. à soupe de sauce soja",
    "3 c. à soupe d'huile",
    "Ciboule, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Scramble the eggs in a little oil, then set aside.",
    "Fry the chicken or shrimp until cooked and set aside.",
    "In the same pan, fry the onion and garlic, then the carrots and beans for 5 minutes.",
    "Add the rice and stir-fry on high heat for 5 minutes, breaking up any lumps.",
    "Add the soy sauce, eggs and meat, mix well and season. Finish with spring onions."
   ],
   "fr": [
    "Faites des œufs brouillés dans un peu d'huile, puis réservez.",
    "Faites revenir le poulet ou les crevettes jusqu'à cuisson et réservez.",
    "Dans la même poêle, faites revenir l'oignon et l'ail, puis les carottes et les haricots 5 minutes.",
    "Ajoutez le riz et faites sauter à feu vif 5 minutes en défaisant les grumeaux.",
    "Ajoutez la sauce soja, les œufs et la viande, mélangez bien et assaisonnez. Terminez avec la ciboule."
   ]
  },
  "serving": {
   "en": [
    "A full meal on its own; add fried plantain or a salad if you like."
   ],
   "fr": [
    "Un repas complet ; ajoutez du plantain frit ou une salade si vous voulez."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "salade-de-cru": {
  "tags": [
   "vegetarian",
   "quick",
   "budget"
  ],
  "prepMinutes": 20,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "½ small cabbage, finely sliced",
    "2 carrots, grated",
    "1 cucumber, sliced",
    "2 tomatoes, in wedges",
    "1 small onion, sliced",
    "3 tbsp oil",
    "1 tbsp vinegar or lime juice",
    "1 tsp mustard",
    "Salt and pepper"
   ],
   "fr": [
    "½ petit chou émincé finement",
    "2 carottes râpées",
    "1 concombre en rondelles",
    "2 tomates en quartiers",
    "1 petit oignon émincé",
    "3 c. à soupe d'huile",
    "1 c. à soupe de vinaigre ou de jus de citron",
    "1 c. à café de moutarde",
    "Sel et poivre"
   ]
  },
  "steps": {
   "en": [
    "Wash all the vegetables well.",
    "Slice, grate and cut them as listed.",
    "Whisk the oil, vinegar, mustard, salt and pepper.",
    "Toss the vegetables with the dressing just before serving."
   ],
   "fr": [
    "Lavez bien tous les légumes.",
    "Émincez, râpez et coupez-les comme indiqué.",
    "Fouettez l'huile, le vinaigre, la moutarde, le sel et le poivre.",
    "Mélangez les légumes à la vinaigrette juste avant de servir."
   ]
  },
  "serving": {
   "en": [
    "Serve as a side with grilled fish or chicken, or with boiled eggs and avocado for a light meal."
   ],
   "fr": [
    "Servez en accompagnement de poisson ou de poulet grillé, ou avec des œufs durs et de l'avocat pour un repas léger."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "salade-de-cuit": {
  "tags": [
   "occasion",
   "vegetarian"
  ],
  "prepMinutes": 25,
  "cookMinutes": 20,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g potatoes",
    "3 carrots",
    "150 g green beans",
    "150 g peas",
    "3 eggs",
    "1 small onion, finely chopped",
    "4 tbsp mayonnaise",
    "1 tsp mustard",
    "Salt and pepper"
   ],
   "fr": [
    "500 g de pommes de terre",
    "3 carottes",
    "150 g de haricots verts",
    "150 g de petits pois",
    "3 œufs",
    "1 petit oignon finement haché",
    "4 c. à soupe de mayonnaise",
    "1 c. à café de moutarde",
    "Sel et poivre"
   ]
  },
  "steps": {
   "en": [
    "Peel and dice the potatoes and carrots, and cut the green beans.",
    "Boil them in salted water until just tender (about 12 minutes), adding the peas for the last 3 minutes. Drain and cool.",
    "Boil the eggs 10 minutes, cool, peel and chop.",
    "Mix the mayonnaise, mustard, salt and pepper.",
    "Combine everything with the onion and chill before serving."
   ],
   "fr": [
    "Épluchez et coupez en dés les pommes de terre et les carottes, et coupez les haricots verts.",
    "Faites-les cuire à l'eau salée jusqu'à ce qu'ils soient juste tendres (environ 12 minutes), en ajoutant les petits pois pour les 3 dernières minutes. Égouttez et laissez refroidir.",
    "Faites cuire les œufs 10 minutes, refroidissez, écalez et hachez-les.",
    "Mélangez la mayonnaise, la moutarde, le sel et le poivre.",
    "Réunissez le tout avec l'oignon et mettez au frais avant de servir."
   ]
  },
  "serving": {
   "en": [
    "Serve cold as a starter or with grilled meat or fish."
   ],
   "fr": [
    "Servez frais en entrée ou avec de la viande ou du poisson grillés."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "sanga": {
  "tags": [
   "vegetarian"
  ],
  "prepMinutes": 30,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "8 ears of fresh corn",
    "500 g cassava leaves or njama-njama, finely chopped",
    "1 kg palm nuts (or 500 ml palm nut cream)",
    "3 tbsp sugar (to taste)",
    "1 pinch of salt"
   ],
   "fr": [
    "8 épis de maïs frais",
    "500 g de feuilles de manioc ou de njama-njama finement hachées",
    "1 kg de noix de palme (ou 500 ml de crème de noix de palme)",
    "3 c. à soupe de sucre (à ajuster)",
    "1 pincée de sel"
   ]
  },
  "steps": {
   "en": [
    "Grate the corn off the cobs (or blend the kernels) into a thick paste.",
    "Boil and pound the palm nuts, squeeze them in warm water and strain to get the juice.",
    "Cook the chopped leaves in the palm nut juice about 30 minutes.",
    "Stir in the corn paste and cook 20 to 25 minutes on low heat, stirring often, until thick.",
    "Add sugar and a pinch of salt to taste."
   ],
   "fr": [
    "Râpez le maïs sur l'épi (ou mixez les grains) pour obtenir une pâte épaisse.",
    "Faites bouillir et pilez les noix de palme, pressez-les dans de l'eau tiède et filtrez pour obtenir le jus.",
    "Faites cuire les feuilles hachées dans le jus de noix de palme environ 30 minutes.",
    "Ajoutez la pâte de maïs et laissez cuire 20 à 25 minutes à feu doux en remuant souvent, jusqu'à ce que ce soit épais.",
    "Sucrez et salez légèrement à votre goût."
   ]
  },
  "serving": {
   "en": [
    "Serve warm in bowls, on its own."
   ],
   "fr": [
    "Servez tiède dans des bols, tel quel."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "sauce-pistache": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "400 g ground pistachio seeds (egusi)",
    "500 g beef",
    "300 g smoked fish",
    "2 tbsp ground crayfish",
    "2 onions",
    "2 tomatoes (optional)",
    "1 hot pepper",
    "100 ml red palm oil",
    "A handful of bitter leaves or spinach",
    "2 stock cubes, salt"
   ],
   "fr": [
    "400 g de graines de pistache (egusi) moulues",
    "500 g de bœuf",
    "300 g de poisson fumé",
    "2 c. à soupe de crayfish moulu",
    "2 oignons",
    "2 tomates (facultatif)",
    "1 piment",
    "100 ml d'huile de palme rouge",
    "Une poignée de feuilles de ndolé ou d'épinards",
    "2 cubes, sel"
   ]
  },
  "steps": {
   "en": [
    "Cook the beef with 1 onion, salt and a stock cube until tender, about 40 minutes. Keep the broth.",
    "Mix the ground pistachio with a little water into a thick paste.",
    "Heat the palm oil, fry the second onion (and tomatoes if using), then drop in spoonfuls of the pistachio paste. Let them set 5 minutes before stirring so they form small lumps.",
    "Add the meat with its broth, the smoked fish, crayfish and pepper, and simmer 15 minutes.",
    "Stir in the leaves and the second stock cube and cook 5 more minutes."
   ],
   "fr": [
    "Faites cuire le bœuf avec 1 oignon, du sel et un cube jusqu'à ce qu'il soit tendre, environ 40 minutes. Gardez le bouillon.",
    "Mélangez la pistache moulue avec un peu d'eau en une pâte épaisse.",
    "Chauffez l'huile de palme, faites revenir le second oignon (et les tomates si vous en mettez), puis déposez la pâte de pistache par cuillerées. Laissez prendre 5 minutes avant de remuer pour former de petits grumeaux.",
    "Ajoutez la viande avec son bouillon, le poisson fumé, le crayfish et le piment, et laissez mijoter 15 minutes.",
    "Ajoutez les feuilles et le second cube et laissez cuire encore 5 minutes."
   ]
  },
  "serving": {
   "en": [
    "Serve with fufu, garri, couscous (corn or cassava) or boiled plantain."
   ],
   "fr": [
    "Servez avec du fufu, du gari, du couscous (maïs ou manioc) ou du plantain bouilli."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "sauce-tomate": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 15,
  "cookMinutes": 45,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg fresh tomatoes (or 2 tins)",
    "2 onions",
    "1 red bell pepper",
    "3 cloves garlic",
    "1 thumb of ginger",
    "1 hot pepper",
    "2 tbsp tomato paste",
    "100 ml oil",
    "500 g beef, chicken or fried fish (optional)",
    "2 stock cubes, salt, 1 bay leaf"
   ],
   "fr": [
    "1 kg de tomates fraîches (ou 2 boîtes)",
    "2 oignons",
    "1 poivron rouge",
    "3 gousses d'ail",
    "1 morceau de gingembre",
    "1 piment",
    "2 c. à soupe de concentré de tomate",
    "100 ml d'huile",
    "500 g de bœuf, de poulet ou de poisson frit (facultatif)",
    "2 cubes, sel, 1 feuille de laurier"
   ]
  },
  "steps": {
   "en": [
    "Blend the tomatoes, 1 onion, the bell pepper, garlic, ginger and pepper.",
    "Heat the oil and fry the second onion, sliced, until soft. Add the tomato paste and fry 2 minutes.",
    "Pour in the blended mix and the bay leaf, and cook uncovered on medium heat 25 to 30 minutes, stirring now and then, until thick and the oil rises to the top.",
    "Add the cooked meat or fried fish and the stock cubes, and simmer 10 more minutes.",
    "Season to taste."
   ],
   "fr": [
    "Mixez les tomates, 1 oignon, le poivron, l'ail, le gingembre et le piment.",
    "Chauffez l'huile et faites revenir le second oignon émincé. Ajoutez le concentré et faites-le revenir 2 minutes.",
    "Versez le mélange mixé et le laurier, et laissez cuire à découvert à feu moyen 25 à 30 minutes en remuant de temps en temps, jusqu'à ce que ce soit épais et que l'huile remonte.",
    "Ajoutez la viande cuite ou le poisson frit et les cubes, et laissez mijoter encore 10 minutes.",
    "Rectifiez l'assaisonnement."
   ]
  },
  "serving": {
   "en": [
    "Serve with white rice, boiled plantain, yam, potatoes or spaghetti.",
    "Keeps 4 days in the fridge and freezes well."
   ],
   "fr": [
    "Servez avec du riz blanc, du plantain bouilli, de l'igname, des pommes de terre ou des spaghettis.",
    "Se garde 4 jours au frais et se congèle bien."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "scotch-eggs": {
  "tags": [
   "snack",
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 20,
  "servings": 6,
  "ingredients": {
   "en": [
    "7 eggs (6 boiled, 1 beaten)",
    "500 g sausage meat or seasoned minced beef",
    "1 small onion, finely chopped",
    "1 tsp thyme, salt, pepper, chili",
    "100 g flour",
    "120 g breadcrumbs",
    "Oil for frying"
   ],
   "fr": [
    "7 œufs (6 durs, 1 battu)",
    "500 g de chair à saucisse ou de bœuf haché assaisonné",
    "1 petit oignon finement haché",
    "1 c. à café de thym, sel, poivre, piment",
    "100 g de farine",
    "120 g de chapelure",
    "De l'huile pour la friture"
   ]
  },
  "steps": {
   "en": [
    "Boil 6 eggs for 8 minutes, cool and peel.",
    "Mix the meat with the onion, thyme and seasoning, and divide into 6.",
    "Roll each egg in flour, then wrap it evenly in a portion of meat.",
    "Dip in beaten egg, then roll in breadcrumbs.",
    "Fry in medium-hot oil 7 to 8 minutes, turning, until deep golden and the meat is cooked through."
   ],
   "fr": [
    "Faites cuire 6 œufs 8 minutes, refroidissez-les et écalez-les.",
    "Mélangez la viande avec l'oignon, le thym et l'assaisonnement, et divisez en 6.",
    "Roulez chaque œuf dans la farine, puis enveloppez-le uniformément d'une portion de viande.",
    "Passez-les dans l'œuf battu, puis dans la chapelure.",
    "Faites frire dans l'huile moyennement chaude 7 à 8 minutes en retournant, jusqu'à ce qu'ils soient bien dorés et la viande cuite."
   ]
  },
  "serving": {
   "en": [
    "Cut in half and serve warm or cold with ketchup or pepper sauce."
   ],
   "fr": [
    "Coupez en deux et servez chaud ou froid avec du ketchup ou du piment."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "smoothies": {
  "tags": [
   "quick",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 2,
  "ingredients": {
   "en": [
    "1 ripe banana",
    "1 cup of mango or pineapple pieces",
    "250 ml milk or yogurt",
    "1 tbsp honey or sugar (optional)",
    "A few ice cubes"
   ],
   "fr": [
    "1 banane mûre",
    "1 tasse de morceaux de mangue ou d'ananas",
    "250 ml de lait ou de yaourt",
    "1 c. à soupe de miel ou de sucre (facultatif)",
    "Quelques glaçons"
   ]
  },
  "steps": {
   "en": [
    "Peel and cut the fruit.",
    "Put everything in a blender.",
    "Blend until smooth, about 1 minute.",
    "Taste and add honey or a splash of milk if it's too thick."
   ],
   "fr": [
    "Épluchez et coupez les fruits.",
    "Mettez tout dans un mixeur.",
    "Mixez jusqu'à ce que ce soit lisse, environ 1 minute.",
    "Goûtez et ajoutez du miel ou un peu de lait si c'est trop épais."
   ]
  },
  "serving": {
   "en": [
    "Serve straight away in tall glasses."
   ],
   "fr": [
    "Servez tout de suite dans de grands verres."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "tapioca": {
  "tags": [
   "budget",
   "quick",
   "vegetarian"
  ],
  "prepMinutes": 2,
  "cookMinutes": 0,
  "servings": 1,
  "ingredients": {
   "en": [
    "4 tbsp tapioca (garri)",
    "Cold water",
    "2 tbsp sugar",
    "3 tbsp milk (evaporated or powdered)",
    "A handful of roasted peanuts (optional)"
   ],
   "fr": [
    "4 c. à soupe de tapioca (gari)",
    "De l'eau froide",
    "2 c. à soupe de sucre",
    "3 c. à soupe de lait (concentré non sucré ou en poudre)",
    "Une poignée d'arachides grillées (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Put the tapioca in a bowl and cover with cold water.",
    "Stir, let the light bits float up and pour off some of the water if you like it less wet.",
    "Add the sugar and milk and stir.",
    "Top with roasted peanuts and eat straight away."
   ],
   "fr": [
    "Mettez le tapioca dans un bol et couvrez d'eau froide.",
    "Mélangez, laissez remonter les petites peaux et videz un peu d'eau si vous l'aimez moins liquide.",
    "Ajoutez le sucre et le lait et mélangez.",
    "Parsemez d'arachides grillées et mangez aussitôt."
   ]
  },
  "serving": {
   "en": [
    "A quick breakfast or snack on hot days."
   ],
   "fr": [
    "Un petit-déjeuner ou un en-cas rapide quand il fait chaud."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 }
}
$chop$::jsonb) as r
on conflict (slug) do nothing;
