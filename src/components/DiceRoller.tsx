"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SECTIONS, getSection } from "@/data/sections";
import type { DishSummary, SectionId, Tag } from "@/data/types";
import { PANTRY_BY_ID, matchPantry, type DishNeeds, type PantryMatch } from "@/data/pantry";
import { ACCENT_BG } from "@/lib/ui";
import { pickRandom } from "@/lib/random";
import { useLocal, usePantry } from "@/lib/local";
import { ArrowRight, Clock, Dices, Refrigerator, RotateCcw } from "lucide-react";
import { SectionIcon, TagIcon } from "./icons";
import { Die, type DieThrow } from "./Dice3D";

const MOODS: Tag[] = ["budget", "quick", "kids", "vegetarian", "snack", "occasion"];
type Origin = "all" | "local" | "western";
type Time = "any" | "30" | "60";
interface Prefs {
  from: SectionId | "all";
  moods: Tag[];
  origin: Origin;
  time: Time;
  onlyRecipes: boolean;
  usePantry: boolean;
}
const DEFAULT_PREFS: Prefs = { from: "all", moods: [], origin: "all", time: "any", onlyRecipes: false, usePantry: false };
const DURATION = 1.6;

const randomThrow = (turn: number, side: -1 | 1): DieThrow => ({
  turn,
  value: 1 + Math.floor(Math.random() * 6),
  dx: side * (34 + Math.random() * 30),
  spin: (Math.random() - 0.5) * 50,
});

export function DiceRoller({
  dishes,
  pantryIndex,
  initialFrom,
  initialPantry,
}: {
  dishes: DishSummary[];
  pantryIndex: Record<string, DishNeeds>;
  initialFrom?: SectionId;
  initialPantry?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [stored, setPrefs] = useLocal<Prefs>("chop-dice-prefs", DEFAULT_PREFS);
  const prefs = { ...DEFAULT_PREFS, ...stored };
  const { pantry } = usePantry();
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<DishSummary | null>(null);
  const [dice, setDice] = useState<[DieThrow, DieThrow]>([
    { turn: 0, value: 5, dx: -46, spin: -8 },
    { turn: 0, value: 3, dx: 46, spin: 10 },
  ]);
  const [calm, setCalm] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Links like /random?from=sunday or /random?pantry=1 set the preference once.
  useEffect(() => {
    if (initialFrom || initialPantry)
      setPrefs((p) => ({ ...DEFAULT_PREFS, ...p, ...(initialFrom ? { from: initialFrom } : {}), ...(initialPantry ? { usePantry: true } : {}) }));
    setCalm(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) => setPrefs((p) => ({ ...DEFAULT_PREFS, ...p, [key]: value }));
  const toggleMood = (tag: Tag) =>
    set("moods", prefs.moods.includes(tag) ? prefs.moods.filter((x) => x !== tag) : [...prefs.moods, tag]);

  const matches = useMemo(() => {
    const m = new Map<string, PantryMatch>();
    if (prefs.usePantry && pantry.items.length)
      for (const x of matchPantry(pantryIndex, pantry.items, pantry.basics)) if (x.missing.length <= 1) m.set(x.slug, x);
    return m;
  }, [prefs.usePantry, pantry, pantryIndex]);

  const pool = useMemo(
    () =>
      dishes.filter((d) => {
        if (prefs.from !== "all" && d.section !== prefs.from) return false;
        if (prefs.onlyRecipes && !d.hasRecipe) return false;
        if (prefs.moods.some((m) => !d.tags.includes(m))) return false;
        if (prefs.origin === "western" && !d.tags.includes("western")) return false;
        if (prefs.origin === "local" && d.tags.includes("western")) return false;
        if (prefs.time !== "any" && (d.minutes == null || d.minutes > Number(prefs.time))) return false;
        if (prefs.usePantry && !matches.has(d.slug)) return false;
        return true;
      }),
    [dishes, prefs.from, prefs.onlyRecipes, prefs.moods, prefs.origin, prefs.time, prefs.usePantry, matches],
  );

  const roll = () => {
    if (!pool.length || rolling) return;
    const final = pickRandom(pool, result?.slug);
    const turn = dice[0].turn + 1;
    setDice([randomThrow(turn, -1), randomThrow(turn, 1)]);
    if (calm) {
      setResult(final);
      return;
    }
    setRolling(true);
    setResult(null);
    timer.current = setTimeout(() => {
      setResult(final);
      setRolling(false);
    }, DURATION * 1000 + 150);
  };

  const section = result ? getSection(result.section)! : null;
  const match = result ? matches.get(result.slug) : undefined;
  const label = (id: string) => {
    const item = PANTRY_BY_ID.get(id);
    return item ? (locale === "fr" ? item.fr : item.en) : id;
  };
  const changed = JSON.stringify(prefs) !== JSON.stringify(DEFAULT_PREFS);

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
      {/* Preferences */}
      <aside className="card order-2 h-fit space-y-6 p-5 lg:order-1">
        <div className="flex items-center justify-between">
          <h2 className="heading text-lg">{t("random.prefsTitle")}</h2>
          {changed && (
            <button type="button" onClick={() => setPrefs(DEFAULT_PREFS)} className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-tomato">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              {t("random.reset")}
            </button>
          )}
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t("random.from")}</legend>
          <div className="flex flex-wrap gap-1.5">
            {(["all", ...SECTIONS.map((s) => s.id)] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => set("from", id)}
                aria-pressed={prefs.from === id}
                className={`chip text-xs ${prefs.from === id ? "chip-active" : "hover:border-tomato"}`}
              >
                {id !== "all" && <SectionIcon id={id} className="mr-1 h-3.5 w-3.5" />}
                {id === "all" ? t("random.everything") : t(`sections.${id}.name`)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t("random.mood")}</legend>
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleMood(tag)}
                aria-pressed={prefs.moods.includes(tag)}
                className={`chip gap-1 text-xs ${prefs.moods.includes(tag) ? "chip-active" : "hover:border-tomato"}`}
              >
                <TagIcon tag={tag} className="h-3.5 w-3.5" />
                {t(`tags.${tag}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t("random.origin")}</legend>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "local", "western"] as Origin[]).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => set("origin", o)}
                aria-pressed={prefs.origin === o}
                className={`chip text-xs ${prefs.origin === o ? "chip-active" : "hover:border-tomato"}`}
              >
                {t(`random.origins.${o}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t("random.time")}</legend>
          <div className="flex flex-wrap gap-1.5">
            {(["any", "30", "60"] as Time[]).map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => set("time", x)}
                aria-pressed={prefs.time === x}
                className={`chip gap-1 text-xs ${prefs.time === x ? "chip-active" : "hover:border-tomato"}`}
              >
                {x !== "any" && <Clock className="h-3.5 w-3.5" aria-hidden />}
                {t(`random.times.${x}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="space-y-3 border-t border-line pt-4">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={prefs.usePantry}
              onChange={(e) => set("usePantry", e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[rgb(var(--tomato))]"
            />
            <span>
              <span className="font-semibold">{t("random.usePantry")}</span>
              <span className="block text-xs text-muted">{t("random.pantryCount", { count: pantry.items.length })}</span>
              <Link href="/pantry" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-tomato hover:underline">
                <Refrigerator className="h-3.5 w-3.5" aria-hidden />
                {t("random.pantryEdit")}
              </Link>
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={prefs.onlyRecipes}
              onChange={(e) => set("onlyRecipes", e.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--tomato))]"
            />
            {t("random.onlyRecipes")}
          </label>
        </div>
        <p className="text-xs font-semibold text-muted">{t("random.pool", { count: pool.length })}</p>
      </aside>

      {/* Table + verdict (first on phones, so the dice are right there) */}
      <div className="order-1 lg:order-2">
        <button
          type="button"
          onClick={roll}
          disabled={!pool.length || rolling}
          aria-label={t("random.throw")}
          className="relative block h-64 w-full overflow-hidden rounded-[2rem] border border-line bg-[radial-gradient(ellipse_at_center,rgb(var(--leaf)/0.9),rgb(var(--leaf)/0.65)_60%,rgb(var(--leaf)/0.5))] shadow-[inset_0_0_60px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed sm:h-72"
        >
          <span aria-hidden className="pointer-events-none absolute inset-3 rounded-[1.6rem] border-2 border-dashed border-white/15" />
          <span className="absolute inset-0 flex items-center justify-center gap-0">
            <Die roll={dice[0]} duration={DURATION} calm={calm} />
            <Die roll={dice[1]} duration={DURATION * 1.08} calm={calm} variant="tomato" />
          </span>
          <span className="absolute inset-x-0 bottom-4 text-center text-xs font-semibold uppercase tracking-wider text-white/80">
            {!pool.length ? t("random.empty") : rolling ? t("random.rolling") : t("random.tapHint")}
          </span>
        </button>

        <div className="mt-4 flex justify-center">
          <button type="button" onClick={roll} disabled={!pool.length || rolling} className="btn-primary btn-lg disabled:opacity-50">
            <Dices className="h-5 w-5" aria-hidden />
            {result ? t("random.rollAgain") : t("random.throw")}
          </button>
        </div>

        <div className="mt-8 min-h-[240px]" aria-live="polite">
          <AnimatePresence mode="wait">
            {result && section && !rolling && (
              <motion.div
                key={result.slug + dice[0].turn}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="card mx-auto flex max-w-lg flex-col items-center gap-3 p-8 text-center"
              >
                <p className="text-sm text-muted">
                  {t("random.verdictKicker")} <span className="font-semibold">{t("random.rolled", { total: dice[0].value + dice[1].value })}</span>
                </p>
                <span className={`grid h-16 w-16 place-items-center rounded-2xl ${ACCENT_BG[section.accent]}`} aria-hidden>
                  <SectionIcon id={section.id} className="h-8 w-8" />
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">{t(`sections.${section.id}.name`)}</p>
                <h2 className="heading text-3xl sm:text-4xl">{t("random.verdict", { dish: result.name })}</h2>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {result.minutes != null && (
                    <span className="chip gap-1 text-xs">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {t("random.minutes", { n: result.minutes })}
                    </span>
                  )}
                  {result.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="chip gap-1 text-xs">
                      <TagIcon tag={tag} className="h-3.5 w-3.5" />
                      {t(`tags.${tag}`)}
                    </span>
                  ))}
                </div>
                {match && (
                  <p className={`text-sm font-semibold ${match.missing.length ? "text-mango" : "text-leaf"}`}>
                    {match.missing.length
                      ? t("random.missing", { items: match.missing.map(label).join(", ") })
                      : t("random.ready")}
                  </p>
                )}
                {!result.hasRecipe && <p className="text-sm text-muted">{t("dish.comingSoon")}</p>}
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  <Link href={`/dishes/${result.slug}`} className="btn-primary">
                    {t("random.open")}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <button type="button" onClick={roll} className="btn-ghost">
                    <Dices className="h-4 w-4" aria-hidden />
                    {t("random.rollAgain")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
