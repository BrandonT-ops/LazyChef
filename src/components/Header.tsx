"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { BookOpen, CalendarDays, ChefHat, Dices, Heart, MapPinned, Menu, PartyPopper, Refrigerator, Search, UserRound, Users, X } from "lucide-react";
import { useAuth } from "./auth/AuthProvider";
import { Link, usePathname } from "@/i18n/navigation";
import { SITE } from "@/config/site";
import { ThemeToggle } from "./ThemeToggle";
import { InstallButton } from "./Pwa";

const MAIN = [
  { href: "/browse", key: "browse", icon: BookOpen },
  { href: "/planner", key: "planner", icon: CalendarDays },
  { href: "/events", key: "events", icon: PartyPopper },
  { href: "/markets", key: "markets", icon: MapPinned },
  { href: "/community", key: "community", icon: Users },
] as const;

const TOOLS = [
  { href: "/search", key: "search", icon: Search },
  { href: "/random", key: "random", icon: Dices },
  { href: "/pantry", key: "pantry", icon: Refrigerator },
  { href: "/me", key: "kitchen", icon: Heart },
] as const;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-tomato text-white">
        <ChefHat className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        {SITE.nameParts[0]}
        <span className="text-tomato">{SITE.nameParts[1]}</span>
      </span>
    </span>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-bg/80 backdrop-blur-md transition-colors ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" onClick={() => setOpen(false)} aria-label={SITE.name}>
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
          {MAIN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t(item.key)}
              {isActive(item.href) && (
                <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-tomato" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {TOOLS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={t(item.key)}
              title={t(item.key)}
              className={`hidden h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-subtle sm:grid ${
                isActive(item.href) ? "text-tomato" : "text-muted hover:text-ink"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" aria-hidden />
            </Link>
          ))}
          <span aria-hidden className="mx-1 hidden h-5 w-px bg-line sm:block" />
          <LocaleSwitcher />
          <ThemeToggle label={t("theme")} />
          <AccountButton />
          <InstallButton />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line lg:hidden"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-[18px] w-[18px]" aria-hidden /> : <Menu className="h-[18px] w-[18px]" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            className="overflow-hidden border-t border-line bg-bg lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="container-page grid gap-1 py-3">
              {[...MAIN, ...TOOLS].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive(item.href) ? "bg-subtle text-ink" : "text-muted hover:bg-subtle hover:text-ink"
                    }`}
                  >
                    <item.icon className="h-4 w-4" aria-hidden />
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function AccountButton() {
  const t = useTranslations("nav");
  const { configured, user, profile } = useAuth();
  if (!configured) return null;
  const initial = (profile?.display_name || user?.email || "").slice(0, 1).toUpperCase();
  return (
    <Link
      href="/account"
      aria-label={t("account")}
      title={user ? (profile?.display_name ?? user.email ?? t("account")) : t("signIn")}
      className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-subtle hover:text-ink"
    >
      {user ? (
        <span className="grid h-7 w-7 place-items-center rounded-full bg-tomato text-xs font-semibold text-white">{initial}</span>
      ) : (
        <UserRound className="h-[18px] w-[18px]" aria-hidden />
      )}
    </Link>
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
      className="grid h-9 min-w-9 place-items-center rounded-lg px-2 text-xs font-semibold uppercase text-muted transition-colors hover:bg-subtle hover:text-ink"
    >
      {other}
    </Link>
  );
}
