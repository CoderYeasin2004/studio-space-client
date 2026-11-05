import type { Metadata } from "next";
import type { Booking } from "@/types/studio";
import { BookingsView } from "@/components/dashboard/bookings-view";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "My bookings — StudioSpace",
};

export const instant = false;

const BookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  let bookings: Booking[] = [];

  if (user?.email) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/my-studio-bookings/${encodeURIComponent(user.email)}`,
        {
          cache: "no-store",
        },
      );

      if (response.ok) {
        const data: unknown = await response.json();

        if (Array.isArray(data)) {
          bookings = data as Booking[];
        }
      }
    } catch {
      bookings = [];
    }
  }

  return <BookingsView bookings={bookings} />;
};

export default BookingsPage;