"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { CircleCheck, CloudUpload, KeyRound, Loader, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { deviceItemCounts, moveDeviceItemsToAccount } from "@/lib/user-content";
import { useAuth } from "./AuthProvider";

const field = "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-ink";

type Mode = "link" | "password" | "signup" | "forgot";

export function AccountPanel({ resetMode, linkError }: { resetMode: boolean; linkError: boolean }) {
  const t = useTranslations("account");
  const { configured, loading, user } = useAuth();

  if (!configured) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <UserRound className="mx-auto h-8 w-8 text-muted" aria-hidden />
        <h1 className="heading mt-4 text-2xl">{t("title")}</h1>
        <p className="mt-2 text-muted">{t("notConfigured")}</p>
      </div>
    );
  }
  if (loading) return <div className="card mx-auto h-80 max-w-md animate-pulse" />;
  if (user && resetMode) return <NewPassword />;
  if (user) return <Profile />;
  return <SignIn linkError={linkError} />;
}

function SignIn({ linkError }: { linkError: boolean }) {
  const t = useTranslations("account");
  const locale = useLocale();
  const supabase = supabaseBrowser()!;
  const [mode, setMode] = useState<Mode>("link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(linkError ? { ok: false, text: t("linkExpired") } : null);

  const callback = (next: string) => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "link") {
        const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: callback(`/${locale}/account`) } });
        if (error) throw error;
        setMessage({ ok: true, text: t("checkEmail") });
      } else if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callback(`/${locale}/account`), data: { display_name: name.trim() || undefined } },
        });
        if (error) throw error;
        if (!data.session) setMessage({ ok: true, text: t("confirmEmail") });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: callback(`/${locale}/account?reset=1`) });
        if (error) throw error;
        setMessage({ ok: true, text: t("resetSent") });
      }
    } catch (err) {
      setMessage({ ok: false, text: friendly((err as Error).message, t) });
    } finally {
      setBusy(false);
    }
  };

  const tabs: { id: Mode; label: string }[] = [
    { id: "link", label: t("tabs.link") },
    { id: "password", label: t("tabs.password") },
    { id: "signup", label: t("tabs.signup") },
  ];

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <h1 className="heading text-3xl">{t("signInTitle")}</h1>
        <p className="mt-2 text-muted">{t("signInText")}</p>
      </div>
      <div className="card mt-8 p-6">
        {mode !== "forgot" && (
          <div className="mb-6 flex rounded-lg border border-line p-1" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={mode === tab.id}
                onClick={() => {
                  setMode(tab.id);
                  setMessage(null);
                }}
                className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors ${mode === tab.id ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          {mode === "forgot" && <p className="text-sm text-muted">{t("forgotText")}</p>}
          {mode === "signup" && (
            <div>
              <label htmlFor="a-name" className="mb-1.5 block text-sm font-medium">{t("name")}</label>
              <input id="a-name" value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="nickname" maxLength={80} />
            </div>
          )}
          <div>
            <label htmlFor="a-email" className="mb-1.5 block text-sm font-medium">{t("email")}</label>
            <input id="a-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
          </div>
          {(mode === "password" || mode === "signup") && (
            <div>
              <label htmlFor="a-pass" className="mb-1.5 block text-sm font-medium">{t("password")}</label>
              <input
                id="a-pass"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              {mode === "signup" && <p className="mt-1 text-xs text-muted">{t("passwordHint")}</p>}
            </div>
          )}
          <button type="submit" disabled={busy} className="btn-primary h-11 w-full">
            {busy ? <Loader className="h-4 w-4 animate-spin" aria-hidden /> : mode === "link" ? <Mail className="h-4 w-4" aria-hidden /> : <KeyRound className="h-4 w-4" aria-hidden />}
            {mode === "link" ? t("sendLink") : mode === "password" ? t("signIn") : mode === "signup" ? t("createAccount") : t("sendReset")}
          </button>
          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg px-3 py-2 text-sm ${message.ok ? "bg-leaf/10 text-leaf" : "bg-tomato/10 text-tomato"}`}
                role="status"
              >
                {message.text}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="text-center text-sm">
            {mode === "password" && (
              <button type="button" onClick={() => setMode("forgot")} className="text-muted underline hover:text-ink">
                {t("forgot")}
              </button>
            )}
            {mode === "forgot" && (
              <button type="button" onClick={() => setMode("password")} className="text-muted underline hover:text-ink">
                {t("backToSignIn")}
              </button>
            )}
          </p>
        </form>
      </div>
      <p className="mt-6 text-center text-xs text-muted">{t("why")}</p>
    </div>
  );
}

function friendly(msg: string, t: ReturnType<typeof useTranslations>) {
  if (/invalid login credentials/i.test(msg)) return t("errors.credentials");
  if (/already registered/i.test(msg)) return t("errors.exists");
  if (/rate limit|too many/i.test(msg)) return t("errors.rate");
  if (/email not confirmed/i.test(msg)) return t("errors.unconfirmed");
  return msg;
}

function NewPassword() {
  const t = useTranslations("account");
  const supabase = supabaseBrowser()!;
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="card mx-auto max-w-md space-y-4 p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({ password });
        if (error) setError(error.message);
        else setDone(true);
      }}
    >
      <h1 className="heading text-2xl">{t("newPassword")}</h1>
      <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={field} autoComplete="new-password" aria-label={t("password")} />
      <button type="submit" className="btn-primary w-full">{t("savePassword")}</button>
      {done && (
        <p className="text-sm text-leaf">
          {t("passwordSaved")}{" "}
          <Link href="/account" className="underline">{t("continue")}</Link>
        </p>
      )}
      {error && <p className="text-sm text-tomato">{error}</p>}
    </form>
  );
}

function Profile() {
  const t = useTranslations("account");
  const { user, profile, isAdmin, syncing, refreshProfile, signOut } = useAuth();
  const supabase = supabaseBrowser()!;
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState(false);
  const [device, setDevice] = useState<{ recipes: number; photos: number }>({ recipes: 0, photos: 0 });
  const [moving, setMoving] = useState(false);
  const [moved, setMoved] = useState<{ recipes: number; photos: number } | null>(null);

  useEffect(() => setName(profile?.display_name ?? ""), [profile]);
  useEffect(() => {
    deviceItemCounts().then(setDevice);
  }, [moved]);

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("profiles").update({ display_name: name.trim() || null }).eq("id", user!.id);
    await refreshProfile();
    setSavedName(true);
    setTimeout(() => setSavedName(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-tomato text-xl font-semibold text-white">
            {(profile?.display_name || user!.email || "?").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="heading text-2xl">{profile?.display_name || t("title")}</h1>
            <p className="text-sm text-muted">{user!.email}</p>
          </div>
        </div>
        <button type="button" onClick={signOut} className="btn-ghost">
          <LogOut className="h-4 w-4" aria-hidden />
          {t("signOut")}
        </button>
      </div>

      <div className="card flex items-center gap-3 p-4 text-sm">
        {syncing ? <Loader className="h-4 w-4 animate-spin text-muted" aria-hidden /> : <CircleCheck className="h-4 w-4 text-leaf" aria-hidden />}
        <span className="text-muted">{syncing ? t("syncing") : t("synced")}</span>
        <Link href="/me" className="ml-auto font-medium hover:underline">
          {t("openKitchen")}
        </Link>
      </div>

      {(device.recipes > 0 || device.photos > 0) && (
        <div className="card flex flex-col gap-3 border-mango/40 p-5 sm:flex-row sm:items-center">
          <CloudUpload className="h-6 w-6 shrink-0 text-mango" aria-hidden />
          <p className="min-w-0 flex-1 text-sm">{t("moveText", { recipes: device.recipes, photos: device.photos })}</p>
          <button
            type="button"
            disabled={moving}
            onClick={async () => {
              setMoving(true);
              try {
                setMoved(await moveDeviceItemsToAccount(user!.id));
              } finally {
                setMoving(false);
              }
            }}
            className="btn-primary shrink-0"
          >
            {moving && <Loader className="h-4 w-4 animate-spin" aria-hidden />}
            {t("moveButton")}
          </button>
        </div>
      )}
      {moved && <p className="text-sm text-leaf">{t("moved", { recipes: moved.recipes, photos: moved.photos })}</p>}

      <form onSubmit={saveName} className="card space-y-3 p-5">
        <label htmlFor="p-name" className="block text-sm font-medium">{t("displayName")}</label>
        <p className="text-xs text-muted">{t("displayNameHint")}</p>
        <div className="flex gap-2">
          <input id="p-name" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className={field} />
          <button type="submit" className="btn-ghost h-11 shrink-0">
            {savedName ? <CircleCheck className="h-4 w-4 text-leaf" aria-hidden /> : null}
            {t("save")}
          </button>
        </div>
      </form>

      {isAdmin && (
        <Link href="/admin" className="card flex items-center gap-3 p-5 transition-shadow hover:shadow-lift">
          <ShieldCheck className="h-5 w-5 text-tomato" aria-hidden />
          <span className="flex-1">
            <span className="block font-semibold">{t("adminTitle")}</span>
            <span className="block text-sm text-muted">{t("adminText")}</span>
          </span>
        </Link>
      )}
    </div>
  );
}
