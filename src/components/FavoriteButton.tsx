"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/local";

export function FavoriteButton({ slug, variant = "icon" }: { slug: string; variant?: "icon" | "button" }) {
  const t = useTranslations("kitchen");
  const { isFavorite, toggle } = useFavorites();
  const on = isFavorite(slug);
  const label = on ? t("unfavorite") : t("favorite");

  const heart = (
    <motion.span
      key={String(on)}
      initial={{ scale: on ? 0.6 : 1 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      className="inline-flex"
    >
      <Heart className={`h-4 w-4 ${on ? "fill-tomato text-tomato" : ""}`} aria-hidden />
    </motion.span>
  );

  if (variant === "button") {
    return (
      <button type="button" onClick={() => toggle(slug)} aria-pressed={on} className={`btn-ghost ${on ? "border-tomato text-tomato" : ""}`}>
        {heart}
        {on ? t("saved") : t("favorite")}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-full bg-surface/90 text-muted shadow-sm transition-colors hover:text-tomato"
    >
      {heart}
    </button>
  );
}
