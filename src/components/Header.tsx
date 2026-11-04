"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { InstallButton } from "./Pwa";
import { SITE } from "@/config/site";
import { BookOpen, CalendarDays, ChefHat, Dices, MapPinned, Menu, Search, X } from "lucide-react";

const NAV = [
  { href: "/browse", key: "browse", icon: BookOpen },
  { href: "/search", key: "search", icon: Search },
  { href: "/random", key: "random", icon: Dices },
  { href: "/planner", key: "planner", icon: CalendarDays },
  { href: "/markets", key: "markets", icon: MapPinned },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <motion.span
            className="grid h-9 w-9 place-items-center rounded-full bg-tomato text-lg text-white shadow-soft"
            whileHover={{ rotate: -12, scale: 1.05 }}
          >
            <ChefHat className="h-5 w-5" aria-hidden />
          </motion.span>
          <span className="heading text-xl">
            {SITE.nameParts[0]}
            <span className="text-tomato">{SITE.nameParts[1]}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(item.href) ? "text-tomato" : "text-muted hover:text-ink"
              }`}
            >
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-tomato/10"
                />
              )}
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <InstallButton />
          <LocaleSwitcher />
          <ThemeToggle label={t("theme")} />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface lg:hidden"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            className="overflow-hidden border-t border-line lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="container-page grid grid-cols-2 gap-2 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`card flex items-center gap-2 px-4 py-3 text-sm font-semibold ${
                    isActive(item.href) ? "border-tomato text-tomato" : ""
                  }`}
                >
                  <item.icon className="h-4 w-4 text-tomato" aria-hidden />
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const other = locale === "en" ? "fr" : "en";

  return (
    <Link
      href={pathname}
      locale={other}
      aria-label={`${t("language")}: ${other.toUpperCase()}`}
      className="grid h-10 min-w-10 place-items-center rounded-full border border-line bg-surface px-3 text-xs font-bold uppercase tracking-wide text-muted transition-colors hover:border-tomato hover:text-tomato"
    >
      {other}
    </Link>
  );
}
