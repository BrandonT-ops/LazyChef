"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getSection } from "@/data/sections";
import type { DishSummary } from "@/data/types";
import {
  PANTRY,
  PANTRY_BY_ID,
  PANTRY_GROUPS,
  STAPLE_IDS,
  findItems,
  matchPantry,
  normalize,
  type DishNeeds,
  type PantryMatch,
} from "@/data/pantry";
import { usePantry, useShopping } from "@/lib/local";
import { ACCENT_BG } from "@/lib/ui";
import { ArrowRight, Check, Clock, Dices, Plus, ShoppingBasket, X } from "lucide-react";
import { SectionIcon } from "./icons";

export function PantryCook({ dishes, index }: { dishes: DishSummary[]; index: Record<string, DishNeeds> }) {
  const t = useTranslations("pantry");
  const tr = useTranslations();
  const locale = useLocale();
  const { pantry, toggle, add, setBasics, clear } = usePantry();
  const shopping = useShopping();
  const [text, setText] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const label = (id: string) => {
    const p = PANTRY_BY_ID.get(id);
    return p ? (locale === "fr" ? p.fr : p.en) : id;
  };
  const bySlug = useMemo(() => new Map(dishes.map((d) => [d.slug, d])), [dishes]);
  const matches = useMemo(
    () => (pantry.items.length ? matchPantry(index, pantry.items, pantry.basics).filter((m) => bySlug.has(m.slug)) : []),
    [index, pantry, bySlug],
  );
  const ready = matches.filter((m) => m.missing.length === 0);
  const almost = matches.filter((m) => m.missing.length > 0 && m.missing.length <= 2);
  const more = matches.filter((m) => m.missing.length > 2).slice(0, 12);

  // Suggestions while typing: labels and search words in both languages.
  const query = normalize(text.split(",").pop()?.trim() ?? "");
  const suggestions = query.length >= 2
    ? PANTRY.filter(
        (p) =>
          !p.staple &&
          !pantry.items.includes(p.id) &&
          [p.en, p.fr, ...p.terms].some((w) => normalize(w).includes(query)),
      ).slice(0, 6)
    : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const found = findItems(text).filter((id) => !STAPLE_IDS.includes(id));
    const ids = found.length ? found : suggestions.slice(0, 1).map((s) => s.id);
    if (ids.length) {
      add(ids);
      setText("");
      setNote(null);
    } else setNote(t("notFound"));
  };

  const addMissing = (m: PantryMatch, dish: DishSummary) => {
    shopping.replaceSource(`pantry:${m.slug}`, m.missing.map((id) => ({ text: label(id), group: dish.name })));
    setAdded((s) => new Set(s).add(m.slug));
  };

  const card = (m: PantryMatch) => {
    const d = bySlug.get(m.slug)!;
    const section = getSection(d.section)!;
    const mine = m.have.filter((id) => !STAPLE_IDS.includes(id));
    return (
      <li key={m.slug} className="card flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${ACCENT_BG[section.accent]}`} aria-hidden>
            <SectionIcon id={section.id} className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <Link href={`/dishes/${d.slug}`} className="heading block text-lg leading-tight hover:text-tomato">
              {d.name}
            </Link>
            <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
              {tr(`sections.${section.id}.name`)}
              {d.minutes != null && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden />
                  {t("minutes", { n: d.minutes })}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {mine.map((id) => (
            <span key={id} className="inline-flex items-center gap-1 rounded-full bg-leaf/10 px-2 py-0.5 text-xs font-medium text-leaf">
              <Check className="h-3 w-3" aria-hidden />
              {label(id)}
            </span>
          ))}
          {m.missing.map((id) => (
            <span key={id} className="inline-flex items-center gap-1 rounded-full border border-dashed border-line px-2 py-0.5 text-xs text-muted">
              <Plus className="h-3 w-3" aria-hidden />
              {label(id)}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <Link href={`/dishes/${d.slug}`} className="btn-primary btn-sm">
            {t("open")}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          {m.missing.length > 0 && (
            <button type="button" onClick={() => addMissing(m, d)} className="btn-ghost btn-sm max-w-full" disabled={added.has(m.slug)}>
              {added.has(m.slug) ? <Check className="h-3.5 w-3.5" aria-hidden /> : <ShoppingBasket className="h-3.5 w-3.5" aria-hidden />}
              {added.has(m.slug) ? t("added") : t("addMissing")}
            </button>
          )}
        </div>
      </li>
    );
  };

  const block = (title: string, sub: string, list: PantryMatch[]) =>
    list.length > 0 && (
      <section className="mt-8">
        <h2 className="heading text-2xl">
          {title} <span className="text-base font-medium text-muted">· {t("count", { count: list.length })}</span>
        </h2>
        <p className="mt-1 text-sm text-muted">{sub}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map(card)}</ul>
      </section>
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <aside className="card h-fit space-y-5 p-5 lg:sticky lg:top-24">
        <form onSubmit={submit}>
          <label htmlFor="pantry-input" className="text-sm font-semibold">
            {t("inputLabel")}
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="pantry-input"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setNote(null);
              }}
              placeholder={t("placeholder")}
              autoComplete="off"
              className="input min-w-0 flex-1"
            />
            <button type="submit" className="btn-primary px-3" aria-label={t("add")}>
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    add([s.id]);
                    setText("");
                  }}
                  className="chip text-xs hover:border-tomato"
                >
                  <Plus className="mr-1 h-3 w-3" aria-hidden />
                  {label(s.id)}
                </button>
              ))}
            </div>
          )}
          {note && <p className="mt-2 text-xs text-tomato">{note}</p>}
        </form>

        {pantry.items.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{t("mine")}</p>
              <button type="button" onClick={clear} className="text-xs font-semibold text-muted hover:text-tomato">
                {t("clear")}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pantry.items.map((id) => (
                <button key={id} type="button" onClick={() => toggle(id)} className="chip chip-active gap-1 text-xs">
                  {label(id)}
                  <X className="h-3 w-3" aria-label={t("remove")} />
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={pantry.basics}
            onChange={(e) => setBasics(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[rgb(var(--tomato))]"
          />
          {t("basics")}
        </label>

        <details className="group" open={pantry.items.length === 0}>
          <summary className="cursor-pointer text-sm font-semibold text-muted hover:text-ink">{t("browse")}</summary>
          <div className="mt-3 space-y-4">
            {PANTRY_GROUPS.map((g) => {
              const items = PANTRY.filter((p) => p.group === g && !p.staple);
              if (!items.length) return null;
              return (
                <div key={g}>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted">{t(`groups.${g}`)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((p) => {
                      const on = pantry.items.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggle(p.id)}
                          aria-pressed={on}
                          className={`chip text-xs ${on ? "chip-active" : "hover:border-tomato"}`}
                        >
                          {locale === "fr" ? p.fr : p.en}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      </aside>

      <div>
        {!pantry.items.length ? (
          <div className="card grid place-items-center p-10 text-center text-muted">{t("empty")}</div>
        ) : !matches.length ? (
          <div className="card grid place-items-center p-10 text-center text-muted">{t("noMatch")}</div>
        ) : (
          <>
            <div className="card flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
              <p className="text-sm">
                {t("summary", { ready: ready.length, almost: almost.length })}
              </p>
              <Link href="/random?pantry=1" className="btn-ghost btn-sm">
                <Dices className="h-4 w-4" aria-hidden />
                {t("roll")}
              </Link>
            </div>
            {block(t("ready"), t("readyText"), ready)}
            {block(t("almost"), t("almostText"), almost)}
            {block(t("more"), t("moreText"), more)}
          </>
        )}
      </div>
    </div>
  );
}
