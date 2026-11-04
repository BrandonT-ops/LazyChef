"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CircleCheck, ExternalLink, LogOut, PencilLine, Plus, Search, ShieldX } from "lucide-react";
import { GithubMark } from "./GithubMark";
import type { DishSummary } from "@/data/types";
import { searchKey } from "@/lib/text";
import { SectionIcon } from "../icons";
import { RecipeAdminForm } from "./RecipeAdminForm";

interface Me {
  configured: boolean;
  missing: string[];
  login: string | null;
}

export function AdminApp({ dishes, error }: { dishes: DishSummary[]; error?: string }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [me, setMe] = useState<Me | null>(null);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<{ slug: string; isNew: boolean } | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  /** Dishes created in this session (they appear on the site after the next publish). */
  const [added, setAdded] = useState<DishSummary[]>([]);
  const all = useMemo(() => [...added, ...dishes.filter((d) => !added.some((a) => a.slug === d.slug))], [added, dishes]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe({ configured: false, missing: [], login: null }));
  }, []);

  const results = useMemo(() => {
    const words = searchKey(q).split(" ").filter(Boolean);
    return all.filter((d) => words.every((w) => searchKey(d.name).includes(w)));
  }, [all, q]);

  const choose = useCallback(
    (next: { slug: string; isNew: boolean }) => {
      if (dirty && !confirm(t("unsavedConfirm"))) return;
      setDirty(false);
      setSelected(next);
    },
    [dirty, t],
  );

  if (!me) return <div className="card h-64 animate-pulse" />;

  if (!me.configured) {
    return (
      <div className="card mx-auto max-w-2xl p-8">
        <ShieldX className="h-8 w-8 text-mango" aria-hidden />
        <h2 className="heading mt-4 text-xl">{t("notConfigured")}</h2>
        <p className="mt-2 text-muted">{t("notConfiguredText")}</p>
        {me.missing.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {me.missing.map((m) => (
              <li key={m} className="rounded-md bg-subtle px-2 py-1 font-mono text-xs">
                {m}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm text-muted">{t("setupDoc")}</p>
      </div>
    );
  }

  if (!me.login) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-subtle">
          <GithubMark className="h-6 w-6" />
        </span>
        <h2 className="heading mt-4 text-xl">{t("signInTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("signInText")}</p>
        {error === "forbidden" && <p className="mt-4 rounded-lg bg-tomato/10 px-3 py-2 text-sm text-tomato">{t("forbidden")}</p>}
        {error === "signin" && <p className="mt-4 rounded-lg bg-tomato/10 px-3 py-2 text-sm text-tomato">{t("signinError")}</p>}
        <a href={`/api/admin/login?locale=${locale}`} className="btn-primary btn-lg mt-6 w-full">
          <GithubMark />
          {t("signIn")}
        </a>
      </div>
    );
  }

  const withRecipe = (d: DishSummary) => d.hasRecipe || saved.has(d.slug);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3 text-sm">
            <span className="truncate">
              {t("signedInAs")} <strong>@{me.login}</strong>
            </span>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                setMe({ ...me, login: null });
              }}
              className="inline-flex items-center gap-1 text-muted hover:text-ink"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              {t("signOut")}
            </button>
          </div>
          <div className="p-3">
            <button type="button" onClick={() => choose({ slug: "", isNew: true })} className="btn-primary w-full">
              <Plus className="h-4 w-4" aria-hidden />
              {t("newDish")}
            </button>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("searchDishes")}
                aria-label={t("searchDishes")}
                className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <p className="mt-3 px-1 text-xs text-muted">
              {t("progress", { done: all.filter(withRecipe).length, total: all.length })}
            </p>
          </div>
          <ul className="max-h-[60vh] overflow-auto border-t border-line">
            {results.map((d) => {
              const active = selected?.slug === d.slug;
              return (
                <li key={d.slug}>
                  <button
                    type="button"
                    onClick={() => choose({ slug: d.slug, isNew: false })}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      active ? "bg-subtle font-semibold" : "hover:bg-subtle"
                    }`}
                  >
                    <SectionIcon id={d.section} className="h-4 w-4 shrink-0 text-muted" />
                    <span className="min-w-0 flex-1 truncate">{d.name}</span>
                    {withRecipe(d) ? (
                      <CircleCheck className="h-4 w-4 shrink-0 text-leaf" aria-label={t("hasRecipe")} />
                    ) : (
                      <PencilLine className="h-4 w-4 shrink-0 text-muted/60" aria-label={t("noRecipe")} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <section className="min-w-0">
        {selected ? (
          <motion.div key={selected.slug || "new"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <RecipeAdminForm
              slug={selected.slug}
              isNew={selected.isNew}
              dish={all.find((d) => d.slug === selected.slug)}
              existingSlugs={all.map((d) => d.slug)}
              onDirty={setDirty}
              onSaved={(d) => {
                setDirty(false);
                setSaved((s) => new Set(s).add(d.slug));
                if (!dishes.some((x) => x.slug === d.slug)) setAdded((a) => [d, ...a.filter((x) => x.slug !== d.slug)]);
              }}
            />
          </motion.div>
        ) : (
          <div className="card grid min-h-[320px] place-items-center p-10 text-center text-muted">
            <div>
              <PencilLine className="mx-auto h-8 w-8" aria-hidden />
              <p className="mt-3">{t("pickDish")}</p>
              <a href={`/${locale}`} className="mt-4 inline-flex items-center gap-1 text-sm text-ink hover:underline">
                {t("viewSite")}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
