import type { Category } from "@/types/studio";

export const categories: Category[] = [
  {
    id: "photography",
    name: "Photography Studios",
    tagline: "Daylight, cyc walls and controlled silence.",
    image: "1560787313-5dff3307e257",
    count: 42,
  },
  {
    id: "film-sound",
    name: "Film & Sound Stages",
    tagline: "Grids, green screens and room to roll.",
    image: "1502481851512-e9e2529bfbf9",
    count: 27,
  },
  {
    id: "podcast",
    name: "Podcast Rooms",
    tagline: "Treated walls, warm mics, ready to talk.",
    image: "1590602847861-f357a9332bbc",
    count: 31,
  },
  {
    id: "music",
    name: "Music Recording Suites",
    tagline: "Isolated booths and consoles that breathe.",
    image: "1598488035139-bdbb2231ce04",
    count: 24,
  },
  {
    id: "art",
    name: "Art Workshops",
    tagline: "Big tables, good light, room to make a mess.",
    image: "1531058020387-3be344556be6",
    count: 18,
  },
];

export const categoryLabels: Record<Category["id"], string> = Object.fromEntries(
  categories.map((c) => [c.id, c.name]),
) as Record<Category["id"], string>;
