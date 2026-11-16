export type TBookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

export interface IBooking {
  id: string;
  studioId: string;
  studioSlug?: string;
  studioName: string;
  studioImage: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  total: number;
  status: TBookingStatus;
}

export interface IBookingCalendarProps {
  /** Bookings for the authenticated host's own studios (fetched server-side). */
  bookings: IBooking[];
}
