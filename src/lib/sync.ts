"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { onLocalWrite, readLocal, writeLocal } from "./local";

/** What syncs to the account, and where each lives on the device. */
const KEYS = {
  favorites: "chop-favorites",
  shopping: "chop-shopping",
  prices: "chop-prices",
  plan: "chop-plan-v3",
  event: "chop-event-v1",
} as const;
type SyncKey = keyof typeof KEYS;
const LOCAL_TO_SYNC = Object.fromEntries(Object.entries(KEYS).map(([k, v]) => [v, k])) as Record<string, SyncKey>;

interface Meta {
  userId: string | null;
  /** When each key was last in sync with the account, per key. */
  at: Partial<Record<SyncKey, number>>;
}
const META_KEY = "chop-sync-meta";

type Row = { key: SyncKey; value: unknown; updated_at: string };

/** First time this device meets this account: combine both sides instead of picking one. */
function merge(key: SyncKey, local: unknown, remote: unknown): unknown {
  if (local == null) return remote;
  if (remote == null) return local;
  if (key === "favorites") return [...new Set([...(local as string[]), ...(remote as string[])])];
  if (key === "shopping") {
    const ids = new Set((local as { id: string }[]).map((i) => i.id));
    return [...(local as { id: string }[]), ...(remote as { id: string }[]).filter((i) => !ids.has(i.id))];
  }
  if (key === "prices") return { ...(remote as object), ...(local as object) };
  return local; // plans: keep what's on this device
}

/**
 * Syncs the kitchen with the signed-in account. Returns a stop function.
 * Local storage stays the working copy, so everything keeps working offline.
 */
export async function startSync(supabase: SupabaseClient, userId: string): Promise<() => void> {
  const meta = readLocal<Meta>(META_KEY, { userId: null, at: {} });
  const firstTime = meta.userId !== userId;
  const { data } = await supabase.from("user_data").select("key, value, updated_at");
  const remote = new Map<SyncKey, Row>(((data ?? []) as Row[]).map((r) => [r.key, r]));
  const at: Meta["at"] = firstTime ? {} : { ...meta.at };

  const push = async (key: SyncKey) => {
    const value = readLocal<unknown>(KEYS[key], null);
    if (value == null) return;
    const now = new Date().toISOString();
    const { error } = await supabase.from("user_data").upsert({ user_id: userId, key, value, updated_at: now });
    if (!error) {
      at[key] = Date.parse(now);
      writeLocal(META_KEY, { userId, at }, true);
    }
  };

  for (const key of Object.keys(KEYS) as SyncKey[]) {
    const local = readLocal<unknown>(KEYS[key], null);
    const row = remote.get(key);
    let next: unknown;
    if (firstTime) next = merge(key, local, row?.value);
    else if (row && Date.parse(row.updated_at) > (at[key] ?? 0)) next = row.value; // changed on another device
    else next = local ?? row?.value;
    if (next == null) continue;
    if (JSON.stringify(next) !== JSON.stringify(local)) writeLocal(KEYS[key], next, true);
    if (!row || JSON.stringify(next) !== JSON.stringify(row.value)) await push(key);
    else at[key] = Date.parse(row.updated_at);
  }
  writeLocal(META_KEY, { userId, at }, true);

  // From now on, send local changes up (batched).
  const timers = new Map<SyncKey, ReturnType<typeof setTimeout>>();
  const stop = onLocalWrite((localKey) => {
    const key = LOCAL_TO_SYNC[localKey];
    if (!key) return;
    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(() => void push(key), 800));
  });

  // Pick up changes made on other devices when coming back to the app.
  const onFocus = async () => {
    const { data: fresh } = await supabase.from("user_data").select("key, value, updated_at");
    for (const r of (fresh ?? []) as Row[]) {
      if (Date.parse(r.updated_at) > (at[r.key] ?? 0)) {
        at[r.key] = Date.parse(r.updated_at);
        writeLocal(KEYS[r.key], r.value, true);
      }
    }
    writeLocal(META_KEY, { userId, at }, true);
  };
  window.addEventListener("focus", onFocus);

  return () => {
    stop();
    timers.forEach((t) => clearTimeout(t));
    window.removeEventListener("focus", onFocus);
  };
}

/** After signing out, the next sign-in on this device merges again instead of overwriting. */
export function forgetSyncedUser() {
  writeLocal(META_KEY, { userId: null, at: {} }, true);
}
