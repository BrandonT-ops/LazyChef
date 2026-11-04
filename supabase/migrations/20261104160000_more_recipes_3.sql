-- 131 recipes from content/recipes. Existing rows are left untouched.
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
 "avocat": {
  "tags": [
   "quick",
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 3,
  "cookMinutes": 0,
  "servings": 2,
  "ingredients": {
   "en": [
    "1 ripe avocado",
    "Salt and a pinch of chili",
    "A squeeze of lime (optional)"
   ],
   "fr": [
    "1 avocat mûr",
    "Sel et une pincée de piment",
    "Un filet de citron vert (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Cut the avocado in two around the stone and twist to open.",
    "Remove the stone with a spoon.",
    "Sprinkle with salt, chili and lime and eat with a spoon, or slice it."
   ],
   "fr": [
    "Coupez l'avocat en deux autour du noyau et tournez pour l'ouvrir.",
    "Retirez le noyau avec une cuillère.",
    "Saupoudrez de sel, de piment et de citron et mangez à la cuillère, ou tranchez-le."
   ]
  },
  "serving": {
   "en": [
    "With bread, boiled plantain, cassava or beans."
   ],
   "fr": [
    "Avec du pain, du plantain bouilli, du manioc ou des haricots."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "beafteak": {
  "tags": [
   "quick",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 10,
  "servings": 2,
  "ingredients": {
   "en": [
    "2 beef steaks (about 2 cm thick)",
    "2 cloves garlic, crushed",
    "1 tbsp oil + 1 tbsp butter",
    "Salt, black pepper",
    "Thyme or rosemary (optional)"
   ],
   "fr": [
    "2 steaks de bœuf (environ 2 cm d'épaisseur)",
    "2 gousses d'ail écrasées",
    "1 c. à soupe d'huile + 1 c. à soupe de beurre",
    "Sel, poivre noir",
    "Thym ou romarin (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Take the steaks out of the fridge 20 minutes before; pat them dry and season.",
    "Heat the oil in a heavy pan until very hot.",
    "Cook the steaks 2 to 3 minutes per side for medium (longer for well done) without moving them.",
    "Add the butter, garlic and herbs and spoon the foaming butter over the meat for 1 minute.",
    "Rest 5 minutes before cutting."
   ],
   "fr": [
    "Sortez les steaks du frigo 20 minutes avant ; séchez-les et assaisonnez.",
    "Chauffez l'huile dans une poêle épaisse jusqu'à ce qu'elle soit très chaude.",
    "Faites cuire les steaks 2 à 3 minutes de chaque côté pour à point (plus longtemps pour bien cuit) sans les bouger.",
    "Ajoutez le beurre, l'ail et les herbes et arrosez la viande du beurre moussant pendant 1 minute.",
    "Laissez reposer 5 minutes avant de couper."
   ]
  },
  "serving": {
   "en": [
    "Serve with fries, pommes sautées, plantain or salad."
   ],
   "fr": [
    "Servez avec des frites, des pommes sautées, du plantain ou une salade."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "beignets-de-riz": {
  "tags": [
   "budget",
   "vegetarian",
   "snack",
   "kids"
  ],
  "prepMinutes": 15,
  "cookMinutes": 15,
  "servings": 6,
  "ingredients": {
   "en": [
    "2 cups cooked rice (leftover is perfect)",
    "1 cup flour",
    "1 tsp baking powder",
    "3 tbsp sugar",
    "1 egg",
    "100 ml milk",
    "1 pinch nutmeg or vanilla",
    "Oil for frying"
   ],
   "fr": [
    "2 tasses de riz cuit (un reste est parfait)",
    "1 tasse de farine",
    "1 c. à café de levure chimique",
    "3 c. à soupe de sucre",
    "1 œuf",
    "100 ml de lait",
    "1 pincée de muscade ou de vanille",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Mash the rice roughly with a fork (or pulse it in a blender).",
    "Mix in the flour, baking powder, sugar, egg, milk and flavouring to make a thick batter.",
    "Drop spoonfuls into medium-hot oil and fry 3 to 4 minutes, turning, until golden.",
    "Drain and dust with sugar if you like."
   ],
   "fr": [
    "Écrasez grossièrement le riz à la fourchette (ou mixez-le rapidement).",
    "Ajoutez la farine, la levure, le sucre, l'œuf, le lait et l'arôme pour obtenir une pâte épaisse.",
    "Déposez des cuillerées dans une huile moyennement chaude et faites frire 3 à 4 minutes en retournant, jusqu'à ce qu'elles soient dorées.",
    "Égouttez et saupoudrez de sucre si vous voulez."
   ]
  },
  "serving": {
   "en": [
    "Serve warm with tea or bouillie."
   ],
   "fr": [
    "Servez tiède avec du thé ou de la bouillie."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "beignets-koki": {
  "tags": [
   "budget",
   "vegetarian",
   "snack"
  ],
  "prepMinutes": 30,
  "cookMinutes": 20,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g black-eyed beans",
    "1 onion",
    "1 hot pepper",
    "1 tsp salt",
    "Oil for frying"
   ],
   "fr": [
    "500 g de haricots cornille (niébé)",
    "1 oignon",
    "1 piment",
    "1 c. à café de sel",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Soak the beans 2 hours (or overnight), then rub them between your hands and float off the skins. Rinse until white.",
    "Blend the beans with the onion, pepper and very little water into a thick, smooth paste.",
    "Whisk the paste hard for 3 to 5 minutes to add air (it should get lighter), then add the salt.",
    "Drop spoonfuls into hot oil and fry 3 to 4 minutes, turning, until golden. Drain on paper."
   ],
   "fr": [
    "Faites tremper les haricots 2 heures (ou une nuit), puis frottez-les entre vos mains et éliminez les peaux qui flottent. Rincez jusqu'à ce qu'ils soient blancs.",
    "Mixez les haricots avec l'oignon, le piment et très peu d'eau en une pâte épaisse et lisse.",
    "Battez fort la pâte 3 à 5 minutes pour l'aérer (elle doit s'alléger), puis salez.",
    "Déposez des cuillerées dans l'huile chaude et faites frire 3 à 4 minutes en retournant, jusqu'à ce qu'elles soient dorées. Égouttez sur du papier."
   ]
  },
  "serving": {
   "en": [
    "Serve hot with bouillie or bread, and a chili sauce."
   ],
   "fr": [
    "Servez chaud avec de la bouillie ou du pain, et une sauce pimentée."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Bénin Web TV – Beignets de haricot (ata)",
    "url": "https://beninwebtv.bj/cuisine-recette-de-beignet-de-haricot-blanc-ata-photo/"
   },
   {
    "label": "Afrik – Beignets-haricots",
    "url": "https://www.afrik.com/beignets-haricots-le-plat-mythique-des-camerounais"
   }
  ]
 },
 "beignets-manioc-banane": {
  "tags": [
   "budget",
   "vegetarian",
   "snack",
   "kids"
  ],
  "prepMinutes": 20,
  "cookMinutes": 15,
  "servings": 6,
  "ingredients": {
   "en": [
    "600 g fresh cassava, grated and squeezed (or cassava dough)",
    "4 very ripe bananas",
    "2 tbsp sugar",
    "1 pinch salt",
    "2 tbsp flour (if needed)",
    "Oil for frying"
   ],
   "fr": [
    "600 g de manioc frais râpé et pressé (ou de pâte de manioc)",
    "4 bananes très mûres",
    "2 c. à soupe de sucre",
    "1 pincée de sel",
    "2 c. à soupe de farine (si besoin)",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Mash the bananas into a smooth purée.",
    "Mix with the squeezed cassava, sugar and salt. Add a little flour if it's too soft to hold.",
    "Shape small balls with wet hands (or drop spoonfuls).",
    "Fry in medium-hot oil 5 to 7 minutes, turning, until deep golden. Drain."
   ],
   "fr": [
    "Écrasez les bananes en purée lisse.",
    "Mélangez avec le manioc pressé, le sucre et le sel. Ajoutez un peu de farine si c'est trop mou pour tenir.",
    "Formez de petites boules avec les mains mouillées (ou déposez des cuillerées).",
    "Faites frire dans une huile moyennement chaude 5 à 7 minutes en retournant, jusqu'à ce qu'elles soient bien dorées. Égouttez."
   ]
  },
  "serving": {
   "en": [
    "A sweet snack: serve warm with tea, bouillie or juice."
   ],
   "fr": [
    "Un snack sucré : servez tiède avec du thé, de la bouillie ou du jus."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "International Cuisine – Banana fritters (CAR)",
    "url": "https://www.internationalcuisine.com/?p=3758"
   }
  ]
 },
 "beignets-manioc-simple": {
  "tags": [
   "budget",
   "vegetarian",
   "snack"
  ],
  "prepMinutes": 20,
  "cookMinutes": 15,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg fresh cassava (or 600 g fermented cassava dough)",
    "3 tbsp sugar (optional)",
    "½ tsp salt",
    "Oil for frying"
   ],
   "fr": [
    "1 kg de manioc frais (ou 600 g de pâte de manioc fermentée)",
    "3 c. à soupe de sucre (facultatif)",
    "½ c. à café de sel",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Peel the cassava, remove the central fibre, and grate it finely (or use ready dough).",
    "Squeeze the grated cassava in a cloth to remove as much liquid as you can.",
    "Mix with the salt (and sugar), then shape small balls or flat cakes with wet hands.",
    "Fry in medium-hot oil 6 to 8 minutes, turning, until crisp and golden all over."
   ],
   "fr": [
    "Épluchez le manioc, retirez la fibre centrale et râpez-le finement (ou utilisez de la pâte toute prête).",
    "Pressez le manioc râpé dans un linge pour enlever le plus de liquide possible.",
    "Mélangez avec le sel (et le sucre), puis façonnez de petites boules ou des galettes avec les mains mouillées.",
    "Faites frire dans une huile moyennement chaude 6 à 8 minutes en retournant, jusqu'à ce qu'elles soient croustillantes et dorées."
   ]
  },
  "serving": {
   "en": [
    "Serve hot with a chili sauce, or with bouillie for breakfast."
   ],
   "fr": [
    "Servez chaud avec une sauce pimentée, ou avec de la bouillie au petit-déjeuner."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Le Fooding – Beignets de manioc",
    "url": "https://lefooding.com/recettes/beignets-de-manioc-au-comte"
   }
  ]
 },
 "bhb": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 20,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "Beignets: 500 g flour, 7 g dry yeast, 80 g sugar, 1 pinch salt, about 300 ml warm water, oil for frying",
    "Beans: 500 g red or white beans (soaked overnight), 2 onions, 2 tomatoes, 100 ml oil, salt, pepper",
    "Bouillie: 150 g corn flour (or fermented corn paste), 1 litre water, 2 lemongrass stalks, sugar, juice of 1 lime"
   ],
   "fr": [
    "Beignets : 500 g de farine, 7 g de levure sèche, 80 g de sucre, 1 pincée de sel, environ 300 ml d'eau tiède, huile de friture",
    "Haricots : 500 g de haricots rouges ou blancs (trempés la veille), 2 oignons, 2 tomates, 100 ml d'huile, sel, piment",
    "Bouillie : 150 g de farine de maïs (ou de pâte de maïs fermentée), 1 litre d'eau, 2 tiges de citronnelle, sucre, jus d'1 citron vert"
   ]
  },
  "steps": {
   "en": [
    "Beans: cook the soaked beans until very soft (about 1 hour), salt and drain. Fry the onions in the oil, add the tomatoes and pepper, then the beans; cook 10 minutes.",
    "Beignets: mix the flour, yeast, sugar and salt, and add the water little by little to a soft, sticky dough. Beat it with your hand 5 minutes, cover and let it rise 1 hour.",
    "With wet fingers, drop small balls of dough into hot oil and fry 4 to 5 minutes, turning, until golden and puffed. Drain.",
    "Bouillie: boil 750 ml water with the lemongrass 10 minutes. Mix the corn flour with 250 ml cold water, pour it into the boiling water while whisking, and cook 10 minutes, stirring, until smooth. Remove the lemongrass; add sugar and lime to taste."
   ],
   "fr": [
    "Haricots : faites cuire les haricots trempés jusqu'à ce qu'ils soient très tendres (environ 1 heure), salez et égouttez. Faites revenir les oignons dans l'huile, ajoutez les tomates et le piment, puis les haricots ; laissez cuire 10 minutes.",
    "Beignets : mélangez la farine, la levure, le sucre et le sel, et ajoutez l'eau petit à petit pour une pâte souple et collante. Battez-la à la main 5 minutes, couvrez et laissez lever 1 heure.",
    "Avec les doigts mouillés, déposez de petites boules de pâte dans l'huile chaude et faites frire 4 à 5 minutes en retournant, jusqu'à ce qu'elles soient dorées et gonflées. Égouttez.",
    "Bouillie : faites bouillir 750 ml d'eau avec la citronnelle 10 minutes. Délayez la farine de maïs dans 250 ml d'eau froide, versez dans l'eau bouillante en fouettant, et laissez cuire 10 minutes en remuant jusqu'à ce que ce soit lisse. Retirez la citronnelle ; ajoutez sucre et citron à votre goût."
   ]
  },
  "serving": {
   "en": [
    "The classic Cameroonian breakfast: beignets and beans on a plate, with a cup of hot bouillie.",
    "Add chili sauce on the beans if you like."
   ],
   "fr": [
    "Le petit-déjeuner camerounais par excellence : beignets et haricots dans l'assiette, avec un bol de bouillie chaude.",
    "Ajoutez de la sauce pimentée sur les haricots si vous aimez."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Nkosi Agro – Beignet haricot et bouillie",
    "url": "https://www.nkosiagro.com/blogs/culture-africaine/beignet-haricot-et-bouille"
   },
   {
    "label": "Kelianfood – Beignet haricot",
    "url": "https://kelianfood.com/en/the-best-recipe-bignet-haricot-cameroon"
   },
   {
    "label": "Afrik – Beignets-haricots",
    "url": "https://www.afrik.com/beignets-haricots-le-plat-mythique-des-camerounais"
   },
   {
    "label": "Allodocteurs – BHB et santé",
    "url": "https://www.allodocteurs.fr/stars-du-petit-dejeuner-camerounais-les-beignets-haricots-sont-ils-vraiment-dangereux-pour-la-sante-44300.html"
   }
  ]
 },
 "biscuits-au-beurre": {
  "tags": [
   "kids",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 15,
  "cookMinutes": 15,
  "servings": 30,
  "ingredients": {
   "en": [
    "250 g flour",
    "125 g soft butter",
    "100 g sugar",
    "1 egg",
    "1 tsp vanilla",
    "1 pinch salt"
   ],
   "fr": [
    "250 g de farine",
    "125 g de beurre mou",
    "100 g de sucre",
    "1 œuf",
    "1 c. à café de vanille",
    "1 pincée de sel"
   ]
  },
  "steps": {
   "en": [
    "Beat the butter and sugar until pale and creamy.",
    "Add the egg and vanilla, then the flour and salt, and mix just until it forms a dough. Chill 30 minutes.",
    "Roll out 5 mm thick and cut shapes (or roll small balls and press flat).",
    "Bake at 180 °C for 10 to 12 minutes, until the edges are just golden. Cool on a rack."
   ],
   "fr": [
    "Battez le beurre et le sucre jusqu'à ce que le mélange blanchisse.",
    "Ajoutez l'œuf et la vanille, puis la farine et le sel, et mélangez juste assez pour former une pâte. Mettez 30 minutes au frais.",
    "Étalez sur 5 mm et découpez des formes (ou faites de petites boules aplaties).",
    "Faites cuire à 180 °C 10 à 12 minutes, jusqu'à ce que les bords soient à peine dorés. Laissez refroidir sur une grille."
   ]
  },
  "serving": {
   "en": [
    "Keep in a tin for up to a week."
   ],
   "fr": [
    "Se conservent une semaine dans une boîte en métal."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "biscuits-au-yaourt-et-pepites-de-chocolat": {
  "tags": [
   "kids",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 15,
  "cookMinutes": 15,
  "servings": 24,
  "ingredients": {
   "en": [
    "1 plain yogurt (125 g)",
    "1 yogurt-pot of sugar, 2 pots of flour (using the empty pot)",
    "50 g melted butter or oil",
    "1 egg",
    "1 tsp baking powder",
    "100 g chocolate chips"
   ],
   "fr": [
    "1 yaourt nature (125 g)",
    "1 pot de sucre, 2 pots de farine (avec le pot vide)",
    "50 g de beurre fondu ou d'huile",
    "1 œuf",
    "1 c. à café de levure chimique",
    "100 g de pépites de chocolat"
   ]
  },
  "steps": {
   "en": [
    "Mix the yogurt, sugar, egg and butter.",
    "Add the flour and baking powder and stir to a soft dough, then fold in the chocolate chips.",
    "Drop spoonfuls on a lined tray, spaced apart.",
    "Bake at 180 °C for 12 to 15 minutes until golden at the edges."
   ],
   "fr": [
    "Mélangez le yaourt, le sucre, l'œuf et le beurre.",
    "Ajoutez la farine et la levure et mélangez en pâte souple, puis incorporez les pépites.",
    "Déposez des cuillerées sur une plaque garnie de papier, bien espacées.",
    "Faites cuire à 180 °C 12 à 15 minutes jusqu'à ce que les bords soient dorés."
   ]
  },
  "serving": {
   "en": [
    "Let them cool on the tray; they firm up as they cool."
   ],
   "fr": [
    "Laissez-les refroidir sur la plaque ; ils durcissent en refroidissant."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "boeuf-dg": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 70,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg tender beef, in cubes",
    "6 ripe (yellow) plantains",
    "3 carrots, 1 handful green beans, 2 green peppers",
    "3 tomatoes, 2 onions, 3 cloves garlic, 1 piece ginger",
    "1 small bunch parsley, and celery or leek",
    "2 stock cubes, salt, pepper",
    "Oil for frying"
   ],
   "fr": [
    "1 kg de bœuf tendre en cubes",
    "6 plantains mûrs (jaunes)",
    "3 carottes, 1 poignée de haricots verts, 2 poivrons",
    "3 tomates, 2 oignons, 3 gousses d'ail, 1 morceau de gingembre",
    "1 petit bouquet de persil, et du céleri ou du poireau",
    "2 cubes, sel, piment",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Season the beef with blended garlic, ginger, half an onion, a cube and salt. Cook it covered in its own juice, then with a little water, until tender (about 40 minutes).",
    "Drain the beef (keep the juice) and fry it until golden.",
    "Peel the plantains, cut them in thick rounds and fry until golden. Drain.",
    "In a large pot, fry the rest of the onion, add the blended tomatoes and cook 10 minutes. Add the carrots, beans and peppers, the meat juice and the second cube; cook 10 minutes.",
    "Add the beef and the plantain, sprinkle with parsley and celery, and toss gently for 5 minutes so everything is coated without breaking."
   ],
   "fr": [
    "Assaisonnez le bœuf avec l'ail, le gingembre et un demi-oignon mixés, un cube et du sel. Faites cuire à couvert dans son jus, puis avec un peu d'eau, jusqu'à ce que ce soit tendre (environ 40 minutes).",
    "Égouttez la viande (gardez le jus) et faites-la dorer à la poêle.",
    "Épluchez les plantains, coupez-les en grosses rondelles et faites-les frire jusqu'à ce qu'ils soient dorés. Égouttez.",
    "Dans une grande marmite, faites revenir le reste de l'oignon, ajoutez les tomates mixées et laissez cuire 10 minutes. Ajoutez les carottes, haricots et poivrons, le jus de cuisson et le second cube ; laissez cuire 10 minutes.",
    "Ajoutez la viande et le plantain, parsemez de persil et de céleri, et mélangez délicatement 5 minutes pour tout enrober sans casser."
   ]
  },
  "serving": {
   "en": [
    "A complete party dish: serve as is, hot."
   ],
   "fr": [
    "Un plat de fête complet : servez tel quel, bien chaud."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "bora-bora-jus": {
  "tags": [
   "quick",
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 5,
  "cookMinutes": 0,
  "servings": 1,
  "ingredients": {
   "en": [
    "100 ml pineapple juice",
    "60 ml passion fruit juice",
    "10 ml lemon juice",
    "10 ml grenadine syrup",
    "Ice, a pineapple slice"
   ],
   "fr": [
    "10 cl de jus d'ananas",
    "6 cl de jus de fruit de la passion",
    "1 cl de jus de citron",
    "1 cl de sirop de grenadine",
    "Glaçons, une tranche d'ananas"
   ]
  },
  "steps": {
   "en": [
    "Fill a shaker (or a jar with a lid) with ice.",
    "Add the pineapple, passion and lemon juices and shake hard for 10 seconds.",
    "Strain into a tall glass over fresh ice.",
    "Pour the grenadine slowly down the side so it sinks to the bottom, and garnish with pineapple."
   ],
   "fr": [
    "Remplissez un shaker (ou un bocal avec couvercle) de glaçons.",
    "Ajoutez les jus d'ananas, de passion et de citron et secouez fort 10 secondes.",
    "Versez dans un grand verre sur des glaçons neufs.",
    "Versez la grenadine doucement le long du verre pour qu'elle tombe au fond, et décorez d'ananas."
   ]
  },
  "serving": {
   "en": [
    "An alcohol-free cocktail for parties and kids."
   ],
   "fr": [
    "Un cocktail sans alcool pour les fêtes et les enfants."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Circulaire en ligne – Cocktail Bora Bora",
    "url": "https://www.circulaire-en-ligne.ca/recette/cocktail-bora-bora-alcool"
   }
  ]
 },
 "bouillon-de-boeuf": {
  "tags": [],
  "prepMinutes": 15,
  "cookMinutes": 90,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg beef with bones (shin, ribs) and some cow foot or tripe",
    "2 tbsp ground njansang",
    "1 tbsp pepper-soup spice (country onion, white pepper, calabash nutmeg) or bush pepper",
    "3 cloves garlic, 1 piece ginger, 2 onions",
    "2 cubes, salt, 1 to 2 hot peppers",
    "A few basil (massep) leaves"
   ],
   "fr": [
    "1 kg de bœuf avec os (jarret, côtes) et un peu de pied ou de tripes",
    "2 c. à soupe de djansang moulu",
    "1 c. à soupe d'épices pour pèpè soup (rondelle, poivre blanc, pèbè) ou poivre de brousse",
    "3 gousses d'ail, 1 morceau de gingembre, 2 oignons",
    "2 cubes, sel, 1 à 2 piments",
    "Quelques feuilles de basilic (massep)"
   ]
  },
  "steps": {
   "en": [
    "Wash the meat and put it in a pot with a sliced onion, salt and a cube. Let it sweat covered 10 minutes in its own juice.",
    "Blend the garlic, ginger, other onion and peppers and add them with 2 litres of water. Simmer 1 hour or more until the meat is tender.",
    "Stir in the njansang and the spice and simmer 20 more minutes so the broth thickens a little.",
    "Taste for salt and add the basil at the very end."
   ],
   "fr": [
    "Lavez la viande et mettez-la dans une marmite avec un oignon émincé, du sel et un cube. Laissez-la suer à couvert 10 minutes dans son jus.",
    "Mixez l'ail, le gingembre, l'autre oignon et les piments et ajoutez-les avec 2 litres d'eau. Laissez mijoter 1 heure ou plus jusqu'à ce que la viande soit tendre.",
    "Incorporez le djansang et les épices et laissez mijoter encore 20 minutes pour que le bouillon épaississe un peu.",
    "Rectifiez le sel et ajoutez le basilic tout à la fin."
   ]
  },
  "serving": {
   "en": [
    "Serve hot on its own, or with boiled plantain, macabo or bread."
   ],
   "fr": [
    "Servez bien chaud tel quel, ou avec du plantain, du macabo bouilli ou du pain."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Precious Core – Cameroonian pepper soup",
    "url": "https://www.preciouscore.com/cameroonian-pepper-soup/"
   },
   {
    "label": "Afrik – Pèpè soup du Cameroun",
    "url": "https://www.afrik.com/pepe-soup-du-cameroun"
   }
  ]
 },
 "bouillon-de-pommes": {
  "tags": [
   "budget",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "800 g potatoes, in chunks",
    "300 g meat or chicken (optional)",
    "1 carrot, 1 leek or onion, 1 tomato",
    "2 cloves garlic, 1 small piece ginger",
    "1 cube, salt, pepper, parsley"
   ],
   "fr": [
    "800 g de pommes de terre en morceaux",
    "300 g de viande ou de poulet (facultatif)",
    "1 carotte, 1 poireau ou oignon, 1 tomate",
    "2 gousses d'ail, 1 petit morceau de gingembre",
    "1 cube, sel, poivre, persil"
   ]
  },
  "steps": {
   "en": [
    "If using meat, simmer it 20 minutes with the garlic, ginger, onion, cube and 1.5 litres of water.",
    "Add the potatoes, carrot and chopped tomato. Simmer 20 minutes until the potatoes are soft and start to thicken the broth.",
    "Season and add parsley."
   ],
   "fr": [
    "Si vous mettez de la viande, faites-la mijoter 20 minutes avec l'ail, le gingembre, l'oignon, le cube et 1,5 litre d'eau.",
    "Ajoutez les pommes de terre, la carotte et la tomate hachée. Laissez mijoter 20 minutes jusqu'à ce que les pommes de terre soient tendres et épaississent un peu le bouillon.",
    "Assaisonnez et ajoutez le persil."
   ]
  },
  "serving": {
   "en": [
    "A warming supper on its own, with bread."
   ],
   "fr": [
    "Un souper réconfortant à lui seul, avec du pain."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "bouillon-de-porc": {
  "tags": [],
  "prepMinutes": 15,
  "cookMinutes": 75,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg pork (ribs, trotters, belly) in pieces",
    "2 tbsp ground njansang",
    "1 tbsp pepper-soup spice",
    "3 cloves garlic, 1 piece ginger, 2 onions, 1 leek",
    "2 cubes, salt, hot pepper",
    "Basil or celery leaves"
   ],
   "fr": [
    "1 kg de porc (côtes, pieds, poitrine) en morceaux",
    "2 c. à soupe de djansang moulu",
    "1 c. à soupe d'épices pour pèpè soup",
    "3 gousses d'ail, 1 morceau de gingembre, 2 oignons, 1 poireau",
    "2 cubes, sel, piment",
    "Feuilles de basilic ou de céleri"
   ]
  },
  "steps": {
   "en": [
    "Blanch the pork 5 minutes in boiling water, drain and rinse (this keeps the broth clear).",
    "Put it back with the blended garlic, ginger, onion, leek and pepper, the cubes, salt and 2 litres of water. Simmer 1 hour until tender.",
    "Add the njansang and spice and simmer 15 minutes more.",
    "Finish with the herbs."
   ],
   "fr": [
    "Blanchissez le porc 5 minutes à l'eau bouillante, égouttez et rincez (le bouillon reste clair).",
    "Remettez-le avec l'ail, le gingembre, l'oignon, le poireau et le piment mixés, les cubes, le sel et 2 litres d'eau. Laissez mijoter 1 heure jusqu'à ce qu'il soit tendre.",
    "Ajoutez le djansang et les épices et laissez mijoter encore 15 minutes.",
    "Terminez avec les herbes."
   ]
  },
  "serving": {
   "en": [
    "Serve hot with plantain, potatoes or bread."
   ],
   "fr": [
    "Servez chaud avec du plantain, des pommes de terre ou du pain."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Precious Core – Cameroonian pepper soup",
    "url": "https://www.preciouscore.com/cameroonian-pepper-soup/"
   },
   {
    "label": "Afrik – Pèpè soup du Cameroun",
    "url": "https://www.afrik.com/pepe-soup-du-cameroun"
   }
  ]
 },
 "boulettes-enrobe-de-miondo": {
  "tags": [
   "snack"
  ],
  "prepMinutes": 25,
  "cookMinutes": 25,
  "servings": 4,
  "ingredients": {
   "en": [
    "400 g minced beef, seasoned (onion, garlic, parsley, salt, pepper)",
    "6 miondo (thin cassava sticks), unwrapped",
    "1 egg + flour",
    "Oil for frying"
   ],
   "fr": [
    "400 g de bœuf haché assaisonné (oignon, ail, persil, sel, poivre)",
    "6 miondo (fins bâtons de manioc) déballés",
    "1 œuf + farine",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Shape the seasoned meat into small balls.",
    "Mash the miondo with a fork (or briefly in a blender) into a smooth, sticky dough.",
    "Wrap each meatball in a thin layer of miondo with wet hands.",
    "Dip in flour, then beaten egg, and fry 6 to 8 minutes until golden and the meat is cooked through."
   ],
   "fr": [
    "Formez de petites boulettes avec la viande assaisonnée.",
    "Écrasez les miondo à la fourchette (ou rapidement au mixeur) en une pâte lisse et collante.",
    "Enrobez chaque boulette d'une fine couche de miondo avec les mains mouillées.",
    "Passez dans la farine puis l'œuf battu, et faites frire 6 à 8 minutes jusqu'à ce qu'elles soient dorées et la viande cuite."
   ]
  },
  "serving": {
   "en": [
    "Serve as a party snack with a chili dip."
   ],
   "fr": [
    "Servez en amuse-bouche de fête avec une sauce pimentée."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "bread-toast-snack": {
  "tags": [
   "quick",
   "kids",
   "western"
  ],
  "prepMinutes": 5,
  "cookMinutes": 10,
  "servings": 2,
  "ingredients": {
   "en": [
    "4 slices of bread",
    "2 eggs",
    "50 g grated cheese",
    "1 tomato, ½ onion, chopped",
    "Ham or sausage, chopped (optional)",
    "Butter, salt, pepper"
   ],
   "fr": [
    "4 tranches de pain",
    "2 œufs",
    "50 g de fromage râpé",
    "1 tomate, ½ oignon hachés",
    "Jambon ou saucisse hachés (facultatif)",
    "Beurre, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Beat the eggs with the cheese, tomato, onion, ham, salt and pepper.",
    "Butter the bread on the outside.",
    "Spread the egg mixture on two slices and close with the others.",
    "Cook in a pan on medium heat 3 to 4 minutes per side, pressing, until golden and the egg is set."
   ],
   "fr": [
    "Battez les œufs avec le fromage, la tomate, l'oignon, le jambon, le sel et le poivre.",
    "Beurrez le pain à l'extérieur.",
    "Étalez le mélange aux œufs sur deux tranches et refermez avec les autres.",
    "Faites cuire à la poêle à feu moyen 3 à 4 minutes de chaque côté en pressant, jusqu'à ce que ce soit doré et l'œuf pris."
   ]
  },
  "serving": {
   "en": [
    "Cut in triangles; serve with juice or tea."
   ],
   "fr": [
    "Coupez en triangles ; servez avec du jus ou du thé."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "brochettes-de-porc": {
  "tags": [],
  "prepMinutes": 20,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "800 g pork (neck or shoulder), in cubes",
    "3 cloves garlic, 1 piece ginger, 1 onion, blended",
    "1 tsp paprika, 1 tsp chili, 1 cube, salt",
    "3 tbsp oil",
    "1 green pepper, 1 onion (for the skewers)"
   ],
   "fr": [
    "800 g de porc (échine ou épaule) en cubes",
    "3 gousses d'ail, 1 morceau de gingembre, 1 oignon, mixés",
    "1 c. à café de paprika, 1 de piment, 1 cube, sel",
    "3 c. à soupe d'huile",
    "1 poivron, 1 oignon (pour les brochettes)"
   ]
  },
  "steps": {
   "en": [
    "Marinate the pork with the blended aromatics, spices, cube, salt and oil for at least 1 hour.",
    "Thread onto skewers with pieces of pepper and onion.",
    "Grill over medium charcoal 12 to 15 minutes, turning, until cooked through and caramelised. Pork must be well done."
   ],
   "fr": [
    "Faites mariner le porc avec les aromates mixés, les épices, le cube, le sel et l'huile au moins 1 heure.",
    "Enfilez sur les piques avec des morceaux de poivron et d'oignon.",
    "Grillez sur une braise moyenne 12 à 15 minutes en retournant, jusqu'à ce que ce soit cuit à cœur et caramélisé. Le porc doit être bien cuit."
   ]
  },
  "serving": {
   "en": [
    "Serve with fried plantain, miondo or fries and chili."
   ],
   "fr": [
    "Servez avec du plantain frit, des miondo ou des frites et du piment."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "brochettes-de-soja": {
  "tags": [
   "vegetarian"
  ],
  "prepMinutes": 20,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "300 g dried soy chunks (textured soy protein)",
    "1 onion, 1 green pepper (for the skewers)",
    "Soya spice (kankan): 3 tbsp ground roasted peanuts, 1 tsp each ginger, garlic and chili powder, 1 cube",
    "3 tbsp oil",
    "Wooden skewers, soaked"
   ],
   "fr": [
    "300 g de morceaux de soja séché (protéines de soja texturées)",
    "1 oignon, 1 poivron (pour les brochettes)",
    "Épices soya (kankan) : 3 c. à soupe d'arachides grillées moulues, 1 c. à café chacun de gingembre, d'ail et de piment en poudre, 1 cube",
    "3 c. à soupe d'huile",
    "Piques en bois trempées"
   ]
  },
  "steps": {
   "en": [
    "Soak the soy chunks 10 minutes in hot salted water with a cube, then squeeze out the water.",
    "Mix them with the oil and half the spice.",
    "Thread onto skewers, alternating with onion and pepper pieces.",
    "Grill or pan-fry 10 to 12 minutes, turning, then roll in the rest of the spice."
   ],
   "fr": [
    "Faites tremper le soja 10 minutes dans de l'eau chaude salée avec un cube, puis pressez pour enlever l'eau.",
    "Mélangez-le avec l'huile et la moitié des épices.",
    "Enfilez sur les piques en alternant avec des morceaux d'oignon et de poivron.",
    "Grillez ou faites cuire à la poêle 10 à 12 minutes en retournant, puis roulez dans le reste des épices."
   ]
  },
  "serving": {
   "en": [
    "Serve with raw onion, chili and plantain or bread."
   ],
   "fr": [
    "Servez avec de l'oignon cru, du piment et du plantain ou du pain."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Precious Core – Cameroonian soya",
    "url": "https://www.preciouscore.com/cameroonian-soya/"
   },
   {
    "label": "Afrik – Soya de bœuf grillé",
    "url": "https://www.afrik.com/soya-de-boeuf-grille-a-la-camerounaise"
   }
  ]
 },
 "brochettes-poulet-farine": {
  "tags": [
   "kids",
   "snack"
  ],
  "prepMinutes": 20,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g chicken breast, in cubes",
    "2 cloves garlic, 1 cube, salt, pepper, paprika",
    "100 g flour, 2 eggs, 100 g breadcrumbs",
    "Wooden skewers, oil for frying"
   ],
   "fr": [
    "500 g de blanc de poulet en cubes",
    "2 gousses d'ail, 1 cube, sel, poivre, paprika",
    "100 g de farine, 2 œufs, 100 g de chapelure",
    "Piques en bois, huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Season the chicken with garlic, cube, salt, pepper and paprika. Leave 15 minutes.",
    "Thread 4 or 5 cubes on each skewer.",
    "Roll each skewer in flour, then beaten egg, then breadcrumbs.",
    "Fry in medium-hot oil 6 to 8 minutes, turning, until golden and cooked through."
   ],
   "fr": [
    "Assaisonnez le poulet avec l'ail, le cube, le sel, le poivre et le paprika. Laissez 15 minutes.",
    "Enfilez 4 ou 5 cubes par pique.",
    "Roulez chaque brochette dans la farine, puis l'œuf battu, puis la chapelure.",
    "Faites frire dans une huile moyennement chaude 6 à 8 minutes en tournant, jusqu'à ce qu'elles soient dorées et cuites à cœur."
   ]
  },
  "serving": {
   "en": [
    "Serve with fries and a dipping sauce."
   ],
   "fr": [
    "Servez avec des frites et une sauce."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "burger-plantain": {
  "tags": [
   "kids"
  ],
  "prepMinutes": 15,
  "cookMinutes": 20,
  "servings": 2,
  "ingredients": {
   "en": [
    "2 large ripe (but firm) plantains",
    "250 g minced beef, seasoned and shaped into 2 patties",
    "2 slices cheese",
    "Lettuce, tomato, onion, sauce",
    "Oil for frying"
   ],
   "fr": [
    "2 gros plantains mûrs (mais fermes)",
    "250 g de bœuf haché assaisonné, en 2 steaks",
    "2 tranches de fromage",
    "Salade, tomate, oignon, sauce",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Cut each plantain in half lengthways, then each half in 2 pieces – these are the 'buns'.",
    "Fry the plantain pieces until golden, then press them a little flatter.",
    "Cook the patties 3 to 4 minutes per side and put the cheese on to melt.",
    "Build: plantain, sauce, lettuce, patty, tomato, onion, plantain."
   ],
   "fr": [
    "Coupez chaque plantain en deux dans la longueur, puis chaque moitié en 2 morceaux – ce sont les « pains ».",
    "Faites frire les morceaux de plantain jusqu'à ce qu'ils soient dorés, puis aplatissez-les un peu.",
    "Faites cuire les steaks 3 à 4 minutes de chaque côté et posez le fromage dessus pour qu'il fonde.",
    "Montez : plantain, sauce, salade, steak, tomate, oignon, plantain."
   ]
  },
  "serving": {
   "en": [
    "Eat right away while the plantain is hot."
   ],
   "fr": [
    "Mangez tout de suite, tant que le plantain est chaud."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "cafe": {
  "tags": [
   "quick"
  ],
  "prepMinutes": 2,
  "cookMinutes": 5,
  "servings": 1,
  "ingredients": {
   "en": [
    "2 tsp ground coffee or 1 tsp instant coffee",
    "200 ml water",
    "Sugar, milk or condensed milk to taste"
   ],
   "fr": [
    "2 c. à café de café moulu ou 1 c. à café de café soluble",
    "200 ml d'eau",
    "Sucre, lait ou lait concentré selon le goût"
   ]
  },
  "steps": {
   "en": [
    "Heat the water until just off the boil.",
    "Instant: stir the coffee into the water. Ground: let it steep 4 minutes in a press or filter.",
    "Add sugar and milk to taste."
   ],
   "fr": [
    "Chauffez l'eau juste avant ébullition.",
    "Soluble : mélangez le café dans l'eau. Moulu : laissez infuser 4 minutes dans une cafetière à piston ou un filtre.",
    "Ajoutez sucre et lait selon votre goût."
   ]
  },
  "serving": {
   "en": [
    "With bread, beignets or pain perdu."
   ],
   "fr": [
    "Avec du pain, des beignets ou du pain perdu."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "calabar-soup": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg beef (and/or cow skin)",
    "1 stockfish head or 200 g dried fish",
    "500 g fluted pumpkin leaves (ugu), sliced",
    "500 g waterleaf, sliced",
    "200 ml palm oil",
    "3 tbsp ground crayfish",
    "2 onions, 2 stock cubes, 2 peppers",
    "Periwinkles (optional), salt"
   ],
   "fr": [
    "1 kg de bœuf (et/ou de peau de bœuf)",
    "1 tête de stockfish ou 200 g de poisson séché",
    "500 g de feuilles d'ugu (citrouille cannelée) coupées",
    "500 g de « waterleaf » (pourpier de Cuba) coupé",
    "200 ml d'huile de palme",
    "3 c. à soupe d'écrevisses moulues",
    "2 oignons, 2 cubes, 2 piments",
    "Bigorneaux (facultatif), sel"
   ]
  },
  "steps": {
   "en": [
    "Boil the meat and stockfish with the onions, cubes and salt in very little water until tender (the soup should not be watery).",
    "Add the palm oil, crayfish and pepper and cook 5 minutes.",
    "Add the waterleaf first and cook 5 minutes: it releases its own water.",
    "Add the ugu (and periwinkles), stir, and cook just 3 to 5 more minutes so the leaves stay green. Taste for salt."
   ],
   "fr": [
    "Faites bouillir la viande et le stockfish avec les oignons, les cubes et le sel dans très peu d'eau jusqu'à ce qu'ils soient tendres (la soupe ne doit pas être aqueuse).",
    "Ajoutez l'huile de palme, les écrevisses et le piment et laissez cuire 5 minutes.",
    "Ajoutez d'abord le waterleaf et laissez cuire 5 minutes : il rend sa propre eau.",
    "Ajoutez l'ugu (et les bigorneaux), remuez et laissez cuire seulement 3 à 5 minutes de plus pour que les feuilles restent vertes. Rectifiez le sel."
   ]
  },
  "serving": {
   "en": [
    "Serve with fufu, garri or pounded yam."
   ],
   "fr": [
    "Servez avec du fufu, du garri ou de l'igname pilée."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Pulse – Edikang ikong",
    "url": "https://www.pulse.ng/lifestyle/calabar-delicacy-how-to-make-the-perfect-pot-of-edikang-ikong-soup/g6z1vr2"
   }
  ]
 },
 "cassava-sticks": {
  "tags": [
   "budget",
   "vegetarian",
   "snack"
  ],
  "prepMinutes": 15,
  "cookMinutes": 25,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg fresh cassava",
    "Salt",
    "Oil for frying"
   ],
   "fr": [
    "1 kg de manioc frais",
    "Sel",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Peel the cassava, cut into finger-size sticks and remove the hard central fibre.",
    "Boil in salted water 15 minutes, until just tender. Drain and let dry.",
    "Fry in hot oil 5 to 7 minutes until golden and crisp outside.",
    "Salt right away."
   ],
   "fr": [
    "Épluchez le manioc, coupez-le en bâtonnets de la taille d'un doigt et retirez la fibre centrale.",
    "Faites bouillir à l'eau salée 15 minutes, juste tendre. Égouttez et laissez sécher.",
    "Faites frire dans l'huile chaude 5 à 7 minutes jusqu'à ce qu'ils soient dorés et croustillants.",
    "Salez tout de suite."
   ]
  },
  "serving": {
   "en": [
    "Serve like fries, with chili sauce, ketchup or grilled fish."
   ],
   "fr": [
    "Servez comme des frites, avec une sauce pimentée, du ketchup ou du poisson braisé."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "champignons-sautes": {
  "tags": [
   "quick",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 15,
  "servings": 3,
  "ingredients": {
   "en": [
    "400 g mushrooms, sliced",
    "1 onion, 2 cloves garlic",
    "2 tbsp oil or butter",
    "Parsley, salt, pepper",
    "2 tbsp cream (optional)"
   ],
   "fr": [
    "400 g de champignons émincés",
    "1 oignon, 2 gousses d'ail",
    "2 c. à soupe d'huile ou de beurre",
    "Persil, sel, poivre",
    "2 c. à soupe de crème (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Heat the oil in a wide pan over high heat.",
    "Add the mushrooms in one layer and leave them 3 minutes without stirring so they brown.",
    "Add the onion and garlic and sauté 5 more minutes.",
    "Season, add the parsley (and cream) and cook 1 minute."
   ],
   "fr": [
    "Chauffez l'huile dans une grande poêle à feu vif.",
    "Ajoutez les champignons en une seule couche et laissez-les 3 minutes sans remuer pour qu'ils dorent.",
    "Ajoutez l'oignon et l'ail et faites sauter encore 5 minutes.",
    "Assaisonnez, ajoutez le persil (et la crème) et laissez cuire 1 minute."
   ]
  },
  "serving": {
   "en": [
    "Serve with rice, pasta, potatoes or on toast."
   ],
   "fr": [
    "Servez avec du riz, des pâtes, des pommes de terre ou sur des toasts."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "chevre-dg": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 80,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg goat meat, in pieces",
    "6 ripe (yellow) plantains",
    "3 carrots, 1 handful green beans, 2 green peppers",
    "3 tomatoes, 2 onions, 3 cloves garlic, 1 piece ginger",
    "1 small bunch parsley, and celery or leek",
    "2 stock cubes, salt, pepper",
    "Oil for frying"
   ],
   "fr": [
    "1 kg de viande de chèvre en morceaux",
    "6 plantains mûrs (jaunes)",
    "3 carottes, 1 poignée de haricots verts, 2 poivrons",
    "3 tomates, 2 oignons, 3 gousses d'ail, 1 morceau de gingembre",
    "1 petit bouquet de persil, et du céleri ou du poireau",
    "2 cubes, sel, piment",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Season the goat with blended garlic, ginger, half an onion, a cube and salt. Cook it covered in its own juice, then with a little water, until tender (about 50 minutes).",
    "Drain the goat (keep the juice) and fry it until golden.",
    "Peel the plantains, cut them in thick rounds and fry until golden. Drain.",
    "In a large pot, fry the rest of the onion, add the blended tomatoes and cook 10 minutes. Add the carrots, beans and peppers, the meat juice and the second cube; cook 10 minutes.",
    "Add the goat and the plantain, sprinkle with parsley and celery, and toss gently for 5 minutes so everything is coated without breaking."
   ],
   "fr": [
    "Assaisonnez la chèvre avec l'ail, le gingembre et un demi-oignon mixés, un cube et du sel. Faites cuire à couvert dans son jus, puis avec un peu d'eau, jusqu'à ce que ce soit tendre (environ 50 minutes).",
    "Égouttez la viande (gardez le jus) et faites-la dorer à la poêle.",
    "Épluchez les plantains, coupez-les en grosses rondelles et faites-les frire jusqu'à ce qu'ils soient dorés. Égouttez.",
    "Dans une grande marmite, faites revenir le reste de l'oignon, ajoutez les tomates mixées et laissez cuire 10 minutes. Ajoutez les carottes, haricots et poivrons, le jus de cuisson et le second cube ; laissez cuire 10 minutes.",
    "Ajoutez la viande et le plantain, parsemez de persil et de céleri, et mélangez délicatement 5 minutes pour tout enrober sans casser."
   ]
  },
  "serving": {
   "en": [
    "A complete party dish: serve as is, hot."
   ],
   "fr": [
    "Un plat de fête complet : servez tel quel, bien chaud."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "chicken-and-bread-snack": {
  "tags": [
   "kids",
   "snack"
  ],
  "prepMinutes": 15,
  "cookMinutes": 20,
  "servings": 4,
  "ingredients": {
   "en": [
    "2 chicken breasts",
    "1 baguette or 4 rolls",
    "3 tbsp mayonnaise, 1 tsp mustard",
    "Lettuce, tomato, onion",
    "1 tbsp oil, garlic, salt, pepper, paprika"
   ],
   "fr": [
    "2 blancs de poulet",
    "1 baguette ou 4 petits pains",
    "3 c. à soupe de mayonnaise, 1 c. à café de moutarde",
    "Salade, tomate, oignon",
    "1 c. à soupe d'huile, ail, sel, poivre, paprika"
   ]
  },
  "steps": {
   "en": [
    "Season the chicken with garlic, paprika, salt and pepper and cook in the oil 6 minutes per side. Rest, then slice.",
    "Mix the mayonnaise and mustard.",
    "Open the bread, spread the sauce, and fill with lettuce, chicken, tomato and onion."
   ],
   "fr": [
    "Assaisonnez le poulet avec l'ail, le paprika, le sel et le poivre et faites-le cuire dans l'huile 6 minutes de chaque côté. Laissez reposer, puis tranchez.",
    "Mélangez la mayonnaise et la moutarde.",
    "Ouvrez le pain, tartinez de sauce, et garnissez de salade, de poulet, de tomate et d'oignon."
   ]
  },
  "serving": {
   "en": [
    "Wrap and take for school or a picnic."
   ],
   "fr": [
    "Emballez et emportez pour l'école ou un pique-nique."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "citron": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "4 limes or lemons",
    "1 litre cold water",
    "4 to 6 tbsp sugar",
    "A few mint leaves (optional)",
    "Ice"
   ],
   "fr": [
    "4 citrons verts ou jaunes",
    "1 litre d'eau froide",
    "4 à 6 c. à soupe de sucre",
    "Quelques feuilles de menthe (facultatif)",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Squeeze the limes.",
    "Dissolve the sugar in a little warm water, then add the cold water and lime juice.",
    "Add mint and ice and taste – adjust sugar or lime."
   ],
   "fr": [
    "Pressez les citrons.",
    "Faites dissoudre le sucre dans un peu d'eau tiède, puis ajoutez l'eau froide et le jus de citron.",
    "Ajoutez la menthe et les glaçons et goûtez – ajustez sucre ou citron."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "cocktails": {
  "tags": [
   "vegetarian",
   "occasion"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 ml pineapple juice",
    "500 ml orange juice",
    "250 ml mango or passion juice",
    "Juice of 2 limes",
    "4 tbsp grenadine syrup",
    "Sparkling water, ice, fruit slices"
   ],
   "fr": [
    "500 ml de jus d'ananas",
    "500 ml de jus d'orange",
    "250 ml de jus de mangue ou de passion",
    "Jus de 2 citrons verts",
    "4 c. à soupe de sirop de grenadine",
    "Eau gazeuse, glaçons, rondelles de fruits"
   ]
  },
  "steps": {
   "en": [
    "Mix the fruit juices and lime in a large jug and chill.",
    "Fill glasses with ice, pour in the juice three-quarters full and top with sparkling water.",
    "Add a spoon of grenadine to each glass for the sunrise effect, and decorate with fruit."
   ],
   "fr": [
    "Mélangez les jus de fruits et le citron dans une grande carafe et mettez au frais.",
    "Remplissez les verres de glaçons, versez le jus aux trois quarts et complétez d'eau gazeuse.",
    "Ajoutez une cuillère de grenadine dans chaque verre pour l'effet dégradé, et décorez de fruits."
   ]
  },
  "serving": {
   "en": [
    "A party punch without alcohol; adults can add rum if they like."
   ],
   "fr": [
    "Un punch de fête sans alcool ; les adultes peuvent ajouter du rhum s'ils veulent."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "coco-passion": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "6 passion fruits",
    "400 ml coconut milk",
    "400 ml cold water",
    "4 tbsp sugar",
    "Ice"
   ],
   "fr": [
    "6 fruits de la passion",
    "400 ml de lait de coco",
    "400 ml d'eau froide",
    "4 c. à soupe de sucre",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Pulse the passion fruit pulp briefly with the water and strain out the seeds.",
    "Whisk in the coconut milk and sugar.",
    "Chill and shake before serving."
   ],
   "fr": [
    "Mixez brièvement la pulpe des fruits de la passion avec l'eau et filtrez les graines.",
    "Ajoutez le lait de coco et le sucre en fouettant.",
    "Mettez au frais et secouez avant de servir."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "corn-hot-dogs": {
  "tags": [
   "kids",
   "snack",
   "western"
  ],
  "prepMinutes": 15,
  "cookMinutes": 15,
  "servings": 8,
  "ingredients": {
   "en": [
    "8 sausages (hot dogs)",
    "150 g fine cornmeal + 100 g flour",
    "2 tbsp sugar, 1 tsp baking powder, ½ tsp salt",
    "1 egg + 200 ml milk",
    "Wooden skewers, oil for frying"
   ],
   "fr": [
    "8 saucisses (type hot dog)",
    "150 g de semoule de maïs fine + 100 g de farine",
    "2 c. à soupe de sucre, 1 c. à café de levure chimique, ½ de sel",
    "1 œuf + 200 ml de lait",
    "Piques en bois, huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Mix the cornmeal, flour, sugar, baking powder and salt, then whisk in the egg and milk to a thick batter. Pour it into a tall glass.",
    "Pat the sausages dry and push a skewer into each.",
    "Dip each sausage in the batter so it's well coated.",
    "Fry in hot oil (175 °C) 3 to 4 minutes, turning, until golden."
   ],
   "fr": [
    "Mélangez la semoule, la farine, le sucre, la levure et le sel, puis ajoutez l'œuf et le lait en fouettant pour une pâte épaisse. Versez-la dans un grand verre.",
    "Séchez les saucisses et piquez une brochette dans chacune.",
    "Trempez chaque saucisse dans la pâte pour bien l'enrober.",
    "Faites frire dans l'huile chaude (175 °C) 3 à 4 minutes en tournant, jusqu'à ce qu'elles soient dorées."
   ]
  },
  "serving": {
   "en": [
    "Serve with ketchup and mustard."
   ],
   "fr": [
    "Servez avec du ketchup et de la moutarde."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "coro-coco": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 ripe soursop (corossol)",
    "400 ml coconut milk",
    "500 ml cold water",
    "Sugar, a drop of vanilla",
    "Ice"
   ],
   "fr": [
    "1 corossol mûr",
    "400 ml de lait de coco",
    "500 ml d'eau froide",
    "Sucre, une goutte de vanille",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Peel the soursop and remove all the black seeds and the core.",
    "Blend the flesh with the water, then strain.",
    "Stir in the coconut milk, sugar and vanilla. Chill well."
   ],
   "fr": [
    "Épluchez le corossol et retirez toutes les graines noires et le cœur.",
    "Mixez la chair avec l'eau, puis filtrez.",
    "Ajoutez le lait de coco, le sucre et la vanille. Mettez bien au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Cameroun24 – Jus de corossol",
    "url": "https://cameroun24.net/article/25571-la-recette-du-jus-de-corossol.html"
   }
  ]
 },
 "coro-mangue": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 ripe soursop (corossol)",
    "2 ripe mangoes",
    "1 litre cold water",
    "Sugar, juice of 1 lime",
    "Ice"
   ],
   "fr": [
    "1 corossol mûr",
    "2 mangues mûres",
    "1 litre d'eau froide",
    "Sucre, jus d'1 citron vert",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Peel the soursop and remove all the black seeds (never blend them) and the hard core.",
    "Blend the soursop and mango flesh with half the water.",
    "Strain through a fine sieve or cloth, then add the rest of the water, lime and sugar. Chill."
   ],
   "fr": [
    "Épluchez le corossol et retirez toutes les graines noires (ne jamais les mixer) et le cœur dur.",
    "Mixez la chair du corossol et des mangues avec la moitié de l'eau.",
    "Filtrez dans une passoire fine ou un linge, puis ajoutez le reste de l'eau, le citron et le sucre. Mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Cameroun24 – Jus de corossol",
    "url": "https://cameroun24.net/article/25571-la-recette-du-jus-de-corossol.html"
   }
  ]
 },
 "couscous-choux-arachides": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 15,
  "cookMinutes": 40,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g corn flour + water (couscous)",
    "½ green cabbage, finely sliced",
    "200 g peanut paste",
    "2 tomatoes, 2 onions",
    "3 tbsp oil",
    "1 cube, salt, pepper",
    "Smoked fish (optional)"
   ],
   "fr": [
    "500 g de farine de maïs + eau (couscous)",
    "½ chou vert finement émincé",
    "200 g de pâte d'arachide",
    "2 tomates, 2 oignons",
    "3 c. à soupe d'huile",
    "1 cube, sel, piment",
    "Poisson fumé (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Fry the onions in the oil, add the blended tomatoes and cook 8 minutes.",
    "Loosen the peanut paste in 300 ml warm water, pour it in and simmer 15 minutes, stirring, until the oil rises.",
    "Add the cabbage, cube, salt, pepper (and fish) and cook 10 more minutes; the cabbage should stay a little crunchy.",
    "Make the corn couscous as usual."
   ],
   "fr": [
    "Faites revenir les oignons dans l'huile, ajoutez les tomates mixées et laissez cuire 8 minutes.",
    "Délayez la pâte d'arachide dans 300 ml d'eau tiède, versez et laissez mijoter 15 minutes en remuant, jusqu'à ce que l'huile remonte.",
    "Ajoutez le chou, le cube, le sel, le piment (et le poisson) et laissez cuire encore 10 minutes ; le chou doit rester un peu croquant.",
    "Préparez le couscous de maïs comme d'habitude."
   ]
  },
  "serving": {
   "en": [
    "Serve hot with couscous balls."
   ],
   "fr": [
    "Servez chaud avec des boules de couscous."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "couscous-gombo": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g corn flour + about 1 litre water (for the couscous)",
    "400 g fresh okra (gombo), sliced thin",
    "150 ml palm oil",
    "1 small piece of kanwa, dissolved in ½ glass of water",
    "500 g beef or smoked fish",
    "1 tsp yellow-sauce spices (or pèbè and rondelle)",
    "1 onion, 1 hot pepper",
    "Salt"
   ],
   "fr": [
    "500 g de farine de maïs + environ 1 litre d'eau (pour le couscous)",
    "400 g de gombo frais coupé finement",
    "150 ml d'huile de palme",
    "1 petit morceau de kanwa dissous dans ½ verre d'eau",
    "500 g de bœuf ou de poisson fumé",
    "1 c. à café d'épices pour sauce jaune (ou pèbè et rondelle)",
    "1 oignon, 1 piment",
    "Sel"
   ]
  },
  "steps": {
   "en": [
    "Boil the meat with the onion and salt until tender; keep about 500 ml of broth.",
    "Boil the sliced okra separately in a little water for 8 to 10 minutes until soft and slimy.",
    "In a pot, whisk the palm oil with the strained kanwa water until it turns into a thick yellow cream.",
    "Whisk in the warm broth little by little, then add the ground spices and pepper.",
    "Add the meat (or fish) and the okra, stir gently and simmer 10 minutes. Taste for salt.",
    "Make the corn couscous: rain the flour into boiling water while stirring hard, and work it 10 minutes on low heat until smooth and firm."
   ],
   "fr": [
    "Faites bouillir la viande avec l'oignon et le sel jusqu'à ce qu'elle soit tendre ; gardez environ 500 ml de bouillon.",
    "Faites bouillir le gombo à part dans un peu d'eau 8 à 10 minutes jusqu'à ce qu'il soit tendre et gluant.",
    "Dans une marmite, fouettez l'huile de palme avec l'eau de kanwa filtrée jusqu'à obtenir une crème jaune épaisse.",
    "Ajoutez le bouillon tiède petit à petit en fouettant, puis les épices moulues et le piment.",
    "Ajoutez la viande (ou le poisson) et le gombo, remuez doucement et laissez mijoter 10 minutes. Rectifiez le sel.",
    "Préparez le couscous de maïs : versez la farine en pluie dans l'eau bouillante en remuant fort, et travaillez-la 10 minutes à feu doux jusqu'à ce qu'elle soit lisse et ferme."
   ]
  },
  "serving": {
   "en": [
    "Serve the sauce hot with balls of corn couscous."
   ],
   "fr": [
    "Servez la sauce bien chaude avec des boules de couscous de maïs."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Carnet de recettes Étoile du Nord (PDF)",
    "url": "https://ecole-deletoile-du-nord.cssc.gouv.qc.ca/wp-content/uploads/2026/06/carnet-de-recettes-etoile-du-nord.pdf"
   },
   {
    "label": "Île aux épices – Sauce gombo",
    "url": "https://ileauxepices.com/blog/2026/03/24/sauce-gombo-traditionnelle/wpid48952/"
   }
  ]
 },
 "couscous-legumes-simple": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 15,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g corn flour + about 1 litre water (couscous)",
    "Vegetable sauce: 2 bunches of greens (spinach, amaranth or njama-njama), 2 tomatoes, 2 onions, 4 tbsp oil, 1 cube, salt, pepper"
   ],
   "fr": [
    "500 g de farine de maïs + environ 1 litre d'eau (couscous)",
    "Sauce légumes : 2 bottes de légumes verts (épinards, amarante ou njama-njama), 2 tomates, 2 oignons, 4 c. à soupe d'huile, 1 cube, sel, piment"
   ]
  },
  "steps": {
   "en": [
    "Wash and finely slice the greens; blanch them 3 minutes in boiling water and squeeze dry.",
    "Fry the sliced onions in the oil, add the chopped tomatoes and cook 5 minutes.",
    "Add the greens, cube, salt and pepper and sauté 10 minutes.",
    "Make the corn couscous: rain the flour into boiling water while stirring hard, then work 10 minutes on low heat until smooth."
   ],
   "fr": [
    "Lavez et émincez finement les légumes ; blanchissez-les 3 minutes à l'eau bouillante et pressez-les.",
    "Faites revenir les oignons émincés dans l'huile, ajoutez les tomates hachées et laissez cuire 5 minutes.",
    "Ajoutez les légumes, le cube, le sel et le piment et faites sauter 10 minutes.",
    "Préparez le couscous de maïs : versez la farine en pluie dans l'eau bouillante en remuant fort, puis travaillez 10 minutes à feu doux jusqu'à ce qu'il soit lisse."
   ]
  },
  "serving": {
   "en": [
    "Serve the sautéed greens with couscous balls."
   ],
   "fr": [
    "Servez les légumes sautés avec des boules de couscous."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "couscous-nkui": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 6,
  "ingredients": {
   "en": [
    "For the couscous: 500 g fine white corn flour, about 1 litre water",
    "30 g nkui bark (dried, from the market)",
    "1 tbsp nkui spices (country onion, pèbè, white pepper – sold as a mix)",
    "1 small piece of limestone (kanwa), dissolved in a little water",
    "300 g smoked or fresh beef (optional)",
    "1 hot pepper",
    "Salt"
   ],
   "fr": [
    "Pour le couscous : 500 g de farine de maïs blanc fine, environ 1 litre d'eau",
    "30 g d'écorce de nkui (séchée, au marché)",
    "1 c. à soupe d'épices nkui (rondelle, pèbè, poivre blanc – vendues en mélange)",
    "1 petit morceau de sel gemme (kanwa) dissous dans un peu d'eau",
    "300 g de bœuf frais ou fumé (facultatif)",
    "1 piment",
    "Sel"
   ]
  },
  "steps": {
   "en": [
    "If using meat, boil it with salt until tender and keep the broth.",
    "Soak the nkui bark in 1.5 litres of warm water (or the broth) for 15 minutes, rubbing it with your hands until the water turns slimy, then remove the bark.",
    "Grind the spices with the pepper and add them, with the kanwa water, to the slimy liquid.",
    "Simmer gently 15 minutes, whisking: the sauce should become sticky and stringy. Add the meat and salt.",
    "For the couscous: bring the water to the boil, rain in the corn flour while stirring hard with a wooden spatula, and keep working it on low heat for 10 minutes until it is a smooth, firm ball."
   ],
   "fr": [
    "Si vous mettez de la viande, faites-la bouillir avec du sel jusqu'à ce qu'elle soit tendre et gardez le bouillon.",
    "Faites tremper l'écorce de nkui dans 1,5 litre d'eau tiède (ou le bouillon) 15 minutes en la frottant avec les mains jusqu'à ce que l'eau devienne gluante, puis retirez l'écorce.",
    "Écrasez les épices avec le piment et ajoutez-les, avec l'eau de kanwa, au liquide gluant.",
    "Laissez frémir 15 minutes en fouettant : la sauce doit devenir collante et filante. Ajoutez la viande et le sel.",
    "Pour le couscous : portez l'eau à ébullition, versez la farine en pluie en remuant fort avec une spatule en bois, et continuez à travailler à feu doux 10 minutes jusqu'à obtenir une boule lisse et ferme."
   ]
  },
  "serving": {
   "en": [
    "Shape the couscous into balls and serve the nkui hot alongside. Pinch some couscous and dip."
   ],
   "fr": [
    "Façonnez le couscous en boules et servez le nkui bien chaud à côté. On pince un peu de couscous et on trempe."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Afrik – Nkui au couscous de maïs",
    "url": "https://www.afrik.com/nkui-au-couscous-de-mais"
   },
   {
    "label": "Discover Cameroon – Food",
    "url": "https://discover-cameroon.com/en/food-and-drinks/"
   }
  ]
 },
 "couscous-sauce-jaune-legumes": {
  "tags": [],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g corn flour + water (couscous)",
    "150 ml palm oil",
    "1 small piece kanwa, dissolved in ½ glass water",
    "500 g beef or tripe, cooked (keep the broth)",
    "2 bunches of greens (njama-njama or spinach), blanched",
    "1 tsp yellow-sauce spices, 1 pepper, salt"
   ],
   "fr": [
    "500 g de farine de maïs + eau (couscous)",
    "150 ml d'huile de palme",
    "1 petit morceau de kanwa dissous dans ½ verre d'eau",
    "500 g de bœuf ou de tripes cuits (gardez le bouillon)",
    "2 bottes de légumes verts (njama-njama ou épinards) blanchis",
    "1 c. à café d'épices sauce jaune, 1 piment, sel"
   ]
  },
  "steps": {
   "en": [
    "Whisk the palm oil with the strained kanwa water until thick and yellow.",
    "Add warm broth little by little, whisking, then the ground spices and pepper.",
    "Add the meat and simmer 10 minutes. Salt to taste.",
    "Sauté the blanched greens with a little oil and salt, to serve on the side.",
    "Make the corn couscous: flour into boiling water, stirring hard, 10 minutes on low heat."
   ],
   "fr": [
    "Fouettez l'huile de palme avec l'eau de kanwa filtrée jusqu'à ce qu'elle soit épaisse et jaune.",
    "Ajoutez le bouillon tiède petit à petit en fouettant, puis les épices moulues et le piment.",
    "Ajoutez la viande et laissez mijoter 10 minutes. Salez.",
    "Faites sauter les légumes blanchis avec un peu d'huile et de sel, pour servir à côté.",
    "Préparez le couscous de maïs : farine dans l'eau bouillante en remuant fort, 10 minutes à feu doux."
   ]
  },
  "serving": {
   "en": [
    "Serve couscous, yellow sauce and greens together on the plate."
   ],
   "fr": [
    "Servez couscous, sauce jaune et légumes ensemble dans l'assiette."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Camer.be – Taro pilé et sauce jaune",
    "url": "https://www.camer.be/71107/35:32/cameroon-cameroun-tchop-le-taro-pile-et-sa-sauce-jaune.html"
   },
   {
    "label": "Brut – Sauce jaune camerounaise",
    "url": "https://www.brut.media/afrique/videos/la-recette-de-la-sauce-jaune-camerounaise"
   }
  ]
 },
 "couscous-sauce-legumes": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 15,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g corn flour + water (couscous)",
    "1 carrot, 1 zucchini, 1 green pepper, a handful of green beans",
    "3 tomatoes, 2 onions, 2 cloves garlic",
    "300 g beef or chicken (optional)",
    "4 tbsp oil, 1 cube, thyme, salt, pepper"
   ],
   "fr": [
    "500 g de farine de maïs + eau (couscous)",
    "1 carotte, 1 courgette, 1 poivron, une poignée de haricots verts",
    "3 tomates, 2 oignons, 2 gousses d'ail",
    "300 g de bœuf ou de poulet (facultatif)",
    "4 c. à soupe d'huile, 1 cube, thym, sel, piment"
   ]
  },
  "steps": {
   "en": [
    "Brown the meat (if using) in the oil, then add the onions and garlic.",
    "Add the blended tomatoes, thyme and cube and simmer 10 minutes.",
    "Add the vegetables cut small with a glass of water, and simmer 15 minutes until just tender.",
    "Make the corn couscous."
   ],
   "fr": [
    "Faites dorer la viande (si vous en mettez) dans l'huile, puis ajoutez les oignons et l'ail.",
    "Ajoutez les tomates mixées, le thym et le cube et laissez mijoter 10 minutes.",
    "Ajoutez les légumes en petits morceaux avec un verre d'eau et laissez mijoter 15 minutes, juste tendres.",
    "Préparez le couscous de maïs."
   ]
  },
  "serving": {
   "en": [
    "Serve with the couscous, or with rice."
   ],
   "fr": [
    "Servez avec le couscous, ou avec du riz."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "creme": {
  "tags": [
   "kids",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 10,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 ml milk",
    "3 egg yolks",
    "70 g sugar",
    "30 g cornstarch",
    "1 tsp vanilla (or 2 tbsp cocoa for chocolate)"
   ],
   "fr": [
    "500 ml de lait",
    "3 jaunes d'œufs",
    "70 g de sucre",
    "30 g de maïzena",
    "1 c. à café de vanille (ou 2 c. à soupe de cacao pour du chocolat)"
   ]
  },
  "steps": {
   "en": [
    "Heat the milk with the vanilla (or cocoa).",
    "Whisk the yolks, sugar and cornstarch in a bowl.",
    "Pour the hot milk over the yolks while whisking, then return everything to the pan.",
    "Cook on low heat, whisking constantly, until it thickens (2 to 3 minutes after the first bubble).",
    "Pour into cups and chill at least 2 hours."
   ],
   "fr": [
    "Chauffez le lait avec la vanille (ou le cacao).",
    "Fouettez les jaunes, le sucre et la maïzena dans un bol.",
    "Versez le lait chaud sur les jaunes en fouettant, puis remettez le tout dans la casserole.",
    "Faites cuire à feu doux en fouettant sans arrêt jusqu'à ce que ça épaississe (2 à 3 minutes après le premier bouillon).",
    "Versez dans des pots et mettez au frais au moins 2 heures."
   ]
  },
  "serving": {
   "en": [
    "Serve cold, plain or with biscuits."
   ],
   "fr": [
    "Servez froid, nature ou avec des biscuits."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "crevettes-ail-lait-de-coco": {
  "tags": [
   "quick"
  ],
  "prepMinutes": 10,
  "cookMinutes": 20,
  "servings": 4,
  "ingredients": {
   "en": [
    "600 g shrimp, peeled",
    "400 ml coconut milk",
    "4 cloves garlic, 1 piece ginger",
    "1 onion, 1 tomato",
    "2 tbsp oil, 1 cube, salt, pepper, juice of ½ lime, coriander or parsley"
   ],
   "fr": [
    "600 g de crevettes décortiquées",
    "400 ml de lait de coco",
    "4 gousses d'ail, 1 morceau de gingembre",
    "1 oignon, 1 tomate",
    "2 c. à soupe d'huile, 1 cube, sel, piment, jus d'½ citron vert, coriandre ou persil"
   ]
  },
  "steps": {
   "en": [
    "Fry the onion, garlic and ginger in the oil for 3 minutes.",
    "Add the chopped tomato and cube and cook 5 minutes.",
    "Pour in the coconut milk and simmer 5 minutes.",
    "Add the shrimp and cook 3 minutes, just until pink. Finish with lime and herbs."
   ],
   "fr": [
    "Faites revenir l'oignon, l'ail et le gingembre dans l'huile 3 minutes.",
    "Ajoutez la tomate hachée et le cube et laissez cuire 5 minutes.",
    "Versez le lait de coco et laissez mijoter 5 minutes.",
    "Ajoutez les crevettes et faites cuire 3 minutes, juste jusqu'à ce qu'elles soient roses. Terminez avec le citron et les herbes."
   ]
  },
  "serving": {
   "en": [
    "Serve with white rice or plantain."
   ],
   "fr": [
    "Servez avec du riz blanc ou du plantain."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "crevettes-sautees": {
  "tags": [
   "quick"
  ],
  "prepMinutes": 10,
  "cookMinutes": 10,
  "servings": 3,
  "ingredients": {
   "en": [
    "500 g shrimp, peeled and deveined",
    "3 cloves garlic, 1 small piece ginger",
    "1 onion, 1 green pepper",
    "2 tbsp oil or butter",
    "Juice of ½ lime, parsley, salt, pepper"
   ],
   "fr": [
    "500 g de crevettes décortiquées et déveinées",
    "3 gousses d'ail, 1 petit morceau de gingembre",
    "1 oignon, 1 poivron",
    "2 c. à soupe d'huile ou de beurre",
    "Jus d'½ citron vert, persil, sel, piment"
   ]
  },
  "steps": {
   "en": [
    "Season the shrimp with crushed garlic, ginger, salt and pepper.",
    "Sauté the sliced onion and pepper in hot oil for 3 minutes.",
    "Add the shrimp and cook 2 to 3 minutes, just until pink and curled.",
    "Finish with lime juice and parsley."
   ],
   "fr": [
    "Assaisonnez les crevettes avec l'ail et le gingembre écrasés, le sel et le piment.",
    "Faites sauter l'oignon et le poivron émincés dans l'huile chaude 3 minutes.",
    "Ajoutez les crevettes et faites cuire 2 à 3 minutes, juste jusqu'à ce qu'elles soient roses et recourbées.",
    "Terminez avec le jus de citron et le persil."
   ]
  },
  "serving": {
   "en": [
    "Serve with rice, fried plantain or fries."
   ],
   "fr": [
    "Servez avec du riz, du plantain frit ou des frites."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "croque-monsieur": {
  "name": "Croque-monsieur",
  "section": "monday",
  "tags": [
   "quick",
   "kids",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 10,
  "servings": 2,
  "ingredients": {
   "en": [
    "4 slices of sandwich bread",
    "2 slices of ham",
    "100 g grated cheese (emmental or gouda)",
    "Butter",
    "Béchamel (optional): 1 tbsp butter, 1 tbsp flour, 150 ml milk, nutmeg"
   ],
   "fr": [
    "4 tranches de pain de mie",
    "2 tranches de jambon",
    "100 g de fromage râpé (emmental ou gouda)",
    "Beurre",
    "Béchamel (facultatif) : 1 c. à soupe de beurre, 1 de farine, 150 ml de lait, muscade"
   ]
  },
  "steps": {
   "en": [
    "If making béchamel: melt the butter, stir in the flour 1 minute, whisk in the milk and cook until thick; season with salt and nutmeg.",
    "Butter the bread on the outside. On two slices, put béchamel (or nothing), ham and half the cheese; close with the other slices.",
    "Top with the rest of the cheese (and béchamel).",
    "Bake at 200 °C for 10 minutes, or cook in a pan 3 minutes per side, until golden and melted."
   ],
   "fr": [
    "Si vous faites la béchamel : faites fondre le beurre, ajoutez la farine 1 minute, versez le lait en fouettant et laissez épaissir ; salez et ajoutez la muscade.",
    "Beurrez le pain à l'extérieur. Sur deux tranches, mettez la béchamel (ou rien), le jambon et la moitié du fromage ; refermez avec les autres tranches.",
    "Couvrez du reste du fromage (et de béchamel).",
    "Faites cuire au four à 200 °C 10 minutes, ou à la poêle 3 minutes de chaque côté, jusqu'à ce que ce soit doré et fondu."
   ]
  },
  "serving": {
   "en": [
    "Serve hot with a green salad."
   ],
   "fr": [
    "Servez chaud avec une salade verte."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "egg-ball-with-plantains-and-potatoes": {
  "tags": [
   "kids",
   "snack"
  ],
  "prepMinutes": 20,
  "cookMinutes": 25,
  "servings": 4,
  "ingredients": {
   "en": [
    "4 eggs, hard-boiled and peeled",
    "2 ripe plantains, boiled and mashed",
    "2 potatoes, boiled and mashed",
    "1 egg + breadcrumbs",
    "Salt, pepper, pinch of nutmeg",
    "Oil for frying"
   ],
   "fr": [
    "4 œufs durs écalés",
    "2 plantains mûrs bouillis et écrasés",
    "2 pommes de terre bouillies et écrasées",
    "1 œuf + chapelure",
    "Sel, poivre, pincée de muscade",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Mix the plantain and potato mash with salt, pepper and nutmeg; let it cool.",
    "Wrap each boiled egg in a layer of the mash with wet hands.",
    "Roll in beaten egg, then breadcrumbs.",
    "Fry 4 to 5 minutes until golden. Cut in half to show the egg."
   ],
   "fr": [
    "Mélangez les purées de plantain et de pommes de terre avec le sel, le poivre et la muscade ; laissez refroidir.",
    "Enrobez chaque œuf dur d'une couche de purée avec les mains mouillées.",
    "Roulez dans l'œuf battu, puis la chapelure.",
    "Faites frire 4 à 5 minutes jusqu'à ce qu'elles soient dorées. Coupez en deux pour montrer l'œuf."
   ]
  },
  "serving": {
   "en": [
    "Serve as a snack with a tomato or chili dip."
   ],
   "fr": [
    "Servez en snack avec une sauce tomate ou pimentée."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "egg-burger": {
  "tags": [
   "quick",
   "kids",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 10,
  "servings": 2,
  "ingredients": {
   "en": [
    "2 burger buns",
    "3 eggs",
    "2 slices cheese",
    "Lettuce, tomato, onion",
    "Mayonnaise or ketchup",
    "1 tbsp butter or oil, salt, pepper"
   ],
   "fr": [
    "2 pains à burger",
    "3 œufs",
    "2 tranches de fromage",
    "Salade, tomate, oignon",
    "Mayonnaise ou ketchup",
    "1 c. à soupe de beurre ou d'huile, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Beat the eggs with salt and pepper and cook a thick omelette in the butter; fold it to the size of the buns and cut in two.",
    "Lay the cheese on the hot omelette so it melts.",
    "Toast the buns, spread with sauce, and fill with lettuce, omelette, tomato and onion."
   ],
   "fr": [
    "Battez les œufs avec le sel et le poivre et faites cuire une omelette épaisse dans le beurre ; pliez-la à la taille des pains et coupez en deux.",
    "Posez le fromage sur l'omelette chaude pour qu'il fonde.",
    "Grillez les pains, tartinez de sauce, et garnissez de salade, d'omelette, de tomate et d'oignon."
   ]
  },
  "serving": {
   "en": [
    "Serve with fries or fruit."
   ],
   "fr": [
    "Servez avec des frites ou des fruits."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "egg-cups": {
  "tags": [
   "kids",
   "quick",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 20,
  "servings": 6,
  "ingredients": {
   "en": [
    "6 eggs",
    "50 ml milk",
    "½ green pepper, ½ onion, 1 tomato – finely chopped",
    "50 g ham or sausage, chopped (optional)",
    "50 g grated cheese",
    "Salt, pepper, oil for the tin"
   ],
   "fr": [
    "6 œufs",
    "50 ml de lait",
    "½ poivron, ½ oignon, 1 tomate – finement hachés",
    "50 g de jambon ou de saucisse hachés (facultatif)",
    "50 g de fromage râpé",
    "Sel, poivre, huile pour le moule"
   ]
  },
  "steps": {
   "en": [
    "Heat the oven to 180 °C and oil a muffin tin.",
    "Beat the eggs with the milk, salt and pepper.",
    "Divide the vegetables and ham between the cups and pour the egg over, ¾ full. Top with cheese.",
    "Bake 18 to 20 minutes until puffed and set."
   ],
   "fr": [
    "Préchauffez le four à 180 °C et huilez un moule à muffins.",
    "Battez les œufs avec le lait, le sel et le poivre.",
    "Répartissez les légumes et le jambon dans les alvéoles et versez l'œuf aux ¾. Couvrez de fromage.",
    "Faites cuire 18 à 20 minutes jusqu'à ce qu'ils soient gonflés et pris."
   ]
  },
  "serving": {
   "en": [
    "Good warm or cold, for breakfast or a lunch box."
   ],
   "fr": [
    "Bons tièdes ou froids, au petit-déjeuner ou dans la boîte à goûter."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "egg-white-spinach-and-egg-yolk": {
  "tags": [
   "quick",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 10,
  "servings": 2,
  "ingredients": {
   "en": [
    "4 eggs, whites and yolks separated",
    "2 handfuls of spinach",
    "1 small onion, 1 clove garlic",
    "1 tbsp oil, salt, pepper"
   ],
   "fr": [
    "4 œufs, blancs et jaunes séparés",
    "2 poignées d'épinards",
    "1 petit oignon, 1 gousse d'ail",
    "1 c. à soupe d'huile, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Sauté the onion and garlic in the oil 2 minutes, add the spinach and cook until wilted. Season.",
    "Beat the whites with a pinch of salt and pour them over the spinach; cook on low heat until almost set.",
    "Make 4 little wells and slip a yolk into each.",
    "Cover and cook 2 to 3 minutes until the yolks are as you like them."
   ],
   "fr": [
    "Faites revenir l'oignon et l'ail dans l'huile 2 minutes, ajoutez les épinards et laissez-les tomber. Assaisonnez.",
    "Battez les blancs avec une pincée de sel et versez-les sur les épinards ; laissez cuire à feu doux jusqu'à ce qu'ils soient presque pris.",
    "Creusez 4 petits puits et déposez un jaune dans chacun.",
    "Couvrez et laissez cuire 2 à 3 minutes jusqu'à ce que les jaunes soient comme vous les aimez."
   ]
  },
  "serving": {
   "en": [
    "Serve with bread or toast."
   ],
   "fr": [
    "Servez avec du pain ou des toasts."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "eggs-snack-zucchini": {
  "tags": [
   "vegetarian",
   "kids",
   "snack",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "2 zucchini, grated and squeezed",
    "3 eggs",
    "4 tbsp flour",
    "50 g grated cheese",
    "½ onion, chopped, parsley",
    "Salt, pepper, oil"
   ],
   "fr": [
    "2 courgettes râpées et pressées",
    "3 œufs",
    "4 c. à soupe de farine",
    "50 g de fromage râpé",
    "½ oignon haché, persil",
    "Sel, poivre, huile"
   ]
  },
  "steps": {
   "en": [
    "Mix all the ingredients into a thick batter.",
    "Heat a little oil and drop spoonfuls, flattening them slightly.",
    "Cook 3 minutes per side until golden."
   ],
   "fr": [
    "Mélangez tous les ingrédients en une pâte épaisse.",
    "Chauffez un peu d'huile et déposez des cuillerées en les aplatissant légèrement.",
    "Faites cuire 3 minutes de chaque côté jusqu'à ce qu'elles soient dorées."
   ]
  },
  "serving": {
   "en": [
    "Serve warm with yogurt sauce or ketchup."
   ],
   "fr": [
    "Servez tiède avec une sauce au yaourt ou du ketchup."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "escargots-rotis": {
  "tags": [],
  "prepMinutes": 40,
  "cookMinutes": 60,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg large snails (in shell)",
    "2 limes, 2 tbsp salt or alum (for cleaning)",
    "3 cloves garlic, 1 piece ginger, 1 onion, blended",
    "1 cube, pepper, 2 tbsp oil",
    "Soya spice (optional)"
   ],
   "fr": [
    "1 kg de gros escargots (dans la coquille)",
    "2 citrons verts, 2 c. à soupe de sel ou d'alun (pour nettoyer)",
    "3 gousses d'ail, 1 morceau de gingembre, 1 oignon, mixés",
    "1 cube, piment, 2 c. à soupe d'huile",
    "Épices soya (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Break the shells and pull out the snails. Rub them hard with lime and salt (or alum) and rinse; repeat until the slime is gone.",
    "Boil them 30 to 40 minutes with half the aromatics, the cube and salt, until tender.",
    "Drain, toss with the rest of the aromatics, oil and pepper, and thread on skewers.",
    "Grill 10 minutes over charcoal, turning, and dust with soya spice if you like."
   ],
   "fr": [
    "Cassez les coquilles et sortez les escargots. Frottez-les fort au citron et au sel (ou à l'alun) et rincez ; recommencez jusqu'à ce que la bave soit partie.",
    "Faites-les bouillir 30 à 40 minutes avec la moitié des aromates, le cube et le sel, jusqu'à ce qu'ils soient tendres.",
    "Égouttez, mélangez avec le reste des aromates, l'huile et le piment, et enfilez sur des piques.",
    "Grillez 10 minutes sur la braise en retournant, et saupoudrez d'épices soya si vous voulez."
   ]
  },
  "serving": {
   "en": [
    "Serve hot with plantain, bobolo and chili."
   ],
   "fr": [
    "Servez chaud avec du plantain, du bâton de manioc et du piment."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Afrik – Les escargots à la camerounaise",
    "url": "https://www.afrik.com/les-escargots-a-la-camerounaise"
   }
  ]
 },
 "fish-roll": {
  "tags": [
   "snack",
   "occasion"
  ],
  "prepMinutes": 40,
  "cookMinutes": 25,
  "servings": 12,
  "ingredients": {
   "en": [
    "Dough: 500 g flour, 120 g butter or margarine, 1 tsp baking powder, 1 tbsp sugar, ½ tsp salt, 1 egg, about 150 ml cold water",
    "Filling: 2 tins sardines or mackerel (or 400 g cooked fish), 1 onion, 1 small pepper, ½ tsp thyme, 1 cube",
    "1 egg for brushing (or oil for frying)"
   ],
   "fr": [
    "Pâte : 500 g de farine, 120 g de beurre ou margarine, 1 c. à café de levure chimique, 1 c. à soupe de sucre, ½ c. à café de sel, 1 œuf, environ 150 ml d'eau froide",
    "Farce : 2 boîtes de sardines ou de maquereau (ou 400 g de poisson cuit), 1 oignon, 1 petit piment, ½ c. à café de thym, 1 cube",
    "1 œuf pour dorer (ou de l'huile de friture)"
   ]
  },
  "steps": {
   "en": [
    "Rub the butter into the flour, baking powder, sugar and salt until it looks like breadcrumbs. Add the egg and enough water for a firm dough. Rest 15 minutes.",
    "Drain and mash the fish, then sauté it 5 minutes with the chopped onion, pepper, thyme and cube. Let it cool.",
    "Roll the dough thin and cut into rectangles about 10 × 12 cm.",
    "Put a line of filling along one side, roll up and seal the ends with a fork.",
    "Brush with beaten egg and bake at 190 °C for 20 to 25 minutes, or deep-fry in medium-hot oil until golden."
   ],
   "fr": [
    "Sablez le beurre avec la farine, la levure, le sucre et le sel. Ajoutez l'œuf et assez d'eau pour une pâte ferme. Laissez reposer 15 minutes.",
    "Égouttez et écrasez le poisson, puis faites-le revenir 5 minutes avec l'oignon haché, le piment, le thym et le cube. Laissez refroidir.",
    "Étalez la pâte finement et coupez des rectangles d'environ 10 × 12 cm.",
    "Déposez un boudin de farce sur un côté, roulez et soudez les bords à la fourchette.",
    "Dorez à l'œuf battu et faites cuire au four à 190 °C 20 à 25 minutes, ou faites frire dans une huile moyennement chaude jusqu'à ce qu'ils soient dorés."
   ]
  },
  "serving": {
   "en": [
    "Great for parties, school snacks and with a cold drink."
   ],
   "fr": [
    "Parfait pour les fêtes, le goûter et avec une boisson fraîche."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Precious Core – Fish rolls",
    "url": "https://www.preciouscore.com/flavourful-fish-rolls"
   },
   {
    "label": "Yummy Medley – Fish roll",
    "url": "https://www.yummymedley.com/?p=687"
   }
  ]
 },
 "fraise-banane-lait": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "200 g strawberries",
    "2 ripe bananas",
    "500 ml cold milk",
    "1 to 2 tbsp sugar or honey",
    "Ice"
   ],
   "fr": [
    "200 g de fraises",
    "2 bananes mûres",
    "500 ml de lait froid",
    "1 à 2 c. à soupe de sucre ou de miel",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Wash and hull the strawberries; peel the bananas.",
    "Blend everything until smooth and frothy.",
    "Serve right away."
   ],
   "fr": [
    "Lavez et équeutez les fraises ; épluchez les bananes.",
    "Mixez le tout jusqu'à ce que ce soit lisse et mousseux.",
    "Servez tout de suite."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "fufu-pistache": {
  "tags": [],
  "prepMinutes": 30,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g shelled egusi (pistache / melon seeds), ground",
    "500 g beef, in pieces",
    "2 smoked fish, cleaned and flaked",
    "2 tbsp ground crayfish",
    "1 onion, 1 hot pepper",
    "Salt",
    "Fufu: 800 g corn or cassava fufu flour + water",
    "Banana leaves or foil (to steam)"
   ],
   "fr": [
    "500 g de pistache (graines de melon / egusi) décortiquée et moulue",
    "500 g de bœuf en morceaux",
    "2 poissons fumés nettoyés et émiettés",
    "2 c. à soupe d'écrevisses moulues",
    "1 oignon, 1 piment",
    "Sel",
    "Fufu : 800 g de farine de fufu (maïs ou manioc) + eau",
    "Feuilles de bananier ou papier aluminium (pour la vapeur)"
   ]
  },
  "steps": {
   "en": [
    "Boil the beef with the onion and salt until tender. Keep the broth.",
    "In a bowl, mix the ground pistache with the crayfish, crushed pepper and a little warm broth until it's a thick, smooth paste.",
    "Fold in the beef and smoked fish; season with salt.",
    "Wrap portions in wilted banana leaves (or foil) and tie. Steam over a little water for 45 minutes to 1 hour, until set like a pudding.",
    "Make the fufu: stir the flour into boiling water, working it hard on low heat for 10 minutes until smooth."
   ],
   "fr": [
    "Faites bouillir le bœuf avec l'oignon et le sel jusqu'à ce qu'il soit tendre. Gardez le bouillon.",
    "Dans un bol, mélangez la pistache moulue avec les écrevisses, le piment écrasé et un peu de bouillon tiède pour obtenir une pâte épaisse et lisse.",
    "Incorporez la viande et le poisson fumé ; salez.",
    "Emballez des portions dans des feuilles de bananier passées à la flamme (ou de l'aluminium) et ficelez. Faites cuire à la vapeur sur un peu d'eau 45 minutes à 1 heure, jusqu'à ce que ce soit pris comme un flan.",
    "Préparez le fufu : versez la farine dans l'eau bouillante en la travaillant fort à feu doux 10 minutes jusqu'à ce qu'elle soit lisse."
   ]
  },
  "serving": {
   "en": [
    "Serve the pistache parcels with fufu, boiled plantain or miondo."
   ],
   "fr": [
    "Servez les paquets de pistache avec du fufu, du plantain bouilli ou des miondo."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Afrik – Pudding egusi",
    "url": "https://www.afrik.com/pudding-egusi"
   },
   {
    "label": "Keng's Kitchen – Cameroonian egusi pudding",
    "url": "https://kengskitchen.com/cameroon-recipes/cameroonian-egusi-pudding"
   }
  ]
 },
 "galettes-viande-hachee-pommes": {
  "tags": [
   "kids",
   "western"
  ],
  "prepMinutes": 20,
  "cookMinutes": 20,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g potatoes, boiled and mashed",
    "300 g minced beef, cooked with onion and spices",
    "1 egg, 2 tbsp flour",
    "Salt, pepper, parsley",
    "Oil for frying"
   ],
   "fr": [
    "500 g de pommes de terre bouillies et écrasées",
    "300 g de bœuf haché cuit avec oignon et épices",
    "1 œuf, 2 c. à soupe de farine",
    "Sel, poivre, persil",
    "Huile pour la cuisson"
   ]
  },
  "steps": {
   "en": [
    "Mix the mash with the cooked mince, egg, flour, parsley, salt and pepper.",
    "Shape into flat patties about 1.5 cm thick.",
    "Fry in a little oil 4 minutes per side until golden."
   ],
   "fr": [
    "Mélangez la purée avec la viande cuite, l'œuf, la farine, le persil, le sel et le poivre.",
    "Façonnez des galettes plates d'environ 1,5 cm.",
    "Faites dorer dans un peu d'huile 4 minutes de chaque côté."
   ]
  },
  "serving": {
   "en": [
    "Serve with salad or a tomato sauce."
   ],
   "fr": [
    "Servez avec une salade ou une sauce tomate."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "gateaux-a-l-orange": {
  "tags": [
   "kids",
   "vegetarian",
   "occasion",
   "western"
  ],
  "prepMinutes": 15,
  "cookMinutes": 40,
  "servings": 8,
  "ingredients": {
   "en": [
    "3 eggs",
    "150 g sugar",
    "100 ml oil or 120 g melted butter",
    "Zest of 2 oranges + 150 ml orange juice",
    "250 g flour",
    "1 sachet (11 g) baking powder",
    "Glaze: 100 g icing sugar + 2 tbsp orange juice (optional)"
   ],
   "fr": [
    "3 œufs",
    "150 g de sucre",
    "100 ml d'huile ou 120 g de beurre fondu",
    "Zeste de 2 oranges + 150 ml de jus d'orange",
    "250 g de farine",
    "1 sachet (11 g) de levure chimique",
    "Glaçage : 100 g de sucre glace + 2 c. à soupe de jus d'orange (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Beat the eggs and sugar until pale and foamy.",
    "Add the oil, zest and juice, then the flour and baking powder; mix until smooth.",
    "Pour into a greased cake tin.",
    "Bake at 180 °C for 35 to 40 minutes, until a knife comes out clean.",
    "Cool, then drizzle with the glaze if you like."
   ],
   "fr": [
    "Battez les œufs et le sucre jusqu'à ce que le mélange blanchisse et mousse.",
    "Ajoutez l'huile, le zeste et le jus, puis la farine et la levure ; mélangez jusqu'à ce que ce soit lisse.",
    "Versez dans un moule beurré.",
    "Faites cuire à 180 °C 35 à 40 minutes, jusqu'à ce qu'un couteau ressorte sec.",
    "Laissez refroidir, puis nappez de glaçage si vous voulez."
   ]
  },
  "serving": {
   "en": [
    "Serve in slices with tea or juice."
   ],
   "fr": [
    "Servez en tranches avec du thé ou du jus."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "goyave-passion": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "4 ripe guavas",
    "5 passion fruits",
    "1 litre cold water",
    "5 tbsp sugar, juice of ½ lime",
    "Ice"
   ],
   "fr": [
    "4 goyaves mûres",
    "5 fruits de la passion",
    "1 litre d'eau froide",
    "5 c. à soupe de sucre, jus d'½ citron vert",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Wash and cut the guavas; blend them with half the water and strain well (guava seeds are hard).",
    "Pulse the passion fruit pulp briefly with the rest of the water and strain.",
    "Mix both juices with the sugar and lime. Chill."
   ],
   "fr": [
    "Lavez et coupez les goyaves ; mixez-les avec la moitié de l'eau et filtrez bien (les graines de goyave sont dures).",
    "Mixez brièvement la pulpe des fruits de la passion avec le reste de l'eau et filtrez.",
    "Mélangez les deux jus avec le sucre et le citron. Mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "gratin-de-pommes": {
  "tags": [
   "vegetarian",
   "kids",
   "western"
  ],
  "prepMinutes": 20,
  "cookMinutes": 45,
  "servings": 6,
  "ingredients": {
   "en": [
    "1.2 kg potatoes",
    "400 ml milk + 200 ml cream (or all milk)",
    "2 cloves garlic",
    "100 g grated cheese",
    "Butter, salt, pepper, nutmeg"
   ],
   "fr": [
    "1,2 kg de pommes de terre",
    "400 ml de lait + 200 ml de crème (ou tout en lait)",
    "2 gousses d'ail",
    "100 g de fromage râpé",
    "Beurre, sel, poivre, muscade"
   ]
  },
  "steps": {
   "en": [
    "Peel the potatoes and slice them thin (3 mm).",
    "Simmer the slices 10 minutes in the milk and cream with the crushed garlic, salt, pepper and nutmeg, stirring gently.",
    "Butter a baking dish, pour in the potatoes and their milk, and top with the cheese.",
    "Bake at 180 °C for 35 to 45 minutes, until golden and a knife goes through easily."
   ],
   "fr": [
    "Épluchez les pommes de terre et coupez-les en fines rondelles (3 mm).",
    "Faites frémir les rondelles 10 minutes dans le lait et la crème avec l'ail écrasé, le sel, le poivre et la muscade, en remuant doucement.",
    "Beurrez un plat, versez les pommes de terre et leur lait, et couvrez de fromage.",
    "Faites cuire au four à 180 °C 35 à 45 minutes, jusqu'à ce que ce soit doré et qu'un couteau passe facilement."
   ]
  },
  "serving": {
   "en": [
    "Serve with grilled meat, chicken or a green salad."
   ],
   "fr": [
    "Servez avec une viande grillée, du poulet ou une salade verte."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "hache-viande": {
  "tags": [
   "quick",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 25,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g minced beef",
    "1 onion, 2 cloves garlic",
    "2 tomatoes (or 2 tbsp tomato paste)",
    "1 carrot, grated (optional)",
    "2 tbsp oil, 1 cube, thyme, salt, pepper"
   ],
   "fr": [
    "500 g de viande hachée de bœuf",
    "1 oignon, 2 gousses d'ail",
    "2 tomates (ou 2 c. à soupe de concentré)",
    "1 carotte râpée (facultatif)",
    "2 c. à soupe d'huile, 1 cube, thym, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Fry the onion and garlic in the oil for 2 minutes.",
    "Add the mince and break it up with a spoon; cook until it is no longer pink.",
    "Add the tomatoes, carrot, thyme and cube with a little water, and simmer 15 minutes until thick."
   ],
   "fr": [
    "Faites revenir l'oignon et l'ail dans l'huile 2 minutes.",
    "Ajoutez la viande hachée et émiettez-la à la cuillère ; laissez cuire jusqu'à ce qu'elle ne soit plus rose.",
    "Ajoutez les tomates, la carotte, le thym et le cube avec un peu d'eau, et laissez mijoter 15 minutes jusqu'à ce que ce soit épais."
   ]
  },
  "serving": {
   "en": [
    "Serve with rice, pasta, mashed potatoes or in bread."
   ],
   "fr": [
    "Servez avec du riz, des pâtes, de la purée ou dans du pain."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "hachis-parmentier": {
  "name": "Hachis parmentier",
  "section": "wednesday",
  "tags": [
   "kids",
   "western"
  ],
  "prepMinutes": 25,
  "cookMinutes": 30,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg potatoes",
    "500 g minced beef",
    "1 onion, 2 cloves garlic",
    "2 tbsp tomato paste, thyme",
    "200 ml milk, 40 g butter",
    "60 g grated cheese",
    "Salt, pepper, nutmeg"
   ],
   "fr": [
    "1 kg de pommes de terre",
    "500 g de bœuf haché",
    "1 oignon, 2 gousses d'ail",
    "2 c. à soupe de concentré de tomate, thym",
    "200 ml de lait, 40 g de beurre",
    "60 g de fromage râpé",
    "Sel, poivre, muscade"
   ]
  },
  "steps": {
   "en": [
    "Boil the peeled potatoes until soft, then mash with the warm milk, butter, salt and nutmeg.",
    "Fry the onion and garlic, add the mince and cook until browned; stir in the tomato paste, thyme, salt and pepper and cook 5 minutes.",
    "Spread the meat in a baking dish and cover with the mash.",
    "Sprinkle with cheese and bake at 200 °C for 20 to 25 minutes until golden."
   ],
   "fr": [
    "Faites bouillir les pommes de terre épluchées jusqu'à ce qu'elles soient tendres, puis écrasez-les avec le lait chaud, le beurre, le sel et la muscade.",
    "Faites revenir l'oignon et l'ail, ajoutez la viande et faites-la dorer ; ajoutez le concentré, le thym, le sel et le poivre et laissez cuire 5 minutes.",
    "Étalez la viande dans un plat et couvrez de purée.",
    "Parsemez de fromage et faites gratiner au four à 200 °C 20 à 25 minutes."
   ]
  },
  "serving": {
   "en": [
    "Serve with a green salad."
   ],
   "fr": [
    "Servez avec une salade verte."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "haricots-blancs-frit": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 75,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g white beans, soaked overnight",
    "2 onions, 2 tomatoes",
    "4 tbsp oil (or palm oil)",
    "1 cube, salt, pepper"
   ],
   "fr": [
    "500 g de haricots blancs trempés la veille",
    "2 oignons, 2 tomates",
    "4 c. à soupe d'huile (ou d'huile de palme)",
    "1 cube, sel, piment"
   ]
  },
  "steps": {
   "en": [
    "Drain the soaked beans and cook them in fresh water 1 hour or more, until very soft. Salt at the end and drain.",
    "Heat the oil and fry the sliced onions until golden.",
    "Add the chopped tomatoes, cube and pepper and cook 5 minutes.",
    "Add the beans and fry 10 minutes, stirring now and then, until they soak up the sauce."
   ],
   "fr": [
    "Égouttez les haricots trempés et faites-les cuire dans de l'eau neuve 1 heure ou plus, jusqu'à ce qu'ils soient très tendres. Salez à la fin et égouttez.",
    "Chauffez l'huile et faites dorer les oignons émincés.",
    "Ajoutez les tomates hachées, le cube et le piment et laissez cuire 5 minutes.",
    "Ajoutez les haricots et faites-les frire 10 minutes en remuant de temps en temps, pour qu'ils prennent la sauce."
   ]
  },
  "serving": {
   "en": [
    "Serve with beignets (BH), rice, bread or fried plantain."
   ],
   "fr": [
    "Servez avec des beignets (BH), du riz, du pain ou du plantain frit."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Afrik – Beignets-haricots",
    "url": "https://www.afrik.com/beignets-haricots-le-plat-mythique-des-camerounais"
   }
  ]
 },
 "haricots-frit": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 75,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g red beans, soaked overnight",
    "2 onions, 2 tomatoes",
    "4 tbsp oil (or palm oil)",
    "1 cube, salt, pepper"
   ],
   "fr": [
    "500 g de haricots rouges trempés la veille",
    "2 oignons, 2 tomates",
    "4 c. à soupe d'huile (ou d'huile de palme)",
    "1 cube, sel, piment"
   ]
  },
  "steps": {
   "en": [
    "Drain the soaked beans and cook them in fresh water 1 hour or more, until very soft. Salt at the end and drain.",
    "Heat the oil and fry the sliced onions until golden.",
    "Add the chopped tomatoes, cube and pepper and cook 5 minutes.",
    "Add the beans and fry 10 minutes, stirring now and then, until they soak up the sauce."
   ],
   "fr": [
    "Égouttez les haricots trempés et faites-les cuire dans de l'eau neuve 1 heure ou plus, jusqu'à ce qu'ils soient très tendres. Salez à la fin et égouttez.",
    "Chauffez l'huile et faites dorer les oignons émincés.",
    "Ajoutez les tomates hachées, le cube et le piment et laissez cuire 5 minutes.",
    "Ajoutez les haricots et faites-les frire 10 minutes en remuant de temps en temps, pour qu'ils prennent la sauce."
   ]
  },
  "serving": {
   "en": [
    "Serve with beignets (BH), rice, bread or fried plantain."
   ],
   "fr": [
    "Servez avec des beignets (BH), du riz, du pain ou du plantain frit."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Afrik – Beignets-haricots",
    "url": "https://www.afrik.com/beignets-haricots-le-plat-mythique-des-camerounais"
   }
  ]
 },
 "haricots-noirs-frit": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 75,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g black beans, soaked overnight",
    "2 onions, 2 tomatoes",
    "4 tbsp oil (or palm oil)",
    "1 cube, salt, pepper"
   ],
   "fr": [
    "500 g de haricots noirs trempés la veille",
    "2 oignons, 2 tomates",
    "4 c. à soupe d'huile (ou d'huile de palme)",
    "1 cube, sel, piment"
   ]
  },
  "steps": {
   "en": [
    "Drain the soaked beans and cook them in fresh water 1 hour or more, until very soft. Salt at the end and drain.",
    "Heat the oil and fry the sliced onions until golden.",
    "Add the chopped tomatoes, cube and pepper and cook 5 minutes.",
    "Add the beans and fry 10 minutes, stirring now and then, until they soak up the sauce."
   ],
   "fr": [
    "Égouttez les haricots trempés et faites-les cuire dans de l'eau neuve 1 heure ou plus, jusqu'à ce qu'ils soient très tendres. Salez à la fin et égouttez.",
    "Chauffez l'huile et faites dorer les oignons émincés.",
    "Ajoutez les tomates hachées, le cube et le piment et laissez cuire 5 minutes.",
    "Ajoutez les haricots et faites-les frire 10 minutes en remuant de temps en temps, pour qu'ils prennent la sauce."
   ]
  },
  "serving": {
   "en": [
    "Serve with beignets (BH), rice, bread or fried plantain."
   ],
   "fr": [
    "Servez avec des beignets (BH), du riz, du pain ou du plantain frit."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Afrik – Beignets-haricots",
    "url": "https://www.afrik.com/beignets-haricots-le-plat-mythique-des-camerounais"
   }
  ]
 },
 "igname-blanc-sautes": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 15,
  "cookMinutes": 35,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg white yam",
    "2 onions, 2 tomatoes, 1 green pepper",
    "4 tbsp oil",
    "1 cube, salt, pepper",
    "Parsley"
   ],
   "fr": [
    "1 kg d'igname blanche",
    "2 oignons, 2 tomates, 1 poivron",
    "4 c. à soupe d'huile",
    "1 cube, sel, piment",
    "Persil"
   ]
  },
  "steps": {
   "en": [
    "Peel the yam, cut it in cubes and boil 15 to 20 minutes in salted water until tender but firm. Drain.",
    "Fry the onions and pepper in the oil, then add the tomatoes and cube; cook 5 minutes.",
    "Add the yam and sauté 8 minutes until lightly golden in places. Finish with parsley."
   ],
   "fr": [
    "Épluchez l'igname, coupez-la en cubes et faites-la bouillir 15 à 20 minutes à l'eau salée, tendre mais ferme. Égouttez.",
    "Faites revenir les oignons et le poivron dans l'huile, puis ajoutez les tomates et le cube ; laissez cuire 5 minutes.",
    "Ajoutez l'igname et faites sauter 8 minutes jusqu'à ce qu'elle dore par endroits. Terminez avec le persil."
   ]
  },
  "serving": {
   "en": [
    "Serve with eggs, fish or meat."
   ],
   "fr": [
    "Servez avec des œufs, du poisson ou de la viande."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "irish-balls": {
  "tags": [
   "kids",
   "snack",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 20,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg Irish potatoes",
    "2 tbsp butter, salt, pepper",
    "1 small onion, finely chopped, parsley",
    "2 eggs, beaten",
    "100 g breadcrumbs",
    "Oil for frying"
   ],
   "fr": [
    "1 kg de pommes de terre",
    "2 c. à soupe de beurre, sel, poivre",
    "1 petit oignon finement haché, persil",
    "2 œufs battus",
    "100 g de chapelure",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Boil the potatoes until soft, drain well and mash with the butter, salt, pepper, onion and parsley.",
    "Let the mash cool, then roll into balls the size of a small egg.",
    "Dip each ball in beaten egg, then roll in breadcrumbs.",
    "Fry in hot oil 3 to 4 minutes until golden all over. Drain."
   ],
   "fr": [
    "Faites bouillir les pommes de terre jusqu'à ce qu'elles soient tendres, égouttez bien et écrasez-les avec le beurre, le sel, le poivre, l'oignon et le persil.",
    "Laissez refroidir la purée, puis formez des boules de la taille d'un petit œuf.",
    "Trempez chaque boule dans l'œuf battu, puis roulez-la dans la chapelure.",
    "Faites frire dans l'huile chaude 3 à 4 minutes jusqu'à ce qu'elles soient dorées. Égouttez."
   ]
  },
  "serving": {
   "en": [
    "Serve as a snack with ketchup or a chili dip."
   ],
   "fr": [
    "Servez en snack avec du ketchup ou une sauce pimentée."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Cookpad – Irish potato balls",
    "url": "https://cookpad.wasmer.app/ng/recipes/5048151-irish-potatoes-balls"
   }
  ]
 },
 "jus-d-orange": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "8 oranges",
    "1 to 2 tbsp sugar (optional)",
    "Ice"
   ],
   "fr": [
    "8 oranges",
    "1 à 2 c. à soupe de sucre (facultatif)",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Roll the oranges on the table to soften them, then cut in half.",
    "Squeeze them with a juicer or by hand.",
    "Strain out the seeds, sweeten if needed and chill."
   ],
   "fr": [
    "Roulez les oranges sur la table pour les attendrir, puis coupez-les en deux.",
    "Pressez-les au presse-agrumes ou à la main.",
    "Filtrez les pépins, sucrez si besoin et mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "jus-de-mangue": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "3 ripe mangoes",
    "500 ml cold water",
    "Juice of ½ lime",
    "Sugar to taste",
    "Ice"
   ],
   "fr": [
    "3 mangues mûres",
    "500 ml d'eau froide",
    "Jus d'½ citron vert",
    "Sucre selon le goût",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Peel the mangoes and cut the flesh off the stone.",
    "Blend with the water, lime and sugar until smooth.",
    "Strain if the mangoes are fibrous, then chill."
   ],
   "fr": [
    "Épluchez les mangues et détachez la chair du noyau.",
    "Mixez avec l'eau, le citron et le sucre jusqu'à ce que ce soit lisse.",
    "Filtrez si les mangues sont filandreuses, puis mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "jus-de-papaye": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 ripe papaya (about 1 kg)",
    "Juice of 1 lime",
    "500 ml cold water",
    "2 to 3 tbsp sugar",
    "Ice"
   ],
   "fr": [
    "1 papaye mûre (environ 1 kg)",
    "Jus d'un citron vert",
    "500 ml d'eau froide",
    "2 à 3 c. à soupe de sucre",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Peel the papaya, remove the black seeds and cut the flesh in pieces.",
    "Blend with the water, lime juice and sugar until smooth.",
    "Strain if you like it thin, and taste: lime brings papaya to life."
   ],
   "fr": [
    "Épluchez la papaye, retirez les graines noires et coupez la chair en morceaux.",
    "Mixez avec l'eau, le jus de citron et le sucre jusqu'à ce que ce soit lisse.",
    "Filtrez si vous l'aimez fluide, et goûtez : le citron réveille la papaye."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "jus-de-pomme": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "6 apples",
    "500 ml water",
    "Juice of ½ lemon",
    "1 to 2 tbsp sugar (optional)",
    "1 pinch cinnamon (optional)"
   ],
   "fr": [
    "6 pommes",
    "500 ml d'eau",
    "Jus d'½ citron",
    "1 à 2 c. à soupe de sucre (facultatif)",
    "1 pincée de cannelle (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Wash, core and cut the apples (no need to peel).",
    "Blend with the water and lemon juice.",
    "Strain through a fine sieve or cloth, pressing well. Sweeten, add cinnamon and chill."
   ],
   "fr": [
    "Lavez, épépinez et coupez les pommes (pas besoin de les éplucher).",
    "Mixez avec l'eau et le jus de citron.",
    "Filtrez dans une passoire fine ou un linge en pressant bien. Sucrez, ajoutez la cannelle et mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "jus-digestion": {
  "tags": [
   "vegetarian"
  ],
  "prepMinutes": 15,
  "cookMinutes": 0,
  "servings": 6,
  "ingredients": {
   "en": [
    "200 g fresh ginger",
    "½ ripe pineapple",
    "2 limes",
    "A handful of mint leaves",
    "1.5 litres water",
    "Sugar or honey to taste"
   ],
   "fr": [
    "200 g de gingembre frais",
    "½ ananas mûr",
    "2 citrons verts",
    "Une poignée de feuilles de menthe",
    "1,5 litre d'eau",
    "Sucre ou miel selon le goût"
   ]
  },
  "steps": {
   "en": [
    "Wash and roughly chop the ginger (no need to peel). Peel and cut the pineapple.",
    "Blend the ginger and pineapple with half the water.",
    "Strain through a fine sieve or cloth, pressing well.",
    "Add the rest of the water, the lime juice, mint and sugar. Taste: if it's too strong, add water or pineapple. Chill."
   ],
   "fr": [
    "Lavez et coupez grossièrement le gingembre (pas besoin de l'éplucher). Épluchez et coupez l'ananas.",
    "Mixez le gingembre et l'ananas avec la moitié de l'eau.",
    "Filtrez dans une passoire fine ou un linge en pressant bien.",
    "Ajoutez le reste de l'eau, le jus des citrons, la menthe et le sucre. Goûtez : si c'est trop fort, ajoutez de l'eau ou de l'ananas. Mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Drink a small glass after a heavy meal. Keeps 3 days in the fridge."
   ],
   "fr": [
    "Buvez un petit verre après un repas copieux. Se garde 3 jours au frais."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Île aux épices – Jus de gingembre",
    "url": "https://ileauxepices.com/blog/2018/03/09/recette-jus-de-gingembre-ou-gnamakoudji-senegal/wpid16250/"
   },
   {
    "label": "Allodocteurs – Recettes de jus",
    "url": "https://www.allodocteurs.fr/bissap-gingembre-pasteque-5-recettes-pour-des-jus-qui-nous-veulent-du-bien-44344.html"
   }
  ]
 },
 "jus-gateau": {
  "tags": [
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 35,
  "servings": 8,
  "ingredients": {
   "en": [
    "Juice: 4 oranges or 1 small pineapple, sugar to taste",
    "Cake: 3 eggs, 150 g sugar, 100 ml oil, 125 ml milk, 250 g flour, 1 sachet baking powder, vanilla"
   ],
   "fr": [
    "Jus : 4 oranges ou 1 petit ananas, sucre selon le goût",
    "Gâteau : 3 œufs, 150 g de sucre, 100 ml d'huile, 125 ml de lait, 250 g de farine, 1 sachet de levure, vanille"
   ]
  },
  "steps": {
   "en": [
    "Cake: beat the eggs and sugar, add the oil, milk and vanilla, then the flour and baking powder.",
    "Bake in a greased tin at 180 °C for 30 to 35 minutes. Let it cool.",
    "Juice: squeeze the oranges (or blend the peeled pineapple with a glass of water and strain). Sweeten and chill."
   ],
   "fr": [
    "Gâteau : battez les œufs et le sucre, ajoutez l'huile, le lait et la vanille, puis la farine et la levure.",
    "Faites cuire dans un moule beurré à 180 °C 30 à 35 minutes. Laissez refroidir.",
    "Jus : pressez les oranges (ou mixez l'ananas épluché avec un verre d'eau et filtrez). Sucrez et mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve a slice of cake with a cold glass of juice."
   ],
   "fr": [
    "Servez une part de gâteau avec un verre de jus bien frais."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "lait": {
  "tags": [
   "quick",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 1,
  "cookMinutes": 3,
  "servings": 1,
  "ingredients": {
   "en": [
    "250 ml milk (fresh, or 3 tbsp powdered milk + 250 ml water)",
    "1 tsp sugar or honey (optional)",
    "1 tsp cocoa or a drop of vanilla (optional)"
   ],
   "fr": [
    "250 ml de lait (frais, ou 3 c. à soupe de lait en poudre + 250 ml d'eau)",
    "1 c. à café de sucre ou de miel (facultatif)",
    "1 c. à café de cacao ou une goutte de vanille (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "With powder, whisk it into a little warm water first, then add the rest of the water.",
    "Warm the milk gently (don't let it boil over), or serve it cold.",
    "Stir in sugar, cocoa or vanilla if you like."
   ],
   "fr": [
    "Avec de la poudre, délayez-la d'abord dans un peu d'eau tiède, puis ajoutez le reste de l'eau.",
    "Chauffez le lait doucement (sans le laisser déborder), ou servez-le froid.",
    "Ajoutez sucre, cacao ou vanille si vous voulez."
   ]
  },
  "serving": {
   "en": [
    "With bread, biscuits or cereal."
   ],
   "fr": [
    "Avec du pain, des biscuits ou des céréales."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "lasagnes": {
  "name": "Lasagnes",
  "section": "saturday",
  "tags": [
   "occasion",
   "kids",
   "western"
  ],
  "prepMinutes": 30,
  "cookMinutes": 45,
  "servings": 6,
  "ingredients": {
   "en": [
    "12 lasagne sheets",
    "Bolognese sauce: 500 g minced beef, 1 onion, 2 cloves garlic, 600 g crushed tomatoes, herbs, salt, pepper",
    "Béchamel: 50 g butter, 50 g flour, 700 ml milk, nutmeg, salt",
    "150 g grated cheese"
   ],
   "fr": [
    "12 feuilles de lasagne",
    "Sauce bolognaise : 500 g de bœuf haché, 1 oignon, 2 gousses d'ail, 600 g de tomates concassées, herbes, sel, poivre",
    "Béchamel : 50 g de beurre, 50 g de farine, 700 ml de lait, muscade, sel",
    "150 g de fromage râpé"
   ]
  },
  "steps": {
   "en": [
    "Make the bolognese: fry the onion and garlic, brown the mince, add the tomatoes and herbs and simmer 20 minutes.",
    "Make the béchamel: melt the butter, stir in the flour 1 minute, whisk in the milk and cook until thick; season with salt and nutmeg.",
    "In a baking dish, layer: a little sauce, lasagne sheets, bolognese, béchamel, cheese. Repeat 3 times, ending with béchamel and cheese.",
    "Bake at 180 °C for 40 to 45 minutes until bubbling and golden. Rest 10 minutes before cutting."
   ],
   "fr": [
    "Préparez la bolognaise : faites revenir l'oignon et l'ail, faites dorer la viande, ajoutez les tomates et les herbes et laissez mijoter 20 minutes.",
    "Préparez la béchamel : faites fondre le beurre, ajoutez la farine 1 minute, versez le lait en fouettant et laissez épaissir ; salez et ajoutez la muscade.",
    "Dans un plat, alternez : un peu de sauce, des feuilles de lasagne, de la bolognaise, de la béchamel, du fromage. Recommencez 3 fois, en finissant par béchamel et fromage.",
    "Faites cuire au four à 180 °C 40 à 45 minutes jusqu'à ce que ce soit doré et bouillonnant. Laissez reposer 10 minutes avant de couper."
   ]
  },
  "serving": {
   "en": [
    "Serve with a green salad."
   ],
   "fr": [
    "Servez avec une salade verte."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "legumes-sautes": {
  "tags": [
   "quick",
   "vegetarian",
   "budget"
  ],
  "prepMinutes": 15,
  "cookMinutes": 12,
  "servings": 4,
  "ingredients": {
   "en": [
    "2 carrots, 1 zucchini, 1 green pepper",
    "1 handful green beans, ¼ cabbage",
    "1 onion, 2 cloves garlic",
    "3 tbsp oil",
    "1 cube or soy sauce, salt, pepper"
   ],
   "fr": [
    "2 carottes, 1 courgette, 1 poivron",
    "1 poignée de haricots verts, ¼ de chou",
    "1 oignon, 2 gousses d'ail",
    "3 c. à soupe d'huile",
    "1 cube ou de la sauce soja, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Cut all the vegetables in thin strips of the same size.",
    "Heat the oil over high heat and fry the onion and garlic 1 minute.",
    "Add the hardest vegetables first (carrots, beans) for 4 minutes, then the rest for 4 more.",
    "Season with the cube or soy sauce; they should stay bright and crunchy."
   ],
   "fr": [
    "Coupez tous les légumes en fines lanières de même taille.",
    "Chauffez l'huile à feu vif et faites revenir l'oignon et l'ail 1 minute.",
    "Ajoutez d'abord les légumes les plus durs (carottes, haricots) 4 minutes, puis le reste 4 minutes.",
    "Assaisonnez avec le cube ou la sauce soja ; ils doivent rester colorés et croquants."
   ]
  },
  "serving": {
   "en": [
    "A side for grilled meat or fish, or a meal with rice."
   ],
   "fr": [
    "En accompagnement d'une viande ou d'un poisson grillé, ou en plat avec du riz."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "lemon": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "3 lemons + 1 extra for slices",
    "1 litre cold water (or sparkling water)",
    "100 g sugar",
    "1 small piece of ginger (optional)",
    "Ice"
   ],
   "fr": [
    "3 citrons + 1 pour les rondelles",
    "1 litre d'eau froide (ou gazeuse)",
    "100 g de sucre",
    "1 petit morceau de gingembre (facultatif)",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Make a syrup: warm 200 ml of the water with the sugar (and grated ginger) until dissolved. Let it cool.",
    "Squeeze the lemons and mix the juice with the syrup.",
    "Top up with the cold (or sparkling) water and add lemon slices and ice."
   ],
   "fr": [
    "Préparez un sirop : chauffez 200 ml d'eau avec le sucre (et le gingembre râpé) jusqu'à dissolution. Laissez refroidir.",
    "Pressez les citrons et mélangez le jus au sirop.",
    "Complétez avec l'eau froide (ou gazeuse) et ajoutez des rondelles de citron et des glaçons."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "limonade-mangue": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "2 ripe mangoes",
    "3 limes",
    "1 litre cold water (or sparkling)",
    "80 g sugar",
    "Mint, ice"
   ],
   "fr": [
    "2 mangues mûres",
    "3 citrons verts",
    "1 litre d'eau froide (ou gazeuse)",
    "80 g de sucre",
    "Menthe, glaçons"
   ]
  },
  "steps": {
   "en": [
    "Blend the mango flesh with the lime juice, sugar and half the water.",
    "Strain, then top up with the rest of the water (sparkling for fizz).",
    "Add mint and ice."
   ],
   "fr": [
    "Mixez la chair des mangues avec le jus de citron, le sucre et la moitié de l'eau.",
    "Filtrez, puis complétez avec le reste de l'eau (gazeuse pour des bulles).",
    "Ajoutez la menthe et les glaçons."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "macabo-ndole-saute": {
  "tags": [],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg macabo",
    "300 g washed ndolé leaves (ready to cook)",
    "200 g beef or shrimp, cooked",
    "2 onions, 2 cloves garlic",
    "4 tbsp oil",
    "1 stock cube, salt, pepper"
   ],
   "fr": [
    "1 kg de macabo",
    "300 g de ndolé lavé (prêt à cuire)",
    "200 g de bœuf ou de crevettes cuits",
    "2 oignons, 2 gousses d'ail",
    "4 c. à soupe d'huile",
    "1 cube, sel, piment"
   ]
  },
  "steps": {
   "en": [
    "Peel the macabo, cut in large cubes and boil in salted water 20 minutes until just tender. Drain.",
    "Heat the oil and fry the sliced onions and garlic until golden.",
    "Add the meat or shrimp and the ndolé, crumble in the cube and sauté 5 minutes.",
    "Add the macabo and toss gently for 5 minutes so it picks up the flavour without breaking. Season."
   ],
   "fr": [
    "Épluchez le macabo, coupez-le en gros cubes et faites-le bouillir à l'eau salée 20 minutes, juste tendre. Égouttez.",
    "Chauffez l'huile, faites dorer les oignons émincés et l'ail.",
    "Ajoutez la viande ou les crevettes et le ndolé, émiettez le cube et faites sauter 5 minutes.",
    "Ajoutez le macabo et mélangez doucement 5 minutes pour qu'il prenne le goût sans s'écraser. Assaisonnez."
   ]
  },
  "serving": {
   "en": [
    "A one-pan meal: serve hot, with ripe fried plantain if you like."
   ],
   "fr": [
    "Un plat complet : servez chaud, avec du plantain mûr frit si vous voulez."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "macabo-saute": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 15,
  "cookMinutes": 35,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg macabo",
    "200 g smoked fish or meat (optional)",
    "2 onions, 2 tomatoes",
    "4 tbsp oil (or palm oil)",
    "1 cube, salt, pepper"
   ],
   "fr": [
    "1 kg de macabo",
    "200 g de poisson fumé ou de viande (facultatif)",
    "2 oignons, 2 tomates",
    "4 c. à soupe d'huile (ou d'huile de palme)",
    "1 cube, sel, piment"
   ]
  },
  "steps": {
   "en": [
    "Peel, cube and boil the macabo 20 minutes in salted water, until just tender. Drain.",
    "Fry the onions in the oil, add the chopped tomatoes and the fish or meat; cook 8 minutes.",
    "Add the macabo and the cube, and sauté gently 5 minutes until coated."
   ],
   "fr": [
    "Épluchez, coupez en cubes et faites bouillir le macabo 20 minutes à l'eau salée, juste tendre. Égouttez.",
    "Faites revenir les oignons dans l'huile, ajoutez les tomates hachées et le poisson ou la viande ; laissez cuire 8 minutes.",
    "Ajoutez le macabo et le cube, et faites sauter doucement 5 minutes pour bien l'enrober."
   ]
  },
  "serving": {
   "en": [
    "Serve hot with avocado or a green salad."
   ],
   "fr": [
    "Servez chaud avec de l'avocat ou une salade verte."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "mangue-citron": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "3 ripe mangoes",
    "2 limes",
    "600 ml cold water",
    "Sugar to taste"
   ],
   "fr": [
    "3 mangues mûres",
    "2 citrons verts",
    "600 ml d'eau froide",
    "Sucre selon le goût"
   ]
  },
  "steps": {
   "en": [
    "Blend the mango flesh with the water and the juice of the limes.",
    "Sweeten to taste, strain if needed and chill."
   ],
   "fr": [
    "Mixez la chair des mangues avec l'eau et le jus des citrons.",
    "Sucrez selon le goût, filtrez si besoin et mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "mangue-coco": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "3 ripe mangoes",
    "400 ml coconut milk",
    "300 ml cold water",
    "Sugar to taste",
    "Ice"
   ],
   "fr": [
    "3 mangues mûres",
    "400 ml de lait de coco",
    "300 ml d'eau froide",
    "Sucre selon le goût",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Blend the mango flesh with the coconut milk and water until smooth and creamy.",
    "Sweeten to taste and chill."
   ],
   "fr": [
    "Mixez la chair des mangues avec le lait de coco et l'eau jusqu'à ce que ce soit lisse et crémeux.",
    "Sucrez selon le goût et mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "mangue-passion": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "2 ripe mangoes",
    "5 passion fruits",
    "800 ml cold water",
    "Sugar to taste",
    "Ice"
   ],
   "fr": [
    "2 mangues mûres",
    "5 fruits de la passion",
    "800 ml d'eau froide",
    "Sucre selon le goût",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Pulse the passion fruit pulp briefly with half the water and strain out the seeds.",
    "Blend the mango flesh with this juice and the rest of the water.",
    "Sweeten and chill."
   ],
   "fr": [
    "Mixez brièvement la pulpe des fruits de la passion avec la moitié de l'eau et filtrez les graines.",
    "Mixez la chair des mangues avec ce jus et le reste de l'eau.",
    "Sucrez et mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "manioc-fromage": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 15,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "800 g cassava, boiled and mashed",
    "100 g grated cheese",
    "1 egg",
    "Salt, pepper, parsley",
    "Oil for frying (or bake)"
   ],
   "fr": [
    "800 g de manioc bouilli et écrasé",
    "100 g de fromage râpé",
    "1 œuf",
    "Sel, poivre, persil",
    "Huile de friture (ou cuisson au four)"
   ]
  },
  "steps": {
   "en": [
    "Mash the warm cassava (remove any fibres) with the egg, half the cheese, salt, pepper and parsley.",
    "Shape into small balls and push a piece of the remaining cheese into the centre of each.",
    "Fry 4 minutes until golden, or bake at 200 °C for 20 minutes."
   ],
   "fr": [
    "Écrasez le manioc tiède (en retirant les fibres) avec l'œuf, la moitié du fromage, le sel, le poivre et le persil.",
    "Formez de petites boules et enfoncez un morceau du fromage restant au centre de chacune.",
    "Faites frire 4 minutes jusqu'à ce qu'elles soient dorées, ou faites cuire au four à 200 °C 20 minutes."
   ]
  },
  "serving": {
   "en": [
    "Serve warm, with a tomato or chili dip."
   ],
   "fr": [
    "Servez tiède, avec une sauce tomate ou pimentée."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "met-d-arachide": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 30,
  "cookMinutes": 120,
  "servings": 8,
  "ingredients": {
   "en": [
    "1 kg raw peanuts",
    "300 g smoked or dried fish (or meat)",
    "2 tbsp ground crayfish",
    "1 onion, 2 cloves garlic",
    "1 hot pepper",
    "Salt",
    "Banana leaves and string"
   ],
   "fr": [
    "1 kg d'arachides crues",
    "300 g de poisson fumé ou séché (ou de viande)",
    "2 c. à soupe d'écrevisses moulues",
    "1 oignon, 2 gousses d'ail",
    "1 piment",
    "Sel",
    "Feuilles de bananier et ficelle"
   ]
  },
  "steps": {
   "en": [
    "Soak the peanuts 1 hour in warm water and rub off the red skins.",
    "Grind them very finely with the onion, garlic and pepper, adding a little water, until you get a smooth, thick paste.",
    "Beat the paste with a wooden spoon for a few minutes, then mix in the crayfish, flaked fish and salt.",
    "Spoon portions onto wilted banana leaves, fold into tight parcels and tie.",
    "Steam in a large pot over a little water (with stems at the bottom) for about 2 hours, topping up water as needed."
   ],
   "fr": [
    "Faites tremper les arachides 1 heure dans de l'eau tiède et frottez-les pour enlever les peaux rouges.",
    "Écrasez-les très finement avec l'oignon, l'ail et le piment en ajoutant un peu d'eau, jusqu'à obtenir une pâte lisse et épaisse.",
    "Battez la pâte quelques minutes à la cuillère en bois, puis ajoutez les écrevisses, le poisson émietté et le sel.",
    "Déposez des portions sur des feuilles de bananier passées à la flamme, pliez en paquets serrés et ficelez.",
    "Faites cuire à la vapeur dans une grande marmite sur un peu d'eau (avec des tiges au fond) environ 2 heures, en rajoutant de l'eau si besoin."
   ]
  },
  "serving": {
   "en": [
    "Serve with boiled cassava, bobolo or ripe plantain."
   ],
   "fr": [
    "Servez avec du manioc bouilli, du bâton de manioc ou du plantain mûr."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Vikidia – Nkongui owondo",
    "url": "https://fr.vikidia.org/wiki/Nkongui_Owondo"
   },
   {
    "label": "Afrik – Le nnam owondo",
    "url": "https://www.afrik.com/cameroun-gastronomie-le-nnam-owondo-le-totem-des-beti"
   }
  ]
 },
 "oeuf-enrobes": {
  "tags": [
   "snack",
   "occasion"
  ],
  "prepMinutes": 20,
  "cookMinutes": 15,
  "servings": 6,
  "ingredients": {
   "en": [
    "6 eggs, hard-boiled and peeled",
    "400 g minced beef or sausage meat",
    "1 small onion, garlic, parsley, salt, pepper",
    "2 eggs, beaten + flour + breadcrumbs",
    "Oil for frying"
   ],
   "fr": [
    "6 œufs durs écalés",
    "400 g de bœuf haché ou de chair à saucisse",
    "1 petit oignon, ail, persil, sel, poivre",
    "2 œufs battus + farine + chapelure",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Season the meat with the grated onion, garlic, parsley, salt and pepper.",
    "Flour each boiled egg, then wrap it in a thin, even layer of meat with wet hands.",
    "Roll in flour, then beaten egg, then breadcrumbs.",
    "Fry in medium oil 6 to 8 minutes, turning, until golden and the meat is cooked through. Cut in half."
   ],
   "fr": [
    "Assaisonnez la viande avec l'oignon râpé, l'ail, le persil, le sel et le poivre.",
    "Farinez chaque œuf dur, puis enrobez-le d'une couche fine et régulière de viande, avec les mains mouillées.",
    "Roulez dans la farine, puis l'œuf battu, puis la chapelure.",
    "Faites frire dans une huile moyenne 6 à 8 minutes en tournant, jusqu'à ce qu'ils soient dorés et la viande cuite. Coupez en deux."
   ]
  },
  "serving": {
   "en": [
    "Serve as a snack or with salad."
   ],
   "fr": [
    "Servez en snack ou avec une salade."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "oeufs-farcis": {
  "tags": [
   "kids",
   "vegetarian",
   "snack",
   "western"
  ],
  "prepMinutes": 15,
  "cookMinutes": 10,
  "servings": 4,
  "ingredients": {
   "en": [
    "6 eggs",
    "3 tbsp mayonnaise",
    "1 tsp mustard",
    "Salt, pepper, paprika",
    "Parsley or chives"
   ],
   "fr": [
    "6 œufs",
    "3 c. à soupe de mayonnaise",
    "1 c. à café de moutarde",
    "Sel, poivre, paprika",
    "Persil ou ciboulette"
   ]
  },
  "steps": {
   "en": [
    "Boil the eggs 10 minutes, cool them in cold water and peel.",
    "Cut them in half lengthways and scoop the yolks into a bowl.",
    "Mash the yolks with the mayonnaise, mustard, salt and pepper until smooth.",
    "Fill the whites with the mixture and dust with paprika and herbs."
   ],
   "fr": [
    "Faites cuire les œufs 10 minutes, refroidissez-les à l'eau froide et écalez-les.",
    "Coupez-les en deux dans la longueur et mettez les jaunes dans un bol.",
    "Écrasez les jaunes avec la mayonnaise, la moutarde, le sel et le poivre jusqu'à ce que ce soit lisse.",
    "Garnissez les blancs avec ce mélange et saupoudrez de paprika et d'herbes."
   ]
  },
  "serving": {
   "en": [
    "Serve cold as a starter or party snack."
   ],
   "fr": [
    "Servez frais en entrée ou en amuse-bouche."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "ofada-stew-red-bell-pepper": {
  "tags": [],
  "prepMinutes": 25,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "6 red bell peppers, 2 scotch bonnets, 1 onion – blended coarse",
    "250 ml palm oil",
    "500 g assorted meat (beef, tripe, cow skin), cooked, plus its stock",
    "2 tbsp locust beans (iru), 2 tbsp ground crayfish",
    "2 cubes, salt",
    "Boiled eggs (optional)"
   ],
   "fr": [
    "6 poivrons rouges, 2 piments forts, 1 oignon – mixés grossièrement",
    "250 ml d'huile de palme",
    "500 g de viandes assorties (bœuf, tripes, peau) cuites, avec leur bouillon",
    "2 c. à soupe de soumbala (iru), 2 c. à soupe d'écrevisses moulues",
    "2 cubes, sel",
    "Œufs durs (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Boil the pepper blend in a dry pot until most of the water evaporates (15 to 20 minutes).",
    "In another pot, heat the palm oil on low heat with the lid on until it turns clear (about 10 minutes – open a window), then let it cool a little.",
    "Fry the sliced onion and locust beans in the oil 2 minutes, then add the reduced peppers and fry 20 minutes, stirring, until the oil separates.",
    "Add the meats, a little stock, crayfish and cubes; simmer 10 minutes. Add the boiled eggs at the end."
   ],
   "fr": [
    "Faites bouillir les poivrons mixés dans une marmite sèche jusqu'à ce que presque toute l'eau s'évapore (15 à 20 minutes).",
    "Dans une autre marmite, chauffez l'huile de palme à feu doux, couvert, jusqu'à ce qu'elle devienne claire (environ 10 minutes – ouvrez la fenêtre), puis laissez-la tiédir un peu.",
    "Faites revenir l'oignon émincé et le soumbala dans l'huile 2 minutes, puis ajoutez les poivrons réduits et faites frire 20 minutes en remuant, jusqu'à ce que l'huile se sépare.",
    "Ajoutez les viandes, un peu de bouillon, les écrevisses et les cubes ; laissez mijoter 10 minutes. Ajoutez les œufs durs à la fin."
   ]
  },
  "serving": {
   "en": [
    "Serve with ofada or white rice, or with boiled plantain or yam."
   ],
   "fr": [
    "Servez avec du riz ofada ou du riz blanc, ou avec du plantain ou de l'igname bouillis."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "My Active Kitchen – Ofada stew",
    "url": "https://www.myactivekitchen.com/ofada-stew-recipe/"
   },
   {
    "label": "Afrifood Network – Ofada stew",
    "url": "https://afrifoodnetwork.com/recipes/soup-recipes/ofada-stew-recipe/"
   }
  ]
 },
 "okok-sucre": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 20,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g okok (gnetum) leaves, finely sliced",
    "1 kg palm nuts (or 400 g palm-nut cream)",
    "250 g peanut paste",
    "3 to 5 tbsp sugar, to taste",
    "Salt (a pinch)"
   ],
   "fr": [
    "500 g de feuilles d'okok (gnetum) finement coupées",
    "1 kg de noix de palme (ou 400 g de crème de noix de palme)",
    "250 g de pâte d'arachide",
    "3 à 5 c. à soupe de sucre, selon le goût",
    "Sel (une pincée)"
   ]
  },
  "steps": {
   "en": [
    "Wash the sliced okok in several waters and drain.",
    "Boil the palm nuts, pound them and squeeze them in warm water to get about 1 litre of juice; strain.",
    "Bring the palm-nut juice to a simmer and add the okok. Cook 30 minutes on low heat, stirring.",
    "Loosen the peanut paste with a little warm water and stir it in. Cook another 20 minutes, stirring often so it doesn't stick.",
    "Add the sugar and a pinch of salt, taste, and cook until thick and glossy."
   ],
   "fr": [
    "Lavez l'okok coupé dans plusieurs eaux et égouttez.",
    "Faites bouillir les noix de palme, pilez-les et pressez-les dans de l'eau tiède pour obtenir environ 1 litre de jus ; filtrez.",
    "Portez le jus à frémissement et ajoutez l'okok. Laissez cuire 30 minutes à feu doux en remuant.",
    "Délayez la pâte d'arachide avec un peu d'eau tiède et incorporez-la. Laissez cuire encore 20 minutes en remuant souvent pour que ça n'attache pas.",
    "Ajoutez le sucre et une pincée de sel, goûtez, et laissez épaissir jusqu'à ce que ce soit brillant."
   ]
  },
  "serving": {
   "en": [
    "Serve with boiled cassava or bobolo / miondo."
   ],
   "fr": [
    "Servez avec du manioc bouilli ou du bâton de manioc / miondo."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Cameroun24 – Okok",
    "url": "https://cameroun24.net/article/24545-la-recette-de-l-okok-ou-fumbwa.html"
   },
   {
    "label": "Vikidia – Kpweum okok",
    "url": "https://fr.vikidia.org/wiki/Kpweum_Okok"
   }
  ]
 },
 "omelette": {
  "name": "Omelette",
  "section": "breakfast",
  "tags": [
   "quick",
   "budget",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 5,
  "cookMinutes": 5,
  "servings": 1,
  "ingredients": {
   "en": [
    "3 eggs",
    "1 tbsp butter or oil",
    "Salt, pepper",
    "Filling (optional): grated cheese, ham, onion, tomato, mushrooms, herbs"
   ],
   "fr": [
    "3 œufs",
    "1 c. à soupe de beurre ou d'huile",
    "Sel, poivre",
    "Garniture (facultatif) : fromage râpé, jambon, oignon, tomate, champignons, herbes"
   ]
  },
  "steps": {
   "en": [
    "Beat the eggs with salt and pepper until just mixed.",
    "Melt the butter in a pan on medium heat and pour in the eggs.",
    "Stir gently with a spatula for 30 seconds, then let it set, tilting the pan so the runny egg goes underneath.",
    "Add the filling on one half, fold the omelette over and slide it onto a plate."
   ],
   "fr": [
    "Battez les œufs avec le sel et le poivre, juste assez pour les mélanger.",
    "Faites fondre le beurre dans une poêle à feu moyen et versez les œufs.",
    "Remuez doucement à la spatule 30 secondes, puis laissez prendre en inclinant la poêle pour que l'œuf liquide passe dessous.",
    "Mettez la garniture sur une moitié, repliez l'omelette et faites-la glisser dans l'assiette."
   ]
  },
  "serving": {
   "en": [
    "Serve with bread or a green salad."
   ],
   "fr": [
    "Servez avec du pain ou une salade verte."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pain-beurre": {
  "tags": [
   "quick",
   "budget",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 2,
  "cookMinutes": 0,
  "servings": 1,
  "ingredients": {
   "en": [
    "½ baguette or 2 slices of bread",
    "Butter",
    "Sugar, jam or honey (optional)"
   ],
   "fr": [
    "½ baguette ou 2 tranches de pain",
    "Beurre",
    "Sucre, confiture ou miel (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Open the bread (fresh or toasted).",
    "Spread with soft butter.",
    "Add a little sugar, jam or honey if you like it sweet."
   ],
   "fr": [
    "Ouvrez le pain (frais ou grillé).",
    "Tartinez de beurre mou.",
    "Ajoutez un peu de sucre, de confiture ou de miel si vous l'aimez sucré."
   ]
  },
  "serving": {
   "en": [
    "Dip it in hot tea, coffee or chocolate."
   ],
   "fr": [
    "Trempez-le dans du thé, du café ou du chocolat chaud."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pain-choco": {
  "tags": [
   "quick",
   "kids",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 2,
  "cookMinutes": 0,
  "servings": 1,
  "ingredients": {
   "en": [
    "½ baguette or 2 slices of bread",
    "2 tbsp chocolate spread",
    "½ banana (optional)"
   ],
   "fr": [
    "½ baguette ou 2 tranches de pain",
    "2 c. à soupe de pâte à tartiner au chocolat",
    "½ banane (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Open the bread and spread the chocolate.",
    "Add banana slices for a treat, close and press."
   ],
   "fr": [
    "Ouvrez le pain et tartinez de chocolat.",
    "Ajoutez des rondelles de banane pour se faire plaisir, refermez et pressez."
   ]
  },
  "serving": {
   "en": [
    "With a glass of milk."
   ],
   "fr": [
    "Avec un verre de lait."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pain-fromage": {
  "tags": [
   "quick",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 3,
  "cookMinutes": 3,
  "servings": 1,
  "ingredients": {
   "en": [
    "2 slices of bread or ½ baguette",
    "2 slices of cheese (or grated cheese)",
    "A little butter"
   ],
   "fr": [
    "2 tranches de pain ou ½ baguette",
    "2 tranches de fromage (ou du fromage râpé)",
    "Un peu de beurre"
   ]
  },
  "steps": {
   "en": [
    "Butter the bread and add the cheese.",
    "Eat as is, or toast it in a hot pan (or under the grill) 2 to 3 minutes until the cheese melts."
   ],
   "fr": [
    "Beurrez le pain et ajoutez le fromage.",
    "Mangez tel quel, ou faites-le dorer dans une poêle chaude (ou sous le gril) 2 à 3 minutes jusqu'à ce que le fromage fonde."
   ]
  },
  "serving": {
   "en": [
    "Add tomato or ham if you like."
   ],
   "fr": [
    "Ajoutez de la tomate ou du jambon si vous voulez."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pain-mayo": {
  "tags": [
   "quick",
   "budget"
  ],
  "prepMinutes": 2,
  "cookMinutes": 0,
  "servings": 1,
  "ingredients": {
   "en": [
    "½ baguette",
    "1 to 2 tbsp mayonnaise",
    "½ onion and ½ tomato, sliced thin (optional)",
    "1 boiled egg or a little sardine (optional)"
   ],
   "fr": [
    "½ baguette",
    "1 à 2 c. à soupe de mayonnaise",
    "½ oignon et ½ tomate en fines rondelles (facultatif)",
    "1 œuf dur ou un peu de sardine (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Open the bread and spread with mayonnaise.",
    "Add onion and tomato, and egg or sardine for a heartier sandwich.",
    "Close and eat."
   ],
   "fr": [
    "Ouvrez le pain et tartinez de mayonnaise.",
    "Ajoutez l'oignon et la tomate, et un œuf ou de la sardine pour un sandwich plus nourrissant.",
    "Refermez et mangez."
   ]
  },
  "serving": {
   "en": [
    "With tea or coffee."
   ],
   "fr": [
    "Avec du thé ou du café."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pain-pate-d-arachide": {
  "tags": [
   "quick",
   "budget",
   "kids",
   "vegetarian"
  ],
  "prepMinutes": 2,
  "cookMinutes": 0,
  "servings": 1,
  "ingredients": {
   "en": [
    "2 slices of bread or ½ baguette",
    "2 tbsp peanut paste (homemade or bought)",
    "1 tsp sugar or honey (optional)",
    "½ banana (optional)"
   ],
   "fr": [
    "2 tranches de pain ou ½ baguette",
    "2 c. à soupe de pâte d'arachide (maison ou achetée)",
    "1 c. à café de sucre ou de miel (facultatif)",
    "½ banane (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Open the bread (toast it if you like).",
    "Spread the peanut paste generously.",
    "Add a little sugar or honey, and banana slices if you have them."
   ],
   "fr": [
    "Ouvrez le pain (grillez-le si vous voulez).",
    "Tartinez généreusement de pâte d'arachide.",
    "Ajoutez un peu de sucre ou de miel, et des rondelles de banane si vous en avez."
   ]
  },
  "serving": {
   "en": [
    "With tea, coffee or a glass of milk."
   ],
   "fr": [
    "Avec du thé, du café ou un verre de lait."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pain-saucisse": {
  "tags": [
   "quick",
   "kids"
  ],
  "prepMinutes": 5,
  "cookMinutes": 10,
  "servings": 2,
  "ingredients": {
   "en": [
    "1 baguette",
    "4 sausages",
    "½ onion, 1 tomato",
    "Ketchup, mustard or mayonnaise",
    "1 tsp oil"
   ],
   "fr": [
    "1 baguette",
    "4 saucisses",
    "½ oignon, 1 tomate",
    "Ketchup, moutarde ou mayonnaise",
    "1 c. à café d'huile"
   ]
  },
  "steps": {
   "en": [
    "Brown the sausages in the oil 8 to 10 minutes, turning (slit them lengthways to cook faster).",
    "Soften the sliced onion in the same pan for 2 minutes.",
    "Cut the baguette in two, open, spread with sauce and fill with sausages, onion and tomato."
   ],
   "fr": [
    "Faites dorer les saucisses dans l'huile 8 à 10 minutes en les retournant (fendez-les en long pour qu'elles cuisent plus vite).",
    "Faites fondre l'oignon émincé dans la même poêle 2 minutes.",
    "Coupez la baguette en deux, ouvrez, tartinez de sauce et garnissez de saucisses, d'oignon et de tomate."
   ]
  },
  "serving": {
   "en": [
    "Serve with tea or juice."
   ],
   "fr": [
    "Servez avec du thé ou du jus."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pain-saucisson": {
  "tags": [
   "quick",
   "kids",
   "western"
  ],
  "prepMinutes": 3,
  "cookMinutes": 0,
  "servings": 1,
  "ingredients": {
   "en": [
    "½ baguette",
    "4 to 6 slices of saucisson (salami)",
    "Butter or mayonnaise",
    "Lettuce or cucumber (optional)"
   ],
   "fr": [
    "½ baguette",
    "4 à 6 tranches de saucisson",
    "Beurre ou mayonnaise",
    "Salade ou concombre (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Open the bread and spread with butter or mayonnaise.",
    "Lay in the saucisson, with lettuce or cucumber for crunch.",
    "Close and press."
   ],
   "fr": [
    "Ouvrez le pain et tartinez de beurre ou de mayonnaise.",
    "Disposez le saucisson, avec de la salade ou du concombre pour le croquant.",
    "Refermez et pressez."
   ]
  },
  "serving": {
   "en": [
    "Good with tea or coffee in the morning."
   ],
   "fr": [
    "Bon avec du thé ou du café le matin."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pamplemousse": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "3 grapefruits",
    "2 to 4 tbsp sugar or honey",
    "250 ml cold water (optional)",
    "Ice"
   ],
   "fr": [
    "3 pamplemousses",
    "2 à 4 c. à soupe de sucre ou de miel",
    "250 ml d'eau froide (facultatif)",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Cut the grapefruits in half and squeeze.",
    "Strain, sweeten to taste and dilute with water if it's too bitter.",
    "Chill."
   ],
   "fr": [
    "Coupez les pamplemousses en deux et pressez-les.",
    "Filtrez, sucrez selon le goût et allongez d'eau si c'est trop amer.",
    "Mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pancakes": {
  "name": "Pancakes",
  "section": "breakfast",
  "tags": [
   "kids",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "200 g flour",
    "2 tsp baking powder",
    "2 tbsp sugar",
    "1 pinch salt",
    "1 egg",
    "250 ml milk",
    "2 tbsp melted butter or oil"
   ],
   "fr": [
    "200 g de farine",
    "2 c. à café de levure chimique",
    "2 c. à soupe de sucre",
    "1 pincée de sel",
    "1 œuf",
    "250 ml de lait",
    "2 c. à soupe de beurre fondu ou d'huile"
   ]
  },
  "steps": {
   "en": [
    "Mix the flour, baking powder, sugar and salt in a bowl.",
    "Whisk the egg, milk and melted butter in another bowl, then pour into the dry mix and stir just until combined (a few lumps are fine).",
    "Heat a lightly oiled pan on medium heat and pour in small ladles of batter.",
    "Cook until bubbles appear on top (about 2 minutes), flip and cook 1 more minute until golden."
   ],
   "fr": [
    "Mélangez la farine, la levure, le sucre et le sel dans un bol.",
    "Fouettez l'œuf, le lait et le beurre fondu dans un autre bol, puis versez sur le mélange sec et mélangez juste assez (quelques grumeaux, ce n'est pas grave).",
    "Chauffez une poêle légèrement huilée à feu moyen et versez de petites louches de pâte.",
    "Laissez cuire jusqu'à ce que des bulles apparaissent (environ 2 minutes), retournez et faites cuire encore 1 minute jusqu'à ce qu'ils soient dorés."
   ]
  },
  "serving": {
   "en": [
    "Stack and serve with honey, syrup, banana or fruit."
   ],
   "fr": [
    "Empilez et servez avec du miel, du sirop, de la banane ou des fruits."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "passion-fruit": {
  "tags": [
   "vegetarian",
   "kids"
  ],
  "prepMinutes": 10,
  "cookMinutes": 0,
  "servings": 4,
  "ingredients": {
   "en": [
    "10 passion fruits",
    "1 litre cold water",
    "5 tbsp sugar",
    "Ice"
   ],
   "fr": [
    "10 fruits de la passion",
    "1 litre d'eau froide",
    "5 c. à soupe de sucre",
    "Glaçons"
   ]
  },
  "steps": {
   "en": [
    "Cut the passion fruits in half and scoop the pulp into a blender.",
    "Pulse briefly with half the water – just enough to free the juice from the seeds without crushing them.",
    "Strain, pressing the pulp, then add the rest of the water and the sugar. Chill."
   ],
   "fr": [
    "Coupez les fruits de la passion en deux et videz la pulpe dans le mixeur.",
    "Mixez brièvement avec la moitié de l'eau – juste assez pour détacher le jus des graines sans les écraser.",
    "Filtrez en pressant la pulpe, puis ajoutez le reste de l'eau et le sucre. Mettez au frais."
   ]
  },
  "serving": {
   "en": [
    "Serve very cold, over ice. Best drunk the same day."
   ],
   "fr": [
    "Servez bien frais, avec des glaçons. À boire le jour même."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pate-d-arachide": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 15,
  "servings": 6,
  "ingredients": {
   "en": [
    "500 g raw peanuts",
    "1 pinch of salt",
    "1 to 2 tbsp neutral oil (only if needed)"
   ],
   "fr": [
    "500 g d'arachides crues",
    "1 pincée de sel",
    "1 à 2 c. à soupe d'huile neutre (seulement si besoin)"
   ]
  },
  "steps": {
   "en": [
    "Roast the peanuts in a dry pan on medium heat for 10 to 15 minutes, stirring constantly, until golden.",
    "Let them cool, then rub them between your hands and blow away the skins.",
    "Grind in a blender or mill: first to crumbs, then keep going (scraping the sides) until it turns into a smooth, runny paste.",
    "Add the salt, and a little oil only if your blender struggles. Store in a clean jar."
   ],
   "fr": [
    "Grillez les arachides à sec dans une poêle à feu moyen 10 à 15 minutes en remuant sans arrêt, jusqu'à ce qu'elles soient dorées.",
    "Laissez refroidir, puis frottez-les entre vos mains et soufflez les peaux.",
    "Mixez au blender ou au moulin : d'abord en miettes, puis continuez (en raclant les bords) jusqu'à obtenir une pâte lisse et coulante.",
    "Ajoutez le sel, et un peu d'huile seulement si votre mixeur peine. Conservez dans un bocal propre."
   ]
  },
  "serving": {
   "en": [
    "Spread on bread, or use it for sauce d'arachide, okok and met d'arachide. Keeps about a month in a closed jar."
   ],
   "fr": [
    "À tartiner sur du pain, ou pour la sauce d'arachide, l'okok et le met d'arachide. Se garde environ un mois dans un bocal fermé."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "peau-de-boeuf-et-autres-saute": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 20,
  "cookMinutes": 90,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g cow skin (kanda), cleaned",
    "300 g tripe or cow foot (optional)",
    "2 onions, 2 tomatoes, 1 green pepper",
    "3 cloves garlic, 1 piece ginger",
    "4 tbsp oil, 2 cubes, salt, pepper"
   ],
   "fr": [
    "500 g de peau de bœuf (kanda) nettoyée",
    "300 g de tripes ou de pied de bœuf (facultatif)",
    "2 oignons, 2 tomates, 1 poivron",
    "3 gousses d'ail, 1 morceau de gingembre",
    "4 c. à soupe d'huile, 2 cubes, sel, piment"
   ]
  },
  "steps": {
   "en": [
    "Scrape and wash the skin and tripe well; cut into bite-size pieces.",
    "Boil with an onion, a cube and salt for 1 hour or more, until soft but chewy. Drain.",
    "Fry the second onion, garlic, ginger and pepper in the oil, then add the tomatoes and cube; cook 5 minutes.",
    "Add the meats and sauté 10 minutes until the sauce clings."
   ],
   "fr": [
    "Grattez et lavez bien la peau et les tripes ; coupez en petits morceaux.",
    "Faites bouillir avec un oignon, un cube et du sel 1 heure ou plus, jusqu'à ce que ce soit tendre mais encore ferme. Égouttez.",
    "Faites revenir le second oignon, l'ail, le gingembre et le poivron dans l'huile, puis ajoutez les tomates et le cube ; laissez cuire 5 minutes.",
    "Ajoutez les viandes et faites sauter 10 minutes jusqu'à ce que la sauce les enrobe."
   ]
  },
  "serving": {
   "en": [
    "Serve with plantain, bobolo, or as a snack with a cold drink."
   ],
   "fr": [
    "Servez avec du plantain, du bâton de manioc, ou en amuse-bouche avec une boisson fraîche."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pile-macabo": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 20,
  "cookMinutes": 45,
  "servings": 6,
  "ingredients": {
   "en": [
    "1.5 kg macabo (white or red cocoyam)",
    "100 ml palm oil",
    "1 onion",
    "Salt and pepper",
    "250 g cooked beans (optional)"
   ],
   "fr": [
    "1,5 kg de macabo (blanc ou rouge)",
    "100 ml d'huile de palme",
    "1 oignon",
    "Sel et piment",
    "250 g de haricots cuits (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Peel the macabo (wear gloves – it can itch), cut it in pieces and wash well.",
    "Boil in salted water 25 to 30 minutes, until a knife goes in easily. Drain.",
    "Warm the palm oil with the sliced onion.",
    "Pound the hot macabo with the oil (and beans) until smooth and slightly elastic. Season."
   ],
   "fr": [
    "Épluchez le macabo (avec des gants – ça peut gratter), coupez-le en morceaux et lavez-le bien.",
    "Faites-le bouillir à l'eau salée 25 à 30 minutes, jusqu'à ce qu'un couteau y entre facilement. Égouttez.",
    "Faites tiédir l'huile de palme avec l'oignon émincé.",
    "Pilez le macabo chaud avec l'huile (et les haricots) jusqu'à ce qu'il soit lisse et légèrement élastique. Assaisonnez."
   ]
  },
  "serving": {
   "en": [
    "Serve with a green sauce (ndolé, kpwem) or a meat stew."
   ],
   "fr": [
    "Servez avec une sauce verte (ndolé, kpwem) ou un ragoût de viande."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Chop (Smart Services) – Pilé de macabo",
    "url": "https://chop.smartserviceshub.ai/fr/recipes/pile-de-macabo"
   }
  ]
 },
 "pile-plantain": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 20,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "6 half-ripe plantains",
    "500 g red beans, soaked overnight",
    "150 ml palm oil",
    "1 onion",
    "1 hot pepper (optional)",
    "Salt"
   ],
   "fr": [
    "6 plantains mi-mûrs",
    "500 g de haricots rouges trempés la veille",
    "150 ml d'huile de palme",
    "1 oignon",
    "1 piment (facultatif)",
    "Sel"
   ]
  },
  "steps": {
   "en": [
    "Cook the soaked beans in fresh water for about 1 hour, until very soft. Salt them at the end.",
    "Peel the plantains, cut them in pieces and boil 20 minutes until tender.",
    "Warm the palm oil with the sliced onion for a few minutes (don't let it smoke).",
    "Pound the hot plantain in a mortar (or mash it well), adding the beans little by little.",
    "Pour in the palm oil while pounding until it's a soft orange mash. Season with salt and pepper."
   ],
   "fr": [
    "Faites cuire les haricots trempés dans de l'eau neuve environ 1 heure, jusqu'à ce qu'ils soient très tendres. Salez en fin de cuisson.",
    "Épluchez les plantains, coupez-les en morceaux et faites-les bouillir 20 minutes jusqu'à ce qu'ils soient tendres.",
    "Faites tiédir l'huile de palme avec l'oignon émincé quelques minutes (sans la faire fumer).",
    "Pilez le plantain chaud au mortier (ou écrasez-le bien) en ajoutant les haricots petit à petit.",
    "Versez l'huile de palme en continuant de piler jusqu'à obtenir une purée orange. Salez et pimentez."
   ]
  },
  "serving": {
   "en": [
    "Serve warm on its own, or with fried fish or avocado."
   ],
   "fr": [
    "Servez tiède tel quel, ou avec du poisson frit ou de l'avocat."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Kelianfood – Plantain pilé aux haricots rouges",
    "url": "https://kelianfood.com/la-meilleure-recette-du-plantain-pile-avec-haricot-rouge/"
   },
   {
    "label": "Camerdish – Ntouba",
    "url": "https://www.camerdish.com/recipes/ntouba-plantain-pile-a-la-camerounaise/"
   }
  ]
 },
 "pilons-de-poulet-au-fromage": {
  "tags": [
   "kids",
   "western"
  ],
  "prepMinutes": 15,
  "cookMinutes": 40,
  "servings": 4,
  "ingredients": {
   "en": [
    "8 chicken drumsticks",
    "2 cloves garlic, 1 tsp paprika, salt, pepper",
    "2 tbsp oil",
    "150 g grated cheese",
    "2 tbsp breadcrumbs",
    "Parsley"
   ],
   "fr": [
    "8 pilons de poulet",
    "2 gousses d'ail, 1 c. à café de paprika, sel, poivre",
    "2 c. à soupe d'huile",
    "150 g de fromage râpé",
    "2 c. à soupe de chapelure",
    "Persil"
   ]
  },
  "steps": {
   "en": [
    "Season the drumsticks with crushed garlic, paprika, salt, pepper and oil.",
    "Bake at 200 °C for 30 minutes, turning once.",
    "Mix the cheese, breadcrumbs and parsley and press it on top of the drumsticks.",
    "Bake 8 to 10 more minutes until the cheese is melted and golden."
   ],
   "fr": [
    "Assaisonnez les pilons avec l'ail écrasé, le paprika, le sel, le poivre et l'huile.",
    "Faites cuire au four à 200 °C 30 minutes en les retournant une fois.",
    "Mélangez le fromage, la chapelure et le persil et pressez-le sur les pilons.",
    "Remettez au four 8 à 10 minutes jusqu'à ce que le fromage soit fondu et doré."
   ]
  },
  "serving": {
   "en": [
    "Serve with fries, potato wedges or salad."
   ],
   "fr": [
    "Servez avec des frites, des potatoes ou une salade."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pizza-classique": {
  "tags": [
   "kids",
   "western"
  ],
  "prepMinutes": 90,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "Dough: 500 g flour, 7 g dry yeast, 1 tsp sugar, 1 tsp salt, 3 tbsp oil, 300 ml warm water",
    "Sauce: 200 g tomato purée, 1 clove garlic, oregano, salt",
    "200 g mozzarella or grated cheese",
    "Toppings: ham, sausage, peppers, onions, mushrooms, olives…"
   ],
   "fr": [
    "Pâte : 500 g de farine, 7 g de levure sèche, 1 c. à café de sucre, 1 de sel, 3 c. à soupe d'huile, 300 ml d'eau tiède",
    "Sauce : 200 g de coulis de tomate, 1 gousse d'ail, origan, sel",
    "200 g de mozzarella ou de fromage râpé",
    "Garnitures : jambon, saucisse, poivrons, oignons, champignons, olives…"
   ]
  },
  "steps": {
   "en": [
    "Stir the yeast and sugar into the warm water and leave 5 minutes until foamy.",
    "Add the flour, salt and oil, and knead 8 to 10 minutes into a smooth dough. Cover and let it rise 1 hour, until doubled.",
    "Mix the tomato purée with crushed garlic, oregano and salt.",
    "Heat the oven as hot as it goes (240–250 °C). Divide the dough in two and stretch each piece thin on an oiled tray.",
    "Spread the sauce, add the cheese and toppings, and bake 10 to 12 minutes until the crust is golden and the cheese bubbles."
   ],
   "fr": [
    "Mélangez la levure et le sucre dans l'eau tiède et laissez mousser 5 minutes.",
    "Ajoutez la farine, le sel et l'huile et pétrissez 8 à 10 minutes pour obtenir une pâte lisse. Couvrez et laissez lever 1 heure, jusqu'à ce qu'elle double.",
    "Mélangez le coulis avec l'ail écrasé, l'origan et le sel.",
    "Préchauffez le four au maximum (240–250 °C). Divisez la pâte en deux et étalez chaque morceau finement sur une plaque huilée.",
    "Étalez la sauce, ajoutez le fromage et les garnitures, et faites cuire 10 à 12 minutes jusqu'à ce que la pâte soit dorée et le fromage bouillonnant."
   ]
  },
  "serving": {
   "en": [
    "Cut in slices and serve hot."
   ],
   "fr": [
    "Coupez en parts et servez chaud."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pizza-oeufs": {
  "tags": [
   "quick",
   "kids",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 15,
  "cookMinutes": 15,
  "servings": 2,
  "ingredients": {
   "en": [
    "4 eggs",
    "2 tbsp milk",
    "1 tomato, ½ onion, ½ green pepper",
    "50 g grated cheese",
    "Ham or sausage (optional)",
    "1 tbsp oil, salt, pepper, oregano"
   ],
   "fr": [
    "4 œufs",
    "2 c. à soupe de lait",
    "1 tomate, ½ oignon, ½ poivron",
    "50 g de fromage râpé",
    "Jambon ou saucisse (facultatif)",
    "1 c. à soupe d'huile, sel, poivre, origan"
   ]
  },
  "steps": {
   "en": [
    "Beat the eggs with the milk, salt and pepper.",
    "Heat the oil in a pan, pour in the eggs and cook on low heat 3 minutes until the bottom sets.",
    "Top like a pizza: tomato slices, onion, pepper, ham, cheese and oregano.",
    "Cover and cook 5 more minutes (or put under the oven grill 3 minutes) until the top is set and the cheese melts."
   ],
   "fr": [
    "Battez les œufs avec le lait, le sel et le poivre.",
    "Chauffez l'huile dans une poêle, versez les œufs et laissez cuire à feu doux 3 minutes jusqu'à ce que le dessous prenne.",
    "Garnissez comme une pizza : rondelles de tomate, oignon, poivron, jambon, fromage et origan.",
    "Couvrez et laissez cuire encore 5 minutes (ou passez sous le gril 3 minutes) jusqu'à ce que le dessus soit pris et le fromage fondu."
   ]
  },
  "serving": {
   "en": [
    "Cut in wedges; great for breakfast or a light supper."
   ],
   "fr": [
    "Coupez en parts ; parfait au petit-déjeuner ou pour un souper léger."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pkwem": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 20,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 kg cassava leaves (fresh, or frozen pounded)",
    "1 kg palm nuts (or 400 g canned palm-nut cream)",
    "2 ripe plantains or 4 very ripe bananas (optional)",
    "3 tbsp peanut paste (optional)",
    "1 onion",
    "2 cloves garlic",
    "1 hot pepper",
    "Salt"
   ],
   "fr": [
    "1 kg de feuilles de manioc (fraîches, ou pilées surgelées)",
    "1 kg de noix de palme (ou 400 g de crème de noix de palme en boîte)",
    "2 plantains mûrs ou 4 bananes très mûres (facultatif)",
    "3 c. à soupe de pâte d'arachide (facultatif)",
    "1 oignon",
    "2 gousses d'ail",
    "1 piment",
    "Sel"
   ]
  },
  "steps": {
   "en": [
    "Strip the cassava leaves from their stems, wash them and pound (or blend) them finely.",
    "Boil the pounded leaves in plenty of water for 20 minutes, then drain: this takes away the bitterness.",
    "Boil the palm nuts for 30 minutes, pound them and squeeze them in warm water to collect a thick red juice; strain out the fibres.",
    "Put the leaves in a pot with the palm-nut juice, onion, garlic and pepper. Simmer on low heat for 30 to 40 minutes, stirring often, until the oil rises to the top.",
    "For a sweet-savoury pot, add the sliced ripe plantain or banana for the last 15 minutes; for a richer one, stir in the peanut paste.",
    "Season with salt and cook until thick."
   ],
   "fr": [
    "Équeutez les feuilles de manioc, lavez-les et pilez-les (ou mixez-les) finement.",
    "Faites bouillir les feuilles pilées dans beaucoup d'eau 20 minutes, puis égouttez : cela enlève l'amertume.",
    "Faites bouillir les noix de palme 30 minutes, pilez-les et pressez-les dans de l'eau tiède pour recueillir un jus rouge épais ; filtrez les fibres.",
    "Mettez les feuilles dans une marmite avec le jus de noix de palme, l'oignon, l'ail et le piment. Laissez mijoter à feu doux 30 à 40 minutes en remuant souvent, jusqu'à ce que l'huile remonte à la surface.",
    "Pour une version sucrée-salée, ajoutez le plantain ou la banane mûre en rondelles pour les 15 dernières minutes ; pour plus de richesse, incorporez la pâte d'arachide.",
    "Salez et laissez épaissir."
   ]
  },
  "serving": {
   "en": [
    "Serve with boiled cassava, macabo or plantain.",
    "It keeps 3 days in the fridge and tastes even better reheated."
   ],
   "fr": [
    "Servez avec du manioc, du macabo ou du plantain bouilli.",
    "Il se garde 3 jours au frais et il est encore meilleur réchauffé."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Cocotier Market – Kpwem",
    "url": "https://www.cocotier-market.fr/blogs/recettes-du-cameroun/recette-kpwem-feuilles-de-manioc-camerounaise"
   },
   {
    "label": "Éditions 2015 – Kwem",
    "url": "https://www.editions2015.com/cameroun/recette-kwem.php"
   },
   {
    "label": "Cameroun24 – Kwem ou kpwem",
    "url": "https://cameroun24.net/article/24496-la-recette-du-kwem-ou-kpwem.html"
   }
  ]
 },
 "plantain-tape-snack": {
  "tags": [
   "budget",
   "vegetarian",
   "snack"
  ],
  "prepMinutes": 10,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "3 green or half-ripe plantains",
    "Oil for frying",
    "Salt, chili powder",
    "Garlic-pepper dip (optional)"
   ],
   "fr": [
    "3 plantains verts ou mi-mûrs",
    "Huile de friture",
    "Sel, piment en poudre",
    "Sauce ail-piment (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Peel the plantains and cut them in 3 cm pieces.",
    "Fry them in hot oil 4 to 5 minutes until lightly golden but still pale. Drain.",
    "Put each piece between two sheets of paper (or a folded plastic bag) and flatten with the bottom of a glass or a board.",
    "Fry the flattened pieces again 2 to 3 minutes until crisp and golden. Season with salt and chili right away."
   ],
   "fr": [
    "Épluchez les plantains et coupez-les en morceaux de 3 cm.",
    "Faites-les frire dans l'huile chaude 4 à 5 minutes, légèrement dorés mais encore pâles. Égouttez.",
    "Placez chaque morceau entre deux feuilles de papier (ou un sachet plié) et aplatissez-le avec le fond d'un verre ou une planche.",
    "Refaites frire les morceaux aplatis 2 à 3 minutes jusqu'à ce qu'ils soient croustillants et dorés. Salez et pimentez tout de suite."
   ]
  },
  "serving": {
   "en": [
    "Serve hot as a snack with a spicy dip, or with grilled fish."
   ],
   "fr": [
    "Servez chaud en snack avec une sauce pimentée, ou avec du poisson braisé."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Keng's Kitchen – Tapé tapé",
    "url": "https://www.kengskitchen.com/kengs-kitchen-blog/tap-tap-t-he-non-traditional-fried-plantainsdodo"
   },
   {
    "label": "Saiga Tours – Food of Cameroon",
    "url": "https://www.saigatours.com/article/What-is-the-food-of-Cameroon"
   }
  ]
 },
 "poisson-a-la-poele-et-risotto": {
  "tags": [
   "western"
  ],
  "prepMinutes": 15,
  "cookMinutes": 30,
  "servings": 2,
  "ingredients": {
   "en": [
    "2 fish fillets (or 2 small whole fish)",
    "Risotto: 200 g risotto rice, 1 onion, 750 ml hot stock, 30 g butter, 40 g grated cheese",
    "1 lime, 2 cloves garlic, 2 tbsp oil, salt, pepper, parsley"
   ],
   "fr": [
    "2 filets de poisson (ou 2 petits poissons entiers)",
    "Risotto : 200 g de riz à risotto, 1 oignon, 750 ml de bouillon chaud, 30 g de beurre, 40 g de fromage râpé",
    "1 citron vert, 2 gousses d'ail, 2 c. à soupe d'huile, sel, poivre, persil"
   ]
  },
  "steps": {
   "en": [
    "Soften the onion in half the butter, add the rice and stir 1 minute.",
    "Add the hot stock a ladle at a time, stirring, waiting until each is absorbed – about 18 minutes.",
    "Off the heat, stir in the rest of the butter and the cheese. Cover and rest.",
    "Meanwhile season the fish with garlic, lime, salt and pepper. Fry in hot oil 3 to 4 minutes per side until golden and flaky."
   ],
   "fr": [
    "Faites fondre l'oignon dans la moitié du beurre, ajoutez le riz et remuez 1 minute.",
    "Ajoutez le bouillon chaud louche par louche en remuant, en attendant qu'il soit absorbé à chaque fois – environ 18 minutes.",
    "Hors du feu, incorporez le reste du beurre et le fromage. Couvrez et laissez reposer.",
    "Pendant ce temps, assaisonnez le poisson avec l'ail, le citron, le sel et le poivre. Faites-le dorer dans l'huile chaude 3 à 4 minutes de chaque côté."
   ]
  },
  "serving": {
   "en": [
    "Serve the fish on the risotto with lime and parsley."
   ],
   "fr": [
    "Servez le poisson sur le risotto avec du citron et du persil."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "poisson-dg": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 25,
  "cookMinutes": 40,
  "servings": 6,
  "ingredients": {
   "en": [
    "1.5 kg firm fish (sea bass, carp or tilapia), in thick slices",
    "6 ripe plantains",
    "3 carrots, 1 handful green beans, 2 green peppers",
    "3 tomatoes, 2 onions, 3 cloves garlic, 1 piece ginger",
    "Parsley, celery or leek",
    "Juice of 1 lime, 2 stock cubes, salt, pepper",
    "Oil for frying"
   ],
   "fr": [
    "1,5 kg de poisson à chair ferme (bar, carpe ou tilapia) en tranches épaisses",
    "6 plantains mûrs",
    "3 carottes, 1 poignée de haricots verts, 2 poivrons",
    "3 tomates, 2 oignons, 3 gousses d'ail, 1 morceau de gingembre",
    "Persil, céleri ou poireau",
    "Jus d'un citron vert, 2 cubes, sel, piment",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Clean the fish with lime and salt, then season with blended garlic, ginger, a cube and salt. Rest 15 minutes.",
    "Fry the fish slices until golden on both sides; set aside. Fry the plantain rounds the same way.",
    "In a large pot, fry the onions, add the blended tomatoes and cook 10 minutes.",
    "Add the vegetables with half a glass of water and the second cube; cook 10 minutes.",
    "Lay the fish and plantain in the sauce, add the herbs, cover and simmer 5 minutes. Shake the pot gently rather than stirring, so the fish stays whole."
   ],
   "fr": [
    "Nettoyez le poisson au citron et au sel, puis assaisonnez-le avec l'ail et le gingembre mixés, un cube et du sel. Laissez reposer 15 minutes.",
    "Faites frire les tranches de poisson jusqu'à ce qu'elles soient dorées des deux côtés ; réservez. Faites frire les rondelles de plantain de la même façon.",
    "Dans une grande marmite, faites revenir les oignons, ajoutez les tomates mixées et laissez cuire 10 minutes.",
    "Ajoutez les légumes avec un demi-verre d'eau et le second cube ; laissez cuire 10 minutes.",
    "Déposez le poisson et le plantain dans la sauce, ajoutez les herbes, couvrez et laissez mijoter 5 minutes. Secouez doucement la marmite plutôt que de remuer, pour que le poisson reste entier."
   ]
  },
  "serving": {
   "en": [
    "Serve hot as a complete dish."
   ],
   "fr": [
    "Servez chaud, c'est un plat complet."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pommes-sautees-choux": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 10,
  "cookMinutes": 25,
  "servings": 4,
  "ingredients": {
   "en": [
    "800 g potatoes",
    "¼ green cabbage, shredded",
    "1 onion, 1 carrot",
    "4 tbsp oil",
    "1 cube, salt, pepper"
   ],
   "fr": [
    "800 g de pommes de terre",
    "¼ de chou vert émincé",
    "1 oignon, 1 carotte",
    "4 c. à soupe d'huile",
    "1 cube, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Parboil the potato cubes 6 minutes, drain and fry until golden as for pommes sautées.",
    "Push them aside and add the onion, grated carrot and cabbage with the cube.",
    "Sauté 5 to 6 minutes until the cabbage softens but still crunches, then toss everything together. Season."
   ],
   "fr": [
    "Faites précuire les cubes de pommes de terre 6 minutes, égouttez et faites-les dorer comme pour les pommes sautées.",
    "Poussez-les sur le côté et ajoutez l'oignon, la carotte râpée et le chou avec le cube.",
    "Faites sauter 5 à 6 minutes jusqu'à ce que le chou soit tendre mais encore croquant, puis mélangez le tout. Assaisonnez."
   ]
  },
  "serving": {
   "en": [
    "Good on its own or with sausages or eggs."
   ],
   "fr": [
    "Bon tel quel ou avec des saucisses ou des œufs."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pommes-sautees": {
  "tags": [
   "budget",
   "vegetarian",
   "kids",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 25,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg potatoes",
    "4 tbsp oil",
    "1 onion",
    "2 cloves garlic, parsley",
    "Salt, pepper"
   ],
   "fr": [
    "1 kg de pommes de terre",
    "4 c. à soupe d'huile",
    "1 oignon",
    "2 gousses d'ail, persil",
    "Sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Peel the potatoes and cut them in cubes. Boil 6 minutes in salted water, then drain and let them steam dry.",
    "Heat the oil in a large pan and add the potatoes in one layer.",
    "Fry on medium-high heat 12 to 15 minutes, turning only now and then, until golden and crisp.",
    "Add the onion for the last 5 minutes, and the garlic and parsley for the last minute. Season."
   ],
   "fr": [
    "Épluchez les pommes de terre et coupez-les en cubes. Faites-les bouillir 6 minutes à l'eau salée, puis égouttez et laissez-les sécher.",
    "Chauffez l'huile dans une grande poêle et ajoutez les pommes de terre en une couche.",
    "Faites-les dorer à feu moyen-vif 12 à 15 minutes en les retournant de temps en temps seulement, jusqu'à ce qu'elles soient croustillantes.",
    "Ajoutez l'oignon pour les 5 dernières minutes, et l'ail et le persil pour la dernière minute. Assaisonnez."
   ]
  },
  "serving": {
   "en": [
    "Serve with eggs, grilled meat, chicken or fish."
   ],
   "fr": [
    "Servez avec des œufs, de la viande grillée, du poulet ou du poisson."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "potatoes-churros": {
  "tags": [
   "kids",
   "snack",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 20,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g potatoes, boiled and mashed (cooled)",
    "100 g flour",
    "1 egg",
    "Salt, pepper, garlic powder, paprika",
    "Oil for frying"
   ],
   "fr": [
    "500 g de pommes de terre cuites et écrasées (refroidies)",
    "100 g de farine",
    "1 œuf",
    "Sel, poivre, ail en poudre, paprika",
    "Huile de friture"
   ]
  },
  "steps": {
   "en": [
    "Mix the mash with the flour, egg and seasonings into a soft dough you can pipe.",
    "Put it in a piping bag with a star nozzle (or a plastic bag with a corner cut).",
    "Pipe 10 cm lengths straight into hot oil, cutting with scissors.",
    "Fry 3 to 4 minutes until golden and crisp. Drain and salt."
   ],
   "fr": [
    "Mélangez la purée avec la farine, l'œuf et les assaisonnements pour une pâte souple qu'on peut pocher.",
    "Mettez-la dans une poche à douille cannelée (ou un sachet dont on coupe un coin).",
    "Poussez des boudins de 10 cm directement dans l'huile chaude en coupant aux ciseaux.",
    "Faites frire 3 à 4 minutes jusqu'à ce qu'ils soient dorés et croustillants. Égouttez et salez."
   ]
  },
  "serving": {
   "en": [
    "Serve with ketchup, mayonnaise or a cheese dip."
   ],
   "fr": [
    "Servez avec du ketchup, de la mayonnaise ou une sauce fromage."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "poulet-fume": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 20,
  "cookMinutes": 90,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 whole chicken (1.5 kg), opened flat",
    "4 cloves garlic, 1 piece ginger, 1 onion, a little celery and parsley, blended",
    "1 tsp smoked paprika, 1 tsp white pepper, 2 cubes, salt",
    "3 tbsp oil",
    "Hardwood chips or green leaves for the smoke"
   ],
   "fr": [
    "1 poulet entier (1,5 kg) ouvert à plat",
    "4 gousses d'ail, 1 morceau de gingembre, 1 oignon, un peu de céleri et de persil, mixés",
    "1 c. à café de paprika fumé, 1 de poivre blanc, 2 cubes, sel",
    "3 c. à soupe d'huile",
    "Copeaux de bois dur ou feuilles vertes pour la fumée"
   ]
  },
  "steps": {
   "en": [
    "Rub the chicken all over with the blended herbs, spices, cubes, salt and oil. Leave overnight if possible.",
    "Set the grill up for low, indirect heat: charcoal on one side, chicken on the other, lid on (or use a 150 °C oven).",
    "Add wood chips to the coals and smoke the chicken skin-side up for about 1½ hours, until the juices run clear (75 °C in the thickest part).",
    "Finish 5 minutes over direct heat to crisp the skin."
   ],
   "fr": [
    "Frottez le poulet partout avec les herbes mixées, les épices, les cubes, le sel et l'huile. Laissez une nuit si possible.",
    "Préparez le barbecue pour une cuisson douce indirecte : braise d'un côté, poulet de l'autre, couvercle fermé (ou four à 150 °C).",
    "Mettez les copeaux sur la braise et fumez le poulet peau vers le haut environ 1 h 30, jusqu'à ce que le jus soit clair (75 °C au plus épais).",
    "Terminez 5 minutes au-dessus de la braise pour rendre la peau croustillante."
   ]
  },
  "serving": {
   "en": [
    "Serve with plantain, fries, attiéké or salad."
   ],
   "fr": [
    "Servez avec du plantain, des frites, de l'attiéké ou une salade."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "poulet-mayo": {
  "tags": [
   "kids"
  ],
  "prepMinutes": 15,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "4 chicken pieces (thighs or breasts)",
    "4 tbsp mayonnaise",
    "1 tsp mustard",
    "2 cloves garlic, 1 tsp paprika",
    "Juice of ½ lime",
    "Salt, pepper, parsley"
   ],
   "fr": [
    "4 morceaux de poulet (cuisses ou blancs)",
    "4 c. à soupe de mayonnaise",
    "1 c. à café de moutarde",
    "2 gousses d'ail, 1 c. à café de paprika",
    "Jus d'½ citron vert",
    "Sel, poivre, persil"
   ]
  },
  "steps": {
   "en": [
    "Mix the mayonnaise, mustard, crushed garlic, paprika, lime juice, salt and pepper.",
    "Coat the chicken and leave 15 minutes (or overnight in the fridge).",
    "Bake at 200 °C for 30 to 35 minutes (or cook covered in a pan on medium heat 25 minutes), until golden and cooked through.",
    "Sprinkle with parsley."
   ],
   "fr": [
    "Mélangez la mayonnaise, la moutarde, l'ail écrasé, le paprika, le jus de citron, le sel et le poivre.",
    "Enrobez le poulet et laissez 15 minutes (ou une nuit au frais).",
    "Faites cuire au four à 200 °C 30 à 35 minutes (ou à la poêle, couvert, à feu moyen 25 minutes), jusqu'à ce qu'il soit doré et cuit à cœur.",
    "Parsemez de persil."
   ]
  },
  "serving": {
   "en": [
    "Serve with fries, rice or salad."
   ],
   "fr": [
    "Servez avec des frites, du riz ou une salade."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "pounded-cassava-and-okro": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg fresh cassava",
    "Okra soup: 300 g okra, 100 ml palm oil, 300 g fish or beef, 1 onion, 2 tbsp crayfish, 1 pepper, salt"
   ],
   "fr": [
    "1 kg de manioc frais",
    "Soupe gombo : 300 g de gombo, 100 ml d'huile de palme, 300 g de poisson ou de bœuf, 1 oignon, 2 c. à soupe d'écrevisses, 1 piment, sel"
   ]
  },
  "steps": {
   "en": [
    "Peel the cassava, remove the hard fibre in the middle, cut in pieces and boil 30 minutes until very soft.",
    "Pound the hot cassava in a mortar, wetting the pestle with water, until smooth and stretchy.",
    "Meanwhile cook the meat or fish with onion and salt; add the palm oil, crayfish and pepper.",
    "Add the chopped okra and simmer uncovered 8 to 10 minutes until the soup draws."
   ],
   "fr": [
    "Épluchez le manioc, retirez la fibre dure du milieu, coupez-le en morceaux et faites-le bouillir 30 minutes jusqu'à ce qu'il soit très tendre.",
    "Pilez le manioc chaud au mortier en mouillant le pilon, jusqu'à ce qu'il soit lisse et élastique.",
    "Pendant ce temps, faites cuire la viande ou le poisson avec l'oignon et le sel ; ajoutez l'huile de palme, les écrevisses et le piment.",
    "Ajoutez le gombo haché et laissez mijoter à découvert 8 à 10 minutes, jusqu'à ce que la soupe file."
   ]
  },
  "serving": {
   "en": [
    "Shape the pounded cassava into balls and serve with the okro soup."
   ],
   "fr": [
    "Façonnez le manioc pilé en boules et servez avec la soupe gombo."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Île aux épices – Sauce gombo",
    "url": "https://ileauxepices.com/blog/2026/03/24/sauce-gombo-traditionnelle/wpid48952/"
   }
  ]
 },
 "prunes": {
  "tags": [
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 5,
  "cookMinutes": 10,
  "servings": 4,
  "ingredients": {
   "en": [
    "12 safou (African plums)",
    "Water and a pinch of salt (to boil)",
    "Or: hot embers / an oven (to roast)"
   ],
   "fr": [
    "12 safous (prunes africaines)",
    "De l'eau et une pincée de sel (pour bouillir)",
    "Ou : de la braise / un four (pour griller)"
   ]
  },
  "steps": {
   "en": [
    "Wash the plums.",
    "To boil: drop them into simmering salted water for 3 to 5 minutes, just until soft – don't let them burst.",
    "To roast: lay them on hot embers or in a hot oven 5 to 10 minutes, turning, until soft.",
    "Peel or bite into the soft flesh, avoiding the stone."
   ],
   "fr": [
    "Lavez les prunes.",
    "Bouillies : plongez-les dans de l'eau salée frémissante 3 à 5 minutes, juste jusqu'à ce qu'elles soient tendres – sans les laisser éclater.",
    "Grillées : posez-les sur la braise ou dans un four chaud 5 à 10 minutes en les retournant, jusqu'à ce qu'elles ramollissent.",
    "Pelez ou croquez la chair tendre en évitant le noyau."
   ]
  },
  "serving": {
   "en": [
    "Eat with bread, boiled or roasted corn, or plantain."
   ],
   "fr": [
    "Mangez avec du pain, du maïs bouilli ou grillé, ou du plantain."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "quiche-lorraine": {
  "name": "Quiche lorraine",
  "section": "wednesday",
  "tags": [
   "western"
  ],
  "prepMinutes": 20,
  "cookMinutes": 40,
  "servings": 6,
  "ingredients": {
   "en": [
    "1 shortcrust pastry (or 200 g flour + 100 g butter + 1 pinch salt + 4 tbsp cold water)",
    "200 g bacon or smoked ham, diced",
    "3 eggs",
    "200 ml cream + 200 ml milk",
    "80 g grated cheese (optional)",
    "Salt, pepper, nutmeg"
   ],
   "fr": [
    "1 pâte brisée (ou 200 g de farine + 100 g de beurre + 1 pincée de sel + 4 c. à soupe d'eau froide)",
    "200 g de lardons ou de jambon fumé en dés",
    "3 œufs",
    "200 ml de crème + 200 ml de lait",
    "80 g de fromage râpé (facultatif)",
    "Sel, poivre, muscade"
   ]
  },
  "steps": {
   "en": [
    "Heat the oven to 200 °C. Line a tart tin with the pastry and prick the base with a fork.",
    "Brown the bacon in a dry pan for 5 minutes and drain.",
    "Whisk the eggs, cream, milk, pepper, nutmeg and a little salt (bacon is salty).",
    "Scatter the bacon (and cheese) over the pastry and pour in the egg mix.",
    "Bake 35 to 40 minutes until puffed, set and golden."
   ],
   "fr": [
    "Préchauffez le four à 200 °C. Foncez un moule avec la pâte et piquez le fond à la fourchette.",
    "Faites dorer les lardons à sec 5 minutes et égouttez.",
    "Fouettez les œufs, la crème, le lait, le poivre, la muscade et un peu de sel (les lardons sont salés).",
    "Répartissez les lardons (et le fromage) sur la pâte et versez l'appareil.",
    "Faites cuire 35 à 40 minutes jusqu'à ce que ce soit gonflé, pris et doré."
   ]
  },
  "serving": {
   "en": [
    "Serve warm or cold with a green salad."
   ],
   "fr": [
    "Servez tiède ou froid avec une salade verte."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "rape": {
  "tags": [
   "occasion"
  ],
  "prepMinutes": 40,
  "cookMinutes": 90,
  "servings": 8,
  "ingredients": {
   "en": [
    "1 kg macabo (cocoyam)",
    "500 g fresh cassava",
    "2 tbsp palm oil",
    "Banana leaves",
    "Sauce: 300 g raw peanuts, 4 smoked fish, 50 g dried shrimp, 2 onions, 2 tomatoes, 2 cloves garlic, 1 piece ginger, 100 ml oil, 1 pepper, salt"
   ],
   "fr": [
    "1 kg de macabo",
    "500 g de manioc frais",
    "2 c. à soupe d'huile de palme",
    "Feuilles de bananier",
    "Sauce : 300 g d'arachides crues, 4 poissons fumés, 50 g de crevettes séchées, 2 oignons, 2 tomates, 2 gousses d'ail, 1 morceau de gingembre, 100 ml d'huile, 1 piment, sel"
   ]
  },
  "steps": {
   "en": [
    "Peel and wash the macabo and cassava, then grate both finely and mix with the palm oil and a pinch of salt.",
    "Wrap spoonfuls of the grated dough in banana leaves and steam them for about 1 hour, until firm.",
    "For the sauce: boil the peanuts 5 minutes, drain, rub off the skins and blend them with a little water into a smooth paste.",
    "Fry the chopped onions, then add the blended tomatoes, garlic, ginger and shrimp. Cook 10 minutes.",
    "Stir in the peanut paste and a little water and simmer on very low heat about 30 minutes, stirring often, until the oil comes up. Add the smoked fish, pepper and salt for the last 10 minutes."
   ],
   "fr": [
    "Épluchez et lavez le macabo et le manioc, puis râpez-les finement et mélangez avec l'huile de palme et une pincée de sel.",
    "Emballez des cuillerées de pâte râpée dans des feuilles de bananier et faites-les cuire à la vapeur environ 1 heure, jusqu'à ce qu'elles soient fermes.",
    "Pour la sauce : faites bouillir les arachides 5 minutes, égouttez, frottez-les pour enlever la peau et mixez-les avec un peu d'eau en pâte lisse.",
    "Faites revenir les oignons hachés, puis ajoutez les tomates mixées, l'ail, le gingembre et les crevettes. Laissez cuire 10 minutes.",
    "Ajoutez la pâte d'arachide et un peu d'eau, et laissez mijoter à feu très doux environ 30 minutes en remuant souvent, jusqu'à ce que l'huile remonte. Ajoutez le poisson fumé, le piment et le sel pour les 10 dernières minutes."
   ]
  },
  "serving": {
   "en": [
    "Unwrap the râpé and pour the hot peanut-fish sauce over it."
   ],
   "fr": [
    "Déballez le râpé et nappez-le de sauce d'arachide au poisson bien chaude."
   ]
  },
  "images": [],
  "video": "https://www.tiktok.com/@kisse12x/video/7525457550637075743",
  "sources": [
   {
    "label": "Afrik – Kouakoukou à la sauce blanche",
    "url": "https://www.afrik.com/kouakoukou-a-la-sauce-blanche"
   },
   {
    "label": "TikTok – Râpé",
    "url": "https://www.tiktok.com/@kisse12x/video/7525457550637075743"
   }
  ]
 },
 "rice-crackers": {
  "tags": [
   "snack",
   "vegetarian",
   "budget"
  ],
  "prepMinutes": 15,
  "cookMinutes": 20,
  "servings": 4,
  "ingredients": {
   "en": [
    "2 cups cooked rice (leftover)",
    "2 tbsp flour or cornstarch",
    "1 tbsp oil",
    "Salt, pepper, sesame seeds, chili or garlic powder",
    "Oil for frying (or bake)"
   ],
   "fr": [
    "2 tasses de riz cuit (un reste)",
    "2 c. à soupe de farine ou de maïzena",
    "1 c. à soupe d'huile",
    "Sel, poivre, graines de sésame, piment ou ail en poudre",
    "Huile de friture (ou cuisson au four)"
   ]
  },
  "steps": {
   "en": [
    "Blend or mash the rice with the flour, oil and seasonings into a sticky dough.",
    "Spread it very thin between two sheets of baking paper with a rolling pin; cut into squares or rounds.",
    "Bake at 180 °C for 15 to 20 minutes until crisp, or let them dry an hour and fry 1 to 2 minutes until puffed.",
    "Season while warm."
   ],
   "fr": [
    "Mixez ou écrasez le riz avec la farine, l'huile et les assaisonnements pour une pâte collante.",
    "Étalez-la très finement entre deux feuilles de papier cuisson au rouleau ; coupez en carrés ou en ronds.",
    "Faites cuire au four à 180 °C 15 à 20 minutes jusqu'à ce qu'ils soient croustillants, ou laissez-les sécher une heure et faites-les frire 1 à 2 minutes jusqu'à ce qu'ils gonflent.",
    "Assaisonnez encore chauds."
   ]
  },
  "serving": {
   "en": [
    "Keep in a closed jar; eat with dips or plain."
   ],
   "fr": [
    "Conservez dans un bocal fermé ; à manger avec des sauces ou nature."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "risotto": {
  "tags": [
   "vegetarian",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 25,
  "servings": 3,
  "ingredients": {
   "en": [
    "250 g risotto rice (arborio)",
    "1 onion, 1 clove garlic",
    "1 litre hot vegetable or chicken stock",
    "40 g butter, 1 tbsp oil",
    "50 g grated parmesan or other hard cheese",
    "Salt, pepper"
   ],
   "fr": [
    "250 g de riz à risotto (arborio)",
    "1 oignon, 1 gousse d'ail",
    "1 litre de bouillon chaud (légumes ou volaille)",
    "40 g de beurre, 1 c. à soupe d'huile",
    "50 g de parmesan râpé ou autre fromage dur",
    "Sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Soften the chopped onion and garlic in the oil and half the butter for 4 minutes.",
    "Add the rice and stir 1 minute until it looks shiny.",
    "Add a ladle of hot stock and stir until absorbed; repeat for 18 to 20 minutes until the rice is creamy but still a little firm.",
    "Off the heat, stir in the rest of the butter and the cheese. Season and rest 2 minutes."
   ],
   "fr": [
    "Faites fondre l'oignon et l'ail hachés dans l'huile et la moitié du beurre 4 minutes.",
    "Ajoutez le riz et remuez 1 minute jusqu'à ce qu'il soit nacré.",
    "Ajoutez une louche de bouillon chaud et remuez jusqu'à absorption ; recommencez pendant 18 à 20 minutes jusqu'à ce que le riz soit crémeux mais encore un peu ferme.",
    "Hors du feu, incorporez le reste du beurre et le fromage. Assaisonnez et laissez reposer 2 minutes."
   ]
  },
  "serving": {
   "en": [
    "Add mushrooms, shrimp or chicken to make it a full meal."
   ],
   "fr": [
    "Ajoutez des champignons, des crevettes ou du poulet pour en faire un plat complet."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "salade-cesar": {
  "name": "Salade César",
  "section": "monday",
  "tags": [
   "western"
  ],
  "prepMinutes": 20,
  "cookMinutes": 15,
  "servings": 2,
  "ingredients": {
   "en": [
    "1 romaine lettuce",
    "1 chicken breast",
    "2 slices of bread, cut in cubes",
    "30 g parmesan",
    "Dressing: 3 tbsp mayonnaise, 1 tsp mustard, juice of ½ lemon, 1 small clove garlic, 1 tbsp grated parmesan, pepper",
    "1 tbsp oil, salt"
   ],
   "fr": [
    "1 laitue romaine",
    "1 blanc de poulet",
    "2 tranches de pain en cubes",
    "30 g de parmesan",
    "Sauce : 3 c. à soupe de mayonnaise, 1 c. à café de moutarde, jus d'½ citron, 1 petite gousse d'ail, 1 c. à soupe de parmesan râpé, poivre",
    "1 c. à soupe d'huile, sel"
   ]
  },
  "steps": {
   "en": [
    "Season the chicken and cook it in the oil 6 minutes per side. Rest, then slice.",
    "Toast the bread cubes in the same pan until crisp (croutons).",
    "Whisk the dressing ingredients together.",
    "Tear the lettuce, toss with the dressing, and top with chicken, croutons and shaved parmesan."
   ],
   "fr": [
    "Assaisonnez le poulet et faites-le cuire dans l'huile 6 minutes de chaque côté. Laissez reposer, puis tranchez.",
    "Faites dorer les cubes de pain dans la même poêle (croûtons).",
    "Fouettez les ingrédients de la sauce.",
    "Déchirez la salade, mélangez avec la sauce, et garnissez de poulet, de croûtons et de copeaux de parmesan."
   ]
  },
  "serving": {
   "en": [
    "Serve right away so the croutons stay crunchy."
   ],
   "fr": [
    "Servez tout de suite pour que les croûtons restent croquants."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "sardines-kumba-and-egg": {
  "tags": [
   "quick",
   "budget"
  ],
  "prepMinutes": 10,
  "cookMinutes": 10,
  "servings": 2,
  "ingredients": {
   "en": [
    "1 Kumba bread (or any round loaf)",
    "1 tin sardines in oil",
    "2 eggs",
    "½ onion, 1 tomato, 1 small pepper",
    "Salt"
   ],
   "fr": [
    "1 pain Kumba (ou tout pain rond)",
    "1 boîte de sardines à l'huile",
    "2 œufs",
    "½ oignon, 1 tomate, 1 petit piment",
    "Sel"
   ]
  },
  "steps": {
   "en": [
    "Heat a little of the sardine oil and soften the chopped onion, tomato and pepper 3 minutes.",
    "Add the sardines and break them up; push to the side.",
    "Scramble the eggs in the same pan and mix with the sardines. Salt lightly.",
    "Cut the bread open and fill it with the hot mix."
   ],
   "fr": [
    "Chauffez un peu de l'huile des sardines et faites revenir l'oignon, la tomate et le piment hachés 3 minutes.",
    "Ajoutez les sardines et émiettez-les ; poussez-les sur le côté.",
    "Brouillez les œufs dans la même poêle et mélangez aux sardines. Salez légèrement.",
    "Ouvrez le pain et garnissez-le du mélange chaud."
   ]
  },
  "serving": {
   "en": [
    "Serve with tea or coffee."
   ],
   "fr": [
    "Servez avec du thé ou du café."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "sauce-blanche": {
  "tags": [],
  "prepMinutes": 20,
  "cookMinutes": 45,
  "servings": 6,
  "ingredients": {
   "en": [
    "300 g raw peanuts",
    "4 smoked fish, cleaned and flaked",
    "50 g dried shrimp",
    "2 onions, 2 tomatoes, 2 cloves garlic, 1 piece ginger",
    "100 ml vegetable oil (no palm oil)",
    "1 pepper, salt"
   ],
   "fr": [
    "300 g d'arachides crues",
    "4 poissons fumés nettoyés et émiettés",
    "50 g de crevettes séchées",
    "2 oignons, 2 tomates, 2 gousses d'ail, 1 morceau de gingembre",
    "100 ml d'huile végétale (sans huile de palme)",
    "1 piment, sel"
   ]
  },
  "steps": {
   "en": [
    "Boil the peanuts 3 to 5 minutes, drain, and rub off the skins so the sauce stays pale.",
    "Blend the peanuts with a little water into a smooth paste.",
    "Fry the onions in the oil, add the blended tomatoes, garlic, ginger and shrimp; cook 10 minutes.",
    "Add the peanut paste and about 500 ml water, and simmer on very low heat about 30 minutes, stirring often, until creamy and the oil shows on top.",
    "Add the smoked fish and pepper for the last 10 minutes; salt to taste."
   ],
   "fr": [
    "Faites bouillir les arachides 3 à 5 minutes, égouttez et frottez-les pour enlever les peaux, pour que la sauce reste claire.",
    "Mixez les arachides avec un peu d'eau en une pâte lisse.",
    "Faites revenir les oignons dans l'huile, ajoutez les tomates mixées, l'ail, le gingembre et les crevettes ; laissez cuire 10 minutes.",
    "Ajoutez la pâte d'arachide et environ 500 ml d'eau, et laissez mijoter à feu très doux environ 30 minutes en remuant souvent, jusqu'à ce que ce soit crémeux et que l'huile apparaisse.",
    "Ajoutez le poisson fumé et le piment pour les 10 dernières minutes ; salez."
   ]
  },
  "serving": {
   "en": [
    "Serve with râpé (kouakoukou), boiled macabo, plantain or rice."
   ],
   "fr": [
    "Servez avec du râpé (kouakoukou), du macabo bouilli, du plantain ou du riz."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Afrik – Kouakoukou à la sauce blanche",
    "url": "https://www.afrik.com/kouakoukou-a-la-sauce-blanche"
   }
  ]
 },
 "sauce-creme-aux-champignons": {
  "tags": [
   "quick",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 20,
  "servings": 4,
  "ingredients": {
   "en": [
    "400 g mushrooms, sliced",
    "1 onion or 2 shallots, 2 cloves garlic",
    "20 g butter + 1 tbsp oil",
    "200 ml cream",
    "Salt, pepper, parsley or thyme"
   ],
   "fr": [
    "400 g de champignons émincés",
    "1 oignon ou 2 échalotes, 2 gousses d'ail",
    "20 g de beurre + 1 c. à soupe d'huile",
    "200 ml de crème",
    "Sel, poivre, persil ou thym"
   ]
  },
  "steps": {
   "en": [
    "Brown the mushrooms in the hot butter and oil over high heat, 5 minutes.",
    "Add the onion and garlic and cook 3 minutes.",
    "Pour in the cream, season, and simmer 5 minutes until it coats a spoon.",
    "Finish with herbs."
   ],
   "fr": [
    "Faites dorer les champignons dans le beurre et l'huile chauds à feu vif, 5 minutes.",
    "Ajoutez l'oignon et l'ail et laissez cuire 3 minutes.",
    "Versez la crème, assaisonnez et laissez mijoter 5 minutes jusqu'à ce qu'elle nappe la cuillère.",
    "Terminez avec les herbes."
   ]
  },
  "serving": {
   "en": [
    "Serve over chicken, steak, pasta, rice or potatoes."
   ],
   "fr": [
    "Servez sur du poulet, un steak, des pâtes, du riz ou des pommes de terre."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "sautes-de-boulettes": {
  "tags": [
   "kids"
  ],
  "prepMinutes": 20,
  "cookMinutes": 25,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g minced beef",
    "1 egg, 2 tbsp breadcrumbs",
    "2 onions, 2 cloves garlic, parsley",
    "2 tomatoes, 1 green pepper",
    "4 tbsp oil, 1 cube, salt, pepper"
   ],
   "fr": [
    "500 g de viande hachée",
    "1 œuf, 2 c. à soupe de chapelure",
    "2 oignons, 2 gousses d'ail, persil",
    "2 tomates, 1 poivron",
    "4 c. à soupe d'huile, 1 cube, sel, poivre"
   ]
  },
  "steps": {
   "en": [
    "Mix the mince with the egg, breadcrumbs, half a grated onion, garlic, parsley, salt and pepper. Roll into small balls.",
    "Brown the balls in the oil on all sides, about 8 minutes. Set aside.",
    "In the same pan, fry the rest of the onion and the pepper, add the chopped tomatoes and cube and cook 5 minutes.",
    "Return the meatballs and toss for 5 minutes until cooked through and coated."
   ],
   "fr": [
    "Mélangez la viande avec l'œuf, la chapelure, un demi-oignon râpé, l'ail, le persil, le sel et le poivre. Formez de petites boulettes.",
    "Faites dorer les boulettes dans l'huile de tous les côtés, environ 8 minutes. Réservez.",
    "Dans la même poêle, faites revenir le reste de l'oignon et le poivron, ajoutez les tomates hachées et le cube et laissez cuire 5 minutes.",
    "Remettez les boulettes et faites sauter 5 minutes jusqu'à ce qu'elles soient cuites à cœur et bien enrobées."
   ]
  },
  "serving": {
   "en": [
    "Serve with rice, fries, plantain or pasta."
   ],
   "fr": [
    "Servez avec du riz, des frites, du plantain ou des pâtes."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "shawarma": {
  "tags": [],
  "prepMinutes": 30,
  "cookMinutes": 20,
  "servings": 4,
  "ingredients": {
   "en": [
    "500 g chicken breast or thigh, in thin strips",
    "1 tsp each cumin, paprika, garlic powder; ½ tsp cinnamon; juice of 1 lime; 2 tbsp oil; salt",
    "4 large flatbreads (pita or tortilla)",
    "Garlic sauce: 4 tbsp mayonnaise, 2 tbsp yogurt, 1 clove garlic",
    "Cabbage, tomato, onion, cucumber, fries (optional)"
   ],
   "fr": [
    "500 g de blanc ou de cuisse de poulet en fines lanières",
    "1 c. à café chacun de cumin, paprika, ail en poudre ; ½ de cannelle ; jus d'1 citron vert ; 2 c. à soupe d'huile ; sel",
    "4 grandes galettes (pita ou tortilla)",
    "Sauce à l'ail : 4 c. à soupe de mayonnaise, 2 de yaourt, 1 gousse d'ail",
    "Chou, tomate, oignon, concombre, frites (facultatif)"
   ]
  },
  "steps": {
   "en": [
    "Marinate the chicken with the spices, lime, oil and salt for at least 30 minutes.",
    "Cook in a very hot pan 8 to 10 minutes until browned and a little charred.",
    "Mix the garlic sauce. Slice the vegetables thinly.",
    "Warm the bread, spread with sauce, add chicken, vegetables (and fries), roll tightly and toast 1 minute in the dry pan."
   ],
   "fr": [
    "Faites mariner le poulet avec les épices, le citron, l'huile et le sel au moins 30 minutes.",
    "Faites cuire dans une poêle très chaude 8 à 10 minutes jusqu'à ce qu'il soit doré et un peu grillé.",
    "Préparez la sauce à l'ail. Émincez finement les légumes.",
    "Chauffez le pain, tartinez de sauce, ajoutez le poulet, les légumes (et les frites), roulez serré et faites dorer 1 minute à la poêle sèche."
   ]
  },
  "serving": {
   "en": [
    "Cut in half and wrap in foil to eat by hand."
   ],
   "fr": [
    "Coupez en deux et emballez dans de l'aluminium pour manger à la main."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "sliced-meat-or-soya": {
  "tags": [],
  "prepMinutes": 20,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "800 g beef (sirloin or rump), sliced very thin",
    "Soya spice (kankan): 4 tbsp ground roasted peanuts, 1 tsp ginger, 1 tsp garlic, 1 tsp chili, ½ tsp rondelle, 1 cube, salt",
    "4 tbsp oil",
    "1 onion, 1 tomato (to serve)"
   ],
   "fr": [
    "800 g de bœuf (faux-filet ou rumsteck) en tranches très fines",
    "Épices soya (kankan) : 4 c. à soupe d'arachides grillées moulues, 1 c. à café de gingembre, 1 d'ail, 1 de piment, ½ de rondelle, 1 cube, sel",
    "4 c. à soupe d'huile",
    "1 oignon, 1 tomate (pour servir)"
   ]
  },
  "steps": {
   "en": [
    "Mix the meat with the oil and two-thirds of the spice. Leave 30 minutes (or longer in the fridge).",
    "Thread the slices onto skewers, or lay them flat on a grill tray.",
    "Grill over hot charcoal or under the oven grill 3 to 4 minutes per side.",
    "Roll the hot meat in the rest of the spice."
   ],
   "fr": [
    "Mélangez la viande avec l'huile et les deux tiers des épices. Laissez 30 minutes (ou plus au frais).",
    "Enfilez les tranches sur des piques, ou étalez-les à plat sur une grille.",
    "Grillez sur la braise ou sous le gril du four 3 à 4 minutes de chaque côté.",
    "Roulez la viande chaude dans le reste des épices."
   ]
  },
  "serving": {
   "en": [
    "Serve wrapped in paper with sliced onion, tomato and chili."
   ],
   "fr": [
    "Servez dans du papier avec de l'oignon émincé, de la tomate et du piment."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Precious Core – Cameroonian soya",
    "url": "https://www.preciouscore.com/cameroonian-soya/"
   },
   {
    "label": "Afrik – Soya de bœuf grillé",
    "url": "https://www.afrik.com/soya-de-boeuf-grille-a-la-camerounaise"
   },
   {
    "label": "International Cuisine – Cameroon suya",
    "url": "https://www.internationalcuisine.com/cameroon-suya/"
   }
  ]
 },
 "spaghetti-bolognaise": {
  "name": "Spaghetti bolognaise",
  "section": "friday",
  "tags": [
   "kids",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 40,
  "servings": 4,
  "ingredients": {
   "en": [
    "400 g spaghetti",
    "400 g minced beef",
    "1 onion, 1 carrot, 2 cloves garlic",
    "400 g crushed tomatoes + 1 tbsp tomato paste",
    "1 tsp dried oregano or basil, 1 bay leaf",
    "2 tbsp oil, salt, pepper",
    "Grated parmesan"
   ],
   "fr": [
    "400 g de spaghetti",
    "400 g de bœuf haché",
    "1 oignon, 1 carotte, 2 gousses d'ail",
    "400 g de tomates concassées + 1 c. à soupe de concentré",
    "1 c. à café d'origan ou de basilic séché, 1 feuille de laurier",
    "2 c. à soupe d'huile, sel, poivre",
    "Parmesan râpé"
   ]
  },
  "steps": {
   "en": [
    "Soften the finely chopped onion, carrot and garlic in the oil for 5 minutes.",
    "Add the mince and brown it, breaking it up.",
    "Add the tomatoes, paste, herbs, bay leaf, salt and pepper; simmer gently 25 to 30 minutes.",
    "Cook the spaghetti in plenty of salted boiling water as the packet says; drain."
   ],
   "fr": [
    "Faites fondre l'oignon, la carotte et l'ail hachés finement dans l'huile 5 minutes.",
    "Ajoutez la viande et faites-la dorer en l'émiettant.",
    "Ajoutez les tomates, le concentré, les herbes, le laurier, le sel et le poivre ; laissez mijoter doucement 25 à 30 minutes.",
    "Faites cuire les spaghetti dans beaucoup d'eau bouillante salée selon le paquet ; égouttez."
   ]
  },
  "serving": {
   "en": [
    "Serve the sauce over the pasta with grated parmesan."
   ],
   "fr": [
    "Servez la sauce sur les pâtes avec du parmesan râpé."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "tapioca-gombo": {
  "tags": [
   "budget",
   "quick"
  ],
  "prepMinutes": 10,
  "cookMinutes": 30,
  "servings": 4,
  "ingredients": {
   "en": [
    "300 g tapioca (coarse cassava gari)",
    "400 ml boiling water",
    "Okra sauce: 300 g okra, 100 ml palm oil, 300 g fish or meat, 1 onion, 1 tomato, 1 pepper, 1 tbsp crayfish, salt"
   ],
   "fr": [
    "300 g de tapioca (gari de manioc, gros grains)",
    "400 ml d'eau bouillante",
    "Sauce gombo : 300 g de gombo, 100 ml d'huile de palme, 300 g de poisson ou de viande, 1 oignon, 1 tomate, 1 piment, 1 c. à soupe d'écrevisses séchées, sel"
   ]
  },
  "steps": {
   "en": [
    "Cook the meat or fish with a little salt and water. Keep the broth.",
    "Heat the palm oil, soften the chopped onion and tomato for 5 minutes, then add the crayfish and pepper.",
    "Add the broth and the meat, then the finely chopped okra. Simmer uncovered 10 minutes until the sauce is stringy.",
    "Pour the boiling water over the tapioca, stir, cover for 5 minutes, then stir hard with a spoon until it forms a soft, smooth dough."
   ],
   "fr": [
    "Faites cuire la viande ou le poisson avec un peu de sel et d'eau. Gardez le bouillon.",
    "Chauffez l'huile de palme, faites revenir l'oignon et la tomate hachés 5 minutes, puis ajoutez les écrevisses et le piment.",
    "Versez le bouillon et la viande, puis le gombo finement haché. Laissez mijoter à découvert 10 minutes, jusqu'à ce que la sauce file.",
    "Versez l'eau bouillante sur le tapioca, mélangez, couvrez 5 minutes, puis remuez fort à la cuillère pour obtenir une pâte souple et lisse."
   ]
  },
  "serving": {
   "en": [
    "Shape the tapioca into balls and serve with the hot okra sauce."
   ],
   "fr": [
    "Façonnez le tapioca en boules et servez avec la sauce gombo bien chaude."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Île aux épices – Sauce gombo",
    "url": "https://ileauxepices.com/blog/2026/03/24/sauce-gombo-traditionnelle/wpid48952/"
   }
  ]
 },
 "tapioca-pistache": {
  "tags": [],
  "prepMinutes": 30,
  "cookMinutes": 60,
  "servings": 6,
  "ingredients": {
   "en": [
    "Pistache (see Fufu pistache): 500 g ground pistache, 500 g beef, 2 smoked fish, 2 tbsp crayfish, 1 pepper, salt",
    "300 g tapioca (cassava gari)",
    "400 ml boiling water"
   ],
   "fr": [
    "Pistache (voir Fufu pistache) : 500 g de pistache moulue, 500 g de bœuf, 2 poissons fumés, 2 c. à soupe d'écrevisses, 1 piment, sel",
    "300 g de tapioca (gari de manioc)",
    "400 ml d'eau bouillante"
   ]
  },
  "steps": {
   "en": [
    "Prepare and steam the pistache parcels as for fufu pistache (about 1 hour).",
    "When they're nearly ready, pour the boiling water over the tapioca, cover 5 minutes, then stir hard until smooth and soft."
   ],
   "fr": [
    "Préparez et faites cuire les paquets de pistache à la vapeur comme pour le fufu pistache (environ 1 heure).",
    "Quand ils sont presque prêts, versez l'eau bouillante sur le tapioca, couvrez 5 minutes, puis remuez fort jusqu'à ce qu'il soit lisse et souple."
   ]
  },
  "serving": {
   "en": [
    "Serve the tapioca in balls next to the opened pistache parcels."
   ],
   "fr": [
    "Servez le tapioca en boules à côté des paquets de pistache ouverts."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Afrik – Pudding egusi",
    "url": "https://www.afrik.com/pudding-egusi"
   }
  ]
 },
 "the": {
  "tags": [
   "quick",
   "budget",
   "vegetarian"
  ],
  "prepMinutes": 2,
  "cookMinutes": 5,
  "servings": 1,
  "ingredients": {
   "en": [
    "1 tea bag (or 1 tsp loose tea, or a few lemongrass leaves)",
    "250 ml water",
    "Sugar, lemon, ginger or milk to taste"
   ],
   "fr": [
    "1 sachet de thé (ou 1 c. à café de thé en vrac, ou quelques feuilles de citronnelle)",
    "250 ml d'eau",
    "Sucre, citron, gingembre ou lait selon le goût"
   ]
  },
  "steps": {
   "en": [
    "Bring the water to the boil.",
    "Pour it over the tea and steep 3 to 5 minutes (lemongrass: simmer 5 minutes).",
    "Remove the tea and add sugar, lemon, a slice of ginger or milk."
   ],
   "fr": [
    "Portez l'eau à ébullition.",
    "Versez-la sur le thé et laissez infuser 3 à 5 minutes (citronnelle : laissez frémir 5 minutes).",
    "Retirez le thé et ajoutez du sucre, du citron, une rondelle de gingembre ou du lait."
   ]
  },
  "serving": {
   "en": [
    "With bread and butter or beignets."
   ],
   "fr": [
    "Avec du pain beurre ou des beignets."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "toast-au-saucisse-de-porc-maison": {
  "tags": [
   "western"
  ],
  "prepMinutes": 25,
  "cookMinutes": 15,
  "servings": 4,
  "ingredients": {
   "en": [
    "Homemade sausage: 400 g minced pork, 1 clove garlic, ½ tsp each salt, pepper, paprika, thyme, fennel (optional)",
    "8 slices of bread",
    "1 tomato, 1 onion",
    "50 g cheese (optional)",
    "1 tbsp oil"
   ],
   "fr": [
    "Saucisse maison : 400 g de porc haché, 1 gousse d'ail, ½ c. à café chacun de sel, poivre, paprika, thym, fenouil (facultatif)",
    "8 tranches de pain",
    "1 tomate, 1 oignon",
    "50 g de fromage (facultatif)",
    "1 c. à soupe d'huile"
   ]
  },
  "steps": {
   "en": [
    "Mix the pork with the garlic and spices; shape into 4 flat patties.",
    "Cook in the oil 5 to 6 minutes per side until fully cooked.",
    "Toast the bread. Slice the onion and tomato.",
    "Build the toasts: sausage, onion, tomato (and cheese), close and press in the hot pan 1 minute."
   ],
   "fr": [
    "Mélangez le porc avec l'ail et les épices ; façonnez 4 galettes plates.",
    "Faites cuire dans l'huile 5 à 6 minutes de chaque côté jusqu'à cuisson complète.",
    "Grillez le pain. Émincez l'oignon et la tomate.",
    "Montez les toasts : saucisse, oignon, tomate (et fromage), fermez et pressez dans la poêle chaude 1 minute."
   ]
  },
  "serving": {
   "en": [
    "Serve with juice or tea."
   ],
   "fr": [
    "Servez avec du jus ou du thé."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 },
 "tripes-roties": {
  "tags": [
   "budget"
  ],
  "prepMinutes": 20,
  "cookMinutes": 120,
  "servings": 4,
  "ingredients": {
   "en": [
    "1 kg beef tripe, well cleaned",
    "1 onion, 1 cube, salt",
    "Soya spice (kankan): 3 tbsp ground roasted peanuts, 1 tsp ginger powder, 1 tsp garlic powder, 1 tsp chili, ½ tsp rondelle (country onion), 1 cube",
    "3 tbsp oil"
   ],
   "fr": [
    "1 kg de tripes de bœuf bien nettoyées",
    "1 oignon, 1 cube, sel",
    "Épices soya (kankan) : 3 c. à soupe d'arachides grillées moulues, 1 c. à café de gingembre en poudre, 1 d'ail en poudre, 1 de piment, ½ de rondelle, 1 cube",
    "3 c. à soupe d'huile"
   ]
  },
  "steps": {
   "en": [
    "Wash the tripe several times (lime helps with the smell) and boil it with the onion, cube and salt for 1½ to 2 hours, until tender.",
    "Drain, cool and cut into strips; thread onto skewers if you like.",
    "Brush with oil and roll in the soya spice.",
    "Grill over hot charcoal or under the oven grill 8 to 10 minutes, turning, until crisp at the edges."
   ],
   "fr": [
    "Lavez les tripes plusieurs fois (le citron aide contre l'odeur) et faites-les bouillir avec l'oignon, le cube et le sel 1 h 30 à 2 heures, jusqu'à ce qu'elles soient tendres.",
    "Égouttez, laissez refroidir et coupez en lanières ; enfilez-les sur des piques si vous voulez.",
    "Badigeonnez d'huile et roulez dans les épices soya.",
    "Grillez sur la braise ou sous le gril du four 8 à 10 minutes en retournant, jusqu'à ce que les bords soient croustillants."
   ]
  },
  "serving": {
   "en": [
    "Serve with sliced onion, chili and fried plantain or bobolo."
   ],
   "fr": [
    "Servez avec de l'oignon émincé, du piment et du plantain frit ou du bâton de manioc."
   ]
  },
  "images": [],
  "video": "",
  "sources": [
   {
    "label": "Precious Core – Cameroonian soya",
    "url": "https://www.preciouscore.com/cameroonian-soya/"
   },
   {
    "label": "Afrik – Soya de bœuf grillé",
    "url": "https://www.afrik.com/soya-de-boeuf-grille-a-la-camerounaise"
   }
  ]
 },
 "yaourt-gateau": {
  "tags": [
   "kids",
   "vegetarian",
   "western"
  ],
  "prepMinutes": 10,
  "cookMinutes": 35,
  "servings": 8,
  "ingredients": {
   "en": [
    "1 plain yogurt (125 g) – keep the pot to measure",
    "2 pots of sugar",
    "3 pots of flour",
    "½ pot of oil",
    "3 eggs",
    "1 sachet (11 g) baking powder",
    "Vanilla or lemon zest"
   ],
   "fr": [
    "1 yaourt nature (125 g) – gardez le pot pour mesurer",
    "2 pots de sucre",
    "3 pots de farine",
    "½ pot d'huile",
    "3 œufs",
    "1 sachet (11 g) de levure chimique",
    "Vanille ou zeste de citron"
   ]
  },
  "steps": {
   "en": [
    "Heat the oven to 180 °C and grease a tin.",
    "Empty the yogurt into a bowl and use the pot to measure everything else.",
    "Mix the yogurt, sugar and eggs, then the oil, then the flour, baking powder and flavouring.",
    "Pour into the tin and bake 30 to 35 minutes, until a knife comes out clean."
   ],
   "fr": [
    "Préchauffez le four à 180 °C et beurrez un moule.",
    "Videz le yaourt dans un saladier et utilisez le pot pour mesurer le reste.",
    "Mélangez le yaourt, le sucre et les œufs, puis l'huile, puis la farine, la levure et l'arôme.",
    "Versez dans le moule et faites cuire 30 à 35 minutes, jusqu'à ce qu'un couteau ressorte sec."
   ]
  },
  "serving": {
   "en": [
    "Perfect with tea, juice or in a lunch box."
   ],
   "fr": [
    "Parfait avec du thé, du jus ou dans la boîte à goûter."
   ]
  },
  "images": [],
  "video": "",
  "sources": []
 }
}
$chop$::jsonb) as r
on conflict (slug) do nothing;

-- Label the Western dishes that were already in the database.
update public.recipes
set tags = array_append(tags, 'western')
where slug in ('crepes', 'gateaux-au-citron', 'gateaux-au-yaourt', 'oeufs-mimosa-rose', 'pain-perdu', 'poulet-pane', 'scotch-eggs', 'smoothies')
  and not ('western' = any(tags));
