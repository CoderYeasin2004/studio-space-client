"use client";

import * as React from "react";
import Image from "next/image";
import {
  ClockIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  StarIcon,
} from "lucide-react";
import { img } from "@/lib/images";
import { formatIsoDate } from "@/data/availability";
import type { Studio } from "@/types/studio";
import { AvailabilityCalendar } from "./availability-calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

const DURATION_OPTIONS = [1, 2, 3, 4, 6, 8];
const START_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const label = (hour: number): string => {
  return `${String(hour).padStart(2, "0")}:00`;
};

type BookedSlot = {
  date: string;
  startTime: string;
  endTime: string;
};

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/** Returns true if the requested slot [startHour, startHour+duration) conflicts with any booked slot. */
const isSlotConflicting = (
  startHour: number,
  duration: number,
  bookedSlots: BookedSlot[],
  selectedDate: string
): boolean => {
  const slotStart = startHour * 60;
  const slotEnd = slotStart + duration * 60;

  return bookedSlots.some((booking) => {
    if (booking.date !== selectedDate) return false;
    const bStart = toMinutes(booking.startTime);
    const bEnd = toMinutes(booking.endTime);
    return slotStart < bEnd && slotEnd > bStart;
  });
};

/**
 * Interactive booking panel: availability calendar, live time-slot filtering
 * based on real booked slots, price breakdown, and booking submission to
 * POST /studios/booking.
 */
export const BookingCard = ({
  studio,
  bookings: externalBookings,
  onRefreshAvailability,
}: {
  studio: Studio;
  bookings?: BookedSlot[];
  onRefreshAvailability?: () => void;
}) => {
  const [date, setDate] = React.useState("");
  const [startHour, setStartHour] = React.useState(10);
  const [hours, setHours] = React.useState(2);
  const [submitting, setSubmitting] = React.useState(false);
  const [bookedSlots, setBookedSlots] = React.useState<BookedSlot[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = React.useState(false);
  const [availabilityError, setAvailabilityError] = React.useState(false);

  const studioId = studio.id ?? studio._id ?? "";
  const endHour = startHour + hours;
  const subtotal = studio.hourlyPrice * hours;
  const total = subtotal;

  const effectiveBookings = externalBookings ?? bookedSlots;

  const availableStartHours = START_HOURS.filter(
    (hour) =>
      hour + hours <= 23 && !isSlotConflicting(hour, hours, effectiveBookings, date)
  );

  // Fetch availability from the backend when studio or date changes.
  React.useEffect(() => {
    if (!studioId || externalBookings) return;

    let active = true;
    setAvailabilityLoading(true);
    setAvailabilityError(false);

    const loadAvailability = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${encodeURIComponent(studioId)}/availability`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          setAvailabilityError(true);
          setAvailabilityLoading(false);
          return;
        }

        const data: unknown = await response.json();
        if (active && Array.isArray(data)) {
          setBookedSlots(data as BookedSlot[]);
        }
      } catch {
        setAvailabilityError(true);
      } finally {
        if (active) {
          setAvailabilityLoading(false);
        }
      }
    };

    loadAvailability();

    return () => {
      active = false;
    };
  }, [studioId, date, externalBookings]);

  const refreshAvailability = async () => {
    if (!studioId) return;
    setAvailabilityLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${encodeURIComponent(studioId)}/availability`,
        { cache: "no-store" },
      );
      if (response.ok) {
        const data: unknown = await response.json();
        if (Array.isArray(data)) {
          setBookedSlots(data as BookedSlot[]);
          onRefreshAvailability?.();
        }
      }
    } catch {
      // ignore
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleBook = async () => {
    if (!date) {
      toast.add({
        type: "warning",
        title: "Pick a date",
        description: "Choose a date from the calendar first.",
      });
      return;
    }

    if (!availableStartHours.includes(startHour)) {
      toast.add({
        type: "warning",
        title: "Time slot unavailable",
        description: "Please choose a different start time or duration.",
      });
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/booking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studioId,
            studioSlug: studio.slug,
            studioName: studio.name,
            studioImage: studio.images.length > 0 ? studio.images[0] : "",
            location: studio.location,
            date,
            startTime: label(startHour),
            endTime: label(endHour),
            hours,
            total,
            status: "pending",
          }),
        },
      );

      if (response.status === 409) {
        const data = await response.json().catch(() => ({}));
        await refreshAvailability();
        toast.add({
          type: "warning",
          title: "Time slot unavailable",
          description: data.message || "This time slot is already booked.",
        });
        return;
      }

      if (response.status === 404) {
        toast.add({
          type: "error",
          title: "Studio not available",
          description: "This studio is no longer available for booking.",
        });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.add({
          type: "error",
          title: "Booking failed",
          description: data.message || "Could not complete your booking.",
        });
        return;
      }

      // Success: refresh availability so the new slot shows as booked.
      await refreshAvailability();

      toast.add({
        type: "success",
        title: "Booking request sent",
        description: `${studio.name} · ${formatIsoDate(date)} · ${label(startHour)}–${label(endHour)} · £${total}`,
      });
    } catch (error) {
      console.error("Failed to submit booking:", error);
      toast.add({
        type: "error",
        title: "Couldn't send your booking request",
        description: "The booking service didn't respond. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-correct start hour when date or duration changes and the current
  // selection is no longer available.
  React.useEffect(() => {
    if (
      date &&
      availableStartHours.length > 0 &&
      !availableStartHours.includes(startHour)
    ) {
      setStartHour(availableStartHours[0]);
    }
  }, [date, hours, availableStartHours, startHour]);

  const handleMessage = () => {
    if (!studio.host) return;
    toast.add({
      type: "info",
      title: `Message sent to ${studio.host.name}`,
      description: "Hosts usually reply within a couple of hours.",
    });
  };

  const isStartTimeValid = availableStartHours.includes(startHour);

  return (
    <div className="flex flex-col gap-4">
      {/* Price head */}
      <div className="flex items-end justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3.5">
        <div>
          <p className="font-heading text-2xl font-semibold tracking-[-0.02em]">
            £{studio.hourlyPrice}
            <span className="text-sm font-normal text-muted-foreground">
              {" / hour"}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Minimum 1 hour
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium">
          <StarIcon className="size-4 fill-current text-amber-500" />
          {studio.rating.toFixed(1)}
          <span className="font-normal text-muted-foreground">
            ({studio.reviewCount})
          </span>
        </span>
      </div>

      {/* Availability calendar */}
      <AvailabilityCalendar
        studioId={studioId}
        selected={date}
        onSelect={setDate}
        bookings={effectiveBookings}
      />

      {availabilityError && !availabilityLoading && (
        <div className="rounded-xl border border-border bg-rose-50/10 p-3">
          <p className="text-xs text-rose-700">
            Could not load availability. Please try again.
          </p>
        </div>
      )}

      {/* Time controls and booking summary — only after a date is chosen */}
      {date && (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="start-time"
                className="text-xs font-medium text-muted-foreground"
              >
                Start time
              </label>
              <Select
                value={String(startHour)}
                onValueChange={(v) => {
                  const nextHour = Number(v ?? startHour);
                  if (nextHour + hours <= 23) {
                    setStartHour(nextHour);
                  }
                }}
                disabled={availableStartHours.length === 0}
              >
                <SelectTrigger id="start-time" className="h-9 w-full bg-card">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent
                  side="bottom"
                  alignItemWithTrigger={false}
                  collisionAvoidance={{
                    side: "shift",
                    align: "shift",
                    fallbackAxisSide: "none",
                  }}
                >
                  {availableStartHours.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {label(h)}
                    </SelectItem>
                  ))}
                  {availableStartHours.length === 0 && (
                    <SelectItem key="none" value="none" disabled>
                      No available times
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="duration"
                className="text-xs font-medium text-muted-foreground"
              >
                Duration
              </label>
              <Select
                value={String(hours)}
                onValueChange={(v) => setHours(Number(v ?? 2))}
              >
                <SelectTrigger id="duration" className="h-9 w-full bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  side="bottom"
                  alignItemWithTrigger={false}
                  collisionAvoidance={{
                    side: "shift",
                    align: "shift",
                    fallbackAxisSide: "none",
                  }}
                >
                  {DURATION_OPTIONS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {h} {h === 1 ? "hour" : "hours"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Booking summary */}
          <div className="rounded-xl border border-border bg-card px-4 py-3.5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Booking summary
            </h3>
            <div className="flex items-center justify-between py-0.5 text-sm">
              <span className="text-muted-foreground">Studio</span>
              <span className="text-foreground font-medium">{studio.name}</span>
            </div>
            <div className="flex items-center justify-between py-0.5 text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="text-foreground font-medium">
                {formatIsoDate(date)}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5 text-sm">
              <span className="text-muted-foreground">Time</span>
              <span className="text-foreground font-medium">
                {label(startHour)} – {label(endHour)}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5 text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="text-foreground font-medium">
                {hours} {hours === 1 ? "hour" : "hours"}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5 text-sm">
              <span className="text-muted-foreground">Hourly price</span>
              <span className="text-foreground font-medium tabular-nums">
                £{studio.hourlyPrice}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2.5 font-medium">
              <span className="text-muted-foreground">Total</span>
              <span className="font-heading text-base font-semibold tabular-nums">
                £{total}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleBook}
            disabled={
              submitting ||
              availableStartHours.length === 0 ||
              !isStartTimeValid
            }
            className="h-12 w-full rounded-full"
          >
            {submitting
              ? "Processing…"
              : `Request to book · ${formatIsoDate(date)}`}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheckIcon className="size-3.5" />
            Free cancellation up to 24 hours before
          </p>
        </>
      )}

      {!date && (
        <p className="text-xs text-center text-muted-foreground">
          Select a date from the calendar to see available time slots.
        </p>
      )}

      {/* Host row */}
      {studio.host && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={img(studio.host.avatar, "avatar")}
              alt={studio.host.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{studio.host.name}</p>

            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
              <ClockIcon className="size-3" />
              Host since {studio.host.since}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMessage}
            className="shrink-0 rounded-full"
          >
            <MessageSquareIcon className="size-3.5" />
            Message
          </Button>
        </div>
      )}
    </div>
  );
};
