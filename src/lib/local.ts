"use client";

import { useCallback, useSyncExternalStore } from "react";
import { newId } from "./id";

export { newId };

/**
 * Small JSON values in localStorage, shared live between components
 * (favorites, shopping list). Safe when storage is unavailable.
 */
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

const writeListeners = new Set<(key: string) => void>();

function notify(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

/** Called after every local write (used to sync to the account). Returns an unsubscribe function. */
export function onLocalWrite(cb: (key: string) => void): () => void {
  writeListeners.add(cb);
  return () => writeListeners.delete(cb);
}

export function readLocal<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    /* unavailable */
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

/** `quiet` skips the account sync (used when applying data that came from the account). */
export function writeLocal<T>(key: string, value: T, quiet = false) {
  const raw = JSON.stringify(value);
  try {
    localStorage.setItem(key, raw);
  } catch {
    /* unavailable: keep it in memory for this visit */
  }
  cache.set(key, { raw, value });
  notify(key);
  if (!quiet) writeListeners.forEach((l) => l(key));
}

if (typeof window !== "undefined") {
  // Keep other tabs in sync.
  window.addEventListener("storage", (e) => e.key && notify(e.key));
}

export function useLocal<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const subscribe = useCallback(
    (cb: () => void) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key)!.add(cb);
      return () => listeners.get(key)!.delete(cb);
    },
    [key],
  );
  const value = useSyncExternalStore(
    subscribe,
    () => readLocal(key, fallback),
    () => fallback,
  );
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readLocal(key, fallback);
      writeLocal(key, typeof next === "function" ? (next as (p: T) => T)(prev) : next);
    },
    [key, fallback],
  );
  return [value, set];
}

// ---------- favorites ----------

const NO_FAVORITES: string[] = [];

export function useFavorites() {
  const [favs, setFavs] = useLocal<string[]>("chop-favorites", NO_FAVORITES);
  const toggle = useCallback(
    (slug: string) => setFavs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev])),
    [setFavs],
  );
  return { favorites: favs, isFavorite: (slug: string) => favs.includes(slug), toggle };
}

// ---------- shopping list ----------

export interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
  /** Heading the item is listed under (a dish name, "Sides", "Other"). */
  group: string;
  /** Where it came from, so a source can be replaced as a whole: "week", "event", "dish:<slug>", "manual". */
  source: string;
  /** Priced by servings: price key ("dish:<slug>" / "side:<id>") × number of servings. */
  priceKey?: string;
  qty?: number;
  /** Or a price typed for the whole line (FCFA). */
  price?: number;
}

const NO_ITEMS: ShoppingItem[] = [];

export function useShopping() {
  const [items, setItems] = useLocal<ShoppingItem[]>("chop-shopping", NO_ITEMS);
  return {
    items,
    /** Replaces every item from `source` with `fresh` (keeps ticks on identical lines). */
    setPrice: (id: string, price: number | undefined) =>
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, price } : i))),
    replaceSource: (source: string, fresh: Omit<ShoppingItem, "id" | "checked" | "source">[]) =>
      setItems((prev) => {
        const ticked = new Set(prev.filter((i) => i.source === source && i.checked).map((i) => `${i.group}|${i.text}`));
        return [
          ...prev.filter((i) => i.source !== source),
          ...fresh.map((f) => ({ ...f, source, id: newId(), checked: ticked.has(`${f.group}|${f.text}`) })),
        ];
      }),
    add: (text: string, group: string) =>
      setItems((prev) => [...prev, { id: newId(), text, group, checked: false, source: "manual" }]),
    toggle: (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))),
    remove: (id: string) => setItems((prev) => prev.filter((i) => i.id !== id)),
    clearChecked: () => setItems((prev) => prev.filter((i) => !i.checked)),
    clearAll: () => setItems(NO_ITEMS),
  };
}


export interface PantryState {
  /** Pantry ingredient ids (see src/data/pantry.ts). */
  items: string[];
  /** Count oil, salt, sugar, cubes, spices and water as available. */
  basics: boolean;
}
const NO_PANTRY: PantryState = { items: [], basics: true };

/** What the person has at home, for "Cook with what I have" and the dice. */
export function usePantry() {
  const [pantry, setPantry] = useLocal<PantryState>("chop-pantry", NO_PANTRY);
  return {
    pantry,
    toggle: (id: string) =>
      setPantry((p) => ({ ...p, items: p.items.includes(id) ? p.items.filter((x) => x !== id) : [...p.items, id] })),
    add: (ids: string[]) => setPantry((p) => ({ ...p, items: [...new Set([...p.items, ...ids])] })),
    setBasics: (basics: boolean) => setPantry((p) => ({ ...p, basics })),
    clear: () => setPantry((p) => ({ ...p, items: [] })),
  };
}
