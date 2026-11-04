"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SECTIONS, getSection } from "@/data/sections";
import type { DishSummary, SectionId } from "@/data/types";
import { ACCENT_BG } from "@/lib/ui";
import { pickRandom } from "@/lib/random";

export function DiceRoller({ dishes, initialFrom }: { dishes: DishSummary[]; initialFrom?: SectionId }) {
  const t = useTranslations();
  const [from, setFrom] = useState<SectionId | "all">(initialFrom ?? "all");
  const [onlyRecipes, setOnlyRecipes] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [flicker, setFlicker] = useState<DishSummary | null>(null);
  const [result, setResult] = useState<DishSummary | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const pool = useMemo(
    () => dishes.filter((d) => (from === "all" || d.section === from) && (!onlyRecipes || d.hasRecipe)),
    [dishes, from, onlyRecipes],
  );

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const roll = () => {
    if (!pool.length || rolling) return;
    const final = pickRandom(pool, result?.slug);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) {
      setResult(final);
      return;
    }
    setRolling(true);
    setResult(null);
    let ticks = 0;
    timer.current = setInterval(() => {
      ticks++;
      setFlicker(pickRandom(pool));
      if (ticks >= 12) {
        clearInterval(timer.current!);
        setFlicker(null);
        setResult(final);
        setRolling(false);
      }
    }, 75);
  };

  const shown = flicker ?? result;
  const section = shown ? getSection(shown.section)! : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap justify-center gap-2">
        <span className="w-full text-center text-sm font-semibold text-muted">{t("random.from")}</span>
        {(["all", ...SECTIONS.map((s) => s.id)] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setFrom(id)}
            className={`chip ${from === id ? "chip-active" : "hover:border-tomato"}`}
          >
            {id === "all" ? t("random.everything") : `${getSection(id)!.emoji} ${t(`sections.${id}.name`)}`}
          </button>
        ))}
      </div>
      <label className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={onlyRecipes}
          onChange={(e) => setOnlyRecipes(e.target.checked)}
          className="h-4 w-4 accent-[rgb(var(--tomato))]"
        />
        {t("random.onlyRecipes")}
      </label>

      <div className="mt-10 flex flex-col items-center">
        <motion.button
          type="button"
          onClick={roll}
          disabled={!pool.length}
          aria-label={t("random.roll")}
          className="grid h-32 w-32 place-items-center rounded-[2rem] bg-gradient-to-br from-tomato to-mango text-6xl shadow-lift disabled:opacity-40"
          animate={rolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.08, 1] } : { rotate: 0 }}
          transition={rolling ? { duration: 0.9, ease: "easeInOut" } : {}}
          whileHover={{ scale: 1.05, rotate: -6 }}
          whileTap={{ scale: 0.92 }}
        >
          🎲
        </motion.button>
        <p className="mt-3 text-sm font-semibold text-muted">
          {pool.length ? (rolling ? t("random.rolling") : t("random.roll")) : t("random.empty")}
        </p>
      </div>

      <div className="mt-10 min-h-[220px]">
        <AnimatePresence mode="wait">
          {shown && section && (
            <motion.div
              key={rolling ? "flicker" : shown.slug}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: rolling ? 0.05 : 0.35 }}
              className="card mx-auto flex max-w-md flex-col items-center gap-3 p-8 text-center"
            >
              <span className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl ${ACCENT_BG[section.accent]}`} aria-hidden>
                {section.emoji}
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">{t(`sections.${section.id}.name`)}</p>
              <h2 className="heading text-3xl">{shown.name}</h2>
              {!rolling && (
                <motion.div
                  className="mt-2 flex flex-wrap justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link href={`/dishes/${shown.slug}`} className="btn-primary">
                    {t("random.open")} →
                  </Link>
                  <button type="button" onClick={roll} className="btn-ghost">
                    🎲 {t("random.rollAgain")}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
