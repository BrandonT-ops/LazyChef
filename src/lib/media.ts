export type VideoKind = "youtube" | "tiktok" | "facebook" | "instagram" | "file";

export interface VideoEmbed {
  kind: VideoKind;
  src: string;
  /** Tall videos (TikTok, Reels, Shorts) are shown in a portrait frame. */
  portrait: boolean;
}

/**
 * Turns a video link into something the page can embed, using each platform's official embed player.
 * Returns null for links we can't embed (they're then shown as a plain link).
 */
export function videoEmbed(url: string): VideoEmbed | null {
  const u = url.trim();
  if (!u) return null;
  let m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${m[1]}`, portrait: false };
  m = u.match(/youtube\.com\/shorts\/([\w-]{11})/);
  if (m) return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${m[1]}`, portrait: true };
  m = u.match(/tiktok\.com\/.*\/video\/(\d+)/);
  if (m) return { kind: "tiktok", src: `https://www.tiktok.com/embed/v2/${m[1]}`, portrait: true };
  m = u.match(/instagram\.com\/(?:p|reel|reels|tv)\/([\w-]+)/);
  if (m) return { kind: "instagram", src: `https://www.instagram.com/p/${m[1]}/embed`, portrait: true };
  if (/facebook\.com|fb\.watch/.test(u)) {
    const portrait = /\/reel\//.test(u);
    return {
      kind: "facebook",
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false`,
      portrait,
    };
  }
  if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) return { kind: "file", src: u, portrait: false };
  return null;
}

/** Kept for older code: YouTube links only. */
export function youtubeEmbed(url: string): string | null {
  const e = videoEmbed(url);
  return e?.kind === "youtube" ? e.src : null;
}
