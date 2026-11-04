"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CircleCheck, ExternalLink, LogOut, PencilLine, Plus, Search, ShieldCheck, ShieldX } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "../auth/AuthProvider";
import { ReviewQueue } from "./ReviewQueue";
import { AdminsPanel } from "./AdminsPanel";
import type { DishSummary } from "@/data/types";
import { searchKey } from "@/lib/text";
import { SectionIcon } from "../icons";
import { RecipeAdminForm } from "./RecipeAdminForm";

type Tab = "recipes" | "review" | "admins";

export function AdminApp({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { configured, loading, user, profile, isAdmin, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("recipes");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<{ slug: string; isNew: boolean } | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  /** Dishes created in this session (they appear in the list right away). */
  const [added, setAdded] = useState<DishSummary[]>([]);
  const all = useMemo(() => [...added, ...dishes.filter((d) => !added.some((a) => a.slug === d.slug))], [added, dishes]);
  const [dirty, setDirty] = useState(false);

  const results = useMemo(() => {
    const words = searchKey(q).split(" ").filter(Boolean);
    return all.filter((d) => words.every((w) => searchKey(`${d.name} ${d.original ?? ""}`).includes(w)));
  }, [all, q]);

  const choose = useCallback(
    (next: { slug: string; isNew: boolean }) => {
      if (dirty && !confirm(t("unsavedConfirm"))) return;
      setDirty(false);
      setSelected(next);
    },
    [dirty, t],
  );

  if (!configured) {
    return (
      <div className="card mx-auto max-w-2xl p-8">
        <ShieldX className="h-8 w-8 text-mango" aria-hidden />
        <h2 className="heading mt-4 text-xl">{t("notConfigured")}</h2>
        <p className="mt-2 text-muted">{t("notConfiguredText")}</p>
        <p className="mt-4 text-sm text-muted">{t("setupDoc")}</p>
      </div>
    );
  }

  if (loading || (user && !profile)) return <div className="card h-64 animate-pulse" />;

  if (!user) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-subtle">
          <ShieldCheck className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="heading mt-4 text-xl">{t("signInTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("signInText")}</p>
        <Link href="/account" className="btn-primary btn-lg mt-6 w-full">
          {t("signIn")}
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <ShieldX className="mx-auto h-8 w-8 text-tomato" aria-hidden />
        <h2 className="heading mt-4 text-xl">{t("notAdmin")}</h2>
        <p className="mt-2 text-sm text-muted">{t("notAdminText", { email: user.email ?? "" })}</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "recipes", label: t("tabs.recipes") },
    { id: "review", label: t("tabs.review") },
    { id: "admins", label: t("tabs.admins") },
  ];

  const header = (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex rounded-lg border border-line p-1" role="tablist">
        {tabs.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={tab === x.id}
            onClick={() => (dirty && tab === "recipes" && x.id !== "recipes" && !confirm(t("unsavedConfirm")) ? null : setTab(x.id))}
            className={`rounded-md px-4 py-1.5 text-sm font-medium ${tab === x.id ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted">
          {t("signedInAs")} <strong className="text-ink">{profile?.display_name || user.email}</strong>
        </span>
        <button type="button" onClick={signOut} className="inline-flex items-center gap-1 text-muted hover:text-ink">
          <LogOut className="h-4 w-4" aria-hidden />
          {t("signOut")}
        </button>
      </div>
    </div>
  );

  if (tab === "review") return <>{header}<ReviewQueue /></>;
  if (tab === "admins") return <>{header}<AdminsPanel /></>;

  const withRecipe = (d: DishSummary) => d.hasRecipe || saved.has(d.slug);

  return (
    <>
    {header}
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card overflow-hidden">
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
    </>
  );
}
