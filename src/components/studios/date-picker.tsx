"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";
import { cn } from "cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { dayOffset, formatIsoDate } from "@/data/availability";
import {
  WEEKDAYS,
  toIso,
  isDateFullyBooked,
  type BookingSlot,
} from "./availability-calendar";

interface DatePickerProps {
  selected: string;
  onSelect: (iso: string) => void;
  bookings?: BookingSlot[];
  studioId?: string;
}

/**
 * Compact date picker: a trigger field showing the selected date (or a
 * placeholder) with a calendar icon, which opens a small monthly calendar
 * popover. Past dates and fully-booked dates are disabled. Selecting a date
 * closes the popover and notifies the parent via `onSelect`.
 */
export const DatePicker = ({
  selected,
  onSelect,
  bookings: externalBookings,
  studioId,
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [bookings, setBookings] = React.useState<BookingSlot[]>([]);
  const effectiveBookings = externalBookings ?? bookings;

  // Fetch booked slots when the studio changes and no external bookings are supplied.
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
  // past-date disabling reflects the visitor's calendar.
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

  const handleDaySelect = (iso: string) => {
    onSelect(iso);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button type="button" variant="outline" size="sm" className="w-full gap-2 pr-2">
            <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-left">
              {selected ? formatIsoDate(selected) : "Select date"}
            </span>
          </Button>
        }
      />

      <PopoverContent className="w-[280px] p-2">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-semibold">{monthLabel}</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOffset((o) => o - 1)}
              aria-label="Previous month"
              className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeftIcon className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setOffset((o) => o + 1)}
              aria-label="Next month"
              className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRightIcon className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {WEEKDAYS.map((day, i) => (
            <span
              key={`${day}-${i}`}
              className="py-0.5 text-center text-[10px] font-medium text-muted-foreground"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
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
                onClick={() => handleDaySelect(iso)}
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
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 size-[6px] rounded-full",
                      isFullyBooked ? "bg-rose-500" : "bg-emerald-500"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
