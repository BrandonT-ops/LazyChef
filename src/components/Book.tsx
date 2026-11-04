"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, ChefHat, CircleCheck, ListOrdered, PencilLine, RotateCcw, UtensilsCrossed } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SECTIONS } from "@/data/sections";
import type { DishSummary, Section } from "@/data/types";
import { ACCENT_BG } from "@/lib/ui";
import { SITE } from "@/config/site";
import { SectionIcon } from "./icons";

const PER_PAGE = 9;
const FLIP_S = 0.9;
const EASE = [0.65, 0, 0.35, 1] as const;

type Page =
  | { kind: "cover" }
  | { kind: "endpaper" }
  | { kind: "toc" }
  | { kind: "chapter"; section: Section; chapter: number; count: number }
  | { kind: "list"; section: Section; dishes: DishSummary[] }
  | { kind: "end" }
  | { kind: "blank" }
  | { kind: "back" };

/**
 * Pages in physical order. Like a real book, every leaf has a front (a right-hand page)
 * and a back (the left-hand page once turned): page 2k is the front of leaf k, page 2k+1
 * its back. The cover is the front of leaf 0 and the back cover is the very last back.
 */
function buildPages(dishes: DishSummary[]) {
  const pages: Page[] = [{ kind: "cover" }, { kind: "endpaper" }, { kind: "toc" }];
  const chapterStart: Record<string, number> = {};
  SECTIONS.forEach((section, ci) => {
    const list = dishes.filter((d) => d.section === section.id);
    chapterStart[section.id] = pages.length;
    pages.push({ kind: "chapter", section, chapter: ci + 1, count: list.length });
    for (let i = 0; i < list.length; i += PER_PAGE) pages.push({ kind: "list", section, dishes: list.slice(i, i + PER_PAGE) });
  });
  pages.push({ kind: "end" });
  if (pages.length % 2 === 0) pages.push({ kind: "blank" }); // the back cover has to land on a "back" (odd index)
  pages.push({ kind: "back" });
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

interface Flip {
  /** Pages lying flat under the moving leaf: [left, right]. */
  under: [number | null, number | null];
  /** The moving leaf's front (right-hand side) and back (left-hand side). */
  front: number | null;
  back: number | null;
  from: number;
  to: number;
  target: number;
}

/** Every dish as a real cookbook: hard cover, contents, a chapter per section, and pages that turn over the spine. */
export function Book({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations();
  const wide = useIsWide();
  const { pages, chapterStart } = useMemo(() => buildPages(dishes), [dishes]);
  // Phones show one page at a time, without endpaper, padding or back cover.
  const single = useMemo(
    () =>
      pages
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => p.kind !== "endpaper" && p.kind !== "blank" && p.kind !== "back")
        .map(({ i }) => i),
    [pages],
  );
  const leaves = pages.length / 2;

  // Two-page mode: `pos` = leaves turned. One-page mode: `pos` = index into `single`.
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const rot = useMotionValue(0);
  const busy = useRef(false);

  useEffect(() => {
    setPos(0);
    setFlip(null);
  }, [wide]);

  const max = wide ? leaves : single.length - 1;

  const flipTo = useCallback(
    (target: number) => {
      if (busy.current || target === pos || target < 0 || target > max) return;
      const L = (n: number) => (n > 0 ? 2 * n - 1 : null);
      const R = (n: number) => (2 * n < pages.length ? 2 * n : null);
      const forward = target > pos;
      const f: Flip = wide
        ? forward
          ? { under: [L(pos), R(target)], front: R(pos), back: L(target), from: 0, to: -180, target }
          : { under: [L(target), R(pos)], front: R(target), back: L(pos), from: -180, to: 0, target }
        : forward
          ? { under: [null, single[target]], front: single[pos], back: null, from: 0, to: -180, target }
          : { under: [null, single[pos]], front: single[target], back: null, from: -180, to: 0, target };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPos(target);
        return;
      }
      busy.current = true;
      rot.set(f.from);
      setFlip(f);
      animate(rot, f.to, {
        duration: FLIP_S,
        ease: EASE,
        onComplete: () => {
          setPos(target);
          setFlip(null);
          busy.current = false;
        },
      });
    },
    [pos, max, wide, single, rot, pages.length],
  );

  const next = useCallback(() => flipTo(pos + 1), [flipTo, pos]);
  const prev = useCallback(() => flipTo(pos - 1), [flipTo, pos]);

  /** Opens the book at a physical page. */
  const goToPage = useCallback(
    (page: number) => flipTo(wide ? Math.ceil(page / 2) : Math.max(0, single.indexOf(page))),
    [flipTo, wide, single],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const flatLeft = (n: number) => (n > 0 ? 2 * n - 1 : null);
  const flatRight = (n: number) => (2 * n < pages.length ? 2 * n : null);
  const [leftIdx, rightIdx]: [number | null, number | null] = flip
    ? flip.under
    : wide
      ? [flatLeft(pos), flatRight(pos)]
      : [null, single[pos]];

  // A closed book (front cover) or a finished one (back cover) slides to sit centred.
  const at = flip ? flip.target : pos;
  const shift = !wide ? "0%" : at === 0 ? "-25%" : at === leaves ? "25%" : "0%";

  const render = (idx: number | null, side: "left" | "right") =>
    idx === null ? null : (
      <PageView page={pages[idx]} number={idx} side={side} chapterStart={chapterStart} dishes={dishes} goToPage={goToPage} t={t} />
    );

  return (
    <div>
      <div className={`relative mx-auto ${wide ? "max-w-5xl" : "max-w-md"}`} style={{ perspective: 2200 }}>
        <motion.div
          className={`relative ${wide ? "h-[620px]" : "h-[580px]"}`}
          animate={{ x: shift }}
          transition={{ duration: FLIP_S, ease: EASE }}
          onPanEnd={(_, info) => {
            if (info.offset.x < -50) next();
            else if (info.offset.x > 50) prev();
          }}
          style={{ touchAction: "pan-y" }}
        >
          {/* Thickness of the page block under the open book */}
          {wide && leftIdx !== null && (
            <div aria-hidden className="absolute inset-y-1 left-0 w-1/2 -translate-x-1 translate-y-1 rounded-l-lg bg-line" />
          )}
          {wide && rightIdx !== null && (
            <div aria-hidden className="absolute inset-y-1 right-0 w-1/2 translate-x-1 translate-y-1 rounded-r-lg bg-line" />
          )}

          {wide && leftIdx !== null && (
            <Sheet side="left" wide>
              {render(leftIdx, "left")}
            </Sheet>
          )}
          {rightIdx !== null && (
            <Sheet side="right" wide={wide}>
              {render(rightIdx, "right")}
            </Sheet>
          )}

          {flip && <UnderShadow rot={rot} wide={wide} />}

          {/* The turning leaf, hinged on the spine */}
          {flip && (
            <motion.div
              className={`absolute top-0 z-20 h-full ${wide ? "left-1/2 w-1/2" : "left-0 w-full"}`}
              style={{ rotateY: rot, transformOrigin: "left center", transformStyle: "preserve-3d" }}
            >
              <Face rot={rot} side="front" wide={wide}>
                {render(flip.front, "right")}
              </Face>
              <Face rot={rot} side="back" wide={wide}>
                {render(flip.back, "left")}
              </Face>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className={`mx-auto mt-8 flex items-center justify-between gap-4 ${wide ? "max-w-5xl" : "max-w-md"}`}>
        <button type="button" onClick={prev} disabled={pos === 0} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("book.prev")}
        </button>
        <p className="hidden text-center text-xs text-muted sm:block">{t("book.hint")}</p>
        <button type="button" onClick={next} disabled={pos >= max} className="btn-primary">
          {t("book.next")}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** A page lying flat. Each page darkens slightly towards the spine. */
function Sheet({ side, wide, children }: { side: "left" | "right"; wide: boolean; children: React.ReactNode }) {
  const place = !wide ? "left-0 w-full rounded-lg" : side === "left" ? "left-0 w-1/2 rounded-l-lg" : "left-1/2 w-1/2 rounded-r-lg";
  return (
    <div className={`paper absolute top-0 h-full overflow-hidden shadow-lift ${place}`}>
      {wide && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 z-10 w-12 from-ink/15 to-transparent ${
            side === "left" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"
          }`}
        />
      )}
      {children}
    </div>
  );
}

/** One side of the turning leaf; shading deepens as the page stands up, like real paper. */
function Face({ rot, side, wide, children }: { rot: MotionValue<number>; side: "front" | "back"; wide: boolean; children: React.ReactNode }) {
  const shade = useTransform(rot, side === "front" ? [0, -90] : [-90, -180], side === "front" ? [0, 0.35] : [0.35, 0]);
  const round = !wide ? "rounded-lg" : side === "front" ? "rounded-r-lg" : "rounded-l-lg";
  return (
    <div
      className={`paper absolute inset-0 overflow-hidden ${round}`}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: side === "back" ? "rotateY(180deg)" : undefined,
      }}
    >
      {children}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute inset-0 from-black/60 via-black/10 to-transparent ${
          side === "front" ? "bg-gradient-to-r" : "bg-gradient-to-l"
        }`}
        style={{ opacity: shade }}
      />
    </div>
  );
}

/** The shadow a lifting page casts on the page beneath it. */
function UnderShadow({ rot, wide }: { rot: MotionValue<number>; wide: boolean }) {
  const opacity = useTransform(rot, [0, -90, -180], [0, 0.35, 0]);
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute top-0 z-10 h-full bg-gradient-to-r from-black/50 to-transparent ${
        wide ? "left-1/2 w-1/2 rounded-r-lg" : "left-0 w-full rounded-lg"
      }`}
      style={{ opacity }}
    />
  );
}

function PageView({
  page,
  number,
  side,
  chapterStart,
  dishes,
  goToPage,
  t,
}: {
  page: Page;
  number: number;
  side: "left" | "right";
  chapterStart: Record<string, number>;
  dishes: DishSummary[];
  goToPage: (p: number) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const shown = number - 1; // the contents page is page 1
  const footer = shown > 0 && (
    <p className={`absolute bottom-5 text-xs font-semibold text-muted ${side === "left" ? "left-8" : "right-8"}`}>{shown}</p>
  );
  const pad = "relative h-full p-7 sm:p-9";

  switch (page.kind) {
    case "cover":
    case "back":
      return (
        <div className="relative flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-tomato via-[#d24a25] to-[#a83418] p-8 text-center text-white">
          <div aria-hidden className="pointer-events-none absolute inset-4 rounded-md border-2 border-white/25" />
          <div aria-hidden className={`absolute inset-y-0 w-5 bg-black/15 ${page.kind === "cover" ? "left-0" : "right-0"}`} />
          {page.kind === "cover" ? (
            <>
              <ChefHat className="h-16 w-16" strokeWidth={1.5} aria-hidden />
              <h2 className="heading text-5xl">{SITE.name}</h2>
              <p className="text-lg font-semibold opacity-90">{t("book.cover")}</p>
              <p className="text-sm opacity-80">{t("home.dishCount", { count: dishes.length })}</p>
              <button type="button" onClick={() => goToPage(2)} className="btn relative mt-4 bg-white text-tomato">
                {t("book.open")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </>
          ) : (
            <>
              <p className="heading text-3xl">{SITE.name}.</p>
              <button type="button" onClick={() => goToPage(0)} className="btn relative mt-2 bg-white text-tomato">
                <RotateCcw className="h-4 w-4" aria-hidden />
                {t("book.restart")}
              </button>
            </>
          )}
        </div>
      );

    case "endpaper":
    case "blank":
      return (
        <div className={`${pad} flex items-center justify-center`}>
          {page.kind === "endpaper" && (
            <div className="text-center text-muted">
              <ChefHat className="mx-auto h-10 w-10 text-tomato/60" strokeWidth={1.5} aria-hidden />
              <p className="heading mt-3 text-xl text-ink/70">{SITE.name}</p>
              <p className="mt-1 text-sm italic">{t("footer.tagline")}</p>
            </div>
          )}
        </div>
      );

    case "toc":
      return (
        <div className={pad}>
          <h2 className="heading mb-5 flex items-center gap-2 text-2xl">
            <ListOrdered className="h-6 w-6 text-tomato" aria-hidden />
            {t("book.toc")}
          </h2>
          <ol className="space-y-1">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goToPage(chapterStart[s.id])}
                  className="group flex w-full items-baseline gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-tomato/10"
                >
                  <span className="text-xs font-bold text-muted">{i + 1}.</span>
                  <SectionIcon id={s.id} className="h-4 w-4 translate-y-0.5 self-start text-muted" />
                  <span className="font-semibold group-hover:text-tomato">{t(`sections.${s.id}.name`)}</span>
                  <span aria-hidden className="mx-1 flex-1 -translate-y-[3px] border-b-2 border-dotted border-line" />
                  <span className="text-sm font-semibold text-muted">{chapterStart[s.id] - 1}</span>
                </button>
              </li>
            ))}
          </ol>
          {footer}
        </div>
      );

    case "chapter":
      return (
        <div className={`${pad} flex flex-col items-center justify-center gap-3 text-center`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{t("book.chapter", { n: page.chapter })}</p>
          <span className={`grid h-24 w-24 place-items-center rounded-3xl ${ACCENT_BG[page.section.accent]}`} aria-hidden>
            <SectionIcon id={page.section.id} className="h-12 w-12" />
          </span>
          <h2 className="heading text-3xl">{t(`sections.${page.section.id}.name`)}</h2>
          <p className="max-w-xs text-muted">{t(`sections.${page.section.id}.theme`)}</p>
          <p className="text-sm font-semibold text-tomato">{t("home.dishCount", { count: page.count })}</p>
          {footer}
        </div>
      );

    case "list":
      return (
        <div className={pad}>
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
            <SectionIcon id={page.section.id} className="h-3.5 w-3.5" />
            {t(`sections.${page.section.id}.name`)}
          </p>
          <ul className="space-y-0.5">
            {page.dishes.map((d) => (
              <li key={d.slug}>
                <Link href={`/dishes/${d.slug}`} draggable={false} className="group flex items-baseline gap-2 rounded-lg px-2 py-2 hover:bg-mango/10">
                  <span className="font-medium group-hover:text-tomato">{d.name}</span>
                  <span aria-hidden className="mx-1 flex-1 -translate-y-[3px] border-b-2 border-dotted border-line" />
                  <span className="shrink-0" title={d.hasRecipe ? t("dish.hasRecipe") : t("dish.comingSoon")}>
                    {d.hasRecipe ? (
                      <CircleCheck className="h-4 w-4 text-leaf" aria-label={t("dish.hasRecipe")} />
                    ) : (
                      <PencilLine className="h-4 w-4 text-muted" aria-label={t("dish.comingSoon")} />
                    )}
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
        <div className={`${pad} flex flex-col items-center justify-center gap-3 text-center`}>
          <UtensilsCrossed className="h-12 w-12 text-tomato" aria-hidden />
          <h2 className="heading text-2xl">{t("book.end")}</h2>
          <button type="button" onClick={() => goToPage(0)} className="btn-ghost">
            <RotateCcw className="h-4 w-4" aria-hidden />
            {t("book.restart")}
          </button>
          {footer}
        </div>
      );
  }
}
