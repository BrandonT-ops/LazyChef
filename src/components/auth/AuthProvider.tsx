"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { supabaseConfigured } from "@/lib/supabase/env";
import { forgetSyncedUser, startSync } from "@/lib/sync";

export interface Profile {
  id: string;
  display_name: string | null;
  role: "user" | "admin";
}

interface AuthState {
  configured: boolean;
  /** True until the first session check finishes. */
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  syncing: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  configured: false,
  loading: false,
  user: null,
  profile: null,
  isAdmin: false,
  syncing: false,
  refreshProfile: async () => undefined,
  signOut: async () => undefined,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = supabaseBrowser();
  const [loading, setLoading] = useState(Boolean(supabase));
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((prev) => (prev?.id === session?.user?.id ? prev : (session?.user ?? null)));
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("id, display_name, role").eq("id", user.id).maybeSingle();
    setProfile((data as Profile) ?? null);
  }, [supabase, user]);

  // Load the profile and start syncing the kitchen when someone signs in.
  useEffect(() => {
    void refreshProfile();
    if (!supabase || !user) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    setSyncing(true);
    startSync(supabase, user.id)
      .then((s) => {
        if (cancelled) s();
        else stop = s;
      })
      .catch((e) => console.warn("Sync failed", e))
      .finally(() => setSyncing(false));
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [supabase, user, refreshProfile]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    forgetSyncedUser();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const value = useMemo<AuthState>(
    () => ({
      configured: supabaseConfigured,
      loading,
      user,
      profile,
      isAdmin: profile?.role === "admin",
      syncing,
      refreshProfile,
      signOut,
    }),
    [loading, user, profile, syncing, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
