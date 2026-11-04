import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Header";

export function Footer() {
  const t = useTranslations();
  const cols = [
    {
      title: t("footer.product"),
      links: [
        { href: "/planner", label: t("nav.planner") },
        { href: "/events", label: t("nav.events") },
        { href: "/browse", label: t("nav.browse") },
        { href: "/markets", label: t("nav.markets") },
      ],
    },
    {
      title: t("footer.explore"),
      links: [
        { href: "/search", label: t("nav.search") },
        { href: "/random", label: t("nav.random") },
        { href: "/sections/sunday", label: t("sections.sunday.name") },
        { href: "/sections/drinks", label: t("sections.drinks.name") },
      ],
    },
    {
      title: t("footer.kitchen"),
      links: [
        { href: "/me?tab=favorites", label: t("kitchen.tabs.favorites") },
        { href: "/me?tab=recipes", label: t("kitchen.tabs.recipes") },
        { href: "/me?tab=photos", label: t("kitchen.tabs.photos") },
        { href: "/me?tab=shopping", label: t("kitchen.tabs.shopping") },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-subtle">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">{t("footer.about")}</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-sm font-semibold">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Chop. {t("footer.tagline")}
          </p>
          <p>{t("footer.local")}</p>
        </div>
      </div>
    </footer>
  );
}
