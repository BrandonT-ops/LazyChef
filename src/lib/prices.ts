"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { CURRENCY, SIDE_PRICE, estimateDishPrice } from "@/data/prices";
import type { SideId } from "@/data/sides";
import type { DishSummary } from "@/data/types";
import { useLocal } from "./local";

/** Price keys: "dish:<slug>" or "side:<id>". Values are FCFA per serving. */
export const dishKey = (slug: string) => `dish:${slug}`;
export const sideKey = (id: SideId) => `side:${id}`;

const NO_OVERRIDES: Record<string, number> = {};

/** Estimated prices, overridden by the ones the person typed (remembered on this device). */
export function usePrices(dishes: DishSummary[]) {
  const [overrides, setOverrides] = useLocal<Record<string, number>>("chop-prices", NO_OVERRIDES);
  const locale = useLocale();

  const unit = useCallback(
    (key: string): number => {
      if (overrides[key] !== undefined) return overrides[key];
      if (key.startsWith("side:")) return SIDE_PRICE[key.slice(5) as SideId] ?? 0;
      const slug = key.slice(5);
      const d = dishes.find((x) => x.slug === slug);
      return d ? estimateDishPrice(d.slug, d.section) : 0;
    },
    [overrides, dishes],
  );

  const setUnit = useCallback(
    (key: string, value: number) => setOverrides((prev) => ({ ...prev, [key]: Math.max(0, Math.round(value)) })),
    [setOverrides],
  );

  const isCustom = (key: string) => overrides[key] !== undefined;

  const money = useCallback(
    (n: number) => `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(n))} ${CURRENCY}`,
    [locale],
  );

  return { unit, setUnit, isCustom, money };
}
