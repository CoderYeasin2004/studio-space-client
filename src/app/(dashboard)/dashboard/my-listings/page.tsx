import { headers } from "next/headers";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import type { IStudio } from "@/types/studio";
import { ListingsManager } from "@/components/dashboard/listings-manager";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "My listings — StudioSpace",
};

export const instant = false;

const ListingsPage = async () => {
  const session = await auth.api.getSession({
  headers: await headers(),
});

  if (!session?.user?.email) {
    return <p>Please login to see your listings.</p>;
  }

  const token = await getTokenFromServer();

  let listings: IStudio[] = [];

  try {
    if (!token) {
      throw new Error("Authentication required");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/my-studios/${encodeURIComponent(session.user.email)}`,
      {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch your listings");
    }

    listings = await response.json();
  } catch (error) {
    console.error("Failed to load my listings:", error);
  }

  const live = listings.filter((s) => s.status === "live").length;
  const other = listings.length - live;

  if (listings.length === 0) {
    return (
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow text-primary">Manage</span>

            <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] sm:text-4xl">
              My listings
            </h2>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Manage your studio listings.
            </p>
          </div>

          <Button
            render={<Link href="/dashboard/my-listings/new-studios" />}
            className="h-11 w-fit shrink-0 rounded-full px-5"
          >
            <PlusIcon className="size-4" />
            New listing
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow text-primary">Manage</span>

          <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] sm:text-4xl">
            My listings
          </h2>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {listings.length === 0
              ? "No listings loaded yet."
              : `${listings.length} listing${listings.length === 1 ? "" : "s"} · ${live} live${
                  other > 0 ? ` · ${other} not published` : ""
                }`}
          </p>
        </div>

        <Button
          render={<Link href="/dashboard/my-listings/new-studios" />}
          className="h-11 w-fit shrink-0 rounded-full px-5"
        >
          <PlusIcon className="size-4" />
          New listing
        </Button>
      </div>

      <ListingsManager
        key={listings.map((studio) => studio._id ?? studio.id ?? studio.slug).join("-")}
        listings={listings}
      />
    </div>
  );
};

export default ListingsPage;