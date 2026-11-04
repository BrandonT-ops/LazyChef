# Chop

**What are we eating today?** Home recipes for breakfast, every day of the week and drinks,
in English and French. Browse the cookbook, search, plan your week (or cook ahead on your free days),
roll the dice, find markets near you and share recipes. Installable as an app (PWA) and works offline.

See [`docs/PLAN.md`](docs/PLAN.md) for the full plan and roadmap.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS · next-intl · Framer Motion · Lucide icons · Leaflet + OpenStreetMap

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run lint
```

## Where things live

| What | Where |
|---|---|
| Site name / logo | `src/config/site.ts` |
| Colors (light + dark) | `src/app/globals.css` |
| Dish list per section | `src/data/menu.ts` |
| Written recipes (+ photos, video, links) | `src/data/recipes.ts` |
| Sections (days, accent color) | `src/data/sections.ts` |
| Section and tag icons | `src/components/icons.tsx` |
| Which dishes "keep well" (cook-ahead) | `src/data/traits.ts` |
| Week planner rules (cook every day / cook ahead, snack days) | `src/lib/planner.ts` |
| Sides and which dish gets which | `src/data/sides.ts` |
| Favorites, shopping list (on device) | `src/lib/local.ts` |
| My recipes, "I made it" photos (on device) | `src/lib/idb.ts` |
| Recipe share links (`/r#…`) | `src/lib/recipe-link.ts` |
| Shop search (OpenStreetMap) | `src/lib/places.ts` |
| Event menus per occasion | `src/lib/events.ts` |
| Price estimates (FCFA) | `src/data/prices.ts` |
| App install + offline | `src/app/manifest.ts`, `public/sw.js` |
| English / French text | `messages/en.json`, `messages/fr.json` |
| Pages | `src/app/[locale]/…` |

### Adding a recipe
Add an entry to `src/data/recipes.ts`, keyed by the dish slug (the name in lowercase, without
accents, with dashes instead of spaces: `Pain perdu` becomes `pain-perdu`):

```ts
"pain-perdu": {
  tags: ["budget", "quick"],
  recipe: {
    prepMinutes: 5, cookMinutes: 10, servings: 2,
    media: {
      images: ["https://…/photo.jpg"],
      video: "https://youtu.be/…",           // YouTube link or .mp4
      links: [{ label: "Original recipe", url: "https://…" }],
    },
    ingredients: { en: ["…"], fr: ["…"] },
    steps: { en: ["…"], fr: ["…"] },       // each step is one stop on the treasure map
  },
},
```

From Phase 2 on, recipes come from the admin and from user submissions instead.

## Deploy
Import the repository on [Vercel](https://vercel.com/new). It's a standard Next.js app, so no settings are needed.
