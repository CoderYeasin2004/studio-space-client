import { headers } from "next/headers";
import Link from "next/link";
import { PlusIcon, EyeOffIcon } from "lucide-react";
import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import type { IStudio } from "@/types/studio";
import { ListingsManager } from "@/components/dashboard/listings-manager";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

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
  let fetchError: string | null = null;

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

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Unexpected response from server");
    }
    listings = data as IStudio[];
  } catch (error) {
    console.error("Failed to load my listings:", error);
    fetchError =
      error instanceof Error ? error.message : "Failed to load your listings";
  }

  const live = listings.filter((s) => s.status === "live").length;
  const other = listings.length - live;

  const pageHeader = (
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
  );

  if (fetchError) {
    return (
      <div className="flex flex-col gap-7">
        {pageHeader}

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          <EmptyState
            icon={EyeOffIcon}
            title="Unable to load listings"
            description={fetchError}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  window.location.reload();
                }}
                className="mt-4 rounded-full px-6"
              >
                Try again
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col gap-7">
        {pageHeader}

        <EmptyState
          icon={EyeOffIcon}
          title="No listings yet"
          description="You haven't created any studio listings yet. Create your first listing to get started."
          action={
            <Button
              render={<Link href="/dashboard/my-listings/new-studios" />}
              className="rounded-full px-6"
            >
              Create a listing
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      {pageHeader}

      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        {`${listings.length} listing${listings.length === 1 ? "" : "s"} · ${live} live${
          other > 0 ? ` · ${other} not published` : ""
        }`}
      </p>

      <ListingsManager
        key={listings.map((studio) => studio._id ?? studio.id ?? studio.slug).join("-")}
        listings={listings}
      />
    </div>
  );
};

export default ListingsPage;