"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { DishSummary } from "@/data/types";
import { useShopping } from "@/lib/local";
import { useLineCost } from "./Shopping";

/** "Your list: 12 items left, ~18 500 FCFA" card, shown on the markets page when there's a list. */
export function ShoppingSummary({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations("shopping");
  const { items } = useShopping();
  const { cost, money } = useLineCost(dishes);
  const left = items.filter((i) => !i.checked);
  if (!left.length) return null;
  const toBuy = left.reduce((s, i) => s + (cost(i) ?? 0), 0);
  return (
    <Link href="/me?tab=shopping" className="card group mx-auto mb-6 flex max-w-2xl items-center gap-4 p-4 transition-shadow hover:shadow-lift">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mango/15 text-mango">
        <ShoppingBasket className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{t("yourList")}</span>
        <span className="block text-sm text-muted">
          {t("left", { count: left.length })} · ~{money(toBuy)}
        </span>
      </span>
      <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
