import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <span className="text-6xl" aria-hidden>🍽️</span>
      <h1 className="heading text-3xl">{t("title")}</h1>
      <p className="text-muted">{t("text")}</p>
      <Link href="/" className="btn-primary">{t("back")}</Link>
    </div>
  );
}
