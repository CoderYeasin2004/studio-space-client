import type {
  ActivityEvent,
  Booking,
  DashboardStat,
  UserProfile,
} from "@/types/studio";
import { studios } from "./studios";

/**
 * fetch data here — bookings, profile, KPIs and the trend chart read from
 * this file. Listings deliberately do NOT: they are fetched on the listings
 * pages so they can stay dynamic. Swap the arrays below for API responses
 * (or move each one into the page that renders it) and grep
 * "fetch data here" for every call site.
 */
export const bookings: Booking[] = [
  {
    id: "bk-1041",
    studioId: "st-01",
    studioName: "Lumen Daylight Loft",
    studioImage: "1560787313-5dff3307e257",
    location: "Shoreditch, London",
    date: "2026-11-08",
    startTime: "09:00",
    endTime: "13:00",
    hours: 4,
    total: 340,
    status: "confirmed",
  },
  {
    id: "bk-1039",
    studioId: "st-03",
    studioName: "The Green Room",
    studioImage: "1590602847861-f357a9332bbc",
    location: "Bushwick, Brooklyn",
    date: "2026-11-14",
    startTime: "18:00",
    endTime: "21:00",
    hours: 3,
    total: 195,
    status: "confirmed",
  },
  {
    id: "bk-1036",
    studioId: "st-04",
    studioName: "Analog Attic",
    studioImage: "1598488035139-bdbb2231ce04",
    location: "Hackney, London",
    date: "2026-10-27",
    startTime: "14:00",
    endTime: "18:00",
    hours: 4,
    total: 380,
    status: "completed",
  },
  {
    id: "bk-1033",
    studioId: "st-06",
    studioName: "Aperture Cyclorama",
    studioImage: "1607462109225-6b64ae2dd3cb",
    location: "Capitol Hill, Seattle",
    date: "2026-10-19",
    startTime: "10:00",
    endTime: "16:00",
    hours: 6,
    total: 660,
    status: "completed",
  },
  {
    id: "bk-1030",
    studioId: "st-05",
    studioName: "Kiln & Workshop",
    studioImage: "1531058020387-3be344556be6",
    location: "Leith, Edinburgh",
    date: "2026-11-22",
    startTime: "11:00",
    endTime: "15:00",
    hours: 4,
    total: 180,
    status: "pending",
  },
  {
    id: "bk-1027",
    studioId: "st-09",
    studioName: "Studio Marigold",
    studioImage: "1517502884422-41eaead166d4",
    location: "Kreuzberg, Berlin",
    date: "2026-11-03",
    startTime: "08:00",
    endTime: "12:00",
    hours: 4,
    total: 280,
    status: "cancelled",
  },
];

export const upcomingBookings = bookings.filter(
  (b) => b.status === "confirmed" || b.status === "pending",
);

export const recentBookings = bookings.filter(
  (b) => b.status === "completed" || b.status === "cancelled",
);

export const favoriteStudioIds = ["st-02", "st-04", "st-10", "st-05"];

export const favoriteStudios = studios.filter((s) =>
  favoriteStudioIds.includes(s.id),
);

export const userProfile: UserProfile = {
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  role: "Creator & part-time host",
  location: "London, UK",
  avatar: "1519085360753-af0119f7cbe7",
  joined: "March 2024",
  bio: "Portrait and editorial photographer. I shoot out of Lumen most weeks and host a small podcast room in Camden.",
};

export const dashboardStats: DashboardStat[] = [
  { label: "Bookings", value: "18", delta: "+12%", trend: "up", icon: "calendar" },
  { label: "Hours booked", value: "64", delta: "+8%", trend: "up", icon: "clock" },
  { label: "Favourites", value: "23", delta: "+4", trend: "up", icon: "heart" },
  { label: "Saved spend", value: "£412", delta: "-3%", trend: "down", icon: "wallet" },
];

export const recentActivity: ActivityEvent[] = [
  {
    id: "ac-1",
    label: "Booking confirmed",
    detail: "Lumen Daylight Loft · 8 Nov",
    timestamp: "2 hours ago",
    icon: "calendar-check",
  },
  {
    id: "ac-2",
    label: "Studio favourited",
    detail: "Northlight Stage, Berlin",
    timestamp: "Yesterday",
    icon: "heart",
  },
  {
    id: "ac-3",
    label: "Review posted",
    detail: "Analog Attic · 5 stars",
    timestamp: "2 days ago",
    icon: "star",
  },
  {
    id: "ac-4",
    label: "Listing updated",
    detail: "Midnight Radio · price changed",
    timestamp: "4 days ago",
    icon: "pencil",
  },
  {
    id: "ac-5",
    label: "Payment receipt",
    detail: "£380 · Analog Attic",
    timestamp: "1 week ago",
    icon: "receipt",
  },
];

/** Monthly booking trend for the dashboard chart. */
export const bookingTrend = [
  { month: "Jun", bookings: 8, hours: 26 },
  { month: "Jul", bookings: 12, hours: 41 },
  { month: "Aug", bookings: 10, hours: 33 },
  { month: "Sep", bookings: 16, hours: 52 },
  { month: "Oct", bookings: 14, hours: 47 },
  { month: "Nov", bookings: 18, hours: 64 },
];

/** Rough availability map used by the detail-page calendar (visual only). */
export const unavailableDates: string[] = [
  "2026-11-05",
  "2026-11-06",
  "2026-11-12",
  "2026-11-19",
  "2026-11-20",
  "2026-11-27",
];
