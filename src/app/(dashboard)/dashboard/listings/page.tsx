import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { myListings } from "@/data/bookings";
import { ListingsManager } from "@/components/dashboard/listings-manager";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My listings — StudioSpace",
};

/** Host listing management: create, edit, pause and delete listings. */
export default function ListingsPage() {
  const live = myListings.filter((s) => s.status === "live").length;
  const other = myListings.length - live;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow text-primary">Manage</span>
          <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] sm:text-4xl">
            My listings
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {myListings.length} listings · {live} live
            {other > 0 && ` · ${other} not published`}
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

      <ListingsManager listings={myListings} />
    </div>
  );
}
