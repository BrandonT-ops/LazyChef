-- The recipes Chop launched with (from content/recipes). Existing rows are left untouched.
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
 "beignets-farine": {
  "tags": [
   "budget",
   "snack",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 15,
  "cookMinutes": 20,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g flour",
    "100 g sugar",
    "1 tbsp (10 g) dry yeast",
    "½ tsp salt",
    "1 pinch of nutmeg (optional)",
    "350 to 400 ml warm water",
    "Oil for deep-frying"
   ],
   "fr": [
    "500 g de farine",
    "100 g de sucre",
    "1 c. à soupe (10 g) de levure sèche",
    "½ c. à café de sel",
    "1 pincée de muscade (facultatif)",
    "350 à 400 ml d'eau tiède",
    "De l'huile pour la friture"
   ]
  },
  "steps": {
   "en": [
    "Mix the yeast with a little of the warm water and a pinch of sugar. Wait 5 minutes until foamy.",
    "Mix the flour, sugar, salt and nutmeg. Add the yeast and the rest of the water and beat for 5 minutes into a soft, sticky batter.",
    "Cover and let it rise somewhere warm for about 1 hour, until doubled.",
    "Heat the oil to about 170 °C: a drop of batter should rise quickly.",
    "Grab some batter, squeeze a ball out between your thumb and index finger and drop it into the oil. Fry, turning, until golden all over (3 to 4 minutes).",
    "Drain on paper towels."
   ],
   "fr": [
    "Mélangez la levure avec un peu d'eau tiède et une pincée de sucre. Attendez 5 minutes qu'elle mousse.",
    "Mélangez la farine, le sucre, le sel et la muscade. Ajoutez la levure et le reste de l'eau et battez 5 minutes pour obtenir une pâte souple et collante.",
    "Couvrez et laissez lever au chaud environ 1 heure, jusqu'à ce que la pâte double.",
    "Chauffez l'huile à environ 170 °C : une goutte de pâte doit remonter vite.",
    "Prenez de la pâte, faites sortir une boule entre le pouce et l'index et laissez-la tomber dans l'huile. Faites frire en retournant jusqu'à ce que les beignets soient dorés (3 à 4 minutes).",
    "Égouttez sur du papier absorbant."
   ]
  },
  "serving": {
   "en": [
    "The classic BHB: beignets with haricots (beans) and bouillie (corn porridge).",
    "Or with tea or coffee for breakfast.",
    "Best eaten the same day."
   ],
   "fr": [
    "Le fameux BHB : beignets, haricots et bouillie.",
    "Ou avec du thé ou du café au petit-déjeuner.",
    "À manger le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "bouillon-de-poisson": {
  "tags": [
   "quick"
  ],
  "prepMinutes": 15,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg fish (carp, catfish or tilapia), in thick slices",
    "1 onion",
    "3 cloves garlic",
    "1 thumb of fresh ginger",
    "2 tbsp pepper-soup spices (ground njansang, pebe and country onion)",
    "1 to 2 hot peppers",
    "A handful of basil or scent leaves",
    "1 stock cube, salt",
    "1.5 litres water",
    "1 lime or a little vinegar, to clean the fish"
   ],
   "fr": [
    "1 kg de poisson (carpe, silure ou tilapia) en grosses tranches",
    "1 oignon",
    "3 gousses d'ail",
    "1 morceau de gingembre frais",
    "2 c. à soupe d'épices pour bouillon (njansang, pèbè et esèsè moulus)",
    "1 à 2 piments",
    "Une poignée de basilic ou de feuilles de massep",
    "1 cube d'assaisonnement, sel",
    "1,5 litre d'eau",
    "1 citron vert ou un peu de vinaigre pour nettoyer le poisson"
   ]
  },
  "steps": {
   "en": [
    "Clean the fish with lime juice or vinegar, then rinse.",
    "Blend the onion, garlic, ginger and pepper.",
    "Boil the water with the blended mix, the spices, the stock cube and salt for 10 minutes.",
    "Lower the heat, slide in the fish and simmer gently for 12 to 15 minutes without stirring (shake the pot instead) so the fish stays whole.",
    "Add the chopped basil or scent leaves for the last 2 minutes."
   ],
   "fr": [
    "Nettoyez le poisson avec le citron ou le vinaigre, puis rincez.",
    "Mixez l'oignon, l'ail, le gingembre et le piment.",
    "Faites bouillir l'eau avec le mélange mixé, les épices, le cube et le sel pendant 10 minutes.",
    "Baissez le feu, plongez le poisson et laissez frémir 12 à 15 minutes sans remuer (secouez la marmite) pour qu'il reste entier.",
    "Ajoutez le basilic ou le massep haché 2 minutes avant la fin."
   ]
  },
  "serving": {
   "en": [
    "Serve very hot in deep bowls.",
    "With boiled plantain, yam or bread.",
    "Perfect when you're tired, cold or feeling unwell."
   ],
   "fr": [
    "Servez bien chaud dans des bols creux.",
    "Avec du plantain ou de l'igname bouillis, ou du pain.",
    "Parfait quand on est fatigué, qu'il fait froid ou qu'on est un peu malade."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Similar: Goat meat pepper soup (Keng's Kitchen)",
    "url": "https://www.kengskitchen.com/cameroon-recipes/goat-meat-pepper-soup"
   }
  ]
 },
 "brochettes-de-boeuf": {
  "tags": [
   "snack",
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 15,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg beef (sirloin or rump), thinly sliced",
    "6 tbsp kankankan / suya spice (or 4 tbsp roasted peanut powder + 1 tsp each of chili, ginger and garlic powder + 1 crushed stock cube)",
    "3 tbsp oil",
    "Salt",
    "Skewers (soak wooden ones in water)",
    "1 onion and 2 tomatoes, sliced, to serve"
   ],
   "fr": [
    "1 kg de bœuf (faux-filet ou rumsteck) en fines tranches",
    "6 c. à soupe de kankankan / épices soya (ou 4 c. à soupe de poudre d'arachide grillée + 1 c. à café de piment, de gingembre et d'ail en poudre + 1 cube écrasé)",
    "3 c. à soupe d'huile",
    "Sel",
    "Des brochettes (trempez celles en bois dans l'eau)",
    "1 oignon et 2 tomates en rondelles, pour servir"
   ]
  },
  "steps": {
   "en": [
    "Cut the beef into thin strips and thread them onto the skewers like a ribbon.",
    "Mix the spice with a little salt.",
    "Brush the meat with oil, then roll each skewer in the spice so it's well coated. Leave for 30 minutes.",
    "Grill over hot charcoal for 5 to 7 minutes per side, brushing with a little oil.",
    "Sprinkle with more spice when they come off the grill."
   ],
   "fr": [
    "Coupez le bœuf en fines lanières et enfilez-les sur les brochettes en accordéon.",
    "Mélangez les épices avec un peu de sel.",
    "Badigeonnez la viande d'huile, puis roulez chaque brochette dans les épices pour bien l'enrober. Laissez reposer 30 minutes.",
    "Faites griller sur une braise vive 5 à 7 minutes de chaque côté en badigeonnant d'un peu d'huile.",
    "Saupoudrez encore d'épices à la sortie du feu."
   ]
  },
  "serving": {
   "en": [
    "Serve with raw onion and tomato slices and a small plate of extra spice.",
    "Perfect for parties, with cold drinks."
   ],
   "fr": [
    "Servez avec des rondelles d'oignon et de tomate crus et une petite assiette d'épices en plus.",
    "Parfait pour les fêtes, avec des boissons fraîches."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "ekwang": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 60,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "2 kg cocoyams (macabo), peeled",
    "About 50 cocoyam leaves (or large spinach leaves)",
    "300 ml red palm oil",
    "300 g smoked fish",
    "200 g cooked beef or cow skin",
    "3 tbsp ground crayfish",
    "1 onion",
    "2 hot peppers",
    "2 stock cubes, salt"
   ],
   "fr": [
    "2 kg de macabo épluché",
    "Environ 50 feuilles de macabo (ou de grandes feuilles d'épinards)",
    "300 ml d'huile de palme rouge",
    "300 g de poisson fumé",
    "200 g de bœuf ou de peau de bœuf cuits",
    "3 c. à soupe de crayfish moulu",
    "1 oignon",
    "2 piments",
    "2 cubes d'assaisonnement, sel"
   ]
  },
  "steps": {
   "en": [
    "Grate the cocoyams finely (or blend them with very little water) into a smooth paste. Add a pinch of salt.",
    "Wash the leaves and cut off the thick stalks.",
    "Put a spoonful of paste on each leaf and roll it into a small, tight roll.",
    "Line a pot with a few leaves and arrange the rolls in circles. Add the meat, smoked fish, crayfish, pepper, sliced onion and stock cubes.",
    "Pour in the palm oil and just enough water to reach the top layer. Cover and cook on low heat for about 1 hour, shaking the pot now and then instead of stirring.",
    "It's ready when the rolls are firm and the sauce is thick and glossy."
   ],
   "fr": [
    "Râpez finement le macabo (ou mixez-le avec très peu d'eau) en une pâte lisse. Ajoutez une pincée de sel.",
    "Lavez les feuilles et coupez les grosses tiges.",
    "Déposez une cuillerée de pâte sur chaque feuille et roulez-la en un petit rouleau bien serré.",
    "Tapissez une marmite de quelques feuilles et disposez les rouleaux en cercles. Ajoutez la viande, le poisson fumé, le crayfish, le piment, l'oignon émincé et les cubes.",
    "Versez l'huile de palme et juste assez d'eau pour atteindre la couche du dessus. Couvrez et laissez cuire à feu doux environ 1 heure, en secouant la marmite de temps en temps au lieu de remuer.",
    "C'est prêt quand les rouleaux sont fermes et la sauce épaisse et brillante."
   ]
  },
  "serving": {
   "en": [
    "Serve in a deep plate with the rolls and fish on top; no side needed.",
    "Keeps 2 to 3 days in the fridge."
   ],
   "fr": [
    "Servez dans une assiette creuse, les rouleaux et le poisson dessus ; pas besoin d'accompagnement.",
    "Se garde 2 à 3 jours au frais."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "eru": {
  "tags": [],
  "prepMinutes": 30,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g sliced eru (okazi) leaves",
    "1 kg waterleaf or spinach",
    "500 g beef",
    "300 g cow skin (kanda), in pieces",
    "200 g smoked fish, flaked",
    "2 tbsp ground crayfish",
    "300 ml red palm oil",
    "1–2 hot peppers",
    "2 stock cubes, salt"
   ],
   "fr": [
    "500 g de feuilles d'eru (okok anglophone) émincées",
    "1 kg de waterleaf ou d'épinards",
    "500 g de bœuf",
    "300 g de peau de bœuf (kanda) en morceaux",
    "200 g de poisson fumé émietté",
    "2 c. à soupe de crevettes séchées moulues (crayfish)",
    "300 ml d'huile de palme rouge",
    "1 à 2 piments",
    "2 cubes d'assaisonnement, sel"
   ]
  },
  "steps": {
   "en": [
    "Cook the beef and cow skin with salt and a stock cube until tender, about 45 minutes.",
    "Wash and chop the waterleaf, add it to the pot and cook 10 minutes until it releases its water.",
    "Add the smoked fish, crayfish and pepper.",
    "Rinse the eru and stir it in, a handful at a time.",
    "Pour in the palm oil, stir, cover and cook on low heat 15 to 20 minutes, stirring now and then, until the eru is soft and there's no loose water left.",
    "Season with the second stock cube and salt."
   ],
   "fr": [
    "Faites cuire le bœuf et la peau avec du sel et un cube jusqu'à ce qu'ils soient tendres, environ 45 minutes.",
    "Lavez et hachez le waterleaf, ajoutez-le et laissez cuire 10 minutes jusqu'à ce qu'il rende son eau.",
    "Ajoutez le poisson fumé, le crayfish et le piment.",
    "Rincez l'eru et incorporez-le poignée par poignée.",
    "Versez l'huile de palme, mélangez, couvrez et laissez cuire à feu doux 15 à 20 minutes en remuant de temps en temps, jusqu'à ce que l'eru soit tendre et qu'il ne reste plus d'eau.",
    "Assaisonnez avec le second cube et du sel."
   ]
  },
  "serving": {
   "en": [
    "Serve with water fufu or garri.",
    "Eat with your hands: roll a small ball of fufu and use it to scoop the eru.",
    "Keeps 3 days in the fridge."
   ],
   "fr": [
    "Servez avec du water fufu ou du gari.",
    "Mangez à la main : roulez une petite boule de fufu pour saisir l'eru.",
    "Se garde 3 jours au frais."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "koki": {
  "tags": [
   "vegetarian",
   "budget"
  ],
  "prepMinutes": 40,
  "cookMinutes": 120,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg black-eyed beans (cornille)",
    "250 ml red palm oil",
    "1 hot pepper",
    "2 stock cubes, salt",
    "1 small bunch of cocoyam leaves or spinach (optional)",
    "Banana leaves for wrapping",
    "Warm water"
   ],
   "fr": [
    "1 kg de haricots cornille",
    "250 ml d'huile de palme rouge",
    "1 piment",
    "2 cubes d'assaisonnement, sel",
    "1 petite botte de feuilles de macabo ou d'épinards (facultatif)",
    "Des feuilles de bananier pour emballer",
    "De l'eau tiède"
   ]
  },
  "steps": {
   "en": [
    "Soak the beans for 2 hours (or overnight), then rub them between your hands to remove the skins. Rinse until only white beans are left.",
    "Blend the beans with the pepper and a little water into a thick, smooth paste.",
    "Warm the palm oil until hot but not smoking and let it cool a little. Whisk it into the paste bit by bit until it turns orange, then add salt, stock cubes, the chopped leaves and enough warm water for a thick, pourable batter.",
    "Soften the banana leaves over a flame. Shape them into cones or packets, fill with batter and fold them tightly closed.",
    "Line a large pot with leaf stalks, set the packets inside and add water up to a third of their height. Steam on medium heat for about 2 hours, adding water when needed.",
    "The koki is ready when it's firm and a knife comes out clean."
   ],
   "fr": [
    "Faites tremper les haricots 2 heures (ou une nuit), puis frottez-les entre vos mains pour enlever la peau. Rincez jusqu'à n'avoir que des haricots blancs.",
    "Mixez les haricots avec le piment et un peu d'eau en une pâte épaisse et lisse.",
    "Chauffez l'huile de palme sans la faire fumer et laissez-la tiédir. Incorporez-la petit à petit à la pâte jusqu'à ce qu'elle devienne orange, puis ajoutez le sel, les cubes, les feuilles hachées et assez d'eau tiède pour obtenir une pâte épaisse mais coulante.",
    "Assouplissez les feuilles de bananier au-dessus d'une flamme. Formez des cônes ou des paquets, remplissez-les de pâte et fermez-les bien.",
    "Tapissez une grande marmite de tiges, posez les paquets dessus et ajoutez de l'eau jusqu'au tiers de leur hauteur. Faites cuire à la vapeur à feu moyen environ 2 heures, en rajoutant de l'eau si besoin.",
    "Le koki est prêt quand il est ferme et qu'un couteau en ressort propre."
   ]
  },
  "serving": {
   "en": [
    "Serve with boiled ripe or green plantain, or with bobolo.",
    "Unwrap the packets at the table.",
    "Keeps 3 to 4 days in the fridge, still wrapped."
   ],
   "fr": [
    "Servez avec du plantain mûr ou vert bouilli, ou du bâton de manioc.",
    "Ouvrez les paquets à table.",
    "Se garde 3 à 4 jours au frais, dans ses feuilles."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "kondre-de-porc-et-boeuf": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 90,
  "servings": 8,
  "ingredients": {
   "en": [
    "500 g pork",
    "500 g beef",
    "10 green (unripe) plantains",
    "2 onions",
    "3 tomatoes",
    "4 cloves garlic",
    "1 thumb of fresh ginger",
    "1 tsp each of white pepper, pebe and njansang (or kondre spice mix)",
    "2 leeks or a few celery stalks",
    "1 hot pepper",
    "4 tbsp oil",
    "2 stock cubes, salt"
   ],
   "fr": [
    "500 g de porc",
    "500 g de bœuf",
    "10 plantains verts",
    "2 oignons",
    "3 tomates",
    "4 gousses d'ail",
    "1 morceau de gingembre frais",
    "1 c. à café de poivre blanc, de pèbè et de njansang (ou mélange d'épices pour kondre)",
    "2 poireaux ou quelques branches de céleri",
    "1 piment",
    "4 c. à soupe d'huile",
    "2 cubes d'assaisonnement, sel"
   ]
  },
  "steps": {
   "en": [
    "Cut the meat into pieces and season with garlic, ginger, a stock cube and salt. Cook in a little water for 30 minutes.",
    "Blend the onions, tomatoes, leeks and spices.",
    "Add the blended spices and the oil to the meat and cook for 15 minutes.",
    "Peel the plantains, cut each into 3 or 4 pieces and add them with enough water to just cover.",
    "Cover and cook on medium heat for 30 to 40 minutes, until the plantains are soft and the sauce has thickened. Stir gently once or twice.",
    "Season to taste."
   ],
   "fr": [
    "Coupez la viande en morceaux et assaisonnez-la avec l'ail, le gingembre, un cube et du sel. Faites-la cuire 30 minutes dans un peu d'eau.",
    "Mixez les oignons, les tomates, les poireaux et les épices.",
    "Ajoutez les épices mixées et l'huile à la viande et laissez cuire 15 minutes.",
    "Épluchez les plantains, coupez chacun en 3 ou 4 morceaux et ajoutez-les avec juste assez d'eau pour les couvrir.",
    "Couvrez et laissez cuire à feu moyen 30 à 40 minutes, jusqu'à ce que les plantains soient tendres et la sauce épaissie. Remuez délicatement une ou deux fois.",
    "Rectifiez l'assaisonnement."
   ]
  },
  "serving": {
   "en": [
    "A one-pot meal: no side needed.",
    "Serve in large bowls, plantain, meat and sauce together.",
    "A classic of celebrations in the West Region."
   ],
   "fr": [
    "Un plat complet en une marmite : pas besoin d'accompagnement.",
    "Servez dans de grands bols, plantain, viande et sauce ensemble.",
    "Un classique des cérémonies de l'Ouest."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "mbongo": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 50,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg fish (carp, catfish or bar), in pieces",
    "4 tbsp ground mbongo spice (burnt black spices)",
    "2 onions",
    "4 cloves garlic",
    "1 thumb of fresh ginger",
    "2 tomatoes",
    "1 tsp each of pebe and njansang (optional)",
    "1 hot pepper",
    "4 tbsp oil",
    "2 stock cubes, salt"
   ],
   "fr": [
    "1 kg de poisson (carpe, silure ou bar) en morceaux",
    "4 c. à soupe d'épices mbongo moulues (épices noires grillées)",
    "2 oignons",
    "4 gousses d'ail",
    "1 morceau de gingembre frais",
    "2 tomates",
    "1 c. à café de pèbè et de njansang (facultatif)",
    "1 piment",
    "4 c. à soupe d'huile",
    "2 cubes d'assaisonnement, sel"
   ]
  },
  "steps": {
   "en": [
    "Clean the fish and season it with salt.",
    "Blend the onions, garlic, ginger, tomatoes and pepper with a little water.",
    "Heat the oil in a pot, add the blended mix and cook for 10 minutes.",
    "Stir in the mbongo spice and the other spices, add 500 ml of water and simmer for 15 minutes until the sauce is black and fragrant.",
    "Add the fish and stock cubes. Cover and simmer gently for 15 minutes, shaking the pot rather than stirring so the fish stays whole.",
    "Taste and adjust the salt: the sauce should coat the back of a spoon."
   ],
   "fr": [
    "Nettoyez le poisson et salez-le.",
    "Mixez les oignons, l'ail, le gingembre, les tomates et le piment avec un peu d'eau.",
    "Chauffez l'huile dans une marmite, ajoutez le mélange mixé et laissez cuire 10 minutes.",
    "Ajoutez les épices mbongo et les autres épices, versez 500 ml d'eau et laissez mijoter 15 minutes jusqu'à ce que la sauce soit noire et parfumée.",
    "Ajoutez le poisson et les cubes. Couvrez et laissez mijoter doucement 15 minutes, en secouant la marmite plutôt qu'en remuant, pour garder le poisson entier.",
    "Goûtez et rectifiez le sel : la sauce doit napper le dos d'une cuillère."
   ]
  },
  "serving": {
   "en": [
    "Serve with boiled plantain, bobolo or rice.",
    "Lay the fish whole on top of the black sauce."
   ],
   "fr": [
    "Servez avec du plantain bouilli, du bâton de manioc ou du riz.",
    "Disposez le poisson entier sur la sauce noire."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "ndole": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 40,
  "cookMinutes": 75,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g washed bitter leaves (fresh or frozen, ready to cook)",
    "500 g raw peanuts",
    "700 g beef, in cubes",
    "200 g smoked fish or dried shrimps",
    "2 onions",
    "4 cloves garlic",
    "1 thumb of fresh ginger",
    "1 hot pepper (optional)",
    "150 ml vegetable oil",
    "2 stock cubes, salt"
   ],
   "fr": [
    "500 g de feuilles de ndolé lavées (fraîches ou surgelées)",
    "500 g d'arachides crues",
    "700 g de bœuf en cubes",
    "200 g de poisson fumé ou de crevettes séchées",
    "2 oignons",
    "4 gousses d'ail",
    "1 morceau de gingembre frais",
    "1 piment (facultatif)",
    "150 ml d'huile végétale",
    "2 cubes d'assaisonnement, sel"
   ]
  },
  "steps": {
   "en": [
    "Boil the peanuts for 15 minutes, rub off the skins, then blend them into a smooth paste with a little water.",
    "Season the beef with 1 onion, the garlic, ginger, a stock cube and salt. Cook it in a little water until tender, about 40 minutes. Keep the broth.",
    "If your bitter leaves are fresh, boil them with a pinch of salt, then rinse and squeeze them several times until only a mild bitterness is left.",
    "Pour the peanut paste into the meat and its broth. Simmer gently for 20 minutes, stirring often so it doesn't stick.",
    "Add the smoked fish or shrimps and the bitter leaves, mix well and simmer 10 more minutes. Season to taste.",
    "Fry the second onion, sliced, in the oil until golden. Pour the hot oil and onions over the ndolé just before serving."
   ],
   "fr": [
    "Faites bouillir les arachides 15 minutes, frottez-les pour enlever la peau, puis mixez-les en pâte lisse avec un peu d'eau.",
    "Assaisonnez le bœuf avec 1 oignon, l'ail, le gingembre, un cube et du sel. Faites-le cuire dans un peu d'eau jusqu'à ce qu'il soit tendre, environ 40 minutes. Gardez le bouillon.",
    "Si vos feuilles sont fraîches, faites-les bouillir avec une pincée de sel, puis rincez et pressez-les plusieurs fois jusqu'à ce qu'il ne reste qu'une légère amertume.",
    "Versez la pâte d'arachide dans la viande et son bouillon. Laissez mijoter doucement 20 minutes en remuant souvent pour que ça n'attache pas.",
    "Ajoutez le poisson fumé ou les crevettes et les feuilles de ndolé, mélangez et laissez mijoter encore 10 minutes. Rectifiez l'assaisonnement.",
    "Faites dorer le second oignon émincé dans l'huile. Versez l'huile chaude et les oignons sur le ndolé juste avant de servir."
   ]
  },
  "serving": {
   "en": [
    "Serve hot with miondo, bobolo or fried ripe plantain.",
    "Top each plate with a spoonful of the fried onions.",
    "Ndolé is even better the next day and keeps 3 days in the fridge."
   ],
   "fr": [
    "Servez chaud avec du miondo, du bâton de manioc ou du plantain mûr frit.",
    "Garnissez chaque assiette d'une cuillerée d'oignons frits.",
    "Le ndolé est encore meilleur le lendemain et se garde 3 jours au frais."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "ndomba": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 75,
  "servings": 6,
  "ingredients": {
   "en": [
    "1.5 kg fish (carp, bar) or chicken, in pieces",
    "2 onions",
    "4 cloves garlic",
    "1 thumb of fresh ginger",
    "2 tomatoes",
    "1 tsp pebe",
    "1 tsp njansang",
    "1 small bunch of basil or parsley",
    "1 hot pepper",
    "3 tbsp oil",
    "2 stock cubes, salt",
    "Banana leaves and kitchen string"
   ],
   "fr": [
    "1,5 kg de poisson (carpe, bar) ou de poulet en morceaux",
    "2 oignons",
    "4 gousses d'ail",
    "1 morceau de gingembre frais",
    "2 tomates",
    "1 c. à café de pèbè",
    "1 c. à café de njansang",
    "1 petite botte de basilic ou de persil",
    "1 piment",
    "3 c. à soupe d'huile",
    "2 cubes d'assaisonnement, sel",
    "Des feuilles de bananier et de la ficelle"
   ]
  },
  "steps": {
   "en": [
    "Blend the onions, garlic, ginger, tomatoes, spices, herbs, pepper, oil, stock cubes and salt into a thick paste.",
    "Coat the fish or chicken with the paste and leave for 30 minutes.",
    "Soften the banana leaves over a flame. Place 1 or 2 pieces with plenty of paste in the middle of two crossed leaves, fold into a parcel and tie with string.",
    "Set the parcels in a pot on a bed of leaves or stalks, add a glass of water, cover and steam on low heat for about 1 hour (40 minutes for fish). Or bake them at 180 °C for 1 hour.",
    "The ndomba is ready when the parcels are puffed up and the meat is tender."
   ],
   "fr": [
    "Mixez les oignons, l'ail, le gingembre, les tomates, les épices, les herbes, le piment, l'huile, les cubes et le sel en une pâte épaisse.",
    "Enrobez le poisson ou le poulet de cette pâte et laissez reposer 30 minutes.",
    "Assouplissez les feuilles de bananier au-dessus d'une flamme. Déposez 1 ou 2 morceaux avec beaucoup de pâte au centre de deux feuilles croisées, fermez en papillote et ficelez.",
    "Posez les papillotes dans une marmite sur un lit de feuilles ou de tiges, ajoutez un verre d'eau, couvrez et faites cuire à la vapeur à feu doux environ 1 heure (40 minutes pour le poisson). Ou au four à 180 °C pendant 1 heure.",
    "Le ndomba est prêt quand les papillotes sont gonflées et la viande tendre."
   ]
  },
  "serving": {
   "en": [
    "Bring the parcels to the table and open them on each plate.",
    "With boiled plantain, bobolo or macabo."
   ],
   "fr": [
    "Apportez les papillotes à table et ouvrez-les dans chaque assiette.",
    "Avec du plantain bouilli, du bâton de manioc ou du macabo."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "oeuf-bouillie": {
  "tags": [
   "budget",
   "quick",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 1,
  "cookMinutes": 10,
  "servings": 1,
  "ingredients": {
   "en": [
    "2 eggs",
    "Water",
    "A pinch of salt"
   ],
   "fr": [
    "2 œufs",
    "De l'eau",
    "Une pincée de sel"
   ]
  },
  "steps": {
   "en": [
    "Put the eggs in a small pot and cover them with cold water.",
    "Bring to a boil, then lower the heat: 6 minutes for soft, 10 minutes for hard.",
    "Cool the eggs in cold water for 1 minute, then peel and season."
   ],
   "fr": [
    "Mettez les œufs dans une petite casserole et couvrez-les d'eau froide.",
    "Portez à ébullition puis baissez le feu : 6 minutes pour mollets, 10 minutes pour durs.",
    "Refroidissez les œufs 1 minute dans l'eau froide, écalez et assaisonnez."
   ]
  },
  "serving": {
   "en": [
    "Serve with bread and butter, or sliced over avocado."
   ],
   "fr": [
    "Servez avec du pain beurré, ou en rondelles sur de l'avocat."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "okok-sale": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 40,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g shredded okok (gnetum) leaves",
    "1 kg palm nuts (or 400 ml palm nut cream)",
    "300 g peanut paste",
    "300 g smoked fish",
    "1 hot pepper (optional)",
    "2 stock cubes, salt"
   ],
   "fr": [
    "500 g de feuilles d'okok émincées",
    "1 kg de noix de palme (ou 400 ml de crème de noix de palme)",
    "300 g de pâte d'arachide",
    "300 g de poisson fumé",
    "1 piment (facultatif)",
    "2 cubes d'assaisonnement, sel"
   ]
  },
  "steps": {
   "en": [
    "Boil the palm nuts for 30 minutes, pound them and squeeze them in warm water to get the juice. Strain it.",
    "Wash the okok leaves. If they're thick, pound them lightly in a mortar.",
    "Bring the palm nut juice to a boil and cook for 15 minutes.",
    "Add the okok and cook for 20 minutes, stirring.",
    "Loosen the peanut paste with a little warm water and stir it in with the smoked fish, stock cubes, salt and pepper.",
    "Simmer 15 more minutes until thick."
   ],
   "fr": [
    "Faites bouillir les noix de palme 30 minutes, pilez-les et pressez-les dans de l'eau tiède pour en extraire le jus. Filtrez.",
    "Lavez les feuilles d'okok. Si elles sont épaisses, pilez-les légèrement au mortier.",
    "Portez le jus de noix de palme à ébullition et laissez cuire 15 minutes.",
    "Ajoutez l'okok et laissez cuire 20 minutes en remuant.",
    "Délayez la pâte d'arachide dans un peu d'eau tiède et ajoutez-la avec le poisson fumé, les cubes, le sel et le piment.",
    "Laissez mijoter encore 15 minutes jusqu'à ce que ce soit épais."
   ]
  },
  "serving": {
   "en": [
    "Traditionally served with bobolo or miondo.",
    "Serve warm."
   ],
   "fr": [
    "Traditionnellement servi avec du bâton de manioc ou du miondo.",
    "Servez tiède."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pain-perdu": {
  "tags": [
   "budget",
   "quick",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 5,
  "cookMinutes": 10,
  "servings": 2,
  "ingredients": {
   "en": [
    "4 slices of bread (day-old is best)",
    "2 eggs",
    "150 ml milk",
    "2 tbsp sugar",
    "1 pinch of cinnamon or vanilla",
    "1 tbsp butter or oil"
   ],
   "fr": [
    "4 tranches de pain (rassis, c'est mieux)",
    "2 œufs",
    "150 ml de lait",
    "2 c. à soupe de sucre",
    "1 pincée de cannelle ou de vanille",
    "1 c. à soupe de beurre ou d'huile"
   ]
  },
  "steps": {
   "en": [
    "Whisk the eggs, milk, sugar and cinnamon in a shallow dish.",
    "Soak each slice of bread for a few seconds on each side.",
    "Cook in a hot buttered pan for 2 to 3 minutes per side until golden."
   ],
   "fr": [
    "Fouettez les œufs, le lait, le sucre et la cannelle dans un plat creux.",
    "Trempez chaque tranche de pain quelques secondes de chaque côté.",
    "Faites dorer dans une poêle chaude beurrée 2 à 3 minutes par face."
   ]
  },
  "serving": {
   "en": [
    "Serve warm, plain or with fruit and a drizzle of honey."
   ],
   "fr": [
    "Servez tiède, nature ou avec des fruits et un filet de miel."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pile-pommes": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 20,
  "cookMinutes": 75,
  "servings": 6,
  "ingredients": {
   "en": [
    "1.5 kg potatoes",
    "500 g red beans, soaked overnight",
    "200 ml red palm oil",
    "1 onion",
    "1 hot pepper (optional)",
    "1 stock cube, salt"
   ],
   "fr": [
    "1,5 kg de pommes de terre",
    "500 g de haricots rouges trempés la veille",
    "200 ml d'huile de palme rouge",
    "1 oignon",
    "1 piment (facultatif)",
    "1 cube d'assaisonnement, sel"
   ]
  },
  "steps": {
   "en": [
    "Cook the soaked beans in fresh water until very soft, about 1 hour. Add salt at the end.",
    "Peel the potatoes and boil them in salted water for 20 minutes until soft. Drain, keeping a little of the water.",
    "Heat the palm oil with the sliced onion and pepper for 3 minutes, without letting it smoke.",
    "Pound or mash the potatoes with the beans, adding the hot palm oil and a little cooking water, until you get a smooth orange mash with whole beans in it.",
    "Season with the stock cube and salt."
   ],
   "fr": [
    "Faites cuire les haricots trempés dans de l'eau propre jusqu'à ce qu'ils soient très tendres, environ 1 heure. Salez à la fin.",
    "Épluchez les pommes de terre et faites-les bouillir 20 minutes dans de l'eau salée. Égouttez en gardant un peu d'eau.",
    "Chauffez l'huile de palme avec l'oignon émincé et le piment 3 minutes, sans la faire fumer.",
    "Pilez ou écrasez les pommes de terre avec les haricots en ajoutant l'huile chaude et un peu d'eau de cuisson, jusqu'à obtenir une purée orange et lisse avec des haricots entiers.",
    "Assaisonnez avec le cube et le sel."
   ]
  },
  "serving": {
   "en": [
    "Serve in a bowl with a drizzle of palm oil on top.",
    "Add a piece of fish or meat if you like, or eat it just as it is."
   ],
   "fr": [
    "Servez dans un bol avec un filet d'huile de palme dessus.",
    "Ajoutez un morceau de poisson ou de viande si vous voulez, ou mangez-le tel quel."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "poisson-braise": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "2 whole fish (bar, sea bream, carp or mackerel), cleaned",
    "1 onion",
    "4 cloves garlic",
    "1 thumb of fresh ginger",
    "1 small bunch of parsley",
    "A few basil leaves",
    "1 celery stalk or 1 leek",
    "1 tsp ground pebe (optional)",
    "1 hot pepper",
    "1 stock cube, salt",
    "4 tbsp oil",
    "Juice of 1 lime"
   ],
   "fr": [
    "2 poissons entiers (bar, dorade, carpe ou maquereau), vidés",
    "1 oignon",
    "4 gousses d'ail",
    "1 morceau de gingembre frais",
    "1 petite botte de persil",
    "Quelques feuilles de basilic",
    "1 branche de céleri ou 1 poireau",
    "1 c. à café de pèbè moulu (facultatif)",
    "1 piment",
    "1 cube d'assaisonnement, sel",
    "4 c. à soupe d'huile",
    "Le jus d'un citron vert"
   ]
  },
  "steps": {
   "en": [
    "Clean and dry the fish, then make 3 deep cuts on each side.",
    "Blend the onion, garlic, ginger, parsley, basil, celery, pebe, pepper, stock cube, salt and oil into a green paste.",
    "Rub the fish with lime juice, then fill the cuts and coat the whole fish with the paste. Leave for 30 minutes, or a few hours in the fridge.",
    "Grill over hot charcoal (or under the oven grill) 12 to 15 minutes per side, brushing with the leftover marinade, until the flesh flakes.",
    "Fry any remaining paste for 2 minutes with a sliced onion to make a quick sauce."
   ],
   "fr": [
    "Nettoyez et séchez les poissons, puis faites 3 entailles profondes de chaque côté.",
    "Mixez l'oignon, l'ail, le gingembre, le persil, le basilic, le céleri, le pèbè, le piment, le cube, le sel et l'huile en une pâte verte.",
    "Frottez le poisson avec le jus de citron, puis remplissez les entailles et enrobez tout le poisson de pâte. Laissez reposer 30 minutes, ou quelques heures au frais.",
    "Faites griller sur la braise (ou sous le gril du four) 12 à 15 minutes de chaque côté en badigeonnant de marinade, jusqu'à ce que la chair se détache.",
    "Faites revenir le reste de pâte 2 minutes avec un oignon émincé pour une sauce rapide."
   ]
  },
  "serving": {
   "en": [
    "Serve with fried plantain, bobolo, miondo or fries.",
    "Add a fresh salad and a bowl of pepper sauce on the side.",
    "Eat it hot, straight off the grill."
   ],
   "fr": [
    "Servez avec du plantain frit, du bâton de manioc, du miondo ou des frites.",
    "Ajoutez une salade fraîche et un bol de piment à côté.",
    "À manger bien chaud, à la sortie du feu."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "porc-dg": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg pork (shoulder or ribs), in pieces",
    "5 ripe plantains (still firm)",
    "2 carrots",
    "150 g green beans",
    "1 green bell pepper",
    "2 onions",
    "3 tomatoes",
    "4 cloves garlic",
    "1 thumb of fresh ginger",
    "1 leek",
    "2 stock cubes, salt, black pepper",
    "Oil for frying"
   ],
   "fr": [
    "1 kg de porc (échine ou travers) en morceaux",
    "5 plantains mûrs (encore fermes)",
    "2 carottes",
    "150 g de haricots verts",
    "1 poivron vert",
    "2 oignons",
    "3 tomates",
    "4 gousses d'ail",
    "1 morceau de gingembre frais",
    "1 poireau",
    "2 cubes d'assaisonnement, sel, poivre",
    "De l'huile pour la friture"
   ]
  },
  "steps": {
   "en": [
    "Season the pork with garlic, ginger, a stock cube, salt and pepper. Cook it in a little water for 30 to 35 minutes until tender.",
    "Drain the pork (keep the broth) and fry it until golden and crisp at the edges.",
    "Fry the plantain slices until golden.",
    "In a large pot, fry the onions, then add the tomatoes, carrots, green beans, bell pepper and leek. Cook for 8 minutes.",
    "Add the pork and half a cup of broth and simmer for 10 minutes.",
    "Fold in the plantains and cook for 5 more minutes."
   ],
   "fr": [
    "Assaisonnez le porc avec l'ail, le gingembre, un cube, du sel et du poivre. Faites-le cuire 30 à 35 minutes dans un peu d'eau jusqu'à ce qu'il soit tendre.",
    "Égouttez le porc (gardez le bouillon) et faites-le frire jusqu'à ce qu'il soit doré et croustillant sur les bords.",
    "Faites frire les rondelles de plantain jusqu'à ce qu'elles soient dorées.",
    "Dans une grande marmite, faites revenir les oignons, puis ajoutez les tomates, les carottes, les haricots verts, le poivron et le poireau. Laissez cuire 8 minutes.",
    "Ajoutez le porc et une demi-tasse de bouillon et laissez mijoter 10 minutes.",
    "Incorporez les plantains et laissez cuire encore 5 minutes."
   ]
  },
  "serving": {
   "en": [
    "A complete dish: serve hot, garnished with parsley."
   ],
   "fr": [
    "Un plat complet : servez chaud, parsemé de persil."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Similar: Fried pork and plantains (Precious Core)",
    "url": "https://www.preciouscore.com/fried-pork-and-plantains/"
   }
  ]
 },
 "poulet-braise": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 chicken (about 1.3 kg), cut in 4 or 8",
    "1 onion",
    "4 cloves garlic",
    "1 thumb of fresh ginger",
    "1 small bunch of parsley",
    "1 celery stalk or 1 leek",
    "1 tbsp mustard",
    "1 hot pepper",
    "1 stock cube, salt",
    "4 tbsp oil"
   ],
   "fr": [
    "1 poulet (environ 1,3 kg) coupé en 4 ou 8",
    "1 oignon",
    "4 gousses d'ail",
    "1 morceau de gingembre frais",
    "1 petite botte de persil",
    "1 branche de céleri ou 1 poireau",
    "1 c. à soupe de moutarde",
    "1 piment",
    "1 cube d'assaisonnement, sel",
    "4 c. à soupe d'huile"
   ]
  },
  "steps": {
   "en": [
    "Make a few shallow cuts in the chicken pieces.",
    "Blend the onion, garlic, ginger, parsley, celery, pepper, mustard, stock cube, salt and oil.",
    "Coat the chicken with the marinade and leave it for at least 1 hour (overnight in the fridge is best).",
    "Optional, for juicy chicken: steam or boil the pieces for 10 minutes first.",
    "Grill over medium charcoal for 20 to 25 minutes, turning and brushing with marinade, until well browned and the juices run clear."
   ],
   "fr": [
    "Faites quelques entailles peu profondes dans les morceaux de poulet.",
    "Mixez l'oignon, l'ail, le gingembre, le persil, le céleri, le piment, la moutarde, le cube, le sel et l'huile.",
    "Enrobez le poulet de marinade et laissez reposer au moins 1 heure (une nuit au frais, c'est encore mieux).",
    "Facultatif, pour un poulet bien moelleux : faites d'abord cuire les morceaux 10 minutes à la vapeur ou à l'eau.",
    "Faites griller sur une braise moyenne 20 à 25 minutes en retournant et en badigeonnant de marinade, jusqu'à ce que le poulet soit bien doré et que le jus soit clair."
   ]
  },
  "serving": {
   "en": [
    "Serve with fried plantain, fries or bobolo.",
    "Add raw onion rings, and pepper sauce or mayonnaise on the side."
   ],
   "fr": [
    "Servez avec du plantain frit, des frites ou du bâton de manioc.",
    "Ajoutez des rondelles d'oignon cru, et du piment ou de la mayonnaise à côté."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "poulet-dg": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 50,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 chicken (about 1.5 kg), in pieces",
    "5 ripe plantains (still firm)",
    "3 carrots",
    "200 g green beans",
    "1 green bell pepper",
    "2 onions",
    "3 tomatoes",
    "4 cloves garlic",
    "1 thumb of fresh ginger",
    "1 leek or a few celery stalks",
    "2 stock cubes, salt, black pepper",
    "Oil for frying"
   ],
   "fr": [
    "1 poulet (environ 1,5 kg) en morceaux",
    "5 plantains mûrs (encore fermes)",
    "3 carottes",
    "200 g de haricots verts",
    "1 poivron vert",
    "2 oignons",
    "3 tomates",
    "4 gousses d'ail",
    "1 morceau de gingembre frais",
    "1 poireau ou quelques branches de céleri",
    "2 cubes d'assaisonnement, sel, poivre",
    "De l'huile pour la friture"
   ]
  },
  "steps": {
   "en": [
    "Season the chicken with garlic, ginger, a stock cube, salt and pepper. Leave for 20 minutes.",
    "Simmer the chicken in a little water for 15 minutes, then fry the pieces until golden. Keep the broth.",
    "Peel the plantains, cut them into thick slices and fry until golden. Drain.",
    "In a large pot, fry the onions, then add the chopped tomatoes, carrots, green beans, bell pepper and leek. Cook for 8 minutes.",
    "Add the chicken and a cup of broth, cover and simmer for 10 minutes.",
    "Gently fold in the plantains and cook 5 more minutes so they soak up the sauce without breaking. Season to taste."
   ],
   "fr": [
    "Assaisonnez le poulet avec l'ail, le gingembre, un cube, du sel et du poivre. Laissez reposer 20 minutes.",
    "Faites mijoter le poulet 15 minutes dans un peu d'eau, puis faites dorer les morceaux à la poêle. Gardez le bouillon.",
    "Épluchez les plantains, coupez-les en grosses rondelles et faites-les frire jusqu'à ce qu'ils soient dorés. Égouttez.",
    "Dans une grande marmite, faites revenir les oignons, puis ajoutez les tomates hachées, les carottes, les haricots verts, le poivron et le poireau. Laissez cuire 8 minutes.",
    "Ajoutez le poulet et une tasse de bouillon, couvrez et laissez mijoter 10 minutes.",
    "Incorporez délicatement les plantains et laissez cuire encore 5 minutes pour qu'ils prennent la sauce sans se casser. Rectifiez l'assaisonnement."
   ]
  },
  "serving": {
   "en": [
    "A complete meal on its own, with plantain and vegetables.",
    "Garnish with chopped parsley.",
    "A favorite for Sunday lunch and celebrations."
   ],
   "fr": [
    "Un plat complet à lui seul, avec le plantain et les légumes.",
    "Parsemez de persil haché.",
    "Le plat préféré des dimanches et des fêtes."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "riz-gras": {
  "tags": [
   "occasion",
   "kids"
  ],
  "prepMinutes": 20,
  "cookMinutes": 45,
  "servings": 6,
  "ingredients": {
   "en": [
    "600 g long-grain rice",
    "500 g chicken or beef",
    "4 tomatoes (or 3 tbsp tomato paste)",
    "2 onions",
    "1 red bell pepper",
    "3 cloves garlic",
    "1 thumb of fresh ginger",
    "2 carrots, diced",
    "100 g green beans, cut",
    "1 bay leaf",
    "100 ml oil",
    "2 stock cubes, salt, black pepper"
   ],
   "fr": [
    "600 g de riz long grain",
    "500 g de poulet ou de bœuf",
    "4 tomates (ou 3 c. à soupe de concentré)",
    "2 oignons",
    "1 poivron rouge",
    "3 gousses d'ail",
    "1 morceau de gingembre frais",
    "2 carottes en dés",
    "100 g de haricots verts coupés",
    "1 feuille de laurier",
    "100 ml d'huile",
    "2 cubes d'assaisonnement, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Cook the meat with half an onion, the garlic, ginger, a stock cube and salt. Keep 1 litre of broth.",
    "Blend the tomatoes, the rest of the onions and the bell pepper.",
    "Heat the oil and fry the meat until golden, then set it aside. Fry the blended mix in the same oil for 15 minutes, until it darkens and the oil rises to the top.",
    "Add the rinsed rice and stir to coat it. Pour in the broth and add the bay leaf, carrots, green beans, second stock cube and salt. The liquid should sit just above the rice.",
    "Cover and cook on low heat for 20 to 25 minutes until the rice is tender, stirring once halfway. Put the meat back on top for the last 5 minutes."
   ],
   "fr": [
    "Faites cuire la viande avec un demi-oignon, l'ail, le gingembre, un cube et du sel. Gardez 1 litre de bouillon.",
    "Mixez les tomates, le reste des oignons et le poivron.",
    "Chauffez l'huile et faites dorer la viande, puis réservez-la. Faites revenir le mélange mixé dans la même huile 15 minutes, jusqu'à ce qu'il fonce et que l'huile remonte.",
    "Ajoutez le riz rincé et mélangez pour bien l'enrober. Versez le bouillon et ajoutez le laurier, les carottes, les haricots verts, le second cube et le sel. Le liquide doit arriver juste au-dessus du riz.",
    "Couvrez et laissez cuire à feu doux 20 à 25 minutes jusqu'à ce que le riz soit tendre, en remuant une fois à mi-cuisson. Remettez la viande dessus pour les 5 dernières minutes."
   ]
  },
  "serving": {
   "en": [
    "Serve with fried ripe plantain and a fresh salad.",
    "A party favorite: it's easy to cook in big pots."
   ],
   "fr": [
    "Servez avec du plantain mûr frit et une salade fraîche.",
    "Un incontournable des fêtes : facile à préparer en grande quantité."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "salade-de-fruits": {
  "tags": [
   "quick",
   "kids",
   "vegetarian",
   "occasion"
  ],
  "prepMinutes": 15,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 ripe mango",
    "¼ pineapple",
    "2 bananas",
    "1 orange",
    "1 passion fruit (optional)",
    "1 tbsp sugar or honey (optional)"
   ],
   "fr": [
    "1 mangue mûre",
    "¼ d'ananas",
    "2 bananes",
    "1 orange",
    "1 fruit de la passion (facultatif)",
    "1 c. à soupe de sucre ou de miel (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Peel the mango, pineapple and bananas and cut them into bite-size pieces.",
    "Squeeze half the orange over the fruit and cut the other half into pieces.",
    "Add the passion fruit pulp and sugar, mix gently and chill for 15 minutes."
   ],
   "fr": [
    "Épluchez la mangue, l'ananas et les bananes et coupez-les en morceaux.",
    "Pressez la moitié de l'orange sur les fruits et coupez l'autre moitié en morceaux.",
    "Ajoutez la pulpe de passion et le sucre, mélangez doucement et réservez 15 minutes au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve chilled in small glasses or bowls."
   ],
   "fr": [
    "Servez bien frais dans des verrines ou des bols."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "sauce-d-arachide": {
  "tags": [],
  "prepMinutes": 20,
  "cookMinutes": 50,
  "servings": 6,
  "ingredients": {
   "en": [
    "400 g roasted peanut paste",
    "1 chicken (about 1.2 kg) in pieces, or 800 g beef",
    "3 tomatoes",
    "2 onions",
    "3 cloves garlic",
    "1 thumb of fresh ginger",
    "1 hot pepper",
    "2 stock cubes, salt",
    "1 litre water"
   ],
   "fr": [
    "400 g de pâte d'arachide grillée",
    "1 poulet (environ 1,2 kg) en morceaux, ou 800 g de bœuf",
    "3 tomates",
    "2 oignons",
    "3 gousses d'ail",
    "1 morceau de gingembre frais",
    "1 piment",
    "2 cubes d'assaisonnement, sel",
    "1 litre d'eau"
   ]
  },
  "steps": {
   "en": [
    "Season the meat with garlic, ginger, half an onion, a stock cube and salt. Cook it in the water for 20 minutes.",
    "Blend the tomatoes, the rest of the onions and the pepper. Add them to the pot and cook for 10 minutes.",
    "Loosen the peanut paste with a ladle of hot broth until smooth, then stir it into the pot.",
    "Simmer on low heat for 25 to 30 minutes, stirring often, until a layer of red oil appears on top.",
    "Adjust the salt, and the thickness with a little water."
   ],
   "fr": [
    "Assaisonnez la viande avec l'ail, le gingembre, un demi-oignon, un cube et du sel. Faites-la cuire 20 minutes dans l'eau.",
    "Mixez les tomates, le reste des oignons et le piment. Ajoutez-les et laissez cuire 10 minutes.",
    "Délayez la pâte d'arachide dans une louche de bouillon chaud jusqu'à ce qu'elle soit lisse, puis versez-la dans la marmite.",
    "Laissez mijoter à feu doux 25 à 30 minutes en remuant souvent, jusqu'à ce qu'une couche d'huile rouge apparaisse en surface.",
    "Rectifiez le sel, et l'épaisseur avec un peu d'eau."
   ]
  },
  "serving": {
   "en": [
    "Serve with white rice, boiled plantain, yam or macabo.",
    "Keeps 3 days in the fridge; reheat gently with a splash of water."
   ],
   "fr": [
    "Servez avec du riz blanc, du plantain, de l'igname ou du macabo bouillis.",
    "Se garde 3 jours au frais ; réchauffez doucement avec un peu d'eau."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "taro-sauce-jaune": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 90,
  "servings": 6,
  "ingredients": {
   "en": [
    "2 kg taro",
    "300 ml red palm oil",
    "1 tsp limestone powder (kanwa), dissolved in 200 ml warm water",
    "3 tbsp ground achu spices",
    "1 kg beef with cow skin or tripe",
    "1 hot pepper",
    "2 stock cubes, salt",
    "Njama-njama or spinach, sautéed (optional, to serve)"
   ],
   "fr": [
    "2 kg de taro",
    "300 ml d'huile de palme rouge",
    "1 c. à café de sel gemme (kanwa) dissous dans 200 ml d'eau tiède",
    "3 c. à soupe d'épices pour taro (achu) moulues",
    "1 kg de bœuf avec peau ou tripes",
    "1 piment",
    "2 cubes d'assaisonnement, sel",
    "Du njama-njama ou des épinards sautés (facultatif, pour servir)"
   ]
  },
  "steps": {
   "en": [
    "Boil the meat with salt and a stock cube until tender, about 45 minutes. Keep 500 ml of broth.",
    "Boil the taro in its skin for 40 to 60 minutes until soft. Peel it while hot and pound it into a smooth, stretchy paste, adding a little warm water if needed.",
    "Let the limestone water settle, then pour off the clear water and keep it.",
    "Pour the palm oil into a large bowl. Slowly add the clear limestone water while stirring, until the oil turns thick and yellow.",
    "Add the broth mixed with the achu spices, pepper and the second stock cube, a little at a time, stirring until the sauce is smooth and creamy.",
    "Add the meat to the sauce."
   ],
   "fr": [
    "Faites cuire la viande avec du sel et un cube jusqu'à ce qu'elle soit tendre, environ 45 minutes. Gardez 500 ml de bouillon.",
    "Faites bouillir le taro avec la peau 40 à 60 minutes jusqu'à ce qu'il soit tendre. Épluchez-le chaud et pilez-le en une pâte lisse et élastique, avec un peu d'eau tiède si besoin.",
    "Laissez reposer l'eau de kanwa, puis récupérez l'eau claire du dessus.",
    "Versez l'huile de palme dans un grand bol. Ajoutez lentement l'eau de kanwa en remuant, jusqu'à ce que l'huile devienne épaisse et jaune.",
    "Ajoutez petit à petit le bouillon mélangé aux épices, au piment et au second cube, en remuant jusqu'à obtenir une sauce lisse et crémeuse.",
    "Ajoutez la viande dans la sauce."
   ]
  },
  "serving": {
   "en": [
    "Shape the taro into a ring on the plate, pour the yellow sauce in the middle and add the meat.",
    "Eat with your fingers, with sautéed njama-njama on the side."
   ],
   "fr": [
    "Formez une couronne de taro dans l'assiette, versez la sauce jaune au milieu et ajoutez la viande.",
    "Se mange avec les doigts, accompagné de njama-njama sauté."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "tiger-nuts-juice": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 20,
  "cookMinutes": 0,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g dried tiger nuts",
    "1.5 litres water",
    "6 to 8 pitted dates, or 4 tbsp sugar",
    "1 small piece of ginger (optional)",
    "½ coconut, grated (optional)",
    "1 pinch of cinnamon"
   ],
   "fr": [
    "500 g de souchet séché (tiger nuts)",
    "1,5 litre d'eau",
    "6 à 8 dattes dénoyautées, ou 4 c. à soupe de sucre",
    "1 petit morceau de gingembre (facultatif)",
    "½ noix de coco râpée (facultatif)",
    "1 pincée de cannelle"
   ]
  },
  "steps": {
   "en": [
    "Wash the tiger nuts and soak them in water for 24 hours, changing the water once.",
    "Drain, then blend them with the dates, ginger, coconut and half of the water until very smooth.",
    "Strain through a fine cloth or sieve, squeezing well. Blend the pulp again with the rest of the water and strain again.",
    "Add the cinnamon, taste and sweeten if needed.",
    "Chill for at least 2 hours."
   ],
   "fr": [
    "Lavez le souchet et faites-le tremper 24 heures en changeant l'eau une fois.",
    "Égouttez, puis mixez-le avec les dattes, le gingembre, la noix de coco et la moitié de l'eau jusqu'à ce que ce soit très lisse.",
    "Filtrez dans un linge fin ou une passoire en pressant bien. Mixez la pulpe avec le reste de l'eau et filtrez à nouveau.",
    "Ajoutez la cannelle, goûtez et sucrez si besoin.",
    "Mettez au frais au moins 2 heures."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold and shake well before pouring.",
    "Keeps 2 days in the fridge."
   ],
   "fr": [
    "Servez bien frais et secouez avant de verser.",
    "Se garde 2 jours au frais."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 }
}
$chop$::jsonb) as r
on conflict (slug) do nothing;
