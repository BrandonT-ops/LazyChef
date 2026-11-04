"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Camera, CircleCheck, ExternalLink, Loader, Plus, Trash2, CloudUpload, X } from "lucide-react";
import { SECTIONS } from "@/data/sections";
import { TAGS, type DishSummary, type RecipeFile, type RecipeLink, type SectionId, type Tag } from "@/data/types";
import { compressImage } from "@/lib/image";
import { slugify } from "@/lib/text";
import { videoEmbed } from "@/lib/media";
import { TagIcon } from "../icons";
import { VideoPlayer } from "../RecipeMedia";
import { BulletList } from "./BulletList";

type Lang = "en" | "fr";
type Lists = { en: string[]; fr: string[] };
const EMPTY: Lists = { en: [], fr: [] };

interface Upload {
  name: string;
  blob: Blob;
  url: string;
}

const field = "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-ink";
const label = "mb-1.5 block text-sm font-medium";

async function toBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

export function RecipeAdminForm({
  slug: initialSlug,
  isNew,
  dish,
  existingSlugs,
  onDirty,
  onSaved,
}: {
  slug: string;
  isNew: boolean;
  dish?: DishSummary;
  existingSlugs: string[];
  onDirty: (dirty: boolean) => void;
  onSaved: (dish: DishSummary) => void;
}) {
  const t = useTranslations("admin");
  const tAll = useTranslations();
  const locale = useLocale();
  const fileInput = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(!isNew);
  const [name, setName] = useState("");
  const [section, setSection] = useState<SectionId>(dish?.section ?? "sunday");
  const [tags, setTags] = useState<Tag[]>([]);
  const [prep, setPrep] = useState(15);
  const [cook, setCook] = useState(30);
  const [servings, setServings] = useState(4);
  const [lang, setLang] = useState<Lang>(locale === "fr" ? "fr" : "en");
  const [ingredients, setIngredients] = useState<Lists>(EMPTY);
  const [steps, setSteps] = useState<Lists>(EMPTY);
  const [serving, setServing] = useState<Lists>(EMPTY);
  const [images, setImages] = useState<string[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [video, setVideo] = useState("");
  const [sources, setSources] = useState<RecipeLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string; commitUrl?: string } | null>(null);
  const [touched, setTouched] = useState(false);
  /** Dishes created in the admin keep their own name and section in the file. */
  const [ownName, setOwnName] = useState(isNew);
  /** Once a new dish is saved, its address (slug) no longer follows the name. */
  const [lockedSlug, setLockedSlug] = useState<string | null>(null);

  const slug = lockedSlug ?? (isNew ? slugify(name) : initialSlug);
  const slugTaken = isNew && !lockedSlug && !!slug && existingSlugs.includes(slug);

  // Load the latest saved version from GitHub.
  useEffect(() => {
    if (isNew) return;
    let alive = true;
    setLoading(true);
    fetch(`/api/admin/recipe?slug=${initialSlug}`)
      .then((r) => r.json())
      .then(({ recipe }: { recipe: RecipeFile | null }) => {
        if (!alive) return;
        if (recipe) {
          if (recipe.name) {
            setName(recipe.name);
            setOwnName(true);
          }
          if (recipe.section) setSection(recipe.section);
          setTags(recipe.tags ?? []);
          setPrep(recipe.prepMinutes);
          setCook(recipe.cookMinutes);
          setServings(recipe.servings);
          setIngredients({ ...EMPTY, ...recipe.ingredients });
          setSteps({ ...EMPTY, ...recipe.steps });
          setServing({ ...EMPTY, ...(recipe.serving ?? {}) });
          setImages(recipe.images ?? []);
          setVideo(recipe.video ?? "");
          setSources(recipe.sources ?? []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, [initialSlug, isNew]);

  useEffect(() => () => uploads.forEach((u) => URL.revokeObjectURL(u.url)), [uploads]);

  const change =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      setter(v);
      setTouched(true);
      onDirty(true);
      setResult(null);
    };

  const filled = (l: Lists) => l.en.filter(Boolean).length + l.fr.filter(Boolean).length > 0;
  const canSave = !saving && (!ownName || (name.trim() && slug && !slugTaken)) && filled(ingredients) && filled(steps);
  const missingLang = useMemo(
    () => (["en", "fr"] as const).filter((l) => !ingredients[l].some(Boolean) || !steps[l].some(Boolean)),
    [ingredients, steps],
  );

  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const room = 6 - uploads.length;
    const picked = Array.from(files).slice(0, room);
    const next: Upload[] = [];
    for (const [i, f] of picked.entries()) {
      const blob = await compressImage(f, 1600, 0.82);
      next.push({ name: `${Date.now().toString(36)}-${i}.jpg`, blob, url: URL.createObjectURL(blob) });
    }
    change(setUploads)([...uploads, ...next]);
  };

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setResult(null);
    try {
      const recipe: RecipeFile = {
        ...(ownName ? { name: name.trim(), section } : {}),
        tags,
        prepMinutes: prep,
        cookMinutes: cook,
        servings,
        ingredients,
        steps,
        serving,
        images: [...images, ...uploads.map((u) => `/recipes/${slug}/${u.name}`)],
        video: video.trim(),
        sources: sources.filter((s) => s.url.trim()),
      };
      const body = {
        slug,
        recipe,
        uploads: await Promise.all(uploads.map(async (u) => ({ name: u.name, base64: await toBase64(u.blob) }))),
      };
      const res = await fetch("/api/admin/recipe", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; commitUrl?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? res.statusText);
      setImages(recipe.images ?? []);
      setUploads([]);
      setTouched(false);
      if (isNew) setLockedSlug(slug);
      onSaved({
        slug,
        name: ownName ? name.trim() : (dish?.name ?? slug),
        section: ownName ? section : (dish?.section ?? section),
        tags,
        hasRecipe: true,
      });
      setResult({ ok: true, text: t("saved"), commitUrl: data.commitUrl });
    } catch (e) {
      setResult({ ok: false, text: `${t("saveFailed")} ${(e as Error).message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card h-96 animate-pulse" />;

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{isNew ? t("newDish") : t("editing")}</p>
          <h2 className="heading text-2xl">{ownName ? name || t("untitled") : dish?.name}</h2>
          {(!isNew || lockedSlug) && (
            <a href={`/${locale}/dishes/${slug}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
              {t("viewPage")}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          )}
        </div>
        <SaveButton saving={saving} disabled={!canSave} onClick={save} label={t("publish")} savingLabel={t("publishing")} />
      </div>

      {/* Basics */}
      <Card title={t("basics")}>
        {ownName && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="a-name">{t("dishName")}</label>
              <input id="a-name" value={name} onChange={(e) => change(setName)(e.target.value)} className={field} placeholder="Ndolé, Eru, Koki…" />
              {slug && (
                <p className={`mt-1 text-xs ${slugTaken ? "text-tomato" : "text-muted"}`} aria-live="polite">
                  {slugTaken ? t("slugTaken") : `/dishes/${slug}`}
                </p>
              )}
            </div>
            <div>
              <span className={label}>{t("section")}</span>
              <select value={section} onChange={(e) => change(setSection)(e.target.value as SectionId)} className={field}>
                {SECTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {tAll(`sections.${s.id}.name`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "a-prep", text: t("prep"), value: prep, set: setPrep },
            { id: "a-cook", text: t("cook"), value: cook, set: setCook },
            { id: "a-serv", text: t("servings"), value: servings, set: setServings },
          ].map((f) => (
            <div key={f.id}>
              <label className={label} htmlFor={f.id}>{f.text}</label>
              <input id={f.id} type="number" min={0} inputMode="numeric" value={f.value} onChange={(e) => change(f.set)(Number(e.target.value))} className={field} />
            </div>
          ))}
        </div>
        <div>
          <span className={label}>{t("tags")}</span>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const on = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={on}
                  onClick={() => change(setTags)(on ? tags.filter((x) => x !== tag) : [...tags, tag])}
                  className={`chip gap-1.5 ${on ? "chip-active" : "hover:border-ink"}`}
                >
                  <TagIcon tag={tag} className="h-3.5 w-3.5" />
                  {tAll(`tags.${tag}`)}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Lists, per language */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <p className="text-sm font-medium">{t("recipeText")}</p>
          <div className="flex rounded-lg border border-line p-0.5" role="tablist">
            {(["en", "fr"] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={lang === l}
                onClick={() => setLang(l)}
                className={`rounded-md px-3 py-1 text-sm font-medium ${lang === l ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
              >
                {l === "en" ? "English" : "Français"}
                {missingLang.includes(l) && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-mango align-middle" />}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-8 p-5">
          <ListSection title={t("whatToBuy")} hint={t("whatToBuyHint")}>
            <BulletList
              value={ingredients[lang]}
              onChange={(v) => change(setIngredients)({ ...ingredients, [lang]: v })}
              placeholder={lang === "fr" ? "500 g de feuilles de ndolé" : "500 g bitter leaves"}
              addLabel={t("addItem")}
            />
          </ListSection>
          <ListSection title={t("howToCook")} hint={t("howToCookHint")}>
            <BulletList
              numbered
              value={steps[lang]}
              onChange={(v) => change(setSteps)({ ...steps, [lang]: v })}
              placeholder={lang === "fr" ? "Lavez les feuilles…" : "Wash the leaves…"}
              addLabel={t("addStep")}
            />
          </ListSection>
          <ListSection title={t("howToServe")} hint={t("howToServeHint")}>
            <BulletList
              value={serving[lang]}
              onChange={(v) => change(setServing)({ ...serving, [lang]: v })}
              placeholder={lang === "fr" ? "Servez avec du miondo…" : "Serve with miondo…"}
              addLabel={t("addTip")}
            />
          </ListSection>
          {missingLang.length > 0 && <p className="text-xs text-muted">{t("bothLanguages")}</p>}
        </div>
      </div>

      {/* Photos */}
      <Card title={t("photos")} hint={t("photosHint")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((src) => (
            <Thumb key={src} src={src} onRemove={() => change(setImages)(images.filter((x) => x !== src))} label={t("remove")} />
          ))}
          {uploads.map((u) => (
            <Thumb key={u.name} src={u.url} pending onRemove={() => change(setUploads)(uploads.filter((x) => x !== u))} label={t("remove")} />
          ))}
          {uploads.length < 6 && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="grid aspect-[4/3] place-items-center rounded-lg border-2 border-dashed border-line text-sm text-muted hover:border-ink hover:text-ink"
            >
              <span className="flex flex-col items-center gap-1">
                <Camera className="h-5 w-5" aria-hidden />
                {t("addPhotos")}
              </span>
            </button>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addPhotos(e.target.files);
            e.target.value = "";
          }}
        />
      </Card>

      {/* Video */}
      <Card title={t("video")} hint={t("videoHint")}>
        <input value={video} onChange={(e) => change(setVideo)(e.target.value)} className={field} placeholder="https://www.youtube.com/watch?v=… · https://www.tiktok.com/@…/video/… · https://www.facebook.com/…" />
        {video.trim() && (
          <div className="mt-4">
            {videoEmbed(video) ? <VideoPlayer url={video} title={dish?.name ?? name} /> : <p className="text-sm text-tomato">{t("videoUnknown")}</p>}
          </div>
        )}
        <p className="mt-3 text-xs text-muted">{t("videoUploadNote")}</p>
      </Card>

      {/* Sources */}
      <Card title={t("sources")} hint={t("sourcesHint")}>
        <div className="space-y-2">
          {sources.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={s.label}
                onChange={(e) => change(setSources)(sources.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                className={`${field} w-2/5`}
                placeholder={t("sourceLabel")}
                aria-label={t("sourceLabel")}
              />
              <input
                type="url"
                value={s.url}
                onChange={(e) => change(setSources)(sources.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                className={field}
                placeholder="https://…"
                aria-label="URL"
              />
              <button
                type="button"
                onClick={() => change(setSources)(sources.filter((_, j) => j !== i))}
                aria-label={t("remove")}
                className="grid w-10 shrink-0 place-items-center rounded-lg border border-line text-muted hover:text-ink"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => change(setSources)([...sources, { label: "", url: "" }])} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
            <Plus className="h-4 w-4" aria-hidden />
            {t("addSource")}
          </button>
        </div>
      </Card>

      {/* Save bar */}
      <div className="sticky bottom-4 z-10">
        <div className="card flex flex-wrap items-center gap-3 p-3 shadow-lift">
          <AnimatePresence mode="wait">
            <motion.p
              key={result?.text ?? (touched ? "dirty" : "clean")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`min-w-0 flex-1 text-sm ${result ? (result.ok ? "text-leaf" : "text-tomato") : "text-muted"}`}
            >
              {result ? (
                <span className="inline-flex flex-wrap items-center gap-2">
                  {result.ok && <CircleCheck className="h-4 w-4" aria-hidden />}
                  {result.text}
                  {result.commitUrl && (
                    <a href={result.commitUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink underline">
                      {t("viewCommit")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  )}
                </span>
              ) : touched ? (
                t("unsaved")
              ) : (
                t("upToDate")
              )}
            </motion.p>
          </AnimatePresence>
          <SaveButton saving={saving} disabled={!canSave} onClick={save} label={t("publish")} savingLabel={t("publishing")} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="card space-y-4 p-5">
      <div>
        <h3 className="font-semibold">{title}</h3>
        {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function ListSection({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-semibold">{title}</h3>
      <p className="mb-3 mt-0.5 text-sm text-muted">{hint}</p>
      {children}
    </section>
  );
}

function Thumb({ src, onRemove, pending = false, label }: { src: string; onRemove: () => void; pending?: boolean; label: string }) {
  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
      {pending && (
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-ink/80 px-1.5 py-0.5 text-[11px] font-medium text-bg">
          <CloudUpload className="h-3 w-3" aria-hidden />
          new
        </span>
      )}
      <button type="button" onClick={onRemove} aria-label={label} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-surface/90 shadow">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function SaveButton({ saving, disabled, onClick, label, savingLabel }: { saving: boolean; disabled: boolean; onClick: () => void; label: string; savingLabel: string }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="btn-primary">
      {saving ? <Loader className="h-4 w-4 animate-spin" aria-hidden /> : <CloudUpload className="h-4 w-4" aria-hidden />}
      {saving ? savingLabel : label}
    </button>
  );
}

