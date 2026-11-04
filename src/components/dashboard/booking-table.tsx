import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { img } from "@/lib/images";
import { studios } from "@/data/studios";
import type { Booking } from "@/types/studio";
import { StatusBadge } from "./status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// fetch data here — this component reads the studio catalogue directly.

/**
 * Bookings table shared by the dashboard overview and the bookings page.
 * Rows deep-link to the studio; statuses are mock-data driven.
 */
export const BookingTable = ({ bookings }: { bookings: Booking[] }) => {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="pl-0 text-xs uppercase">Studio</TableHead>
            <TableHead className="text-xs uppercase">When</TableHead>
            <TableHead className="text-xs uppercase">Hours</TableHead>
            <TableHead className="text-right text-xs uppercase">Total</TableHead>
            <TableHead className="text-xs uppercase">Status</TableHead>
            <TableHead className="pr-0 text-right text-xs uppercase">
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const slug = studios.find((s) => s.id === booking.studioId)?.slug;
            return (
              <TableRow key={booking.id} className="border-border">
                <TableCell className="py-3 pl-0">
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
                      <p className="truncate text-xs text-muted-foreground">
                        {booking.location}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                  {booking.date}
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
                <TableCell className="pr-0 text-right">
                  {slug && (
                    <Link
                      href={`/studios/${slug}`}
                      aria-label={`View ${booking.studioName}`}
                      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <ArrowUpRightIcon className="size-4" />
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
