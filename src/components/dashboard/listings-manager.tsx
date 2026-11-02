"use client";

import * as React from "react";
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
import { img } from "@/lib/images";
import { bookings } from "@/data/bookings";
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
 * mock pause/resume and a confirmed delete (local state only — swap for
 * API mutations later).
 */
export function ListingsManager({ listings }: { listings: Studio[] }) {
  const [items, setItems] = React.useState<Studio[]>(listings);
  const [deleting, setDeleting] = React.useState<Studio | null>(null);

  function confirmDelete() {
    if (!deleting) return;
    setItems((prev) => prev.filter((s) => s.id !== deleting.id));
    toast.add({
      type: "success",
      title: "Listing deleted",
      description: `${deleting.name} was removed from your listings.`,
    });
    setDeleting(null);
  }

  function togglePause(studio: Studio) {
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
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={EyeOffIcon}
        title="No listings left"
        description="You've deleted every listing. Create a new one to start taking bookings again."
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
        const bookingCount = bookings.filter(
          (b) => b.studioId === studio.id,
        ).length;

        return (
          <article
            key={studio.id}
            className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/30 sm:flex-row sm:items-center"
          >
            {/* Thumbnail */}
            <Link
              href={`/studios/${studio.slug}`}
              className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:aspect-video sm:w-40"
            >
              <Image
                src={img(studio.images[0], "thumb")}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 160px"
                className="zoom-media object-cover"
              />
            </Link>

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
                  {studio.rating.toFixed(1)}
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
}
