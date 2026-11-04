"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader, ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useAuth } from "../auth/AuthProvider";

interface AdminRow {
  id: string;
  email: string;
  display_name: string | null;
}

/** Who can manage recipes and reviews. People must have an account before they can be made admin. */
export function AdminsPanel() {
  const t = useTranslations("admin.admins");
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminRow[] | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabaseBrowser()!.rpc("admin_list");
    if (error) setMessage({ ok: false, text: error.message });
    setAdmins((data as AdminRow[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setAdmin = async (target: string, make: boolean) => {
    setBusy(true);
    setMessage(null);
    const { error } = await supabaseBrowser()!.rpc("set_admin", { target_email: target, make_admin: make });
    if (error) setMessage({ ok: false, text: error.message });
    else {
      setMessage({ ok: true, text: make ? t("added", { email: target }) : t("removed", { email: target }) });
      setEmail("");
      await load();
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim()) void setAdmin(email.trim(), true);
        }}
        className="card space-y-3 p-5"
      >
        <label htmlFor="ad-email" className="block font-semibold">{t("addTitle")}</label>
        <p className="text-sm text-muted">{t("addHint")}</p>
        <div className="flex gap-2">
          <input id="ad-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-ink" />
          <button type="submit" disabled={busy || !email.trim()} className="btn-primary shrink-0">
            {busy ? <Loader className="h-4 w-4 animate-spin" aria-hidden /> : <UserPlus className="h-4 w-4" aria-hidden />}
            {t("add")}
          </button>
        </div>
        {message && <p className={`text-sm ${message.ok ? "text-leaf" : "text-tomato"}`}>{message.text}</p>}
      </form>

      <div className="card overflow-hidden">
        <p className="border-b border-line px-5 py-3 font-semibold">{t("listTitle")}</p>
        {admins === null ? (
          <div className="h-24 animate-pulse" />
        ) : (
          <ul className="divide-y divide-line">
            {admins.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-tomato" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{a.display_name || a.email}</span>
                  <span className="block truncate text-xs text-muted">{a.email}</span>
                </span>
                {a.id === user?.id ? (
                  <span className="text-xs text-muted">{t("you")}</span>
                ) : (
                  <button type="button" disabled={busy} onClick={() => confirm(t("confirmRemove", { email: a.email })) && setAdmin(a.email, false)} className="btn-ghost h-8 px-3 text-xs">
                    <UserMinus className="h-3.5 w-3.5" aria-hidden />
                    {t("remove")}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
