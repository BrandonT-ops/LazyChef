// Builds the SQL that copies content/recipes/*.json into the Supabase "recipes" table.
// Usage: node scripts/recipes-to-sql.mjs > supabase/migrations/<timestamp>_seed_recipes.sql
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "recipes");
const all = {};
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  all[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
}
const json = JSON.stringify(all, null, 1);
if (json.includes("$chop$")) throw new Error("recipe text contains the SQL quote marker");

process.stdout.write(`-- The recipes Chop launched with (from content/recipes). Existing rows are left untouched.
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
${json}
$chop$::jsonb) as r
on conflict (slug) do nothing;
`);
