"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "cn";
import { dayOffset, formatIsoDate } from "@/data/availability";

export const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export type BookingSlot = {
  date: string;
  startTime: string;
  endTime: string;
};

export const toIso = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");

  return `${year}-${m}-${d}`;
};

export const toMinutes = (time: string | undefined | null): number | null => {
  if (!time || typeof time !== "string") return null;
  const parts = time.split(":");
  if (parts.length !== 2) return null;
  const [hours, minutes] = parts.map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

/** Returns true if the requested slot overlaps any existing booking on the same date. */
export const isSlotConflicting = (
  startHour: number,
  duration: number,
  bookedSlots: BookingSlot[],
  selectedDate: string
): boolean => {
  const slotStart = startHour * 60;
  const slotEnd = slotStart + duration * 60;

  return bookedSlots.some((booking) => {
    if (booking.date !== selectedDate) return false;
    const bStart = toMinutes(booking.startTime);
    const bEnd = toMinutes(booking.endTime);
    // A booking with missing or malformed times cannot be evaluated for
    // overlap, so it is skipped rather than treated as a conflict.
    if (bStart === null || bEnd === null) return false;
    return slotStart < bEnd && slotEnd > bStart;
  });
};

// Mirrors booking-form.tsx: 08:00–22:00 start times, slots must end by 23:00,
// minimum booking duration is 1 hour. Adjacent bookings are allowed (only
// overlapping intervals conflict).
export const START_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
export const MIN_DURATION_HOURS = 1;

export const getAvailableStartHours = (
  bookedSlots: BookingSlot[],
  date: string,
  duration: number = MIN_DURATION_HOURS
): number[] => {
  return START_HOURS.filter(
    (hour) =>
      hour + duration <= 23 && !isSlotConflicting(hour, duration, bookedSlots, date)
  );
};

/**
 * A date is fully booked only when no valid booking time remains.
 * A single booking does NOT fully book a date. We use the minimum duration
 * (1 hour): if even one 1-hour slot is free, the date still has availability
 * and remains selectable (partially available dates stay bookable).
 */
export const isDateFullyBooked = (bookings: BookingSlot[], isoDate: string): boolean => {
  return getAvailableStartHours(bookings, isoDate).length === 0;
};

export const AvailabilityCalendar = ({
  studioId,
  selected,
  onSelect,
  bookings: externalBookings,
}: {
  studioId: string;
  selected: string;
  onSelect: (iso: string) => void;
  bookings?: BookingSlot[];
}) => {
  const [offset, setOffset] = React.useState(0);
  const [bookings, setBookings] = React.useState<BookingSlot[]>([]);
  const effectiveBookings = externalBookings ?? bookings;

  // Fetch booked slots from the backend when the studio changes.
  React.useEffect(() => {
    if (!studioId || externalBookings) return;

    let active = true;

    const loadBookings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/studios/${encodeURIComponent(studioId)}/availability`,
          { cache: "no-store" },
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
  }, [studioId, externalBookings]);

  // Today's date is computed on the client (after hydration) so that
  // past-date disabling and today-highlighting reflect the visitor's
  // calendar rather than the server's clock. Initialising to an empty string
  // keeps the server render identical to the first client render, which
  // avoids hydration mismatches; the real value is applied once mounted.
  const [todayIso] = React.useState(() => dayOffset(0));

const [currentYear, currentMonth] = todayIso
  ? todayIso.split("-").map(Number)
  : [0, 0];

const baseDate = todayIso
  ? new Date(currentYear, currentMonth - 1 + offset, 1)
  : null;

const firstOfMonth = baseDate;
const daysInMonth = baseDate
  ? new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate()
  : 0;

const firstYear = firstOfMonth?.getFullYear() ?? 0;
const firstMonth = firstOfMonth?.getMonth() ?? 0;

const leadingBlanks = firstOfMonth?.getDay() ?? 0;

const monthKey = `${firstYear}-${firstMonth}`;

const monthLabel = firstOfMonth
  ? firstOfMonth.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    })
  : "";

  // Dates in this month with no remaining valid slot (minimum 1 hour).
  const fullyBookedDates = React.useMemo(() => {
    const set = new Set<string>();
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toIso(firstYear, firstMonth, day);
      if (isDateFullyBooked(effectiveBookings, iso)) {
        set.add(iso);
      }
    }
    return set;
  }, [effectiveBookings, monthKey, daysInMonth]);

  const isDayDisabled = (iso: string): boolean =>
    iso < todayIso || fullyBookedDates.has(iso);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-heading text-sm font-semibold tracking-[-0.01em]">
          {monthLabel}
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOffset((o) => o - 1)}
            aria-label="Previous month"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => setOffset((o) => o + 1)}
            aria-label="Next month"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = toIso(firstYear, firstMonth, day);

          const isPast = iso < todayIso;
          const isFullyBooked = fullyBookedDates.has(iso);
          const disabled = isPast || isFullyBooked;
          const isSelected = selected === iso;
          const isToday = iso === todayIso;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              aria-label={
                isPast
                  ? `${iso} — past date`
                  : isFullyBooked
                    ? `${iso} — fully booked`
                    : `${iso} — available`
              }
              aria-pressed={isSelected}
              className={cn(
                "relative aspect-square rounded-md text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60",

                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",

                !isSelected &&
                  !disabled &&
                  "text-foreground hover:bg-primary/10 hover:text-primary",

                !isSelected &&
                  disabled &&
                  isFullyBooked &&
                  "cursor-not-allowed bg-rose-500/20 text-rose-700",

                !isSelected &&
                  disabled &&
                  isPast &&
                  "cursor-not-allowed text-muted-foreground/40",

                !isSelected && isToday && "ring-1 ring-primary/60"
              )}
            >
              <span className="relative z-10">{day}</span>

              {!isSelected && !isPast && (
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full",
                    isFullyBooked ? "bg-rose-500" : "bg-emerald-500"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          Available
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-rose-500" />
          Fully booked
        </span>

        <span className="ml-auto">
          {selected ? formatIsoDate(selected) : "Pick a date"}
        </span>
      </div>
    </div>
  );
};
