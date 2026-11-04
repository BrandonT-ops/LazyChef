"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, Copy, MessageCircle, Share2, ThumbsUp } from "lucide-react";

/**
 * Shares a page. Uses the phone's own share sheet when there is one,
 * otherwise opens a small menu: WhatsApp, Facebook, copy link.
 * `text` can be a function so long texts (a week plan) are only built on click.
 */
export function ShareButton({
  title,
  text,
  label,
  className = "btn-ghost",
}: {
  title: string;
  text: string | (() => string);
  label?: string;
  className?: string;
}) {
  const t = useTranslations("share");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const body = () => (typeof text === "function" ? text() : text);
  const url = () => window.location.href;

  const onClick = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: body(), url: url() });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return; // person closed the sheet
      }
    }
    setOpen((o) => !o);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${body()}\n${url()}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const item = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-tomato/10";

  return (
    <div ref={box} className="relative inline-block">
      <button type="button" onClick={onClick} className={className} aria-expanded={open}>
        <Share2 className="h-4 w-4" aria-hidden />
        {label ?? t("button")}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="card absolute left-1/2 top-full z-30 mt-2 w-52 -translate-x-1/2 p-1.5"
          >
            <a
              className={item}
              href={`https://wa.me/?text=${encodeURIComponent(`${body()}\n${url()}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 text-leaf" aria-hidden />
              WhatsApp
            </a>
            <a
              className={item}
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ThumbsUp className="h-4 w-4 text-hibiscus" aria-hidden />
              Facebook
            </a>
            <button type="button" className={item} onClick={copy}>
              {copied ? <Check className="h-4 w-4 text-leaf" aria-hidden /> : <Copy className="h-4 w-4 text-mango" aria-hidden />}
              {copied ? t("copied") : t("copy")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
