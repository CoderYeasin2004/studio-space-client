/**
 * Mock reviews for the Studio Details page. Avatars reuse Unsplash ids
 * already verified in the catalogue. Deterministic pick per studio so the
 * server and client render the same set.
 */

export interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export const reviews: Review[] = [
  {
    id: "rv-01",
    author: "Nadia Okafor",
    role: "Fashion photographer",
    avatar: "1494790108377-be9c29b29330",
    rating: 5,
    date: "2 weeks ago",
    text: "Booked it for a two-day lookbook and the light did half the work for me. Load-in was painless and the host had the cyc wall spotless before we arrived.",
  },
  {
    id: "rv-02",
    author: "Tomás Ferreira",
    role: "Director",
    avatar: "1500648767791-00dcc994a43e",
    rating: 5,
    date: "1 month ago",
    text: "Room tone was quiet enough for dialogue, which is rare at this price. We ran a full crew of nine and never felt on top of each other.",
  },
  {
    id: "rv-03",
    author: "Ines Delacroix",
    role: "Podcast producer",
    avatar: "1534528741775-53994a69daeb",
    rating: 4,
    date: "1 month ago",
    text: "Treated walls, warm mics, no surprises. Would have liked a second monitor, but the space itself is genuinely lovely to work in.",
  },
  {
    id: "rv-04",
    author: "Marcus Lindqvist",
    role: "Music producer",
    avatar: "1506794778202-cad84cf45f1d",
    rating: 5,
    date: "2 months ago",
    text: "Isolation is the real story here — we tracked vocals at midnight with the monitors up and nothing leaked. Booking again next month.",
  },
  {
    id: "rv-05",
    author: "Priya Raman",
    role: "Ceramicist",
    avatar: "1573496359142-b8d87734a5a2",
    rating: 5,
    date: "2 months ago",
    text: "Big tables, good light, and nobody flinched at the mess we made. The cleanup kit waiting at the door told me everything about this host.",
  },
  {
    id: "rv-06",
    author: "Jonah Weiss",
    role: "Product photographer",
    avatar: "1472099645785-5658abf4ff4e",
    rating: 4,
    date: "3 months ago",
    text: "Consistent daylight from morning through lunch, which makes planning a shoot genuinely easier. Street parking is hit or miss, so take the freight lift seriously.",
  },
];

/** Deterministically picks three reviews for a studio id. */
export const reviewsFor = (studioId: string): Review[] => {
  const seed = studioId.charCodeAt(studioId.length - 1) % reviews.length;
  return [0, 1, 2].map((i) => reviews[(seed + i) % reviews.length]);
};
