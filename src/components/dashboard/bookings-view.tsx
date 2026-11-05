"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  RotateCcwIcon,
  SearchXIcon,
  WalletIcon,
} from "lucide-react";
import { cn } from "cn";
import { img } from "@/lib/images";
import type { Booking, BookingStatus } from "@/types/studio";
import { formatIsoDate } from "@/data/availability";
import { StatusBadge } from "./status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TabKey = "upcoming" | "past" | "all";

const statusItems: Record<string, string> = {
  all: "Any status",
  confirmed: "Confirmed",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "all", label: "All" },
];

const isUpcoming = (b: Booking) =>
  b.status === "confirmed" || b.status === "pending";

/** Summary tiles derived from the filtered set. */
const summarise = (rows: Booking[]) => {
  return {
    count: rows.length,
    hours: rows.reduce((sum, b) => sum + b.hours, 0),
    spend: rows.reduce((sum, b) => sum + b.total, 0),
  };
};

/**
 * Client-side bookings screen: tab through upcoming/past, narrow by status or
 * studio, and cancel a pending request. Bookings arrive as props from the
 * page's API fetch; all filter state stays local.
 */

export const BookingsView = ({ bookings }: { bookings: Booking[] }) => {
  const [tab, setTab] = React.useState<TabKey>("upcoming");
  const [status, setStatus] = React.useState<BookingStatus | "all">("all");
  const [query, setQuery] = React.useState("");
  const [rows, setRows] = React.useState<Booking[]>(bookings);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((booking) => {
      if (tab === "upcoming" && !isUpcoming(booking)) return false;
      if (tab === "past" && isUpcoming(booking)) return false;
      if (status !== "all" && booking.status !== status) return false;
      if (
        q &&
        !`${booking.studioName} ${booking.location} ${booking.date}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [rows, tab, status, query]);

  const stats = summarise(filtered);
  const isFiltered = status !== "all" || query.trim() !== "";

  const resetFilters = () => {
    setStatus("all");
    setQuery("");
  };

 const cancelBooking = async (booking: Booking) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/booking/${encodeURIComponent(booking.id)}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to cancel booking");
    }

    const result = await response.json();

    if (!result.acknowledged || result.deletedCount === 0) {
      throw new Error("Booking was not deleted");
    }

    setRows((prev) =>
      prev.filter((b) => b.id !== booking.id),
    );

    toast.add({
      type: "success",
      title: "Booking cancelled",
      description: `${booking.studioName} booking has been removed.`,
    });
  } catch {
    toast.add({
      type: "error",
      title: "Cancellation failed",
      description: "Could not cancel your booking. Please try again.",
    });
  }
};

  return (
    <div className="flex flex-col gap-7">
      {/* ---------- Heading ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow text-primary">Manage</span>
          <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
            My bookings
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Track requests, review past sessions and keep your calendar honest.
          </p>
        </div>
        <Button
          render={<Link href="/studios" />}
          className="h-11 w-fit shrink-0 rounded-full px-5"
        >
          <CalendarIcon className="size-4" />
          Book another studio
        </Button>
      </div>

      {/* ---------- Summary tiles ---------- */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <SummaryTile
          icon={CalendarIcon}
          label={tab === "past" ? "Past sessions" : "Sessions"}
          value={String(stats.count)}
        />
        <SummaryTile
          icon={ClockIcon}
          label="Hours booked"
          value={`${stats.hours}h`}
        />
        <SummaryTile
          icon={WalletIcon}
          label="Total spend"
          value={`£${stats.spend}`}
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {/* ---------- Controls ---------- */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(value) => setTab(value as TabKey)}>
          <TabsList className="h-9 w-full sm:w-auto">
            {tabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="px-4">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search studio or city…"
              aria-label="Search bookings"
              className="h-9 w-full rounded-lg bg-background sm:w-56"
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) =>
              setStatus((v ?? "all") as BookingStatus | "all")
            }
            items={statusItems}
          >
            <SelectTrigger className="h-9 w-full bg-background sm:w-44">
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any status</SelectItem>
              {(
                [
                  "confirmed",
                  "pending",
                  "completed",
                  "cancelled",
                ] as BookingStatus[]
              ).map((s) => (
                <SelectItem key={s} value={s}>
                  {statusItems[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-9 shrink-0 text-muted-foreground"
            >
              <RotateCcwIcon className="size-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ---------- Results ---------- */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchXIcon}
          title={tab === "upcoming" ? "Nothing booked yet" : "No bookings here"}
          description={
            isFiltered
              ? "No sessions match the current filters — try clearing them."
              : tab === "upcoming"
                ? "When you request a studio it will show up here with its status and details."
                : "Your completed and cancelled sessions will collect here."
          }
          action={
            isFiltered ? (
              <Button onClick={resetFilters} className="rounded-full px-6">
                <RotateCcwIcon className="size-4" />
                Clear filters
              </Button>
            ) : (
              <Button
                render={<Link href="/studios" />}
                className="rounded-full px-6"
              >
                Explore studios
              </Button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="pl-4 text-xs uppercase">
                    Studio
                  </TableHead>
                  <TableHead className="text-xs uppercase">When</TableHead>
                  <TableHead className="text-xs uppercase">Hours</TableHead>
                  <TableHead className="text-right text-xs uppercase">
                    Total
                  </TableHead>
                  <TableHead className="text-xs uppercase">Status</TableHead>
                  <TableHead className="pr-4 text-right text-xs uppercase">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((booking) => {
                  const slug = booking.studioSlug;
                  const cancellable =
                    booking.status === "confirmed" ||
                    booking.status === "pending";

                  return (
                    <TableRow key={booking.id} className="border-border">
                      <TableCell className="py-3 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={img(booking.studioImage, "thumb")}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {booking.studioName}
                            </p>
                            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                              <MapPinIcon className="size-3" />
                              {booking.location}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                        {formatIsoDate(booking.date)}
                        <span className="block text-xs text-muted-foreground/70">
                          {booking.startTime}–{booking.endTime}
                        </span>
                      </TableCell>

                      <TableCell className="text-sm tabular-nums text-muted-foreground">
                        {booking.hours}h
                      </TableCell>

                      <TableCell className="text-right text-sm font-medium tabular-nums">
                        £{booking.total}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>

                      <TableCell className="pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {cancellable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => cancelBooking(booking)}
                            >
                              Cancel
                            </Button>
                          )}
                          {slug && (
                            <Link
                              href={`/studios/${slug}`}
                              aria-label={`View ${booking.studioName}`}
                              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                              <ArrowUpRightIcon className="size-4" />
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryTile = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:p-5",
        className,
      )}
    >
      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-heading text-2xl font-semibold tracking-[-0.02em] tabular-nums sm:text-3xl">
          {value}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};
