import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  CalendarIcon,
  PlusIcon,
  UserRoundIcon,
} from "lucide-react";
import type {
  ActivityEvent,
  Booking,
  DashboardStat,
  Studio,
} from "@/types/studio";

import { StatCard } from "@/components/dashboard/stat-card";
import { BookingTrendChart } from "@/components/dashboard/booking-trend-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { BookingTable } from "@/components/dashboard/booking-table";
import { FavoritesPanel } from "@/components/dashboard/favorites-panel";
import { Button } from "@/components/ui/button";import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Dashboard — StudioSpace",
};

/**
 * Dashboard overview: KPIs, trend, activity, bookings and favourites.
 * Bookings load live from the API on every request (`cache: "no-store"`),
 * same blocking-route pattern as the listings page.
 */

export const instant = false;

type TimestampedStudio = Studio & {
  createdAt?: string;
  updatedAt?: string;
};

type TimestampedBooking = Booking & {
  createdAt?: string;
  confirmedAt?: string;
};


const formatActivityTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown date";

  const diff = Date.now() - date.getTime();

  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000)
    return `${Math.floor(diff / 60_000)} minutes ago`;
  if (diff < 86_400_000)
    return `${Math.floor(diff / 3_600_000)} hours ago`;
  if (diff < 604_800_000)
    return `${Math.floor(diff / 86_400_000)} days ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};


const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  let myStudios: Studio[] = [];

try {
  if (user?.email) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/my-studios/${encodeURIComponent(user.email)}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch studios");
    }

    const data: unknown = await response.json();

    if (Array.isArray(data)) {
      myStudios = data as Studio[];
    }
  }
} catch {
  myStudios = [];
}

const liveCount = myStudios.filter(
  (studio) => studio.status === "live",
).length;

const draftCount = myStudios.filter(
  (studio) => studio.status === "draft",
).length;

const pausedCount = myStudios.filter(
  (studio) => studio.status === "paused",
).length;

const dashboardStats: DashboardStat[] = [
  {
    label: "Total Listings",
    value: String(myStudios.length),
    delta: "Your studios",
    trend: "neutral",
    icon: "listings",
  },
  {
    label: "Live Studios",
    value: String(liveCount),
    delta: "Published",
    trend: "neutral",
    icon: "live",
  },
  {
    label: "Draft Listings",
    value: String(draftCount),
    delta: "Unpublished",
    trend: "neutral",
    icon: "draft",
  },
  {
    label: "Paused Listings",
    value: String(pausedCount),
    delta: "Hidden",
    trend: "neutral",
    icon: "paused",
  },
];

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

 
const upcomingBookings = bookings.filter(
  (b) => b.status === "confirmed" || b.status === "pending",
);

const validBookings = bookings.filter(
  (booking) => booking.status !== "cancelled",
);

const now = new Date();

// Real booking trend
const bookingTrend = Array.from({ length: 6 }, (_, index) => {
  const monthDate = new Date(
    now.getFullYear(),
    now.getMonth() - 5 + index,
    1,
  );

  const monthKey = `${monthDate.getFullYear()}-${String(
    monthDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const monthlyBookings = validBookings.filter(
    (booking) => booking.date.slice(0, 7) === monthKey,
  );

  return {
    month: monthDate.toLocaleDateString("en-US", {
      month: "short",
    }),
    bookings: monthlyBookings.length,
    hours: monthlyBookings.reduce(
      (total, booking) => total + Number(booking.hours || 0),
      0,
    ),
  };
});

// Real recent activity
const activities: (ActivityEvent & { sortAt: number })[] = [];

const addActivity = (
  event: Omit<ActivityEvent, "timestamp">,
  dateValue?: string,
) => {
  if (!dateValue) return;

  const timestamp = new Date(dateValue).getTime();

  if (!Number.isFinite(timestamp)) return;

  activities.push({
    ...event,
    timestamp: formatActivityTime(dateValue),
    sortAt: timestamp,
  });
};

// Booking activities
bookings.forEach((booking) => {
  const item = booking as TimestampedBooking;

  addActivity(
    {
      id: `${item.id}-requested`,
      label: "Booking requested",
      detail: `${item.studioName} · ${item.date}`,
      icon: "calendar-check",
    },
    item.createdAt,
  );

  addActivity(
    {
      id: `${item.id}-confirmed`,
      label: "Booking confirmed",
      detail: `${item.studioName} · ${item.date}`,
      icon: "calendar-check",
    },
    item.confirmedAt,
  );
});

// Listing activities
myStudios.forEach((studio) => {
  const item = studio as TimestampedStudio;

  addActivity(
    {
      id: `${item.id ?? item._id}-created`,
      label: "Listing created",
      detail: `${item.name} · ${item.city}`,
      icon: "building",
    },
    item.createdAt,
  );

  const created = item.createdAt
    ? new Date(item.createdAt).getTime()
    : 0;

  const updated = item.updatedAt
    ? new Date(item.updatedAt).getTime()
    : 0;

  if (updated && (!created || updated - created > 1000)) {
    addActivity(
      {
        id: `${item.id ?? item._id}-updated`,
        label: "Listing updated",
        detail: `${item.name} · ${item.city}`,
        icon: "pencil",
      },
      item.updatedAt,
    );
  }
});




const recentActivity: ActivityEvent[] = activities
  .sort((a, b) => b.sortAt - a.sortAt)
  .slice(0, 5)
  .map(({ sortAt, ...event }) => event);


  return (
    <div className="flex flex-col gap-7">
      {/* ---------- Greeting ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow text-primary">Overview</span>
          <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
            Welcome back, {user?.name || "Creator"}.
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Here&apos;s an overview of your studios and recent activity.
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
  {user?.image ? (
    <Image
      src={user.image}
      alt={user.name || "User"}
      width={52}
      height={52}
      unoptimized
      className="size-13 rounded-full object-cover"
    />
  ) : (
    <div className="flex size-13 items-center justify-center rounded-full bg-primary/10 text-primary">
  <span className="text-xl font-semibold">
    {user?.name?.trim().charAt(0).toUpperCase() || "U"}
  </span>
</div>
  )}

  <div className="min-w-0 flex-1">
    <p className="truncate font-semibold">
      {user?.name || "Creator"}
    </p>

    <p className="truncate text-sm text-muted-foreground">
      {user?.email || "No email available"}
    </p>

    <p className="mt-1 text-xs text-emerald-600">
      Signed in
    </p>
  </div>
</div>
        </div>
        <Button
          render={<Link href="/dashboard/listings/new" />}
          className="h-11 w-fit shrink-0 rounded-full px-5"
        >
          <PlusIcon className="size-4" />
          List a studio
        </Button>
      </div>

      {/* ---------- KPIs ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* ---------- Trend + activity ---------- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="gap-3 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                  Booking trend
                </CardTitle>
                <CardDescription>
                  Monthly bookings across your studios
                </CardDescription>
              </div>
              <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                Last 6 months
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <BookingTrendChart data={bookingTrend} />
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="font-heading text-lg tracking-[-0.01em]">
              Recent activity
            </CardTitle>
            <CardDescription>Everything that moved this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed events={recentActivity} />
          </CardContent>
        </Card>
      </div>

      {/* ---------- Bookings + favourites ---------- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="gap-3 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                  Upcoming bookings
                </CardTitle>
                <CardDescription>
                  Confirmed and pending sessions
                </CardDescription>
              </div>
              <Button
                render={<Link href="/dashboard/bookings" />}
                variant="ghost"
                size="sm"
                className="shrink-0 text-muted-foreground"
              >
                View all
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BookingTable bookings={upcomingBookings.slice(0, 4)} />
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                  Favourites
                </CardTitle>
                <CardDescription>Spaces you&apos;ve saved</CardDescription>
              </div>
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarIcon className="size-4" />
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <FavoritesPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
