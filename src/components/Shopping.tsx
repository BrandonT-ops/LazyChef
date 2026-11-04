"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, ListPlus, MapPinned, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/config/site";
import { useShopping, type ShoppingItem } from "@/lib/local";
import { usePrices } from "@/lib/prices";
import type { DishSummary } from "@/data/types";
import type { PlaceKind } from "@/lib/places";
import { PriceField } from "./PriceField";
import { ShareButton } from "./ShareButton";

/** Adds one dish's ingredients (or a reminder line when there's no recipe yet) to the shopping list. */
export function AddToShoppingButton({ source, group, items }: { source: string; group: string; items: string[] }) {
  const t = useTranslations("shopping");
  const { replaceSource } = useShopping();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost"
      onClick={() => {
        replaceSource(source, items.map((text) => ({ text, group })));
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }}
    >
      {done ? <Check className="h-4 w-4 text-leaf" aria-hidden /> : <ListPlus className="h-4 w-4" aria-hidden />}
      {done ? t("added") : t("add")}
    </button>
  );
}

const FISH = ["poisson", "fish", "crevette", "sardine", "seafood", "maquereau"];
const MEAT = ["poulet", "chicken", "boeuf", "beef", "porc", "pork", "chevre", "goat", "viande", "meat", "pilon", "gesier", "tripes", "escargot", "kondre", "saucisse"];
const BAKERY = ["pain", "bread", "gateau", "cake", "biscuit", "croissant", "toast"];

/** Which kinds of shop sell an item, from its name. */
export function shopKinds(text: string): PlaceKind[] {
  const s = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (FISH.some((w) => s.includes(w))) return ["fish", "market"];
  if (MEAT.some((w) => s.includes(w))) return ["butcher", "market"];
  if (BAKERY.some((w) => s.includes(w))) return ["bakery", "supermarket"];
  return ["market", "produce", "grocery", "supermarket"];
}

/** Line cost: priced servings, or a price typed for the whole line. */
export function useLineCost(dishes: DishSummary[]) {
  const prices = usePrices(dishes);
  const cost = (i: ShoppingItem): number | undefined =>
    i.price !== undefined ? i.price : i.priceKey ? prices.unit(i.priceKey) * (i.qty ?? 1) : undefined;
  return { ...prices, cost };
}

export function ShoppingList({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations("shopping");
  const { items, add, toggle, remove, clearChecked, clearAll, setPrice } = useShopping();
  const { cost, money, unit, setUnit, isCustom } = useLineCost(dishes);
  const [text, setText] = useState("");

  const groups = useMemo(() => {
    const map = new Map<string, ShoppingItem[]>();
    for (const i of items) map.set(i.group, [...(map.get(i.group) ?? []), i]);
    return [...map.entries()];
  }, [items]);

  const left = items.filter((i) => !i.checked).length;
  const total = items.reduce((s, i) => s + (cost(i) ?? 0), 0);
  const toBuy = items.filter((i) => !i.checked).reduce((s, i) => s + (cost(i) ?? 0), 0);
  const unpriced = items.filter((i) => cost(i) === undefined).length;
  const kinds = [...new Set(items.filter((i) => !i.checked).flatMap((i) => shopKinds(`${i.text} ${i.priceKey ?? ""}`)))];
  const asText = () =>
    `${t("shareTitle", { site: SITE.name })}\n\n${groups
      .map(([g, list]) => `${g}\n${list.filter((i) => !i.checked).map((i) => `- ${i.text}${i.qty ? ` x${i.qty}` : ""}`).join("\n")}`)
      .join("\n\n")}\n\n${t("toBuy")}: ~${money(toBuy)}`;

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) add(text.trim(), t("other"));
          setText("");
        }}
        className="flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          className="flex-1 rounded-full border border-line bg-surface px-5 py-3 outline-none focus:border-tomato"
        />
        <button type="submit" className="btn-primary" aria-label={t("addItem")}>
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </form>

      {items.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-muted">
          <ShoppingBasket className="mx-auto mb-3 h-10 w-10 text-mango" aria-hidden />
          {t("empty")}
        </div>
      ) : (
        <>
          <div className="card mt-5 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("toBuy")}</p>
              <p className="heading text-2xl text-tomato">~{money(toBuy)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("total")}</p>
              <p className="heading text-2xl">~{money(total)}</p>
            </div>
            <p className="col-span-2 self-center text-xs text-muted sm:col-span-1">
              {unpriced > 0 ? t("unpriced", { count: unpriced }) : t("estimateNote")}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <p className="mr-auto text-sm font-semibold text-tomato">{t("left", { count: left })}</p>
            <ShareButton title={t("shareTitle", { site: SITE.name })} text={asText} label={t("share")} />
            <Link href={`/markets?kinds=${kinds.join(",")}`} className="btn-ghost">
              <MapPinned className="h-4 w-4" aria-hidden />
              {t("findMarket")}
            </Link>
          </div>
          <div className="mt-5 space-y-5">
            {groups.map(([group, list]) => (
              <section key={group} className="card p-4">
                <h3 className="heading mb-2 px-2 text-base">{group}</h3>
                <ul>
                  <AnimatePresence initial={false}>
                    {list.map((i) => (
                      <motion.li
                        key={i.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2"
                      >
                        <button
                          type="button"
                          onClick={() => toggle(i.id)}
                          aria-pressed={i.checked}
                          className="flex flex-1 items-start gap-3 rounded-lg px-2 py-2 text-left hover:bg-mango/10"
                        >
                          <span
                            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 text-white ${
                              i.checked ? "border-leaf bg-leaf" : "border-line"
                            }`}
                          >
                            {i.checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </span>
                          <span className={i.checked ? "text-muted line-through" : ""}>
                            {i.text}
                            {i.qty ? <span className="text-muted"> × {i.qty}</span> : null}
                          </span>
                        </button>
                        <span className="shrink-0 text-right text-xs text-muted">
                          {i.priceKey && i.price === undefined ? (
                            <>
                              <span className="block font-semibold text-ink">{money(cost(i) ?? 0)}</span>
                              <PriceField value={unit(i.priceKey)} custom={isCustom(i.priceKey)} onChange={(v) => setUnit(i.priceKey!, v)} suffix={t("each")} />
                            </>
                          ) : (
                            <PriceField value={i.price} custom onChange={(v) => setPrice(i.id, v)} placeholder={t("addPrice")} />
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(i.id)}
                          aria-label={t("remove")}
                          className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-tomato"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </section>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={clearChecked} className="btn-ghost text-sm">
              {t("clearChecked")}
            </button>
            <button type="button" onClick={() => confirm(t("confirmClear")) && clearAll()} className="btn-ghost text-sm">
              {t("clearAll")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
