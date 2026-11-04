"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CircleCheck, Clock, Download, Globe, Lock, NotebookPen, Pencil, Plus, Send, Smartphone, Trash2, Undo2, UserRound, CircleX } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { SITE } from "@/config/site";
import { getSection } from "@/data/sections";
import { useBlobUrl } from "@/lib/idb";
import { decodeRecipe, encodeRecipe, type SharedRecipe } from "@/lib/recipe-link";
import { myRecipes, useMyRecipes, type MyRecipe } from "@/lib/user-content";
import type { ReviewStatus } from "@/lib/supabase/rows";
import { ACCENT_BG } from "@/lib/ui";
import { useAuth } from "./auth/AuthProvider";
import { SectionIcon } from "./icons";
import { RecipeView } from "./RecipeView";
import { ShareButton } from "./ShareButton";
import { MadeItButton, PhotoGrid } from "./MadeIt";
import { AddToShoppingButton } from "./Shopping";

const toShared = (r: MyRecipe): SharedRecipe => ({
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

const STATUS_ICON: Record<ReviewStatus, typeof Lock> = { private: Lock, submitted: Clock, approved: CircleCheck, rejected: CircleX };
const STATUS_CLASS: Record<ReviewStatus, string> = {
  private: "bg-subtle text-muted",
  submitted: "bg-mango/15 text-mango",
  approved: "bg-leaf/10 text-leaf",
  rejected: "bg-tomato/10 text-tomato",
};

export function StatusBadge({ recipe }: { recipe: MyRecipe }) {
  const t = useTranslations("review");
  if (recipe.where === "device") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-subtle px-2 py-0.5 text-xs font-medium text-muted">
        <Smartphone className="h-3 w-3" aria-hidden />
        {t("device")}
      </span>
    );
  }
  const s = recipe.status ?? "private";
  const Icon = STATUS_ICON[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[s]}`}>
      <Icon className="h-3 w-3" aria-hidden />
      {t(`status.${s}`)}
    </span>
  );
}

/** The person's own recipes, as cards. */
export function MyRecipeList() {
  const t = useTranslations("kitchen");
  const { user, loading } = useAuth();
  const { rows, ready, error } = useMyRecipes(user?.id ?? null, loading);
  if (!ready) return <div className="card h-40 animate-pulse" />;
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <p className="mr-auto text-sm text-muted">{user ? t("recipesNoteAccount") : t("recipesNote")}</p>
        <Link href="/me/edit" className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden />
          {t("newRecipe")}
        </Link>
      </div>
      {error && <p className="mb-4 text-sm text-tomato">{error}</p>}
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

function MyRecipeCard({ recipe }: { recipe: MyRecipe }) {
  const t = useTranslations();
  const blobUrl = useBlobUrl(recipe.photo);
  const url = recipe.photoUrl ?? blobUrl;
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
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-semibold group-hover:text-tomato">{recipe.name}</h3>
          <p className="text-xs text-muted">
            {t(`sections.${section.id}.name`)} · {t("dish.minutes", { count: recipe.prepMinutes + recipe.cookMinutes })}
          </p>
          <div className="mt-auto">
            <StatusBadge recipe={recipe} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/** One of the person's own recipes, with edit / share / submit / delete. */
export function MyRecipePage({ id }: { id: string }) {
  const t = useTranslations();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [recipe, setRecipe] = useState<MyRecipe | null | undefined>(undefined);
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const blobUrl = useBlobUrl(recipe?.photo);

  useEffect(() => {
    if (loading) return;
    myRecipes
      .get(user?.id ?? null, id)
      .then(setRecipe)
      .catch(() => setRecipe(null));
  }, [id, user, loading]);

  useEffect(() => {
    if (!recipe) return;
    encodeRecipe(toShared(recipe)).then((data) => setLink(`${window.location.origin}/${document.documentElement.lang}/r#${data}`));
  }, [recipe]);

  if (recipe === undefined) return <div className="card h-96 animate-pulse" />;
  if (recipe === null) return <p className="card p-10 text-center text-muted">{t("kitchen.notFound")}</p>;

  const changeStatus = async (status: "private" | "submitted") => {
    setBusy(true);
    try {
      await myRecipes.setStatus(recipe.id, status);
      setRecipe({ ...recipe, status });
    } finally {
      setBusy(false);
    }
  };

  const status = recipe.status ?? "private";

  return (
    <RecipeView
      recipe={recipe}
      photoUrl={recipe.photoUrl ?? blobUrl}
      storageKey={`user-${recipe.id}`}
      badge={
        <p className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-leaf">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5" aria-hidden />
            {t("kitchen.myRecipe")}
          </span>
          <StatusBadge recipe={recipe} />
        </p>
      }
      actions={
        <>
          {link && <ShareButton title={recipe.name} text={t("share.dishText", { name: recipe.name, site: SITE.name })} label={t("kitchen.shareRecipe")} url={link} />}
          <MadeItButton dishName={recipe.name} recipeId={recipe.where === "account" ? recipe.id : undefined} dishSlug={recipe.dishSlug} />
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
              await myRecipes.remove(user?.id ?? null, recipe.id);
              router.push("/me?tab=recipes");
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            {t("kitchen.delete")}
          </button>
        </>
      }
      below={
        <div className="space-y-6">
          {/* Community review */}
          <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
            <Globe className="h-5 w-5 shrink-0 text-hibiscus" aria-hidden />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-semibold">{t("review.title")}</p>
              <p className="text-muted">
                {recipe.where === "device"
                  ? t("review.needAccount")
                  : status === "approved"
                    ? t("review.approvedText")
                    : status === "submitted"
                      ? t("review.submittedText")
                      : status === "rejected"
                        ? t("review.rejectedText")
                        : t("review.privateText")}
              </p>
              {status === "rejected" && recipe.reviewNote && <p className="mt-1 rounded-md bg-subtle px-2 py-1 text-ink">“{recipe.reviewNote}”</p>}
            </div>
            {recipe.where === "device" ? (
              <Link href="/account" className="btn-ghost shrink-0">
                {t("review.signIn")}
              </Link>
            ) : status === "submitted" || status === "approved" ? (
              <button type="button" disabled={busy} onClick={() => changeStatus("private")} className="btn-ghost shrink-0">
                <Undo2 className="h-4 w-4" aria-hidden />
                {status === "approved" ? t("review.unpublish") : t("review.withdraw")}
              </button>
            ) : (
              <button type="button" disabled={busy} onClick={() => changeStatus("submitted")} className="btn-primary shrink-0">
                <Send className="h-4 w-4" aria-hidden />
                {status === "rejected" ? t("review.resubmit") : t("review.submit")}
              </button>
            )}
          </div>
          <PhotoGrid recipeId={recipe.where === "account" ? recipe.id : undefined} dishSlug={recipe.where === "device" ? undefined : recipe.dishSlug} compact />
        </div>
      }
    />
  );
}

/** A recipe someone shared by link (/r#…). Can be saved to "My recipes". */
export function SharedRecipePage() {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useAuth();
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
    const id = await myRecipes.save(user?.id ?? null, { ...recipe, serving: [], dishSlug: undefined });
    router.push(`/me/recipe?id=${id}`);
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
