/** ISO calendar date (yyyy-mm-dd) the given number of days from today. */
export const dayOffset = (days: number): string => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
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
