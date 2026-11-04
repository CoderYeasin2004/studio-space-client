
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import type { Studio } from "@/types/studio";
import { ListingsManager } from "@/components/dashboard/listings-manager";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My listings — StudioSpace",
};

/**
 * The listings page reads live data from the API on every request
 * (`cache: "no-store"`), so there is no static shell to prerender.
 * Same blocking-route pattern as the edit route.
 */
export const instant = false;

const ListingsPage = async () => {
  let listings: Studio[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch studios");
    }

    listings = await response.json();
    console.log("First Listing:", listings[0]);
console.log("First Listing Slug:", listings[0]?.slug);
  } catch (error) {
    console.error("Failed to load listings:", error);
  }

  const live = listings.filter((s) => s.status === "live").length;
  const other = listings.length - live;

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
          render={<Link href="/dashboard/listings/new" />}
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
