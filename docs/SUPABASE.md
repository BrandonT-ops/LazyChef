# Supabase setup

Chop uses Supabase for accounts, the admin, community submissions, synced kitchens and photo
and video uploads. Without Supabase the site still works: recipes come from `content/recipes/`
and everything personal stays on the visitor's device.

## 1. Database: apply the migrations

The database setup lives in `supabase/migrations/` (tables, security rules, storage buckets and the
first 23 recipes).

- **With the Supabase GitHub integration** (Supabase dashboard → Project Settings → Integrations →
  GitHub): set the Supabase directory to `supabase` and turn on deploying to production for the branch
  Vercel deploys. Migrations then run automatically on every push.
- **Or by hand:** Supabase dashboard → SQL Editor → paste and run each file in
  `supabase/migrations/`, oldest first. They're safe to run again.

## 2. Connect Vercel

With Vercel's Supabase integration (Vercel → Project → Integrations → Supabase), these are set for you.
Otherwise add them in Vercel → Project → Settings → Environment Variables:

| Name | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key |

These two are safe to expose: the database's row-level security decides what each person can do.
**Never** put the `service_role` key in a `NEXT_PUBLIC_` variable. Chop doesn't need it.

Redeploy after adding them.

## 3. Sign-in settings

Supabase → Authentication → URL Configuration:

- **Site URL:** your site, e.g. `https://your-site.vercel.app`
- **Redirect URLs:** add `https://your-site.vercel.app/auth/callback` (and
  `http://localhost:3000/auth/callback` for local development)

Supabase → Authentication → Providers → Email: keep it enabled (sign-in links and passwords both use it).

**Emails:** Supabase's built-in email sender only allows a few emails per hour, which is fine for
testing but not for real visitors. Before launch, set up your own sender under Authentication →
Emails → SMTP Settings (for example Resend, Brevo or Postmark).

## 4. Make yourself the first admin

1. Create your account on the site (`/account`).
2. In Supabase → SQL Editor, run (with your email):

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

3. Open `/admin`. From then on you can add other admins from **Admin → Admins**.

## What lives where

| Data | Table / bucket | Who can see it |
|---|---|---|
| Official recipes | `recipes` | Everyone (admins edit) |
| People's recipes | `user_recipes` | The owner; everyone once an admin approves it |
| "I made it" photos | `made_photos` + bucket `photos` | Everyone if public; the owner otherwise |
| Favorites, shopping list, prices, plans | `user_data` | The owner only |
| Recipe photos and videos | bucket `recipe-media` | Everyone (files are public links) |
| Roles | `profiles.role` | Changed only by admins |

## Local check of the migrations

`scripts/recipes-to-sql.mjs` regenerates the recipe seed from `content/recipes/` if you edit those files.
