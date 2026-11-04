"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SECTIONS } from "@/data/sections";
import { TAGS, type DishSummary, type SectionId, type Tag } from "@/data/types";
import { searchKey } from "@/lib/text";
import { DishCard } from "./DishCard";
import { Search } from "lucide-react";
import { SectionIcon, TagIcon } from "./icons";

const PAGE = 48;

export function SearchView({
  dishes,
  initial,
}: {
  dishes: DishSummary[];
  initial: { q?: string; section?: SectionId; tag?: Tag };
}) {
  const t = useTranslations();
  const [q, setQ] = useState(initial.q ?? "");
  const [section, setSection] = useState<SectionId | null>(initial.section ?? null);
  const [tag, setTag] = useState<Tag | null>(initial.tag ?? null);
  const [onlyRecipes, setOnlyRecipes] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const keyed = useMemo(() => dishes.map((d) => ({ d, key: searchKey(`${d.name} ${d.original ?? ""}`) })), [dishes]);

  const results = useMemo(() => {
    const words = searchKey(q).split(" ").filter(Boolean);
    return keyed
      .filter(
        ({ d, key }) =>
          (!section || d.section === section) &&
          (!tag || d.tags.includes(tag)) &&
          (!onlyRecipes || d.hasRecipe) &&
          words.every((w) => key.includes(w)),
      )
      .map(({ d }) => d);
  }, [keyed, q, section, tag, onlyRecipes]);

  return (
    <div>
      <div className="relative mx-auto max-w-2xl">
        <Search aria-hidden className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(PAGE);
          }}
          placeholder={t("search.placeholder")}
          aria-label={t("search.title")}
          autoFocus
          className="w-full rounded-full border-2 border-line bg-surface py-4 pl-14 pr-6 text-lg shadow-soft outline-none transition-colors placeholder:text-muted/70 focus:border-tomato"
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => setSection(null)} className={`chip ${!section ? "chip-active" : "hover:border-tomato"}`}>
          {t("search.all")}
        </button>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(section === s.id ? null : s.id)}
            className={`chip ${section === s.id ? "chip-active" : "hover:border-tomato"}`}
          >
            <SectionIcon id={s.id} className="mr-1.5 h-4 w-4" />
            {t(`sections.${s.id}.name`)}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {TAGS.map((tg) => (
          <button
            key={tg}
            type="button"
            onClick={() => setTag(tag === tg ? null : tg)}
            className={`chip ${tag === tg ? "border-mango bg-mango text-ink" : "hover:border-mango"}`}
          >
            <TagIcon tag={tg} className="mr-1.5 h-3.5 w-3.5" />
            {t(`tags.${tg}`)}
          </button>
        ))}
        <label className="chip cursor-pointer gap-2">
          <input
            type="checkbox"
            checked={onlyRecipes}
            onChange={(e) => setOnlyRecipes(e.target.checked)}
            className="h-4 w-4 accent-[rgb(var(--leaf))]"
          />
          {t("search.withRecipe")}
        </label>
      </div>

      <p className="mt-8 text-sm font-semibold text-tomato" aria-live="polite">
        {t("search.results", { count: results.length })}
      </p>
      <motion.div layout className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {results.slice(0, limit).map((d) => (
            <motion.div
              key={d.slug}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <DishCard dish={d} showSection />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {results.length > limit && (
        <div className="mt-8 text-center">
          <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="btn-ghost">
            + {results.length - limit}
          </button>
        </div>
      )}
    </div>
  );
}
