"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Download, Share, SquarePlus, X } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Registers the service worker (production only). */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}

/**
 * "Install app" button. Android / desktop Chrome get the real install prompt;
 * iPhone Safari has none, so it shows the two steps instead. Hidden once installed.
 */
export function InstallButton() {
  const t = useTranslations("pwa");
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(true);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!prompt && !ios)) return null;

  const onClick = async () => {
    if (prompt) {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setPrompt(null);
    } else {
      setHelp((h) => !h);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-tomato px-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
        aria-label={t("install")}
      >
        <Download className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">{t("install")}</span>
      </button>
      <AnimatePresence>
        {help && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="card absolute right-0 top-full z-50 mt-2 w-64 p-4 text-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">{t("iosTitle")}</p>
              <button type="button" onClick={() => setHelp(false)} aria-label={t("close")}>
                <X className="h-4 w-4 text-muted" />
              </button>
            </div>
            <ol className="space-y-2 text-muted">
              <li className="flex items-center gap-2">
                <Share className="h-4 w-4 shrink-0 text-tomato" aria-hidden />
                {t("iosStep1")}
              </li>
              <li className="flex items-center gap-2">
                <SquarePlus className="h-4 w-4 shrink-0 text-tomato" aria-hidden />
                {t("iosStep2")}
              </li>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
