"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Camera, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { SECTIONS } from "@/data/sections";
import { TAGS, type RecipeLink, type SectionId, type Tag } from "@/data/types";
import { idb, useBlobUrl, type UserRecipe } from "@/lib/idb";
import { compressImage } from "@/lib/image";
import { newId } from "@/lib/local";
import { SectionIcon, TagIcon } from "./icons";

const field = "w-full rounded-xl border border-line bg-surface px-4 py-2.5 outline-none transition-colors focus:border-tomato";
const label = "mb-1.5 block text-sm font-semibold";

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Create or edit a personal recipe. Saved on this device only. */
export function RecipeEditor({ id }: { id?: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(!id);
  const [existing, setExisting] = useState<UserRecipe | null>(null);
  const [name, setName] = useState("");
  const [section, setSection] = useState<SectionId>("sunday");
  const [tags, setTags] = useState<Tag[]>([]);
  const [prep, setPrep] = useState(10);
  const [cook, setCook] = useState(30);
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [video, setVideo] = useState("");
  const [links, setLinks] = useState<RecipeLink[]>([]);
  const [photo, setPhoto] = useState<Blob | undefined>();
  const [saving, setSaving] = useState(false);
  const photoUrl = useBlobUrl(photo);

  useEffect(() => {
    if (!id) return;
    idb.get("recipes", id).then((r) => {
      if (r) {
        setExisting(r);
        setName(r.name);
        setSection(r.section);
        setTags(r.tags);
        setPrep(r.prepMinutes);
        setCook(r.cookMinutes);
        setServings(r.servings);
        setIngredients(r.ingredients.join("\n"));
        setSteps(r.steps.join("\n"));
        setVideo(r.video ?? "");
        setLinks(r.links);
        setPhoto(r.photo);
      }
      setLoaded(true);
    });
  }, [id]);

  const valid = name.trim() && lines(ingredients).length && lines(steps).length;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    const now = Date.now();
    const recipe: UserRecipe = {
      id: existing?.id ?? newId(),
      name: name.trim(),
      section,
      tags,
      prepMinutes: Math.max(0, prep),
      cookMinutes: Math.max(0, cook),
      servings: Math.max(1, servings),
      ingredients: lines(ingredients),
      steps: lines(steps),
      video: video.trim() || undefined,
      links: links.filter((l) => l.url.trim()).map((l) => ({ label: l.label.trim() || l.url.trim(), url: l.url.trim() })),
      photo,
      lang: existing?.lang ?? locale,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await idb.put("recipes", recipe);
    router.push(`/me/recipe?id=${recipe.id}`);
  };

  if (!loaded) return <div className="card h-96 animate-pulse" />;

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-6">
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
                onClick={() => setSection(s.id)}
                aria-pressed={section === s.id}
                className={`chip gap-1.5 ${section === s.id ? "chip-active" : "hover:border-tomato"}`}
              >
                <SectionIcon id={s.id} className="h-3.5 w-3.5" />
                {t(`sections.${s.id}.name`)}
              </button>
            ))}
          </div>
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
                  className={`chip gap-1.5 ${on ? "border-mango bg-mango text-ink" : "hover:border-mango"}`}
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
          <label className={label} htmlFor="r-ing">{t("dish.ingredients")}</label>
          <p className="mb-2 text-xs text-muted">{t("editor.oneLine")}</p>
          <textarea id="r-ing" required rows={6} value={ingredients} onChange={(e) => setIngredients(e.target.value)} className={field} placeholder={t("editor.ingredientsPlaceholder")} />
        </div>
        <div>
          <label className={label} htmlFor="r-steps">{t("editor.steps")}</label>
          <p className="mb-2 text-xs text-muted">{t("editor.stepsHint")}</p>
          <textarea id="r-steps" required rows={8} value={steps} onChange={(e) => setSteps(e.target.value)} className={field} placeholder={t("editor.stepsPlaceholder")} />
        </div>
      </div>

      <div className="card space-y-5 p-6">
        <div>
          <span className={label}>{t("editor.photo")}</span>
          {photoUrl ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="" className="h-40 w-56 rounded-xl object-cover" />
              <button type="button" onClick={() => setPhoto(undefined)} aria-label={t("editor.removePhoto")} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-surface/90">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileInput.current?.click()} className="btn-ghost">
              <Camera className="h-4 w-4" aria-hidden />
              {t("editor.addPhoto")}
            </button>
          )}
          <input
            ref={fileInput}
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
          <input id="r-video" type="url" value={video} onChange={(e) => setVideo(e.target.value)} className={field} placeholder="https://youtu.be/…" />
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
                <button type="button" onClick={() => setLinks((p) => p.filter((_, j) => j !== i))} aria-label={t("editor.removeLink")} className="grid w-11 shrink-0 place-items-center rounded-xl border border-line hover:text-tomato">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setLinks((p) => [...p, { label: "", url: "" }])} className="btn-ghost text-sm">
              <Plus className="h-4 w-4" aria-hidden />
              {t("editor.addLink")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <p className="mr-auto text-xs text-muted">{t("editor.deviceNote")}</p>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          {t("editor.cancel")}
        </button>
        <button type="submit" className="btn-primary" disabled={!valid || saving}>
          <Save className="h-4 w-4" aria-hidden />
          {t("editor.save")}
        </button>
      </div>
    </form>
  );
}
