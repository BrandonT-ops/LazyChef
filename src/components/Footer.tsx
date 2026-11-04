import { useTranslations } from "next-intl";
import { SITE } from "@/config/site";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="mt-20 border-t border-line">
      <div className="container-page flex flex-col items-center justify-between gap-2 py-8 text-sm text-muted sm:flex-row">
        <p>
          <span className="heading text-ink">
            {SITE.nameParts[0]}
            <span className="text-tomato">{SITE.nameParts[1]}</span>
          </span>{" "}
          · {t("tagline")}
        </p>
        <p>
          {t("made")} · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
