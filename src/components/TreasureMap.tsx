"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Recipe steps as a treasure map: a winding dotted trail with one stop per step.
 * The current stop glows; finishing a stop draws the trail to the next one.
 * The last stop is the treasure. Progress is remembered per recipe on this device.
 */
export function TreasureMap({ steps, storageKey }: { steps: string[]; storageKey: string }) {
  const t = useTranslations("map");
  const [done, setDone] = useState(0); // number of completed stops
  const key = `lc-map-${storageKey}`;

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(key));
      if (saved > 0 && saved <= steps.length) setDone(saved);
    } catch {
      /* no storage: start from the first stop */
    }
  }, [key, steps.length]);

  const update = (n: number) => {
    setDone(n);
    try {
      localStorage.setItem(key, String(n));
    } catch {
      /* ignore */
    }
  };

  const finished = done >= steps.length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-mango to-tomato"
              animate={{ width: `${(done / steps.length) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs font-semibold text-muted">
            {t("progress", { done, total: steps.length })}
          </p>
        </div>
        {done > 0 && (
          <button type="button" onClick={() => update(0)} className="text-sm font-semibold text-muted hover:text-tomato">
            ↺ {t("reset")}
          </button>
        )}
      </div>

      <ol className="relative">
        {steps.map((step, i) => {
          const state = i < done ? "done" : i === done ? "current" : "todo";
          return (
            <li key={i} className="grid grid-cols-[56px_1fr] gap-3">
              <div className="flex flex-col items-center">
                <motion.button
                  type="button"
                  onClick={() => update(i < done ? i : i + 1)}
                  aria-label={t("stop", { n: i + 1 })}
                  className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 text-lg font-bold transition-colors ${
                    state === "done"
                      ? "border-leaf bg-leaf text-white"
                      : state === "current"
                        ? "border-tomato bg-surface text-tomato"
                        : "border-dashed border-line bg-surface text-muted"
                  }`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {state === "current" && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full border-2 border-tomato"
                      animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  {state === "done" ? "✓" : state === "current" ? "📍" : i + 1}
                </motion.button>
                <Trail drawn={i < done} />
              </div>

              <motion.div
                className="pb-8 pt-1"
                animate={{ opacity: state === "todo" ? 0.55 : 1 }}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-mango">
                  {t("stop", { n: i + 1 })}
                </p>
                <div
                  className={`mt-1 rounded-xl border p-4 transition-all ${
                    state === "current" ? "border-tomato/40 bg-surface shadow-lift" : "border-line bg-surface/60"
                  }`}
                >
                  <p className={state === "done" ? "text-muted line-through decoration-leaf/50" : ""}>{step}</p>
                  {state === "current" && (
                    <motion.button
                      type="button"
                      onClick={() => update(i + 1)}
                      className="btn-primary mt-4 text-sm"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {i === steps.length - 1 ? t("finish") : t("next")}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </li>
          );
        })}

        {/* The treasure */}
        <li className="grid grid-cols-[56px_1fr] gap-3">
          <div className="flex justify-center">
            <motion.div
              className={`grid h-14 w-14 place-items-center rounded-2xl text-3xl ${
                finished ? "bg-mango/20" : "bg-line/50 grayscale"
              }`}
              animate={finished ? { rotate: [0, -10, 10, -6, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.8 }}
            >
              {finished ? "🏆" : "🧰"}
            </motion.div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={finished ? "found" : "hidden"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pt-2"
            >
              <p className="heading text-xl">{finished ? t("treasure") : t("treasureHidden")}</p>
              <p className="text-sm text-muted">{finished ? t("treasureText") : t("treasureHint")}</p>
            </motion.div>
          </AnimatePresence>
        </li>
      </ol>
    </div>
  );
}

/** A wavy dotted connector; the colored trail draws itself once the stop above is done. */
function Trail({ drawn }: { drawn: boolean }) {
  const d = "M28 0 C 4 30, 52 70, 28 100";
  return (
    <svg className="w-14 flex-1" viewBox="0 0 56 100" preserveAspectRatio="none" aria-hidden>
      <path d={d} fill="none" className="stroke-line" strokeWidth={3} strokeDasharray="2 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <motion.path
        d={d}
        fill="none"
        className="stroke-leaf"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </svg>
  );
}
