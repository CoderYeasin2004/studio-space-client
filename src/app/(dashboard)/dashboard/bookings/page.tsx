import type { Metadata } from "next";
import { bookings } from "@/data/bookings";
import { BookingsView } from "@/components/dashboard/bookings-view";

export const metadata: Metadata = {
  title: "My bookings — StudioSpace",
};

/** Booking history and management — data is mocked, state lives client-side. */
export default function BookingsPage() {
  return <BookingsView bookings={bookings} />;
}
