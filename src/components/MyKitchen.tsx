"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Camera, Heart, NotebookPen, ShoppingBasket, type LucideIcon } from "lucide-react";
import type { DishSummary } from "@/data/types";
import { useFavorites } from "@/lib/local";
import { DishCard } from "./DishCard";
import { PhotoGrid } from "./MadeIt";
import { ShoppingList } from "./Shopping";
import { MyRecipeList } from "./UserRecipes";

export type KitchenTab = "favorites" | "recipes" | "photos" | "shopping";
const TABS: { id: KitchenTab; icon: LucideIcon }[] = [
  { id: "favorites", icon: Heart },
  { id: "recipes", icon: NotebookPen },
  { id: "photos", icon: Camera },
  { id: "shopping", icon: ShoppingBasket },
];

export function MyKitchen({ dishes, initialTab }: { dishes: DishSummary[]; initialTab: KitchenTab }) {
  const t = useTranslations("kitchen");
  const [tab, setTab] = useState<KitchenTab>(initialTab);
  const { favorites } = useFavorites();
  const favDishes = favorites.map((s) => dishes.find((d) => d.slug === s)).filter(Boolean) as DishSummary[];

  const choose = (id: KitchenTab) => {
    setTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url);
  };

  return (
    <div>
      <div role="tablist" className="mx-auto flex max-w-2xl gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 shadow-soft">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => choose(id)}
            className={`relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold transition-colors ${
              tab === id ? "text-white" : "text-muted hover:text-ink"
            }`}
          >
            {tab === id && <motion.span layoutId="kitchen-tab" className="absolute inset-0 rounded-full bg-tomato" />}
            <Icon className="relative h-4 w-4" aria-hidden />
            <span className="relative hidden sm:inline">{t(`tabs.${id}`)}</span>
            <span className="sr-only sm:hidden">{t(`tabs.${id}`)}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-sm font-semibold sm:hidden">{t(`tabs.${tab}`)}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          role="tabpanel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          {tab === "favorites" &&
            (favDishes.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favDishes.map((d) => (
                  <DishCard key={d.slug} dish={d} showSection />
                ))}
              </div>
            ) : (
              <div className="card p-10 text-center text-muted">
                <Heart className="mx-auto mb-3 h-10 w-10 text-tomato" aria-hidden />
                {t("noFavorites")}
              </div>
            ))}
          {tab === "recipes" && <MyRecipeList />}
          {tab === "photos" && <PhotoGrid />}
          {tab === "shopping" && <ShoppingList dishes={dishes} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
