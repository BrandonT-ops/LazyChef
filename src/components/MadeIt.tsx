"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Camera, PartyPopper, Share2, Trash2, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/config/site";
import { idb, useBlobUrl, useIdbAll, type MadePhoto } from "@/lib/idb";
import { compressImage } from "@/lib/image";
import { newId } from "@/lib/local";

/** Shares a photo with the phone's share sheet when it supports files. */
export async function sharePhoto(photo: MadePhoto, text: string): Promise<boolean> {
  const file = new File([photo.blob], `${photo.dishName.replace(/[^\w-]+/g, "-")}.jpg`, { type: "image/jpeg" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return true;
    } catch {
      return false;
    }
  }
  // No file sharing (most computers): download the photo instead.
  const a = document.createElement("a");
  a.href = URL.createObjectURL(photo.blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return false;
}

/** "I made it!": take or pick a photo of the dish; it's kept on this device and can be shared. */
export function MadeItButton({ dishName, dishSlug, recipeId }: { dishName: string; dishSlug?: string; recipeId?: string }) {
  const t = useTranslations("made");
  const input = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<MadePhoto | null>(null);
  const [busy, setBusy] = useState(false);
  const url = useBlobUrl(saved?.blob);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const blob = await compressImage(file);
      const photo: MadePhoto = { id: newId(), blob, dishName, dishSlug, recipeId, createdAt: Date.now() };
      await idb.put("photos", photo);
      setSaved(photo);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => input.current?.click()} className="btn-ghost" disabled={busy}>
        <Camera className="h-4 w-4" aria-hidden />
        {busy ? t("saving") : t("button")}
      </button>
      <input ref={input} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />

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
              {url && <img src={url} alt={dishName} className="aspect-square w-full object-cover" />}
              <div className="p-5 text-center">
                <p className="heading flex items-center justify-center gap-2 text-xl">
                  <PartyPopper className="h-5 w-5 text-mango" aria-hidden />
                  {t("savedTitle")}
                </p>
                <p className="mt-1 text-sm text-muted">{t("savedText")}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => sharePhoto(saved, t("shareText", { name: dishName, site: SITE.name }))}
                  >
                    <Share2 className="h-4 w-4" aria-hidden />
                    {t("share")}
                  </button>
                  <Link href="/me?tab=photos" className="btn-ghost">
                    {t("seeAll")}
                  </Link>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSaved(null)}
                aria-label={t("close")}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/90"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Grid of "I made it" photos, optionally only for one dish. */
export function PhotoGrid({ dishSlug, recipeId, compact = false }: { dishSlug?: string; recipeId?: string; compact?: boolean }) {
  const t = useTranslations("made");
  const { rows, ready } = useIdbAll("photos");
  const photos = rows.filter((p) => (!dishSlug || p.dishSlug === dishSlug) && (!recipeId || p.recipeId === recipeId));
  if (!ready) return null;
  if (!photos.length) return compact ? null : <p className="card p-8 text-center text-muted">{t("empty")}</p>;

  return (
    <div>
      {compact && <p className="mb-2 text-sm font-semibold text-muted">{t("yours")}</p>}
      <div className={`grid gap-3 ${compact ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
        {photos.map((p) => (
          <PhotoTile key={p.id} photo={p} compact={compact} />
        ))}
      </div>
    </div>
  );
}

function PhotoTile({ photo, compact }: { photo: MadePhoto; compact: boolean }) {
  const t = useTranslations("made");
  const locale = useLocale();
  const url = useBlobUrl(photo.blob);
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(photo.createdAt);
  const href = photo.dishSlug ? `/dishes/${photo.dishSlug}` : photo.recipeId ? `/me/recipe?id=${photo.recipeId}` : null;

  return (
    <motion.figure layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative overflow-hidden rounded-xl2 bg-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {url && <img src={url} alt={photo.dishName} className="aspect-square w-full object-cover" />}
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
            <button
              type="button"
              onClick={() => sharePhoto(photo, t("shareText", { name: photo.dishName, site: SITE.name }))}
              aria-label={t("share")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => confirm(t("confirmDelete")) && idb.delete("photos", photo.id)}
              aria-label={t("delete")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </span>
        </figcaption>
      )}
    </motion.figure>
  );
}
