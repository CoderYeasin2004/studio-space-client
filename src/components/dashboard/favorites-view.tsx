"use client";

import * as React from "react";
import Link from "next/link";
import { HeartIcon, UsersIcon } from "lucide-react";
import { cn } from "cn";
import type { Studio } from "@/types/studio";
import type { FavoriteItem } from "@/hooks/use-favorites";
import { StudioCard } from "@/components/studio/studio-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FavoriteSortKey = "recent" | "price-asc" | "price-desc" | "rating" | "name";

const sortOptions: { key: FavoriteSortKey; label: string }[] = [
  { key: "recent", label: "Recently Added" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Highest Rated" },
  { key: "name", label: "Studio Name: A–Z" },
];

const DEFAULT_SORT: FavoriteSortKey = "recent";

interface FavoritesViewProps {
  allStudios: Studio[];
}

/**
 * My Favorites page content. Reads the single shared favourite store via
 * `useFavorites`, filters the studio catalogue to favourited studios, and
 * applies the selected sort order. Works for both guests and authenticated
 * users without exposing any other user's favourites.
 */
export const FavoritesView = ({ allStudios }: FavoritesViewProps) => {
  const { items, toggle, count, isAuthenticated, initialized } = useFavorites();
  const [sort, setSort] = React.useState<FavoriteSortKey>(DEFAULT_SORT);

  // Build the favourited studios list, preserving each item's addedAt.
  const favouritedStudios = React.useMemo(() => {
    return allStudios
      .filter((studio) => {
        const id = studio.id ?? studio._id;
        return id ? items.has(id) : false;
      })
      .map((studio) => {
        const id = studio.id ?? studio._id;
        const item = id ? items.get(id) : null;
        return {
          studio,
          addedAt: item?.addedAt ?? new Date().toISOString(),
        };
      });
  }, [allStudios, items]);

  // Sorting
  const sortedStudios = React.useMemo(() => {
    const result = [...favouritedStudios];
    switch (sort) {
      case "recent":
        result.sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
        );
        break;
      case "price-asc":
        result.sort((a, b) => a.studio.hourlyPrice - b.studio.hourlyPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.studio.hourlyPrice - a.studio.hourlyPrice);
        break;
      case "rating":
        result.sort((a, b) => b.studio.rating - a.studio.rating);
        break;
      case "name":
        result.sort((a, b) =>
          a.studio.name.localeCompare(b.studio.name),
        );
        break;
    }
    return result;
  }, [favouritedStudios, sort]);

  // While the store is initializing (loading persisted guest/auth data),
  // show loading skeletons matching the Explore page design.
  if (!initialized) {
    return (
      <div aria-busy="true" aria-label="Loading favourites">
        <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
          <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
          <div className="mt-5 h-11 w-3/4 max-w-2xl animate-pulse rounded-lg bg-muted" />
          <div className="mt-4 h-5 w-1/2 max-w-lg animate-pulse rounded bg-muted" />
        </div>
        <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3.5">
                <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3.5 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
        <EmptyState
          icon={HeartIcon}
          title="No favourites yet"
          description={
            "Tap the heart on any studio across the site and it will show up here."
          }
          action={
            <Button
              render={<Link href="/studios" />}
              className="rounded-full px-6"
            >
              <UsersIcon className="size-4 mr-2" />
              Explore studios
            </Button>
          }
          className="py-16 sm:py-24"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-[-0.03em]">
            My Favourites
          </h1>
          <p className="text-sm text-muted-foreground">
            {count} studio{count !== 1 ? "s" : ""} saved
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground hidden sm:block">
            Sort by:
          </span>
          <Select
            value={sort}
            onValueChange={(v) => setSort((v ?? DEFAULT_SORT) as FavoriteSortKey)}
          >
            <SelectTrigger className="h-9 w-full bg-card sm:w-56">
              <SelectValue>{sortOptions.find((o) => o.key === sort)!.label}</SelectValue>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              alignItemWithTrigger={false}
              collisionAvoidance={{
                side: "shift",
                align: "shift",
                fallbackAxisSide: "none",
              }}
            >
              {sortOptions.map((o) => (
                <SelectItem key={o.key} value={o.key}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
        {sortedStudios.map(({ studio, addedAt }) => (
          <StudioCard
            key={studio.id ?? studio._id}
            studio={studio}
          />
        ))}
      </div>
    </div>
  );
};
