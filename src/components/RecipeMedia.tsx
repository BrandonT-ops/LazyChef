import { useTranslations } from "next-intl";
import type { RecipeMedia as Media } from "@/data/types";
import { youtubeEmbed } from "@/lib/media";
import { ExternalLink, Link2 } from "lucide-react";

/** Photos, a preview video and helpful links for a recipe. Renders nothing when empty. */
export function RecipeMedia({ media, title }: { media?: Media; title: string }) {
  const t = useTranslations("media");
  if (!media) return null;
  const { images = [], video, links = [] } = media;
  const embed = video ? youtubeEmbed(video) : null;

  return (
    <div className="space-y-6">
      {video && (
        <div className="card overflow-hidden">
          <div className="aspect-video bg-ink/5">
            {embed ? (
              <iframe
                src={embed}
                title={`${t("video")}: ${title}`}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={video} controls preload="metadata" className="h-full w-full object-cover" />
            )}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            // Plain <img>: photos can come from any host once users upload them.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`${title} ${i + 1}`}
              loading="lazy"
              className="h-48 w-72 shrink-0 snap-start rounded-xl2 object-cover shadow-soft"
            />
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div>
          <h3 className="heading mb-2 flex items-center gap-2 text-lg">
            <Link2 className="h-5 w-5 text-tomato" aria-hidden />
            {t("links")}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="chip gap-1.5 hover:border-tomato hover:text-tomato">
                  {l.label}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
