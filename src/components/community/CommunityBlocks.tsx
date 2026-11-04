import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getSection } from "@/data/sections";
import { ACCENT_BG } from "@/lib/ui";
import type { CommunityPhoto, CommunityRecipeCard } from "@/lib/community";
import { SectionIcon } from "../icons";

export function CommunityRecipeGrid({ recipes }: { recipes: CommunityRecipeCard[] }) {
  const t = useTranslations();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((r) => {
        const s = getSection(r.section) ?? getSection("sunday")!;
        return (
          <Link key={r.id} href={`/community/${r.id}`} className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
            {r.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.cover} alt="" loading="lazy" className="h-40 w-full object-cover" />
            ) : (
              <div className={`grid h-40 place-items-center ${ACCENT_BG[s.accent]}`}>
                <SectionIcon id={s.id} className="h-10 w-10" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold group-hover:text-tomato">{r.name}</h3>
              <p className="mt-1 text-xs text-muted">
                {r.author ? t("community.by", { name: r.author }) : t("community.anonymous")} · {t("dish.minutes", { count: r.minutes })}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function CommunityPhotoGrid({ photos, showDish = false }: { photos: CommunityPhoto[]; showDish?: boolean }) {
  const t = useTranslations("community");
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((p) => (
        <figure key={p.id} className="relative overflow-hidden rounded-xl2 bg-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.url} alt={p.dishName} loading="lazy" className="aspect-square w-full object-cover" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs text-white">
            {showDish && p.dishSlug ? (
              <Link href={`/dishes/${p.dishSlug}`} className="block truncate font-semibold hover:underline">
                {p.dishName}
              </Link>
            ) : showDish ? (
              <span className="block truncate font-semibold">{p.dishName}</span>
            ) : null}
            <span className="opacity-90">{p.author ? t("madeBy", { name: p.author }) : t("anonymous")}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
