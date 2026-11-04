"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Camera, Eye, EyeOff, Globe, PartyPopper, Share2, Smartphone, Trash2, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/config/site";
import { useBlobUrl } from "@/lib/idb";
import { compressImage } from "@/lib/image";
import { myPhotos, useMyPhotos, type MyPhoto } from "@/lib/user-content";
import { useAuth } from "./auth/AuthProvider";

/** Shares a photo with the phone's share sheet when it supports files, otherwise downloads it. */
export async function sharePhoto(photo: MyPhoto, text: string): Promise<boolean> {
  const blob = photo.blob ?? (photo.url ? await (await fetch(photo.url)).blob() : null);
  if (!blob) return false;
  const file = new File([blob], `${photo.dishName.replace(/[^\w-]+/g, "-")}.jpg`, { type: "image/jpeg" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return true;
    } catch {
      return false;
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return false;
}

/**
 * "I made it!": take or pick a photo of the dish. Signed in, it's saved to the account and
 * shown on the dish page (it can be made private). Signed out, it stays on this device.
 */
export function MadeItButton({ dishName, dishSlug, recipeId }: { dishName: string; dishSlug?: string; recipeId?: string }) {
  const t = useTranslations("made");
  const { user } = useAuth();
  const input = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<MyPhoto | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = useBlobUrl(saved?.blob);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await compressImage(file);
      setSaved(await myPhotos.add(user?.id ?? null, blob, { dishName, dishSlug, recipeId }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const togglePublic = async () => {
    if (!saved || saved.where !== "account") return;
    const next = !saved.isPublic;
    await myPhotos.setPublic(saved.id, next);
    setSaved({ ...saved, isPublic: next });
  };

  return (
    <>
      <button type="button" onClick={() => input.current?.click()} className="btn-ghost" disabled={busy}>
        <Camera className="h-4 w-4" aria-hidden />
        {busy ? t("saving") : t("button")}
      </button>
      <input ref={input} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
      {error && <p className="w-full text-sm text-tomato">{error}</p>}

      <AnimatePresence>
        {saved && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSaved(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("savedTitle")}
              className="card relative w-full max-w-sm overflow-hidden"
              initial={{ y: 30, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {(url || saved.url) && <img src={url ?? saved.url} alt={dishName} className="aspect-square w-full object-cover" />}
              <div className="p-5 text-center">
                <p className="heading flex items-center justify-center gap-2 text-xl">
                  <PartyPopper className="h-5 w-5 text-mango" aria-hidden />
                  {t("savedTitle")}
                </p>
                {saved.where === "account" ? (
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted">
                    {saved.isPublic ? <Globe className="h-4 w-4 text-leaf" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
                    {saved.isPublic ? t("sharedPublic") : t("keptPrivate")}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted">
                    {t("savedText")}{" "}
                    <Link href="/account" className="font-medium text-ink underline">
                      {t("signInToShare")}
                    </Link>
                  </p>
                )}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button type="button" className="btn-primary" onClick={() => sharePhoto(saved, t("shareText", { name: dishName, site: SITE.name }))}>
                    <Share2 className="h-4 w-4" aria-hidden />
                    {t("share")}
                  </button>
                  {saved.where === "account" && (
                    <button type="button" className="btn-ghost" onClick={togglePublic}>
                      {saved.isPublic ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                      {saved.isPublic ? t("makePrivate") : t("makePublic")}
                    </button>
                  )}
                  <Link href="/me?tab=photos" className="btn-ghost">
                    {t("seeAll")}
                  </Link>
                </div>
              </div>
              <button type="button" onClick={() => setSaved(null)} aria-label={t("close")} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/90">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Grid of the person's own "I made it" photos, optionally only for one dish or recipe. */
export function PhotoGrid({ dishSlug, recipeId, compact = false }: { dishSlug?: string; recipeId?: string; compact?: boolean }) {
  const t = useTranslations("made");
  const { user, loading } = useAuth();
  const { rows, ready } = useMyPhotos(user?.id ?? null, loading);
  const photos = rows.filter((p) => (!dishSlug || p.dishSlug === dishSlug) && (!recipeId || p.recipeId === recipeId));
  if (!ready) return null;
  if (!photos.length) return compact ? null : <p className="card p-8 text-center text-muted">{t("empty")}</p>;

  return (
    <div>
      {compact && <p className="mb-2 text-sm font-semibold text-muted">{t("yours")}</p>}
      <div className={`grid gap-3 ${compact ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
        {photos.map((p) => (
          <PhotoTile key={p.id} photo={p} compact={compact} userId={user?.id ?? null} />
        ))}
      </div>
    </div>
  );
}

function PhotoTile({ photo, compact, userId }: { photo: MyPhoto; compact: boolean; userId: string | null }) {
  const t = useTranslations("made");
  const locale = useLocale();
  const blobUrl = useBlobUrl(photo.blob);
  const src = photo.url ?? blobUrl;
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(photo.createdAt);
  const href = photo.dishSlug ? `/dishes/${photo.dishSlug}` : photo.recipeId ? `/me/recipe?id=${photo.recipeId}` : null;

  return (
    <motion.figure layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative overflow-hidden rounded-xl2 bg-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt={photo.dishName} className="aspect-square w-full object-cover" />}
      {!compact && (
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur">
          {photo.where === "device" ? <Smartphone className="h-3 w-3" aria-hidden /> : photo.isPublic ? <Globe className="h-3 w-3" aria-hidden /> : <EyeOff className="h-3 w-3" aria-hidden />}
          {photo.where === "device" ? t("onDevice") : photo.isPublic ? t("public") : t("private")}
        </span>
      )}
      {!compact && (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
          <span className="min-w-0">
            {href ? (
              <Link href={href} className="block truncate text-sm font-semibold hover:underline">
                {photo.dishName}
              </Link>
            ) : (
              <span className="block truncate text-sm font-semibold">{photo.dishName}</span>
            )}
            <span className="text-xs opacity-80">{date}</span>
          </span>
          <span className="flex shrink-0 gap-1">
            {photo.where === "account" && (
              <TileButton label={photo.isPublic ? t("makePrivate") : t("makePublic")} onClick={() => myPhotos.setPublic(photo.id, !photo.isPublic)}>
                {photo.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </TileButton>
            )}
            <TileButton label={t("share")} onClick={() => sharePhoto(photo, t("shareText", { name: photo.dishName, site: SITE.name }))}>
              <Share2 className="h-4 w-4" />
            </TileButton>
            <TileButton label={t("delete")} onClick={() => confirm(t("confirmDelete")) && myPhotos.remove(userId, photo)}>
              <Trash2 className="h-4 w-4" />
            </TileButton>
          </span>
        </figcaption>
      )}
    </motion.figure>
  );
}

function TileButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="grid h-8 w-8 place-items-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30">
      {children}
    </button>
  );
}
