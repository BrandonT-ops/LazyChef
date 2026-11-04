"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getSection } from "@/data/sections";
import type { DishSummary } from "@/data/types";
import { ACCENT_BG } from "@/lib/ui";
import { Check, PencilLine } from "lucide-react";
import { SectionIcon, TagIcon } from "./icons";
import { FavoriteButton } from "./FavoriteButton";

export function DishCard({ dish, showSection = false }: { dish: DishSummary; showSection?: boolean }) {
  const t = useTranslations();
  const section = getSection(dish.section)!;

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="relative h-full">
      <Link
        href={`/dishes/${dish.slug}`}
        className="card group flex h-full flex-col gap-3 p-4 transition-shadow hover:shadow-lift"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl ${ACCENT_BG[section.accent]}`}
          >
            <SectionIcon id={section.id} className="h-5 w-5" />
          </span>
          <div className="min-w-0 pr-8">
            <h3 className="heading text-base leading-snug transition-colors group-hover:text-tomato">
              {dish.name}
            </h3>
            {showSection && (
              <p className="text-xs text-muted">{t(`sections.${dish.section}.name`)}</p>
            )}
          </div>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {dish.hasRecipe ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-leaf/10 px-2.5 py-0.5 text-xs font-semibold text-leaf">
              <Check className="h-3 w-3" aria-hidden />
              {t("dish.hasRecipe")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-line/60 px-2.5 py-0.5 text-xs font-medium text-muted">
              <PencilLine className="h-3 w-3" aria-hidden />
              {t("dish.comingSoon")}
            </span>
          )}
          {dish.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-mango/15 px-2.5 py-0.5 text-xs font-medium text-ink/80">
              <TagIcon tag={tag} className="h-3 w-3" />
              {t(`tags.${tag}`)}
            </span>
          ))}
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <FavoriteButton slug={dish.slug} />
      </div>
    </motion.div>
  );
}
