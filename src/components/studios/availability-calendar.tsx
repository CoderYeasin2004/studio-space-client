"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "cn";
import { dayOffset } from "@/data/availability";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MAX_OFFSET = 2;

type BookingSlot = {
  date: string;
  startTime: string;
  endTime: string;
};

const toIso = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");

  return `${year}-${m}-${d}`;
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Check whether the entire day is booked (08:00–23:00)
const isFullyBooked = (bookings: BookingSlot[]) => {
  const slots = bookings
    .map((booking) => ({
      start: toMinutes(booking.startTime),
      end: toMinutes(booking.endTime),
    }))
    .sort((a, b) => a.start - b.start);

  let coveredUntil = 8 * 60;

  for (const slot of slots) {
    if (slot.start > coveredUntil) return false;

    coveredUntil = Math.max(coveredUntil, slot.end);

    if (coveredUntil >= 23 * 60) return true;
  }

  return false;
};

export const AvailabilityCalendar = ({
  studioId,
  selected,
  onSelect,
}: {
  studioId: string;
  selected: string;
  onSelect: (iso: string) => void;
}) => {
  const [offset, setOffset] = React.useState(0);
  const [bookings, setBookings] = React.useState<BookingSlot[]>([]);

  // Fetch real booking data from MongoDB
  React.useEffect(() => {
    if (!studioId) return;

    let active = true;

    const loadBookings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${encodeURIComponent(studioId)}/availability`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) return;

        const data: unknown = await response.json();

        if (active && Array.isArray(data)) {
          setBookings(data as BookingSlot[]);
        }
      } catch {
        if (active) {
          setBookings([]);
        }
      }
    };

    loadBookings();

    return () => {
      active = false;
    };
  }, [studioId]);
  const todayIso = dayOffset(0);
  const lastIso = dayOffset(59);

  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth() + offset;

  const firstOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Monday-first calendar
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;

  const monthLabel = firstOfMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Calendar header */}
      <div className="flex items-center justify-between gap-2">
        <p className="font-heading text-sm font-semibold tracking-[-0.01em]">
          {monthLabel}
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            aria-label="Previous month"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(MAX_OFFSET, o + 1))}
            disabled={offset === MAX_OFFSET}
            aria-label="Next month"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="mt-3 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day, i) => (
          <span
            key={`${day}-${i}`}
            className="py-1 text-center text-[11px] font-medium text-muted-foreground"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;

          const iso = toIso(
            firstOfMonth.getFullYear(),
            firstOfMonth.getMonth(),
            day,
          );

          const dayBookings = bookings.filter(
            (booking) => booking.date === iso,
          );

          const hasBookings = dayBookings.length > 0;
          const isBooked = isFullyBooked(dayBookings);

          const isPast = iso < todayIso;
          const isBeyond = iso > lastIso;
          const disabled = isBooked || isPast || isBeyond;

          const isSelected = selected === iso;
          const isToday = iso === todayIso;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              aria-label={`${iso}${
                isBooked
                  ? " — fully booked"
                  : hasBookings
                    ? " — partially booked"
                    : isPast
                      ? " — past"
                      : ""
              }`}
              aria-pressed={isSelected}
              className={cn(
                "relative aspect-square rounded-md text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60",

                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary",

                !isSelected &&
                  !disabled &&
                  !hasBookings &&
                  "text-foreground hover:bg-primary/10 hover:text-primary",

                !isSelected &&
                  hasBookings &&
                  !isBooked &&
                  "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/30 dark:text-rose-300",

                !isSelected &&
                  isBooked &&
                  "cursor-not-allowed bg-rose-500/20 text-rose-700 line-through dark:text-rose-300",

                !isSelected &&
                  isPast &&
                  "cursor-not-allowed text-muted-foreground/40",

                !isSelected &&
                  isBeyond &&
                  "cursor-not-allowed text-muted-foreground/40",

                !isSelected && isToday && "ring-1 ring-primary/60",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" />
          Available
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-rose-500" />
          Partially booked
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-rose-700" />
          Fully booked
        </span>

        <span className="ml-auto">
          {selected ? "1 day selected" : "Pick a date"}
        </span>
      </div>
    </div>
  );
};
