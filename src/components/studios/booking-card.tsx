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

const START_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const DURATION_OPTIONS = [1, 2, 3, 4, 6, 8];

const label = (hour: number) => {
  return `${String(hour).padStart(2, "0")}:00`;
};

/**
 * Visual booking panel: availability calendar, time controls and a live
 * price breakdown. Submits to POST /studios/booking and reports the outcome
 * as a toast.
 */
export const BookingCard = ({ studio }: { studio: Studio }) => {
  const [date, setDate] = React.useState("");
  const [startHour, setStartHour] = React.useState(10);
  const [hours, setHours] = React.useState(2);
  const [submitting, setSubmitting] = React.useState(false);

  const subtotal = studio.hourlyPrice * hours;
  const fee = Math.round(subtotal * 0.08);
  const total = subtotal + fee;
  const endHour = startHour + hours;
  const availableStartHours = START_HOURS.filter(
  (hour) => hour + hours <= 23,
);

  const handleBook = async () => {
    if (!date) {
      toast.add({
        type: "warning",
        title: "Pick an available date",
        description: "Choose a highlighted day in the calendar first.",
      });
      return;
    }

    // Ignore repeat clicks while a request is already in flight.
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/booking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studioId: studio.id ?? studio._id ?? "",
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
  const data = await response.json();

  toast.add({
    type: "warning",
    title: "Time slot unavailable",
    description: data.message,
  });

  return;
}

if (!response.ok) {
  throw new Error("Booking failed");
}

      toast.add({
        type: "success",
        title: "Booking request sent",
        description: `${studio.name} · ${formatIsoDate(date)} · ${label(
          startHour,
        )}–${label(endHour)} · £${total}`,
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

  const handleMessage = () => {
    if (!studio.host) return;

    toast.add({
      type: "info",
      title: `Message sent to ${studio.host.name}`,
      description: "Hosts usually reply within a couple of hours.",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Price head */}
      <div className="flex items-end justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3.5">
        <div>
          <p className="font-heading text-2xl font-semibold tracking-[-0.02em]">
            £{studio.hourlyPrice}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / hour
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Minimum 1 hour · VAT included
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

     <AvailabilityCalendar
  studioId={studio._id ?? studio.id ?? ""}
  selected={date}
  onSelect={setDate}
/>

      {/* Time controls */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="start-time"
            className="text-xs font-medium text-muted-foreground"
          >
            Start time
          </label>
          <Select
  value={String(hours)}
  onValueChange={(v) => {
    const nextHours = Number(v ?? 2);
    setHours(nextHours);

    if (startHour + nextHours > 23) {
      setStartHour(23 - nextHours);
    }
  }}
>
            <SelectTrigger id="start-time" className="h-9 w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
             {availableStartHours.map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {label(h)}
                </SelectItem>
              ))}
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
            <SelectContent>
              {DURATION_OPTIONS.map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {h} {h === 1 ? "hour" : "hours"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm">
        <div className="flex items-center justify-between py-0.5 text-muted-foreground">
          <span>
            £{studio.hourlyPrice} × {hours} {hours === 1 ? "hour" : "hours"}
          </span>
          <span className="tabular-nums">£{subtotal}</span>
        </div>
        <div className="flex items-center justify-between py-0.5 text-muted-foreground">
          <span>Service fee</span>
          <span className="tabular-nums">£{fee}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-2.5 font-medium">
          <span>Total</span>
          <span className="font-heading text-base font-semibold tabular-nums">
            £{total}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleBook}
        disabled={submitting}
        className="h-12 w-full rounded-full"
      >
        {date ? `Request to book · ${formatIsoDate(date)}` : "Request to book"}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheckIcon className="size-3.5" />
        Free cancellation up to 24 hours before
      </p>

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
