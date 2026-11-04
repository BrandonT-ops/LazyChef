"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Download, NotebookPen, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { SITE } from "@/config/site";
import { getSection } from "@/data/sections";
import { idb, useBlobUrl, useIdbAll, type UserRecipe } from "@/lib/idb";
import { newId } from "@/lib/local";
import { decodeRecipe, encodeRecipe, type SharedRecipe } from "@/lib/recipe-link";
import { ACCENT_BG } from "@/lib/ui";
import { SectionIcon } from "./icons";
import { RecipeView } from "./RecipeView";
import { ShareButton } from "./ShareButton";
import { MadeItButton, PhotoGrid } from "./MadeIt";
import { AddToShoppingButton } from "./Shopping";

const toShared = (r: UserRecipe): SharedRecipe => ({
  name: r.name,
  section: r.section,
  tags: r.tags,
  prepMinutes: r.prepMinutes,
  cookMinutes: r.cookMinutes,
  servings: r.servings,
  ingredients: r.ingredients,
  steps: r.steps,
  video: r.video,
  links: r.links,
  lang: r.lang,
});

/** The person's own recipes, as cards. */
export function MyRecipeList() {
  const t = useTranslations("kitchen");
  const { rows, ready } = useIdbAll("recipes");
  if (!ready) return null;
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <p className="mr-auto text-sm text-muted">{t("recipesNote")}</p>
        <Link href="/me/edit" className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden />
          {t("newRecipe")}
        </Link>
      </div>
      {rows.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          <NotebookPen className="mx-auto mb-3 h-10 w-10 text-mango" aria-hidden />
          {t("noRecipes")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <MyRecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function MyRecipeCard({ recipe }: { recipe: UserRecipe }) {
  const t = useTranslations();
  const url = useBlobUrl(recipe.photo);
  const section = getSection(recipe.section)!;
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Link href={`/me/recipe?id=${recipe.id}`} className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-36 w-full object-cover" />
        ) : (
          <div className={`grid h-36 place-items-center ${ACCENT_BG[section.accent]}`}>
            <SectionIcon id={section.id} className="h-10 w-10" />
          </div>
        )}
        <div className="p-4">
          <h3 className="heading group-hover:text-tomato">{recipe.name}</h3>
          <p className="text-xs text-muted">
            {t(`sections.${section.id}.name`)} · {t("dish.minutes", { count: recipe.prepMinutes + recipe.cookMinutes })}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/** One of the person's own recipes, with edit / share / delete. */
export function MyRecipePage({ id }: { id: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [recipe, setRecipe] = useState<UserRecipe | null | undefined>(undefined);
  const [link, setLink] = useState("");
  const photoUrl = useBlobUrl(recipe?.photo);

  useEffect(() => {
    idb.get("recipes", id).then((r) => setRecipe(r ?? null));
  }, [id]);

  useEffect(() => {
    if (!recipe) return;
    encodeRecipe(toShared(recipe)).then((data) => setLink(`${window.location.origin}/${document.documentElement.lang}/r#${data}`));
  }, [recipe]);

  if (recipe === undefined) return <div className="card h-96 animate-pulse" />;
  if (recipe === null) return <p className="card p-10 text-center text-muted">{t("kitchen.notFound")}</p>;

  return (
    <RecipeView
      recipe={recipe}
      photoUrl={photoUrl}
      storageKey={`user-${recipe.id}`}
      badge={
        <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-leaf">
          <UserRound className="h-3.5 w-3.5" aria-hidden />
          {t("kitchen.myRecipe")}
        </p>
      }
      actions={
        <>
          {link && (
            <ShareButton
              title={recipe.name}
              text={t("share.dishText", { name: recipe.name, site: SITE.name })}
              label={t("kitchen.shareRecipe")}
              url={link}
            />
          )}
          <MadeItButton dishName={recipe.name} recipeId={recipe.id} />
          <AddToShoppingButton source={`recipe:${recipe.id}`} group={recipe.name} items={recipe.ingredients} />
          <Link href={`/me/edit?id=${recipe.id}`} className="btn-ghost">
            <Pencil className="h-4 w-4" aria-hidden />
            {t("kitchen.edit")}
          </Link>
          <button
            type="button"
            className="btn-ghost"
            onClick={async () => {
              if (!confirm(t("kitchen.confirmDelete"))) return;
              await idb.delete("recipes", recipe.id);
              router.push("/me?tab=recipes");
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            {t("kitchen.delete")}
          </button>
        </>
      }
      below={<PhotoGrid recipeId={recipe.id} compact />}
    />
  );
}

/** A recipe someone shared by link (/r#…). Can be saved to "My recipes". */
export function SharedRecipePage() {
  const t = useTranslations();
  const router = useRouter();
  const [recipe, setRecipe] = useState<SharedRecipe | null | undefined>(undefined);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const h = window.location.hash.slice(1);
    setHash(h);
    if (!h) setRecipe(null);
    else decodeRecipe(h).then(setRecipe);
  }, []);

  if (recipe === undefined) return <div className="card h-96 animate-pulse" />;
  if (recipe === null) return <p className="card p-10 text-center text-muted">{t("kitchen.badLink")}</p>;

  const save = async () => {
    const now = Date.now();
    const row: UserRecipe = { ...recipe, id: newId(), createdAt: now, updatedAt: now };
    await idb.put("recipes", row);
    router.push(`/me/recipe?id=${row.id}`);
  };

  return (
    <RecipeView
      recipe={recipe}
      storageKey={`shared-${hash.slice(0, 24)}`}
      badge={<p className="mb-1 text-xs font-semibold uppercase tracking-wider text-hibiscus">{t("kitchen.sharedWithYou")}</p>}
      actions={
        <>
          <button type="button" onClick={save} className="btn-primary">
            <Download className="h-4 w-4" aria-hidden />
            {t("kitchen.saveToMine")}
          </button>
          <ShareButton title={recipe.name} text={t("share.dishText", { name: recipe.name, site: SITE.name })} />
        </>
      }
    />
  );
}
