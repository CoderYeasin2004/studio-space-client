import { cn } from "cn";
import type { BookingStatus, ListingStatus } from "@/types/studio";

const bookingStyles: Record<BookingStatus, string> = {
  confirmed: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-rose-500/12 text-rose-500 dark:text-rose-400",
};

const listingStyles: Record<ListingStatus, string> = {
  live: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  draft: "bg-muted text-muted-foreground",
  paused: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

/** Pill badge for booking and listing statuses. */
export function StatusBadge({
  status,
  kind = "booking",
}: {
  status: BookingStatus | ListingStatus;
  kind?: "booking" | "listing";
}) {
  const styles =
    kind === "booking"
      ? bookingStyles[status as BookingStatus]
      : listingStyles[status as ListingStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styles,
      )}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-current opacity-70"
      />
      {status}
    </span>
  );
}
