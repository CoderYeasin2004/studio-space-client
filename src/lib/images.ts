
type ImgSize = "thumb" | "card" | "gallery" | "hero" | "avatar";

const SIZES: Record<ImgSize, string> = {
  thumb: "w=160&h=160&fit=crop",
  card: "w=900&h=700&fit=crop",
  gallery: "w=1600&h=1200&fit=crop",
  hero: "w=2000&h=1400&fit=crop",
  avatar: "w=160&h=160&fit=crop&crop=faces",
};

export const img = (
  id: string,
  size: ImgSize = "card",
): string => {
  if (!id) return "/images/studio-placeholder.jpg";

  // Already a complete image URL — validate it and force HTTPS, since the
  // image optimizer only accepts https remote patterns. Malformed URLs fall
  // back to the placeholder instead of rendering a broken src.
  if (id.startsWith("http://") || id.startsWith("https://")) {
    try {
      const url = new URL(id);
      url.protocol = "https:";
      return url.toString();
    } catch {
      return "/images/studio-placeholder.jpg";
    }
  }

  // Unsplash photo IDs are long alphanumeric strings (e.g. "abc123def456").
  // Reject malformed ids such as single characters or values that already
  // include the "photo-" prefix (which would double-prefix the URL and
  // produce an invalid Unsplash URL like "photo-photo-Y").
  if (id.startsWith("photo-") || id.length < 4) {
    return "/images/studio-placeholder.jpg";
  }

  return `https://images.unsplash.com/photo-${id}?auto=format&quality=82&${SIZES[size]}`;
};
