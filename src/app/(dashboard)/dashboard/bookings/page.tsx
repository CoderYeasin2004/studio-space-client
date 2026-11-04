import type { Metadata } from "next";
import type { Booking } from "@/types/studio";
import { BookingsView } from "@/components/dashboard/bookings-view";

export const metadata: Metadata = {
  title: "My bookings — StudioSpace",
};

/**
 * Booking history and management — live data from the API on every request
 * (`cache: "no-store"`), same blocking-route pattern as the listings page.
 */
export const instant = false;

const BookingsPage = async () => {
  let bookings: Booking[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/booking`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch bookings (${response.status})`);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Bookings response was not a list");
    }

    bookings = data as Booking[];
  } catch (error) {
    console.error("Failed to load bookings:", error);
  }

  return <BookingsView bookings={bookings} />;
};

export default BookingsPage;
