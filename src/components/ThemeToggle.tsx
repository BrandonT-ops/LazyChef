"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

function currentTheme(): "light" | "dark" {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Follows the device setting until the person picks a theme, then remembers it. */
export function ThemeToggle({ label }: { label: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => setTheme(currentTheme()), []);

  const toggle = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("lc-theme", next);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line bg-surface transition-colors hover:border-mango"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme ?? "unset"}
          aria-hidden
          initial={{ y: 14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "dark" ? <Moon className="h-[18px] w-[18px] text-mango" /> : <Sun className="h-[18px] w-[18px] text-mango" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
