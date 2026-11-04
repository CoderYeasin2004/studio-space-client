import Link from "next/link";
import { ArrowRightIcon, CalendarIcon, PlusIcon } from "lucide-react";
import type { Booking } from "@/types/studio";
import { bookingTrend, dashboardStats, recentActivity } from "@/data/bookings";
import { StatCard } from "@/components/dashboard/stat-card";
import { BookingTrendChart } from "@/components/dashboard/booking-trend-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { BookingTable } from "@/components/dashboard/booking-table";
import { FavoritesPanel } from "@/components/dashboard/favorites-panel";
import { Button } from "@/components/ui/button";
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

const DashboardPage = async () => {
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

  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  );

  return (
    <div className="flex flex-col gap-7">
      {/* ---------- Greeting ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow text-primary">Overview</span>
          <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
            Welcome back, Alex.
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Your spaces are booked 12% more than last month. Here&apos;s the
            shape of it.
          </p>
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
