"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SECTIONS } from "@/data/sections";
import type { DishSummary, Section } from "@/data/types";
import { ACCENT_BG } from "@/lib/ui";
import { SITE } from "@/config/site";

const PER_PAGE = 9;

type Page =
  | { kind: "cover" }
  | { kind: "toc" }
  | { kind: "chapter"; section: Section; chapter: number; count: number }
  | { kind: "list"; section: Section; dishes: DishSummary[] }
  | { kind: "end" };

function buildPages(dishes: DishSummary[]) {
  const pages: Page[] = [{ kind: "cover" }, { kind: "toc" }];
  const chapterStart: Record<string, number> = {};
  SECTIONS.forEach((section, ci) => {
    const list = dishes.filter((d) => d.section === section.id);
    chapterStart[section.id] = pages.length;
    pages.push({ kind: "chapter", section, chapter: ci + 1, count: list.length });
    for (let i = 0; i < list.length; i += PER_PAGE) {
      pages.push({ kind: "list", section, dishes: list.slice(i, i + PER_PAGE) });
    }
  });
  pages.push({ kind: "end" });
  return { pages, chapterStart };
}

function useIsWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

/** All dishes as a cookbook: cover, contents, one chapter per section, pages that turn. */
export function Book({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations();
  const wide = useIsWide();
  const { pages, chapterStart } = useMemo(() => buildPages(dishes), [dishes]);
  const step = wide ? 2 : 1;
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const shown = wide ? index - (index % 2) : index;
  const last = pages.length - 1;

  const goTo = useCallback(
    (p: number) => {
      const target = Math.max(0, Math.min(last, wide ? p - (p % 2) : p));
      setState(([cur]) => [target, target > cur ? 1 : -1]);
    },
    [last, wide],
  );
  const next = useCallback(() => shown + step <= last && goTo(shown + step), [shown, step, last, goTo]);
  const prev = useCallback(() => shown > 0 && goTo(shown - step), [shown, step, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  };

  const visible = wide ? [shown, shown + 1] : [shown];

  const renderPage = (p: number) => {
    const page = pages[p];
    if (!page) return <div className="h-full" />;
    return (
      <PageView
        page={page}
        number={p}
        chapterStart={chapterStart}
        dishes={dishes}
        goTo={goTo}
        t={t}
      />
    );
  };

  return (
    <div>
      <div className="relative mx-auto max-w-5xl [perspective:1800px]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={shown}
            custom={dir}
            variants={{
              enter: (d: number) => ({ rotateY: d > 0 ? 18 : -18, x: d > 0 ? 40 : -40, opacity: 0 }),
              center: { rotateY: 0, x: 0, opacity: 1 },
              exit: (d: number) => ({ rotateY: d > 0 ? -18 : 18, x: d > 0 ? -40 : 40, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            className={`grid min-h-[600px] cursor-grab touch-pan-y overflow-hidden rounded-2xl border border-line bg-surface shadow-lift active:cursor-grabbing ${
              wide ? "grid-cols-2" : "grid-cols-1"
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {visible.map((p, i) => (
              <div
                key={p}
                className={`relative p-6 sm:p-8 ${
                  wide && i === 0 ? "border-r border-line bg-gradient-to-l from-ink/[0.04] to-transparent" : ""
                } ${wide && i === 1 ? "bg-gradient-to-r from-ink/[0.04] to-transparent" : ""}`}
              >
                {renderPage(p)}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mx-auto mt-6 flex max-w-5xl items-center justify-between gap-4">
        <button type="button" onClick={prev} disabled={shown === 0} className="btn-ghost">
          ← {t("book.prev")}
        </button>
        <p className="hidden text-center text-xs text-muted sm:block">{t("book.hint")}</p>
        <button type="button" onClick={next} disabled={shown + step > last} className="btn-primary">
          {t("book.next")} →
        </button>
      </div>
    </div>
  );
}

function PageView({
  page,
  number,
  chapterStart,
  dishes,
  goTo,
  t,
}: {
  page: Page;
  number: number;
  chapterStart: Record<string, number>;
  dishes: DishSummary[];
  goTo: (p: number) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const footer = number > 0 && (
    <p className="absolute bottom-4 left-0 right-0 text-center text-xs font-semibold text-muted">— {number} —</p>
  );

  switch (page.kind) {
    case "cover":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-tomato to-mango p-8 text-center text-white">
          <span className="text-6xl" aria-hidden>{SITE.logoEmoji}</span>
          <h2 className="heading text-4xl">{SITE.name}</h2>
          <p className="text-lg font-semibold opacity-90">{t("book.cover")}</p>
          <p className="text-sm opacity-80">{t("home.dishCount", { count: dishes.length })}</p>
          <button type="button" onClick={() => goTo(1)} className="btn mt-4 bg-white text-tomato">
            {t("book.open")} →
          </button>
        </div>
      );

    case "toc":
      return (
        <div className="pb-8">
          <h2 className="heading mb-5 text-2xl">📑 {t("book.toc")}</h2>
          <ol className="space-y-1">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goTo(chapterStart[s.id])}
                  className="group flex w-full items-baseline gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-tomato/10"
                >
                  <span className="text-xs font-bold text-muted">{i + 1}.</span>
                  <span aria-hidden>{s.emoji}</span>
                  <span className="font-semibold group-hover:text-tomato">{t(`sections.${s.id}.name`)}</span>
                  <span aria-hidden className="mx-1 flex-1 translate-y-[-3px] border-b-2 border-dotted border-line" />
                  <span className="text-sm font-semibold text-muted">{chapterStart[s.id]}</span>
                </button>
              </li>
            ))}
          </ol>
          {footer}
        </div>
      );

    case "chapter":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 pb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
            {t("book.chapter", { n: page.chapter })}
          </p>
          <span className={`grid h-24 w-24 place-items-center rounded-3xl text-5xl ${ACCENT_BG[page.section.accent]}`} aria-hidden>
            {page.section.emoji}
          </span>
          <h2 className="heading text-3xl">{t(`sections.${page.section.id}.name`)}</h2>
          <p className="max-w-xs text-muted">{t(`sections.${page.section.id}.theme`)}</p>
          <p className="text-sm font-semibold text-tomato">{t("home.dishCount", { count: page.count })}</p>
          {footer}
        </div>
      );

    case "list":
      return (
        <div className="pb-8">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
            <span aria-hidden>{page.section.emoji}</span>
            {t(`sections.${page.section.id}.name`)}
          </p>
          <ul className="space-y-0.5">
            {page.dishes.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/dishes/${d.slug}`}
                  draggable={false}
                  className="group flex items-baseline gap-2 rounded-lg px-2 py-2 hover:bg-mango/10"
                >
                  <span className="font-medium group-hover:text-tomato">{d.name}</span>
                  <span aria-hidden className="mx-1 flex-1 translate-y-[-3px] border-b-2 border-dotted border-line" />
                  <span className="shrink-0 text-xs" title={d.hasRecipe ? t("dish.hasRecipe") : t("dish.comingSoon")}>
                    {d.hasRecipe ? "✅" : "📝"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {footer}
        </div>
      );

    case "end":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 pb-8 text-center">
          <span className="text-5xl" aria-hidden>🍽️</span>
          <h2 className="heading text-2xl">{t("book.end")}</h2>
          <button type="button" onClick={() => goTo(0)} className="btn-ghost">
            ↺ {t("book.restart")}
          </button>
          {footer}
        </div>
      );
  }
}
