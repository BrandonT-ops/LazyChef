# Project plan

> Name: **Chop** ("food / to eat" in Cameroonian Pidgin). It lives in `src/config/site.ts`.

## Goal

A bilingual (English / French) home-cooking site where anyone, with no account needed, can:

- browse the family's dishes by **day-of-week theme**, breakfast and drinks
- **search** for a dish and filter it (💰 low budget, ⚡ quick, 👶 kids…)
- **plan a week** of meals automatically
- **roll the dice** for a random dish
- follow a recipe as a **treasure map**, step by step
- leaf through everything as a **cookbook** with turning pages

Accounts are only needed to contribute:

- **Users** can write personal recipes (private) or publish them, which sends them to review.
- **Admins** add recipes directly and approve or reject submissions.

## Design

- **Palette: Marché (warm market).** Cream `#FFF8EE`, cocoa `#2A1A12`, tomato `#E4572E`,
  mango `#F4A916`, plantain leaf `#2E8B57`, with a little hibiscus `#7A3E9D`. The colors are
  tokens in `src/app/globals.css`, and dark mode follows the device setting, with a toggle.
- **Motion:** Framer Motion for gentle page fades, cards that fade up as you scroll, a hover lift, the dice roll,
  page turns and the trail drawing itself on the treasure map. Nothing flashes or loops loudly, and all
  motion turns off when the device asks for reduced motion.

## Phases

### Phase 1: public site ✅ (this branch)
- Next.js 15 (App Router) + Tailwind + next-intl (`/en`, `/fr`) + Framer Motion
- The whole family food list as data (`src/data/menu.ts`): about 250 dishes, each marked "recipe coming soon"
- 3 sample recipes (`src/data/recipes.ts`): Œuf bouillie, Pain perdu, Salade de fruits
- Pages: home (today's theme), cookbook, section, dish (treasure map, ingredient checklist,
  photos / preview video / links), search with filters, dice, week planner (saved on the device)
- Static generation for every dish in both languages

### Phase 1.5: planner, markets, sharing, app ✅
- Week planner with breakfast, lunch and supper. **Cook every day** follows the day themes.
  **Cook ahead** asks which days you're free, plans batches of dishes that keep well on those days,
  and fills the other days with the leftovers.
- **Markets** page: shops and markets near you (geolocation or a typed place) from OpenStreetMap,
  with filters, distance and directions. Opened from a recipe, it also shows the shopping list.
- Share a recipe or your week (the phone's share sheet, or WhatsApp / Facebook / copy link)
- Installable PWA: manifest, icons, an offline service worker and an "Install app" button
  (with steps for iPhone)

### Phase 1.6: essentials without a backend ✅
Everything here is stored on the person's own device (localStorage and IndexedDB), and is built
so it can be uploaded to their account when Phase 2 arrives.
- **Cook ahead, reworked:** one dish per cooking day. It's the main meal until the next cooking
  day, breakfasts and light suppers are suggested, and stretches of 4+ days get a snack day
  (which you can toggle).
- **Sides:** every main dish gets a matching side (ndolé with plantain or miondo, eru with fufu,
  grills with plantain or fries…). Dishes that already include their starch get none. You can reroll sides.
- **My kitchen** (`/me`): favorites, my recipes, "I made it" photos, shopping list
- **My recipes:** an editor (photo, video, links). Each step becomes a stop on the treasure map.
  Share by link: the whole recipe travels in the link (`/r#…`), and the person who opens it can save it.
- **"I made it!":** take a photo of the dish, keep it in a gallery, share it to WhatsApp or Instagram
- **Shopping list:** built from the week plan or from one recipe. Tick items off, share it, find a market.
- **Cookbook:** a real book with a hard cover, page turns over the spine, and the book centered when closed

### Phase 1.7: events and costs ✅
- **Events** (`/events`): birthday, wedding / dot / ceremony, Christmas & New Year, baptism / baby shower,
  funeral / wake, family Sunday lunch, friends & grill night. Pick the guests and a budget (small, comfortable,
  generous) to get snacks, mains with sides, a dessert and drinks, with servings scaled to the guests. Swap,
  add or remove items, see the total and cost per guest, share the menu, and send it to the shopping list.
- **Costs in FCFA:** rough per-serving estimates (`src/data/prices.ts`). Tap any price to change it; your
  prices are remembered and used everywhere.
- **Shopping list:** price per line, "left to buy" and total. "Find a market" pre-selects the right shop
  types (butcher, fish, bakery…), and the markets page shows what's left to buy.
- **Week planner:** a "people eating" count, so quantities and costs in the list fit the household.

### Phase 2: accounts, submissions, admin
Proposed backend: **Supabase** (Postgres, auth, file storage for photos and videos, row-level security), with a free tier.

```
profiles   id (auth user) · display_name · role: 'user' | 'admin'
recipes    id · slug · section · name · alt_names{en,fr}
           tags[] · prep/cook minutes · servings
           ingredients{en[],fr[]} · steps{en[],fr[]}
           images[] · video_url · links[{label,url}]
           author_id · visibility: 'private' | 'public'
           status: 'draft' | 'pending' | 'approved' | 'rejected'
           review_note · created_at · updated_at
plans      user_id · week (json)   -- optional: sync the planner across devices
```

Rules (enforced by row-level security):
- Anyone can read `public` + `approved` recipes.
- Authors can read and edit their own recipes. Publishing a recipe sets its status to `pending`.
- Admins can do everything, including approve and reject.

Screens: sign in (email magic link or Google), "My recipes", recipe editor (bilingual fields, photo and
video upload, links), "Submit for review", admin review queue, and **"I made it!" photo posts** on recipe pages.

`src/lib/dishes.ts` is the only place that reads data, so Phase 2 swaps its internals for
database queries without touching the pages.

### Phase 3: nice-to-haves
- Shopping list built from the week plan
- Serving-size scaler
- Favorites
- Occasion collections (birthday, Christmas, guests…)
- Share a week plan by link

## Open questions
- What are **BHB, Dovv, SL, Dakere**? (They are listed under breakfast for now.)
- **Présentations, Trials, Et autre** were left out: should they be categories, dishes, or nothing?
- Which dishes are **💰 low budget**, quick, or kid-friendly? Tag them so the filters fill up.
