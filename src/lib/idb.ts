"use client";

import { useEffect, useState } from "react";
import type { RecipeLink, SectionId, Tag } from "@/data/types";

/**
 * On-device storage for things too big for localStorage: the person's own
 * recipes and their "I made it!" photos. Nothing leaves the device.
 * When accounts arrive, these records can be uploaded as they are.
 */

export interface UserRecipe {
  id: string;
  name: string;
  section: SectionId;
  tags: Tag[];
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  video?: string;
  links: RecipeLink[];
  photo?: Blob;
  /** Language it was written in. */
  lang: string;
  createdAt: number;
  updatedAt: number;
}

export interface MadePhoto {
  id: string;
  blob: Blob;
  dishName: string;
  /** Link back: a site dish slug or one of the person's recipe ids. */
  dishSlug?: string;
  recipeId?: string;
  createdAt: number;
}

type StoreName = "recipes" | "photos";
type Row<S extends StoreName> = S extends "recipes" ? UserRecipe : MadePhoto;

let dbPromise: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open("chop", 1);
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains("recipes")) d.createObjectStore("recipes", { keyPath: "id" });
        if (!d.objectStoreNames.contains("photos")) d.createObjectStore("photos", { keyPath: "id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function run<T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return db().then(
    (d) =>
      new Promise<T>((resolve, reject) => {
        const tx = d.transaction(store, mode);
        const req = fn(tx.objectStore(store));
        tx.oncomplete = () => resolve(req.result);
        tx.onerror = () => reject(tx.error);
      }),
  );
}

const changed = new Set<() => void>();
const emit = () => changed.forEach((f) => f());

export const idb = {
  all: <S extends StoreName>(store: S) => run<Row<S>[]>(store, "readonly", (s) => s.getAll() as IDBRequest<Row<S>[]>),
  get: <S extends StoreName>(store: S, id: string) =>
    run<Row<S> | undefined>(store, "readonly", (s) => s.get(id) as IDBRequest<Row<S> | undefined>),
  put: async <S extends StoreName>(store: S, row: Row<S>) => {
    await run(store, "readwrite", (s) => s.put(row));
    emit();
  },
  delete: async (store: StoreName, id: string) => {
    await run(store, "readwrite", (s) => s.delete(id));
    emit();
  },
};

/** All rows of a store, newest first; re-reads whenever anything is saved or deleted. */
export function useIdbAll<S extends StoreName>(store: S): { rows: Row<S>[]; ready: boolean } {
  const [rows, setRows] = useState<Row<S>[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const load = () =>
      idb
        .all(store)
        .then((r) => {
          if (!alive) return;
          setRows([...r].sort((a, b) => b.createdAt - a.createdAt));
          setReady(true);
        })
        .catch(() => setReady(true));
    load();
    changed.add(load);
    return () => {
      alive = false;
      changed.delete(load);
    };
  }, [store]);
  return { rows, ready };
}

/** An object URL for a Blob, revoked when no longer needed. */
export function useBlobUrl(blob?: Blob): string | undefined {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!blob) {
      setUrl(undefined);
      return;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}
