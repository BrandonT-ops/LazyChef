"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { RecipeLink, SectionId, Tag } from "@/data/types";
import { idb, type MadePhoto, type UserRecipe } from "./idb";
import { newId } from "./id";
import { supabaseBrowser } from "./supabase/browser";
import { storageUrl } from "./supabase/env";
import type { MadePhotoRow, ReviewStatus, UserRecipeRow } from "./supabase/rows";

/**
 * People's own recipes and "I made it" photos, wherever they live:
 * on this device (IndexedDB) when signed out, in their account (Supabase) when signed in.
 */

export type Where = "device" | "account";

export interface MyRecipe {
  id: string;
  name: string;
  section: SectionId;
  dishSlug?: string;
  tags: Tag[];
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  serving: string[];
  video?: string;
  links: RecipeLink[];
  lang: string;
  /** A photo on this device, or the photo's web address in the account. */
  photo?: Blob;
  photoUrl?: string;
  status?: ReviewStatus;
  reviewNote?: string;
  createdAt: number;
  updatedAt: number;
  where: Where;
}

export type MyRecipeInput = Omit<MyRecipe, "id" | "createdAt" | "updatedAt" | "where" | "photo" | "photoUrl" | "status" | "reviewNote"> & {
  id?: string;
};

export interface MyPhoto {
  id: string;
  dishName: string;
  dishSlug?: string;
  recipeId?: string;
  blob?: Blob;
  url?: string;
  isPublic?: boolean;
  path?: string;
  createdAt: number;
  where: Where;
}

// ---------- change notifications ----------

const listeners = new Set<() => void>();
const changed = () => listeners.forEach((l) => l());

// ---------- mapping ----------

const fromDevice = (r: UserRecipe): MyRecipe => ({
  id: r.id,
  name: r.name,
  section: r.section,
  dishSlug: r.dishSlug,
  tags: r.tags,
  prepMinutes: r.prepMinutes,
  cookMinutes: r.cookMinutes,
  servings: r.servings,
  ingredients: r.ingredients,
  steps: r.steps,
  serving: r.serving ?? [],
  video: r.video,
  links: r.links,
  lang: r.lang,
  photo: r.photo,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
  where: "device",
});

const fromRow = (r: UserRecipeRow): MyRecipe => ({
  id: r.id,
  name: r.name,
  section: r.section,
  dishSlug: r.dish_slug ?? undefined,
  tags: r.tags ?? [],
  prepMinutes: r.prep_minutes,
  cookMinutes: r.cook_minutes,
  servings: r.servings,
  ingredients: r.ingredients ?? [],
  steps: r.steps ?? [],
  serving: r.serving ?? [],
  video: r.video ?? undefined,
  links: r.links ?? [],
  lang: r.lang,
  photoUrl: r.images?.[0],
  status: r.status,
  reviewNote: r.review_note ?? undefined,
  createdAt: Date.parse(r.created_at),
  updatedAt: Date.parse(r.updated_at),
  where: "account",
});

const photoFromRow = (p: MadePhotoRow): MyPhoto => ({
  id: p.id,
  dishName: p.dish_name,
  dishSlug: p.dish_slug ?? undefined,
  recipeId: p.user_recipe_id ?? undefined,
  url: storageUrl("photos", p.path),
  path: p.path,
  isPublic: p.is_public,
  createdAt: Date.parse(p.created_at),
  where: "account",
});

function client(): SupabaseClient {
  const c = supabaseBrowser();
  if (!c) throw new Error("Accounts aren't set up on this site yet.");
  return c;
}

async function uploadRecipeFile(userId: string, recipeId: string, file: Blob, ext: string): Promise<string> {
  const path = `users/${userId}/${recipeId}/${Date.now().toString(36)}.${ext}`;
  const { error } = await client().storage.from("recipe-media").upload(path, file, {
    contentType: file.type || (ext === "jpg" ? "image/jpeg" : undefined),
    upsert: false,
  });
  if (error) throw error;
  return storageUrl("recipe-media", path);
}

// ---------- recipes ----------

export const myRecipes = {
  async list(userId: string | null): Promise<MyRecipe[]> {
    if (!userId) return (await idb.all("recipes")).map(fromDevice).sort((a, b) => b.createdAt - a.createdAt);
    const { data, error } = await client()
      .from("user_recipes")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as UserRecipeRow[]).map(fromRow);
  },

  async get(userId: string | null, id: string): Promise<MyRecipe | null> {
    if (!userId) {
      const r = await idb.get("recipes", id);
      return r ? fromDevice(r) : null;
    }
    const { data, error } = await client().from("user_recipes").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as UserRecipeRow) : null;
  },

  /** Creates or updates a recipe. `photo`: a new photo, the current photo's address to keep it, or nothing. */
  async save(userId: string | null, input: MyRecipeInput, photo?: Blob | string, video?: Blob): Promise<string> {
    const now = Date.now();
    if (!userId) {
      const prev = input.id ? await idb.get("recipes", input.id) : undefined;
      const row: UserRecipe = {
        ...input,
        id: input.id ?? newId(),
        photo: photo instanceof Blob ? photo : photo ? prev?.photo : undefined,
        createdAt: prev?.createdAt ?? now,
        updatedAt: now,
      };
      await idb.put("recipes", row);
      changed();
      return row.id;
    }
    const id = input.id ?? newId();
    const photoUrl = photo instanceof Blob ? await uploadRecipeFile(userId, id, photo, "jpg") : photo;
    const videoUrl = video ? await uploadRecipeFile(userId, id, video, (video.type.split("/")[1] ?? "mp4").replace("quicktime", "mov")) : input.video;
    const row = {
      id,
      owner_id: userId,
      dish_slug: input.dishSlug || null,
      name: input.name,
      section: input.section,
      tags: input.tags,
      prep_minutes: input.prepMinutes,
      cook_minutes: input.cookMinutes,
      servings: input.servings,
      ingredients: input.ingredients,
      steps: input.steps,
      serving: input.serving,
      lang: input.lang === "fr" ? "fr" : "en",
      images: photoUrl ? [photoUrl] : [],
      video: videoUrl || null,
      links: input.links,
    };
    const { error } = await client().from("user_recipes").upsert(row);
    if (error) throw error;
    changed();
    return id;
  },

  async remove(userId: string | null, id: string): Promise<void> {
    if (!userId) await idb.delete("recipes", id);
    else {
      const { error } = await client().from("user_recipes").delete().eq("id", id);
      if (error) throw error;
    }
    changed();
  },

  /** Send a recipe to the admins for review, or take it back. */
  async setStatus(id: string, status: "private" | "submitted"): Promise<void> {
    const { error } = await client().from("user_recipes").update({ status }).eq("id", id);
    if (error) throw error;
    changed();
  },
};

// ---------- photos ----------

export const myPhotos = {
  async list(userId: string | null): Promise<MyPhoto[]> {
    if (!userId) {
      return (await idb.all("photos"))
        .map<MyPhoto>((p) => ({ ...p, where: "device" }))
        .sort((a, b) => b.createdAt - a.createdAt);
    }
    const { data, error } = await client()
      .from("made_photos")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as MadePhotoRow[]).map(photoFromRow);
  },

  async add(
    userId: string | null,
    blob: Blob,
    meta: { dishName: string; dishSlug?: string; recipeId?: string; isPublic?: boolean },
  ): Promise<MyPhoto> {
    const id = newId();
    if (!userId) {
      const row: MadePhoto = { id, blob, dishName: meta.dishName, dishSlug: meta.dishSlug, recipeId: meta.recipeId, createdAt: Date.now() };
      await idb.put("photos", row);
      changed();
      return { ...row, where: "device" };
    }
    const path = `${userId}/${id}.jpg`;
    const sb = client();
    const up = await sb.storage.from("photos").upload(path, blob, { contentType: "image/jpeg", upsert: false });
    if (up.error) throw up.error;
    const { data, error } = await sb
      .from("made_photos")
      .insert({
        id,
        owner_id: userId,
        dish_name: meta.dishName,
        dish_slug: meta.dishSlug ?? null,
        user_recipe_id: meta.recipeId ?? null,
        path,
        is_public: meta.isPublic ?? true,
      })
      .select()
      .single();
    if (error) {
      await sb.storage.from("photos").remove([path]);
      throw error;
    }
    changed();
    return { ...photoFromRow(data as MadePhotoRow), blob };
  },

  async remove(userId: string | null, photo: MyPhoto): Promise<void> {
    if (!userId || photo.where === "device") await idb.delete("photos", photo.id);
    else {
      const sb = client();
      const { error } = await sb.from("made_photos").delete().eq("id", photo.id);
      if (error) throw error;
      if (photo.path) await sb.storage.from("photos").remove([photo.path]);
    }
    changed();
  },

  async setPublic(id: string, isPublic: boolean): Promise<void> {
    const { error } = await client().from("made_photos").update({ is_public: isPublic }).eq("id", id);
    if (error) throw error;
    changed();
  },
};

// ---------- moving device items into the account ----------

export async function deviceItemCounts(): Promise<{ recipes: number; photos: number }> {
  try {
    const [r, p] = await Promise.all([idb.all("recipes"), idb.all("photos")]);
    return { recipes: r.length, photos: p.length };
  } catch {
    return { recipes: 0, photos: 0 };
  }
}

/** Uploads everything saved on this device to the account, then removes the device copies. */
export async function moveDeviceItemsToAccount(userId: string): Promise<{ recipes: number; photos: number }> {
  const recipes = await idb.all("recipes");
  const photos = await idb.all("photos");
  const newIds = new Map<string, string>();
  for (const r of recipes) {
    const id = await myRecipes.save(userId, { ...fromDevice(r), id: undefined }, r.photo);
    newIds.set(r.id, id);
    await idb.delete("recipes", r.id);
  }
  for (const p of photos) {
    // Old photos stay private until the person chooses to share them.
    await myPhotos.add(userId, p.blob, {
      dishName: p.dishName,
      dishSlug: p.dishSlug,
      recipeId: p.recipeId ? newIds.get(p.recipeId) : undefined,
      isPublic: false,
    });
    await idb.delete("photos", p.id);
  }
  changed();
  return { recipes: recipes.length, photos: photos.length };
}

// ---------- hooks ----------

function useLoad<T>(load: () => Promise<T>, deps: unknown[], initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const run = () =>
      load()
        .then((v) => {
          if (!alive) return;
          setValue(v);
          setError(null);
          setReady(true);
        })
        .catch((e: Error) => {
          if (!alive) return;
          setError(e.message);
          setReady(true);
        });
    run();
    listeners.add(run);
    return () => {
      alive = false;
      listeners.delete(run);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { value, ready, error };
}

const NO_RECIPES: MyRecipe[] = [];
const NO_PHOTOS: MyPhoto[] = [];

export function useMyRecipes(userId: string | null, authLoading: boolean) {
  const { value, ready, error } = useLoad(
    () => (authLoading ? Promise.resolve(NO_RECIPES) : myRecipes.list(userId)),
    [userId, authLoading],
    NO_RECIPES,
  );
  return { rows: value, ready: ready && !authLoading, error };
}

export function useMyPhotos(userId: string | null, authLoading: boolean) {
  const { value, ready, error } = useLoad(
    () => (authLoading ? Promise.resolve(NO_PHOTOS) : myPhotos.list(userId)),
    [userId, authLoading],
    NO_PHOTOS,
  );
  return { rows: value, ready: ready && !authLoading, error };
}

export function notifyUserContentChanged() {
  changed();
}
