/**
 * Central helper for remote photography.
 *
 * All studio imagery is served from Unsplash's CDN and allowed via
 * `images.remotePatterns` in next.config.ts. Keeping URLs in one place makes
 * it trivial to swap in your own asset host or API later.
 */

type ImgSize = "thumb" | "card" | "gallery" | "hero" | "avatar";

const SIZES: Record<ImgSize, string> = {
  thumb: "w=160&h=160&fit=crop",
  card: "w=900&h=700&fit=crop",
  gallery: "w=1600&h=1200&fit=crop",
  hero: "w=2000&h=1400&fit=crop",
  avatar: "w=160&h=160&fit=crop&crop=faces",
};

/** Builds a sized, cropped Unsplash URL from a bare photo id. */
export const img = (id: string, size: ImgSize = "card"): string => {
  return `https://images.unsplash.com/photo-${id}?auto=format&quality=82&${SIZES[size]}`;
};
