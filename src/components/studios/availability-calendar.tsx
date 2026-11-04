"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "cn";
import { bookedDates, dayOffset } from "@/data/availability";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MAX_OFFSET = 2; // mock availability covers ~60 days

const toIso = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

/**
 * Two-month-ahead availability grid. Booked and past days are disabled;
 * selection is controlled by the parent booking card.
 */
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

  const booked = React.useMemo(() => new Set(bookedDates(studioId)), [studioId]);
  const todayIso = dayOffset(0);
  const lastIso = dayOffset(59);

  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth() + offset;
  const firstOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  // Monday-first grid.
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const monthLabel = firstOfMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-border bg-card p-4">
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

      {/* Weekday row */}
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

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = toIso(year, monthIndex, day);
          const isBooked = booked.has(iso);
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
              aria-label={`${iso}${isBooked ? " — booked" : isPast ? " — past" : ""}`}
              aria-pressed={isSelected}
              className={cn(
                "relative aspect-square rounded-md text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary",
                !isSelected &&
                  !disabled &&
                  "text-foreground hover:bg-primary/10 hover:text-primary",
                !isSelected &&
                  isBooked &&
                  "cursor-not-allowed bg-muted text-muted-foreground/60 line-through",
                !isSelected && isPast && "cursor-not-allowed text-muted-foreground/40",
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
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          Booked
        </span>
        <span className="ml-auto">
          {selected ? "1 day selected" : "Pick a date"}
        </span>
      </div>
    </div>
  );
};
