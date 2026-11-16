import type { Metadata } from "next";
import type { IBooking } from "@/types/studio";
import { BookingsView } from "@/components/dashboard/bookings-view";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

export const metadata: Metadata = {
  title: "My bookings — StudioSpace",
};

export const instant = false;

const BookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const token = await getTokenFromServer();

  let bookings: IBooking[] = [];

  if (user?.email) {
    try {
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/my-studio-bookings/${encodeURIComponent(user.email)}`,
        {
          cache: "no-store",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data: unknown = await response.json();

        if (Array.isArray(data)) {
          bookings = data as IBooking[];
        }
      }
    } catch {
      bookings = [];
    }
  }

  return <BookingsView bookings={bookings} />;
};

export default BookingsPage;