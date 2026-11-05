"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  EyeOffIcon,
  MoreHorizontalIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { categoryLabels } from "@/data/categories";
import type { ListingStatus, Studio } from "@/types/studio";
import { StatusBadge } from "./status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

/**
 * Client-side listings manager: renders the host's listings, allows a
 * pause/resume and a confirmed delete.
 *
 * fetch data here — `listings` is passed in from the listings page (already
 * wired for dynamic data). The two mutations below still only touch local
 * state; swap `setItems` for your API calls when the backend lands.
 */
export const ListingsManager = ({ listings }: { listings: Studio[] }) => {
  const [items, setItems] = React.useState<Studio[]>(listings);
  const [deleting, setDeleting] = React.useState<Studio | null>(null);
  const router = useRouter();

const confirmDelete = async () => {
  if (!deleting?.id) {
    toast.add({
      type: "error",
      title: "Listing ID missing",
    });
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${encodeURIComponent(deleting.id)}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete listing");
    }

    const result = await response.json();

    if (!result.acknowledged || result.deletedCount === 0) {
      throw new Error("Listing was not deleted");
    }

    setItems((prev) =>
  prev.filter((studio) => studio.id !== deleting.id),
);

router.refresh();

toast.add({
  type: "success",
  title: "Listing deleted",
  description: `${deleting.name} was removed from your listings.`,
});
  } catch {
    toast.add({
      type: "error",
      title: "Delete failed",
      description: "Could not delete your listing. Please try again.",
    });
  } finally {
    setDeleting(null);
  }
};
  const togglePause = (studio: Studio) => {
    const next: ListingStatus = studio.status === "live" ? "paused" : "live";
    setItems((prev) =>
      prev.map((s) => (s.id === studio.id ? { ...s, status: next } : s)),
    );
    toast.add({
      type: next === "live" ? "success" : "warning",
      title: next === "live" ? "Listing is live" : "Listing paused",
      description:
        next === "live"
          ? `${studio.name} is visible in Explore again.`
          : `${studio.name} is hidden from Explore until you resume it.`,
    });
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={EyeOffIcon}
        title="No listings yet"
        description="Nothing to show here yet. Create your first listing and it will appear here with its status and bookings."
        action={
          <Button
            render={<Link href="/dashboard/listings/new" />}
            className="rounded-full px-6"
          >
            Create a listing
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {items.map((studio) => {
        // fetch data here — per-listing booking count should come from your
        // API (e.g. `studio.bookingCount`). It reads the mock bookings table
        // today, which no longer matches these listings, so it starts at 0.
        const bookingCount: number = 0;

        return (
          <article
            key={studio._id ?? studio.id ?? studio.slug}
            className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/30 sm:flex-row sm:items-center"
          >
            {/* Thumbnail */}
            <Link
              href={`/studios/${studio.slug}`}
              className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:aspect-video sm:w-40"
            >
 {studio.images?.[0] ? (
  <Image
    src={studio.images[0]}
    alt={studio.name}
    fill
    unoptimized
    sizes="(max-width: 640px) 100vw, 160px"
    className="zoom-media object-cover"
  />
) : (
  <div className="flex h-full w-full items-center justify-center bg-muted">
    <span className="text-sm text-muted-foreground">
      No image available
    </span>
  </div>
)}     </Link>

            {/* Body */}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/studios/${studio.slug}`}
                  className="font-heading truncate text-base font-semibold tracking-[-0.01em] outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {studio.name}
                </Link>
                <StatusBadge status={studio.status} kind="listing" />
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {categoryLabels[studio.category]} · {studio.location}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <StarIcon className="size-3.5 fill-current text-amber-500" />
                  {(studio.rating ?? 0).toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <UsersIcon className="size-3.5" />
                  {studio.capacity} capacity
                </span>
                <span className="tabular-nums">
                  {bookingCount} {bookingCount === 1 ? "booking" : "bookings"}
                </span>
                <span className="font-medium text-foreground">
                  £{studio.hourlyPrice}/hr
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                render={<Link href={`/dashboard/listings/${studio.id}/edit`} />}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <PencilIcon className="size-3.5" />
                Edit
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`More actions for ${studio.name}`}
                    />
                  }
                >
                  <MoreHorizontalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => togglePause(studio)}
                    className="gap-2"
                  >
                    <EyeOffIcon className="size-4" />
                    {studio.status === "live" ? "Pause listing" : "Resume listing"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={
                      <Link href={`/studios/${studio.slug}`} />
                    }
                    className="gap-2"
                  >
                    <StarIcon className="size-4" />
                    Preview listing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleting(studio)}
                    className="gap-2 text-destructive focus:text-destructive [&_svg]:text-destructive"
                  >
                    <Trash2Icon className="size-4" />
                    Delete listing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </article>
        );
      })}

      {/* ---------- Delete confirmation ---------- */}
      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && (
                <>
                  <strong className="font-medium text-foreground">
                    {deleting.name}
                  </strong>{" "}
                  will be removed from your dashboard and from Explore. Any
                  future bookings attached to it will be cancelled. This can&apos;t
                  be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep listing</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              <Trash2Icon className="size-4" />
              Delete listing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
