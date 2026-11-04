import { useTranslations } from "next-intl";
import { ExternalLink, Link2, PlayCircle } from "lucide-react";
import type { RecipeLink, RecipeMedia as Media } from "@/data/types";
import { videoEmbed } from "@/lib/media";

/** A how-to video from YouTube, TikTok, Facebook, Instagram or a video file. Unknown links show as a button. */
export function VideoPlayer({ url, title }: { url: string; title: string }) {
  const t = useTranslations("media");
  const e = videoEmbed(url);
  if (!e) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
        <PlayCircle className="h-4 w-4" aria-hidden />
        {t("watchOn")}
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>
    );
  }
  return (
    <div className={`card overflow-hidden ${e.portrait ? "mx-auto max-w-[360px]" : ""}`}>
      <div className={`${e.portrait ? "aspect-[9/16]" : "aspect-video"} bg-subtle`}>
        {e.kind === "file" ? (
          <video src={e.src} controls preload="metadata" className="h-full w-full object-cover" />
        ) : (
          <iframe
            src={e.src}
            title={`${t("video")}: ${title}`}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; clipboard-write"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

/** Photos of the finished dish: one large, the rest in a grid. */
export function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  if (!images.length) return null;
  const [first, ...rest] = images;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {/* Plain <img>: photos come from the repo or from any host. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={first} alt={title} loading="lazy" className={`w-full rounded-xl2 object-cover ${rest.length ? "aspect-[4/3] sm:row-span-2 sm:aspect-auto sm:h-full" : "aspect-[16/9] sm:col-span-2"}`} />
      {rest.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt={`${title} ${i + 2}`} loading="lazy" className="aspect-[4/3] w-full rounded-xl2 object-cover" />
      ))}
    </div>
  );
}

export function LinkList({ links, heading }: { links: RecipeLink[]; heading: string }) {
  if (!links.length) return null;
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Link2 className="h-4 w-4 text-tomato" aria-hidden />
        {heading}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="chip gap-1.5 hover:border-ink hover:text-ink">
              {l.label}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Video, photos and links together (used for people's own recipes). Renders nothing when empty. */
export function RecipeMedia({ media, title }: { media?: Media; title: string }) {
  const t = useTranslations("media");
  if (!media) return null;
  const { images = [], video, links = [] } = media;
  return (
    <div className="space-y-6">
      {video && <VideoPlayer url={video} title={title} />}
      <PhotoGallery images={images} title={title} />
      <LinkList links={links} heading={t("links")} />
    </div>
  );
}
