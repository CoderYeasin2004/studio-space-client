/**
 * Mock availability — one source of truth for the Explore date filter and
 * the Studio Details calendar. Deterministic per studio id so server and
 * client render the same calendar. Replace with API data later.
 */

/** Deterministic 32-bit FNV-1a seed from a studio id. */
const seedFrom = (id: string): number => {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** Small deterministic LCG — stable output for a given seed. */
const rng = (seed: number): () => number => {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

/** ISO calendar date (yyyy-mm-dd) the given number of days from today. */
export const dayOffset = (days: number): string => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

/** The studio is already booked on these dates over the next 60 days. */
export const bookedDates = (studioId: string): string[] => {
  const rand = rng(seedFrom(studioId));
  const count = 6 + Math.floor(rand() * 6);
  const dates = new Set<string>();
  while (dates.size < count) {
    dates.add(dayOffset(Math.floor(rand() * 60)));
  }
  return [...dates].sort();
};

/** Convenience predicate for filters and calendar rendering. */
export const isBookedOn = (studioId: string, isoDate: string): boolean => {
  return bookedDates(studioId).includes(isoDate);
};

/** Formats an ISO date for display, e.g. "14 Nov 2026". */
export const formatIsoDate = (isoDate: string): string => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d, 12).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
