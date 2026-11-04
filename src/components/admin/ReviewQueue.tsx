"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown, Inbox, Loader, Undo2, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { ReviewStatus, UserRecipeRow } from "@/lib/supabase/rows";
import { RecipeView } from "../RecipeView";

type Filter = "submitted" | "approved" | "rejected";

/** Recipes people submitted: preview, then approve (public) or reject (with a note). */
export function ReviewQueue() {
  const t = useTranslations("admin.review");
  const locale = useLocale();
  const [filter, setFilter] = useState<Filter>("submitted");
  const [rows, setRows] = useState<UserRecipeRow[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setRows(null);
    const { data, error } = await supabaseBrowser()!
      .from("user_recipes")
      .select("*")
      .eq("status", filter)
      .order("updated_at", { ascending: filter === "submitted" });
    if (error) setError(error.message);
    setRows((data as UserRecipeRow[]) ?? []);
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const decide = async (r: UserRecipeRow, status: ReviewStatus) => {
    setBusy(r.id);
    setError(null);
    const { error } = await supabaseBrowser()!
      .from("user_recipes")
      .update({ status, review_note: status === "rejected" ? notes[r.id]?.trim() || null : null })
      .eq("id", r.id);
    if (error) setError(error.message);
    else {
      await fetch("/api/revalidate", { method: "POST" }).catch(() => undefined);
      setRows((prev) => prev?.filter((x) => x.id !== r.id) ?? null);
    }
    setBusy(null);
  };

  const date = (s: string) => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(s));

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["submitted", "approved", "rejected"] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={`chip ${filter === f ? "chip-active" : "hover:border-ink"}`}>
            {t(`filters.${f}`)}
          </button>
        ))}
      </div>
      {error && <p className="mb-4 rounded-lg bg-tomato/10 px-3 py-2 text-sm text-tomato">{error}</p>}
      {rows === null ? (
        <div className="card h-40 animate-pulse" />
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          <Inbox className="mx-auto mb-3 h-8 w-8" aria-hidden />
          {t(`empty.${filter}`)}
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="card overflow-hidden">
              <button type="button" onClick={() => setOpen(open === r.id ? null : r.id)} className="flex w-full items-center gap-4 p-4 text-left hover:bg-subtle" aria-expanded={open === r.id}>
                {r.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.images[0]} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="h-12 w-12 shrink-0 rounded-lg bg-subtle" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{r.name}</span>
                  <span className="block truncate text-xs text-muted">
                    {r.author_name ?? t("anonymous")} · {r.lang.toUpperCase()} · {date(r.updated_at)}
                  </span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${open === r.id ? "rotate-180" : ""}`} aria-hidden />
              </button>
              <AnimatePresence initial={false}>
                {open === r.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-line">
                    <div className="p-5">
                      <RecipeView
                        recipe={{
                          name: r.name,
                          section: r.section,
                          tags: r.tags,
                          prepMinutes: r.prep_minutes,
                          cookMinutes: r.cook_minutes,
                          servings: r.servings,
                          ingredients: r.ingredients,
                          steps: r.steps,
                          serving: r.serving,
                          video: r.video ?? undefined,
                          links: r.links ?? [],
                        }}
                        photoUrl={r.images?.[0]}
                        storageKey={`review-${r.id}`}
                      />
                    </div>
                    <div className="flex flex-col gap-3 border-t border-line bg-subtle p-4 sm:flex-row sm:items-center">
                      {filter === "submitted" ? (
                        <>
                          <input
                            value={notes[r.id] ?? ""}
                            onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                            placeholder={t("notePlaceholder")}
                            aria-label={t("notePlaceholder")}
                            className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-ink"
                          />
                          <button type="button" disabled={busy === r.id} onClick={() => decide(r, "rejected")} className="btn-ghost">
                            <X className="h-4 w-4" aria-hidden />
                            {t("reject")}
                          </button>
                          <button type="button" disabled={busy === r.id} onClick={() => decide(r, "approved")} className="btn-primary">
                            {busy === r.id ? <Loader className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
                            {t("approve")}
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="flex-1 text-sm text-muted">{r.review_note ? `“${r.review_note}”` : t(`decided.${filter}`)}</p>
                          <button type="button" disabled={busy === r.id} onClick={() => decide(r, filter === "approved" ? "rejected" : "approved")} className="btn-ghost">
                            <Undo2 className="h-4 w-4" aria-hidden />
                            {filter === "approved" ? t("takeDown") : t("approveAnyway")}
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
