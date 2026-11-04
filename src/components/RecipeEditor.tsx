"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Camera, Film, Loader, Plus, Save, Trash2, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { SECTIONS } from "@/data/sections";
import { TAGS, type DishSummary, type RecipeLink, type SectionId, type Tag } from "@/data/types";
import { useBlobUrl } from "@/lib/idb";
import { compressImage } from "@/lib/image";
import { myRecipes, type MyRecipe } from "@/lib/user-content";
import { useAuth } from "./auth/AuthProvider";
import { SectionIcon, TagIcon } from "./icons";

const field = "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink";
const label = "mb-1.5 block text-sm font-medium";
const MAX_VIDEO = 50 * 1024 * 1024;

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.replace(/^\s*(?:[-*•·]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);

/** Create or edit a personal recipe. Saved to the account when signed in, otherwise on this device. */
export function RecipeEditor({ id, dishes }: { id?: string; dishes: DishSummary[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(!id);
  const [existing, setExisting] = useState<MyRecipe | null>(null);
  const [name, setName] = useState("");
  const [section, setSection] = useState<SectionId>("sunday");
  const [dishSlug, setDishSlug] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [prep, setPrep] = useState(10);
  const [cook, setCook] = useState(30);
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [serving, setServing] = useState("");
  const [video, setVideo] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [links, setLinks] = useState<RecipeLink[]>([]);
  /** A new photo (Blob), the current photo's address (string), or none. */
  const [photo, setPhoto] = useState<Blob | string | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blobUrl = useBlobUrl(photo instanceof Blob ? photo : undefined);
  const photoUrl = typeof photo === "string" ? photo : blobUrl;
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!id || authLoading) return;
    myRecipes
      .get(userId, id)
      .then((r) => {
        if (r) {
          setExisting(r);
          setName(r.name);
          setSection(r.section);
          setDishSlug(r.dishSlug ?? "");
          setTags(r.tags);
          setPrep(r.prepMinutes);
          setCook(r.cookMinutes);
          setServings(r.servings);
          setIngredients(r.ingredients.join("\n"));
          setSteps(r.steps.join("\n"));
          setServing(r.serving.join("\n"));
          setVideo(r.video ?? "");
          setLinks(r.links);
          setPhoto(r.photo ?? r.photoUrl);
        }
      })
      .finally(() => setLoaded(true));
  }, [id, userId, authLoading]);

  const sectionDishes = useMemo(() => dishes.filter((d) => d.section === section), [dishes, section]);
  const valid = name.trim() && lines(ingredients).length && lines(steps).length;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    setError(null);
    try {
      const savedId = await myRecipes.save(
        existing?.where === "device" ? null : userId,
        {
          id: existing?.id,
          name: name.trim(),
          section,
          dishSlug: dishSlug || undefined,
          tags,
          prepMinutes: Math.max(0, prep),
          cookMinutes: Math.max(0, cook),
          servings: Math.max(1, servings),
          ingredients: lines(ingredients),
          steps: lines(steps),
          serving: lines(serving),
          video: videoFile ? undefined : video.trim() || undefined,
          links: links.filter((l) => l.url.trim()).map((l) => ({ label: l.label.trim() || l.url.trim(), url: l.url.trim() })),
          lang: existing?.lang ?? locale,
        },
        photo,
        videoFile ?? undefined,
      );
      router.push(`/me/recipe?id=${savedId}`);
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  if (!loaded || authLoading) return <div className="card h-96 animate-pulse" />;

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-6">
      <p className="rounded-lg bg-subtle px-4 py-3 text-sm text-muted">
        {userId && existing?.where !== "device" ? (
          t("editor.accountNote")
        ) : (
          <>
            {t("editor.deviceNote")}{" "}
            <Link href="/account" className="font-medium text-ink underline">
              {t("editor.signIn")}
            </Link>
          </>
        )}
      </p>

      <div className="card space-y-5 p-6">
        <div>
          <label className={label} htmlFor="r-name">{t("editor.name")}</label>
          <input id="r-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder={t("editor.namePlaceholder")} />
        </div>

        <div>
          <span className={label}>{t("editor.section")}</span>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSection(s.id);
                  setDishSlug("");
                }}
                aria-pressed={section === s.id}
                className={`chip gap-1.5 ${section === s.id ? "chip-active" : "hover:border-ink"}`}
              >
                <SectionIcon id={s.id} className="h-3.5 w-3.5" />
                {t(`sections.${s.id}.name`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={label} htmlFor="r-dish">{t("editor.whichDish")}</label>
          <select id="r-dish" value={dishSlug} onChange={(e) => setDishSlug(e.target.value)} className={field}>
            <option value="">{t("editor.noDish")}</option>
            {sectionDishes.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">{t("editor.whichDishHint")}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "r-prep", text: t("editor.prep"), value: prep, set: setPrep },
            { id: "r-cook", text: t("editor.cook"), value: cook, set: setCook },
            { id: "r-serv", text: t("dish.servings"), value: servings, set: setServings },
          ].map((f) => (
            <div key={f.id}>
              <label className={label} htmlFor={f.id}>{f.text}</label>
              <input id={f.id} type="number" min={0} inputMode="numeric" value={f.value} onChange={(e) => f.set(Number(e.target.value))} className={field} />
            </div>
          ))}
        </div>

        <div>
          <span className={label}>{t("editor.tags")}</span>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const on = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTags((p) => (on ? p.filter((x) => x !== tag) : [...p, tag]))}
                  className={`chip gap-1.5 ${on ? "chip-active" : "hover:border-ink"}`}
                >
                  <TagIcon tag={tag} className="h-3.5 w-3.5" />
                  {t(`tags.${tag}`)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card space-y-5 p-6">
        <div>
          <label className={label} htmlFor="r-ing">{t("dish.whatToBuy")}</label>
          <p className="mb-2 text-xs text-muted">{t("editor.oneLine")}</p>
          <textarea id="r-ing" required rows={6} value={ingredients} onChange={(e) => setIngredients(e.target.value)} className={field} placeholder={t("editor.ingredientsPlaceholder")} />
        </div>
        <div>
          <label className={label} htmlFor="r-steps">{t("dish.howToCook")}</label>
          <p className="mb-2 text-xs text-muted">{t("editor.stepsHint")}</p>
          <textarea id="r-steps" required rows={8} value={steps} onChange={(e) => setSteps(e.target.value)} className={field} placeholder={t("editor.stepsPlaceholder")} />
        </div>
        <div>
          <label className={label} htmlFor="r-serve">{t("dish.howToServe")}</label>
          <p className="mb-2 text-xs text-muted">{t("editor.servingHint")}</p>
          <textarea id="r-serve" rows={3} value={serving} onChange={(e) => setServing(e.target.value)} className={field} placeholder={t("editor.servingPlaceholder")} />
        </div>
      </div>

      <div className="card space-y-5 p-6">
        <div>
          <span className={label}>{t("editor.photo")}</span>
          {photoUrl ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="" className="h-40 w-56 rounded-lg object-cover" />
              <button type="button" onClick={() => setPhoto(undefined)} aria-label={t("editor.removePhoto")} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-surface/90">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => photoInput.current?.click()} className="btn-ghost">
              <Camera className="h-4 w-4" aria-hidden />
              {t("editor.addPhoto")}
            </button>
          )}
          <input
            ref={photoInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) setPhoto(await compressImage(f));
            }}
          />
        </div>
        <div>
          <label className={label} htmlFor="r-video">{t("editor.video")}</label>
          {videoFile ? (
            <div className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 text-sm">
              <Film className="h-4 w-4 text-muted" aria-hidden />
              <span className="min-w-0 flex-1 truncate">{videoFile.name}</span>
              <button type="button" onClick={() => setVideoFile(null)} aria-label={t("editor.removeVideo")}>
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <input id="r-video" type="url" value={video} onChange={(e) => setVideo(e.target.value)} className={field} placeholder="YouTube, TikTok, Facebook, Instagram…" />
          )}
          {userId && existing?.where !== "device" && !videoFile && (
            <>
              <button type="button" onClick={() => videoInput.current?.click()} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
                <Film className="h-4 w-4" aria-hidden />
                {t("editor.uploadVideo")}
              </button>
              <input
                ref={videoInput}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) return;
                  if (f.size > MAX_VIDEO) setError(t("editor.videoTooBig"));
                  else setVideoFile(f);
                }}
              />
            </>
          )}
        </div>
        <div>
          <span className={label}>{t("media.links")}</span>
          <div className="space-y-2">
            {links.map((l, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={l.label}
                  onChange={(e) => setLinks((p) => p.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  className={`${field} w-2/5`}
                  placeholder={t("editor.linkLabel")}
                  aria-label={t("editor.linkLabel")}
                />
                <input
                  type="url"
                  value={l.url}
                  onChange={(e) => setLinks((p) => p.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                  className={field}
                  placeholder="https://…"
                  aria-label="URL"
                />
                <button type="button" onClick={() => setLinks((p) => p.filter((_, j) => j !== i))} aria-label={t("editor.removeLink")} className="grid w-11 shrink-0 place-items-center rounded-lg border border-line hover:text-ink">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setLinks((p) => [...p, { label: "", url: "" }])} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
              <Plus className="h-4 w-4" aria-hidden />
              {t("editor.addLink")}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="rounded-lg bg-tomato/10 px-4 py-3 text-sm text-tomato">{error}</p>}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          {t("editor.cancel")}
        </button>
        <button type="submit" className="btn-primary" disabled={!valid || saving}>
          {saving ? <Loader className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
          {t("editor.save")}
        </button>
      </div>
    </form>
  );
}
