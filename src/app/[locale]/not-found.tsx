import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <UtensilsCrossed className="h-14 w-14 text-tomato" aria-hidden />
      <h1 className="heading text-3xl">{t("title")}</h1>
      <p className="text-muted">{t("text")}</p>
      <Link href="/" className="btn-primary">{t("back")}</Link>
    </div>
  );
}
