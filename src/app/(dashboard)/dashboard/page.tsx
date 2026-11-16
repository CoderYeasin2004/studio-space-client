import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  PlusIcon,
  UserRoundIcon,
} from "lucide-react";
import type { IBooking, IDashboardStat, IStudio } from "@/types/studio";

import { StatCard } from "@/components/dashboard/stat-card";
import { BookingTable } from "@/components/dashboard/booking-table";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export const metadata = {
  title: "Dashboard — StudioSpace",
};

/**
 * Dashboard overview: KPIs, trend, activity, bookings and favourites.
 * Bookings load live from the API on every request (`cache: "no-store"`),
 * same blocking-route pattern as the listings page.
 */

export const instant = false;

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  let myStudios: IStudio[] = [];

const token = await getTokenFromServer();

try {
  if (user?.email) {
    if (!token) {
      throw new Error("Authentication required");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/my-studios/${encodeURIComponent(user.email)}`,
      {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch studios");
    }

    const data: unknown = await response.json();
    if (Array.isArray(data)) {
      myStudios = data as IStudio[];
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

const dashboardStats: IDashboardStat[] = [
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

const upcomingBookings = bookings.filter(
  (b) => b.status === "confirmed" || b.status === "pending",
);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow text-primary">Overview</span>
          <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
            Welcome back, {user?.name || "Creator"}.
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Here&apos;s an overview of your studios and bookings.
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
          render={<Link href="/dashboard/my-listings/new-studios" />}
          className="h-11 w-fit shrink-0 rounded-full px-5"
        >
          <PlusIcon className="size-4" />
          List a studio
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <Card className="gap-3">
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
              render={<Link href="/dashboard/my-bookings" />}
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
    </div>
  );
};

export default DashboardPage;
