"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CloudUpload, UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { deviceItemCounts } from "@/lib/user-content";
import { useAuth } from "./AuthProvider";

/** In "My kitchen": invites signed-out people to sync, and signed-in people to move device items. */
export function KitchenAccountBanner() {
  const t = useTranslations("kitchen");
  const { configured, loading, user } = useAuth();
  const [device, setDevice] = useState({ recipes: 0, photos: 0 });

  useEffect(() => {
    if (user) deviceItemCounts().then(setDevice);
  }, [user]);

  if (!configured || loading) return null;
  if (!user) {
    return (
      <Link href="/account" className="card mx-auto mb-6 flex max-w-2xl items-center gap-3 p-4 text-sm transition-shadow hover:shadow-lift">
        <UserRound className="h-5 w-5 shrink-0 text-tomato" aria-hidden />
        <span className="flex-1 text-muted">{t("signInBanner")}</span>
        <span className="font-medium">{t("signInCta")}</span>
      </Link>
    );
  }
  if (device.recipes + device.photos === 0) return null;
  return (
    <Link href="/account" className="card mx-auto mb-6 flex max-w-2xl items-center gap-3 border-mango/40 p-4 text-sm transition-shadow hover:shadow-lift">
      <CloudUpload className="h-5 w-5 shrink-0 text-mango" aria-hidden />
      <span className="flex-1 text-muted">{t("moveBanner")}</span>
      <span className="font-medium">{t("moveCta")}</span>
    </Link>
  );
}
