# Setting up the admin

The admin lives at **`/admin`** (there's also a small "Admin" link in the footer).
You sign in with GitHub. When you publish a recipe, it's saved as a file in this repository
(`content/recipes/<dish>.json`, photos in `public/recipes/<dish>/`), and Vercel republishes
the site in about a minute. No database is needed.

It takes about 5 minutes to set up, once.

## 1. Create a GitHub OAuth App (this is how the admin knows who you are)

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. **Application name:** `Chop admin`
3. **Homepage URL:** your site, e.g. `https://your-site.vercel.app`
4. **Authorization callback URL:** `https://your-site.vercel.app/api/admin/callback`
5. Click **Register application**. Copy the **Client ID**, then click **Generate a new client secret** and copy it.

The admin only asks GitHub for your public profile (to read your username). It never gets access to your repositories.

## 2. Create a token that can save recipes (this repository only)

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. **Repository access:** *Only select repositories* → `LazyChef`.
3. **Permissions → Repository permissions → Contents:** *Read and write*.
4. Generate it and copy the token.

## 3. Add the settings in Vercel

Vercel → your project → **Settings** → **Environment Variables**, add:

| Name | Value |
|---|---|
| `GITHUB_CLIENT_ID` | from step 1 |
| `GITHUB_CLIENT_SECRET` | from step 1 |
| `GITHUB_TOKEN` | from step 2 |
| `ADMIN_GITHUB_USERS` | GitHub usernames allowed in, comma-separated, e.g. `BrandonT-ops` |
| `SESSION_SECRET` | 32+ random characters (e.g. run `openssl rand -base64 32`) |
| `GITHUB_REPO` *(optional)* | defaults to `BrandonT-ops/LazyChef` |
| `GITHUB_BRANCH` *(optional)* | defaults to the repository's default branch, which should be the one Vercel deploys |

Then **redeploy** (Deployments → ⋯ → Redeploy). Open `/admin` and sign in.

## Adding someone else as an admin
Add their GitHub username to `ADMIN_GITHUB_USERS` and redeploy.

## What the admin can do
- Edit any dish's recipe, or add a new dish
- **What to buy:** a bulleted list (paste a whole list and it splits into lines)
- **How to cook:** numbered steps, which become the treasure map
- **How to serve:** tips, plus photos of the finished dish
- **Video:** a YouTube, TikTok, Facebook or Instagram link, shown with the platform's own player
- **Sources:** credit the recipes or videos that inspired it
- English and French, side by side

Uploading video files (instead of links) and letting visitors submit recipes for review come with
the Supabase database (see `docs/PLAN.md`, Phase 2).
