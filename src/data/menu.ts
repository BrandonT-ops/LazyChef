import type { SectionId } from "./types";

/**
 * The family food list, grouped by section, exactly as written.
 * Each name becomes a dish card. Dishes start as "recipe coming soon"
 * until a recipe is added in ./recipes.ts (and later, from the admin).
 *
 * Left out for now, pending clarification: "Présentations", "Trials", "Et autre".
 */
export const MENU: Record<SectionId, string[]> = {
  breakfast: [
    "Œuf frit", "Œuf bouillie", "Café", "Lait", "Thé", "Avocat", "Prunes",
    "Crêpes", "Kumba bread filling", "Pain perdu", "Pain choco", "Pain beurre",
    "Pain mayo", "Pain saucisse", "Pain saucisson", "Pain pâte d'arachide",
    "Pain fromage", "Tapioca", "BHB", "Bread toast snack", "Kids breakfast",
    "Purée d'avocat", "Jus gâteau", "Crème", "Smoothies", "Sucettes", "Dakere",
    "Yaourt gâteau", "Gummies", "Dovv", "SL",
  ],
  monday: [
    "Chicken and bread snack", "Crockettes de poisson", "Pilli poisson",
    "Pilons poulet", "Pilli poulet", "Pilli viande de boeuf", "Œuf enrobés",
    "Oeufs mimosa rose", "Salade de crû", "Plantain cups",
    "Boulettes enrobé de miondo", "Egg cups", "Egg burger", "Manioc fromage",
    "Burger plantain", "Recettes avec les cornichons",
    "Egg white, spinach and egg yolk", "Galettes viande hachée pommes",
    "Sardines, kumba and egg", "Nems", "Cassava sticks",
    "Egg ball with plantains and potatoes",
  ],
  tuesday: [
    "Beafteak", "Pattes sautés", "Champignons sautés", "Sautés de boulettes",
    "Poulet mayo", "Haricots frit", "Riz sauté", "Risotto", "Riz gras",
    "Coconut rice", "Poulet DG", "Kedjenou", "Porc DG", "Boeuf DG",
    "Poisson DG", "Chèvre DG", "Gésier sauté", "Crevettes sautées",
    "Choux sauté", "Igname blanc sautés", "Légumes sautés", "Macabo sauté",
    "Pommes sautées", "Peau de boeuf et autres sauté", "Pommes sautées choux",
    "Haché viande", "Haricots blancs frit", "Haricots rouges frit",
    "Haricots noirs frit",
  ],
  wednesday: [
    "Pizza classique", "Galettes farineuses", "Biscuits au beurre",
    "Gâteaux au yaourt", "Gâteaux au citron", "Gâteaux de manioc frais",
    "Gâteaux à l'orange", "Toast au saucisse de porc maison", "Salade de cuit",
    "Irish balls", "Corn hot dogs", "Brochettes poulet farine", "Scotch eggs",
    "Potatoes churros", "Rice crackers",
    "Biscuits au yaourt et pépites de chocolat",
  ],
  thursday: [
    "Tripes rôties", "Escargots rôtis", "Chèvre rôti", "Poisson rôti",
    "Poulet rôti",
  ],
  friday: [
    "Christmas stew", "Sauce crème aux champignons",
    "Crevettes, ail, lait de coco", "Sauce tomate", "Sauce d'arachide",
    "Sauce blanche", "Sauce pistache", "Ofada stew red bell pepper",
    "Bouillon de pommes", "Bouillon de poulet", "Bouillon de poisson",
    "Bouillon de porc", "Bouillon de boeuf", "Beignets banane",
    "Beignets manioc simple", "Beignets de riz", "Beignets manioc banane",
    "Beignets koki", "Beignets farine",
  ],
  saturday: [
    "Poisson braisé", "Porc braisé", "Poulet braisé", "Brochettes de poulet",
    "Brochettes de boeuf", "Brochettes de soja", "Brochettes de porc",
    "Poisson au four", "Poisson à la poêle et risotto", "Boulettes de boeuf",
    "Pilons de poulet au fromage", "Poulet pané", "Sliced meat or soya",
    "Shawarma", "Manioc farci", "Plantain tapé snack", "Poulet fumé",
    "Eggs snack zucchini", "Pizza oeufs", "Œufs farcis", "Gratin de pommes",
    "Gratin pour belle sœur", "Salade de fruits", "Meat pie", "Fish roll",
  ],
  sunday: [
    "Koki", "Kondre de porc et boeuf", "Kondre de poulet", "Corn chaff",
    "Couscous légumes simple", "Couscous légumes pistache", "Couscous nkui",
    "Couscous choux arachides", "Couscous gombo",
    "Couscous sauce jaune légumes", "Couscous de riz et fufu gombo",
    "Couscous de riz et fufu pistache", "Tapioca gombo", "Tapioca pistache",
    "Fufu gombo", "Fufu pistache", "Fufu pistache style huile rouge et ndolé",
    "Couscous sauce légumes", "Râpé", "Taro sauce jaune", "Taro sauce noire",
    "Eru", "Pounded cassava and okro", "Ekwang", "Kati kati", "Ogbono soup",
    "Ndolé", "Mbanga soup", "Mbongo", "Ndomba", "Pilé pommes",
    "Pilé plantain", "Pilé bananes cochon et number one", "Pilé macabo",
    "Calabar soup", "Koki de manioc", "Pilé macabo feuilles de melon",
    "Gâteaux de maïs", "Chap", "Chap pilé légumes", "Banane malaxée",
    "Kwanzap", "Mille morceaux de plantain", "Macabo ndolé sauté",
    "Okok sucré", "Okok salé", "Pkwem", "Sanga", "Met de pistache",
    "Met d'arachide", "Pâte d'arachide",
  ],
  drinks: [
    "Whisky café écrémé", "Matango", "Tiger nuts juice", "Fanta",
    "Jus d'ananas", "Jus de papaye", "Jus d'orange", "Lemon", "Jus de mangue",
    "Jus de pomme", "Jus de goyave", "Jus en conserve", "Citron",
    "Pamplemousse", "Passion fruit", "Limonade brésilienne",
    "Limonade mangue", "Mangue citron", "Coro ananas", "Coro mangue",
    "Coro coco", "Mangue coco", "Ananas passion", "Coco passion",
    "Goyave passion", "Mangue passion", "Cocktails", "Carotte banane lait",
    "Fraise banane lait", "Bora Bora jus", "Jus digestion",
  ],
};
