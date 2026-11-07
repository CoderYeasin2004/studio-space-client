"use client";

import * as React from "react";
import Image from "next/image";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { cn } from "cn";
import { img } from "@/lib/images";
import type { Booking } from "@/types/studio";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";

/** Monday-first weekday labels, matching the studio availability calendar. */
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const toIso = (date: Date): string => format(date, "yyyy-MM-dd");

/** Parses an ISO date without timezone ambiguity (local midnight). */
const parseIso = (iso: string): Date => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** Dot colour for a date, derived from the statuses of its bookings. */
const dotColorFor = (dayBookings: Booking[]): string => {
  const statuses = dayBookings.map((booking) => booking.status);
  if (statuses.includes("pending")) return "bg-amber-500";
  if (statuses.includes("confirmed")) return "bg-emerald-500";
  if (statuses.includes("completed")) return "bg-muted";
  return "bg-rose-500"; // cancelled only
};

interface BookingCalendarProps {
  /** Bookings for the authenticated host's own studios (fetched server-side). */
  bookings: Booking[];
}

/**
 * Compact booking calendar for the host dashboard.
 *
 * Data ownership: `bookings` is supplied by the server component, which obtains
 * the host identity from the authenticated session (not from a client-supplied
 * URL parameter). Only bookings belonging to the host's studios are displayed.
 *
 * Selected-date bookings render in a floating popup anchored to the clicked
 * date cell, positioned within the calendar's horizontal boundaries without
 * pushing surrounding content.
 */
export const BookingCalendar = ({ bookings }: BookingCalendarProps) => {
  const [viewDate, setViewDate] = React.useState<Date>(new Date());
  const [selected, setSelected] = React.useState<string>(toIso(new Date()));
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);

  const popupRef = React.useRef<HTMLDivElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const anchorCellRef = React.useRef<HTMLElement | null>(null);

  const bookingsByDate = React.useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const booking of bookings) {
      const group = map.get(booking.date) ?? [];
      group.push(booking);
      map.set(booking.date, group);
    }
    return map;
  }, [bookings]);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const todayIso = toIso(new Date());
  const monthLabel = monthStart.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  // Close popup when clicking outside the anchor cell or the popup itself.
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!popupOpen) return;
      const target = e.target as Node;
      const isInsideAnchor =
        anchorCellRef.current?.contains(target) ?? false;
      const isInsidePopup = popupRef.current?.contains(target) ?? false;

      if (!isInsideAnchor && !isInsidePopup) {
        setPopupOpen(false);
        setAnchorRect(null);
        anchorCellRef.current = null;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupOpen]);

  // Close popup when the page scrolls (no continuous repositioning).
  React.useEffect(() => {
    const handleScroll = () => {
      setPopupOpen(false);
      setAnchorRect(null);
      anchorCellRef.current = null;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openPopup = (iso: string, rect: DOMRect | null, cell: HTMLElement | null) => {
    const dayBookings = bookingsByDate.get(iso) ?? [];
    if (dayBookings.length === 0) {
      setSelected(iso);
      setPopupOpen(false);
      setAnchorRect(null);
      anchorCellRef.current = null;
      return;
    }

    // Toggle: clicking the already-selected date closes the popup.
    if (popupOpen && selected === iso) {
      closePopup();
      return;
    }

    setSelected(iso);
    setAnchorRect(rect ?? null);
    anchorCellRef.current = cell ?? null;
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setAnchorRect(null);
    anchorCellRef.current = null;
  };

  // Compute popup position within the calendar's horizontal boundaries.
  // Position is only recalculated when opening or switching dates — never
  // continuously during page scroll.
  const [popupPosition, setPopupPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
    placement: "top" | "bottom";
    arrowLeft: number;
  } | null>(null);

  React.useLayoutEffect(() => {
    if (
      !popupOpen ||
      !anchorRect ||
      !popupRef.current ||
      !calendarRef.current
    )
      return;

    const calendarRect = calendarRef.current.getBoundingClientRect();
    const popupEl = popupRef.current;
    const popupHeight = popupEl.offsetHeight || 220;
    const defaultPopupWidth = popupEl.offsetWidth || 260;
    const viewportHeight = window.innerHeight;
    const pad = 8;

    // Reduce popup width if the calendar is too narrow for the default width.
    const calendarInnerWidth = calendarRect.width - pad * 2;
    let popupWidth = defaultPopupWidth;
    if (popupWidth > calendarInnerWidth) {
      popupWidth = calendarInnerWidth;
    }

    // Horizontally centre on the date cell, clamped inside the calendar.
    const cellCenterX = anchorRect.left + anchorRect.width / 2;
    let left = cellCenterX - popupWidth / 2;
    const minLeft = calendarRect.left + pad;
    const maxLeft = calendarRect.right - popupWidth - pad;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    // Arrow: point toward the clicked date cell, clamped inside the popup.
    let arrowLeft = cellCenterX - left;
    arrowLeft = Math.max(4, Math.min(arrowLeft, popupWidth - 4));

    // Vertically prefer above the cell; flip below when there is no room.
    let top = anchorRect.top - popupHeight - pad;
    let placement: "top" | "bottom" = "top";
    if (top < pad) {
      top = anchorRect.bottom + pad;
      placement = "bottom";
    }
    top = Math.max(pad, Math.min(top, viewportHeight - popupHeight - pad));

    setPopupPosition({ top, left, width: popupWidth, placement, arrowLeft });
  }, [popupOpen, anchorRect]);

  let popupStyle: React.CSSProperties = { display: "none" };
  let arrowStyle: React.CSSProperties = { display: "none" };

  const pos = popupPosition;
  if (pos) {
    popupStyle = {
      display: "block",
      position: "fixed",
      top: pos.top,
      left: pos.left,
      width: pos.width,
      zIndex: 50,
    };

    arrowStyle = {
      display: "block",
      position: "absolute",
      left: pos.arrowLeft,
      transform: "none",
      zIndex: 51,
    };

    if (pos.placement === "top") {
      arrowStyle.top = "auto";
      arrowStyle.bottom = "-5px";
      (arrowStyle as any).rotate = "45deg";
    } else {
      arrowStyle.top = "-5px";
      arrowStyle.bottom = "auto";
      (arrowStyle as any).rotate = "225deg";
    }
  }

  return (
    <div ref={calendarRef} className="space-y-1.5 relative">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg tracking-[-0.01em]">
            Booking Calendar
          </h3>
          <p className="text-xs text-muted-foreground">
            Sessions across your studios
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setViewDate((date) => subMonths(date, 1))}
            aria-label="Previous month"
            disabled={popupOpen}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="text-sm font-semibold">{monthLabel}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setViewDate((date) => addMonths(date, 1))}
            aria-label="Next month"
            disabled={popupOpen}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            className="py-1 text-center text-[11px] font-medium text-muted-foreground"
          >
            {weekday}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const iso = toIso(day);
          const dayBookings = bookingsByDate.get(iso) ?? [];
          const hasBookings = dayBookings.length > 0;
          const isSelected = iso === selected;
          const isToday = iso === todayIso && !isSelected;
          const isOutside = !isSameMonth(day, monthStart);

          return (
            <button
              key={iso}
              type="button"
              aria-label={
                parseIso(iso).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }) +
                (hasBookings
                  ? ` — ${dayBookings.length} booking${
                      dayBookings.length > 1 ? "s" : ""
                    }`
                  : "")
              }
              onClick={(e) => {
                openPopup(
                  iso,
                  e.currentTarget.getBoundingClientRect(),
                  e.currentTarget as HTMLElement,
                );
                if (isOutside) setViewDate(day);
              }}
              className={cn(
                "relative aspect-square rounded-md text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary",
                !isSelected &&
                  !isOutside &&
                  "text-foreground hover:bg-muted/50",
                isOutside && "text-muted-foreground/40 hover:bg-muted/30",
                isToday && "ring-1 ring-primary/60",
              )}
            >
              <span className="relative z-10">{day.getDate()}</span>
              {hasBookings && (
                <span
                  className={cn(
                    "absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 size-1.5 rounded-full",
                    isSelected ? "bg-white" : dotColorFor(dayBookings),
                  )}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Floating booking schedule popup (fixed, within calendar bounds) */}
      {popupOpen && anchorRect && (
        <div
          ref={popupRef}
          style={popupStyle}
          className="w-full max-w-[260px] max-h-[60vh] rounded-xl border border-border bg-card shadow-lg overflow-hidden flex flex-col z-50 animate-in fade-in zoom-in duration-100"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50">
            <p className="text-xs font-medium">
              {parseIso(selected).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={closePopup}
              aria-label="Close schedule"
              className="size-6 p-0"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          <div className="overflow-y-auto max-h-[calc(60vh-56px)] py-2 space-y-2">
            {bookingsByDate.get(selected)?.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-2.5 px-3 py-1.5"
              >
                <div className="relative size-8 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={img(booking.studioImage, "thumb")}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate leading-snug">
                    {booking.studioName}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none">
                    {booking.startTime} &ndash; {booking.endTime}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
          {/* Popover arrow */}
          <div
            style={{
              ...arrowStyle,
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid var(--border)",
              ...(pos?.placement === "bottom"
                ? {
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid var(--border)",
                  }
                : {}),
            } as React.CSSProperties}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};
