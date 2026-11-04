"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarIcon,
  RotateCcwIcon,
  SearchIcon,
  SearchXIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { cn } from "cn";
import { studios } from "@/data/studios";
import { categories, categoryLabels } from "@/data/categories";
import { bookedDates, dayOffset } from "@/data/availability";
import { StudioCard } from "@/components/studio/studio-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StudioCategory } from "@/types/studio";

// fetch data here — ExploreView imports the full catalogue for filtering.

type SortKey =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "reviews";

const PRICE_MAX = 200;

const sortLabels: Record<SortKey, string> = {
  recommended: "Recommended",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Highest rated",
  reviews: "Most reviewed",
};

const sortItems: Record<string, string> = { ...sortLabels };

const capacityOptions = [
  { value: "0", label: "Any capacity" },
  { value: "2", label: "2+ people" },
  { value: "4", label: "4+ people" },
  { value: "6", label: "6+ people" },
  { value: "8", label: "8+ people" },
  { value: "12", label: "12+ people" },
  { value: "20", label: "20+ people" },
];

const capacityItems: Record<string, string> = Object.fromEntries(
  capacityOptions.map((o) => [o.value, o.label]),
);

const categoryItems: Record<string, string> = {
  all: "All categories",
  ...categoryLabels,
};

interface Filters {
  query: string;
  category: StudioCategory | "all";
  city: string;
  date: string;
  price: [number, number];
  capacity: number;
  sort: SortKey;
}

const DEFAULT_FILTERS: Filters = {
  query: "",
  category: "all",
  city: "all",
  date: "",
  price: [0, PRICE_MAX],
  capacity: 0,
  sort: "recommended",
};

const CITIES = [...new Set(studios.map((s) => s.city))].sort();

/**
 * Fully client-side search / filter / sort over the mock catalogue.
 * Reads the incoming `?category=` deep link once, then keeps all state local —
 * swap the `studios` import for an API call when a backend lands.
 */
export const ExploreView = () => {
  const searchParams = useSearchParams();

  const [filters, setFilters] = React.useState<Filters>(() => {
    const requested = searchParams.get("category");
    const isValid =
      requested === "all" ||
      categories.some((c) => c.id === requested);
    return {
      ...DEFAULT_FILTERS,
      category: isValid ? ((requested ?? "all") as StudioCategory | "all") : "all",
    };
  });
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrice = (value: number | readonly number[]) => {
    if (Array.isArray(value) && value.length >= 2) {
      setFilters((prev) => ({ ...prev, price: [value[0], value[1]] }));
    }
  };

  const isDirty =
    filters.query !== "" ||
    filters.category !== "all" ||
    filters.city !== "all" ||
    filters.date !== "" ||
    filters.price[0] !== 0 ||
    filters.price[1] !== PRICE_MAX ||
    filters.capacity !== 0;

  const activeCount = [
    filters.query !== "",
    filters.category !== "all",
    filters.city !== "all",
    filters.date !== "",
    filters.price[0] !== 0 || filters.price[1] !== PRICE_MAX,
    filters.capacity !== 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort }));
  };

  const results = React.useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    const matched = studios.filter((studio) => {
      if (studio.status !== "live") return false;
      if (filters.category !== "all" && studio.category !== filters.category)
        return false;
      if (filters.city !== "all" && studio.city !== filters.city) return false;
      if (filters.date && bookedDates(studio.id).includes(filters.date))
        return false;
      if (
        studio.hourlyPrice < filters.price[0] ||
        studio.hourlyPrice > filters.price[1]
      )
        return false;
      if (filters.capacity && studio.capacity < filters.capacity) return false;

      if (q) {
        const haystack = [
          studio.name,
          studio.location,
          studio.city,
          studio.country,
          studio.description,
          studio.tags.join(" "),
          studio.amenities.map((a) => a.name).join(" "),
          studio.host.name,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...matched];
    switch (filters.sort) {
      case "price-asc":
        sorted.sort((a, b) => a.hourlyPrice - b.hourlyPrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.hourlyPrice - a.hourlyPrice);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        sorted.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            b.rating - a.rating ||
            b.reviewCount - a.reviewCount,
        );
    }
    return sorted;
  }, [filters]);

  return (
    <div>
      {/* ---------------- Filter bar ---------------- */}
      <div className="sticky top-16 z-30 border-y border-border bg-background/90 backdrop-blur-xl lg:top-[72px]">
        <div className="mx-auto max-w-[1440px] px-5 py-3.5 sm:px-8 lg:px-12">
          {/* Row 1 — search + mobile toggle */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <SearchIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <label htmlFor="studio-search" className="sr-only">
                Search studios
              </label>
              <Input
                id="studio-search"
                type="search"
                value={filters.query}
                onChange={(e) => update("query", e.target.value)}
                placeholder="Search studios, amenities, hosts, cities…"
                className="h-10 rounded-full bg-card pr-9 pl-10 shadow-none"
              />
              {filters.query && (
                <button
                  type="button"
                  onClick={() => update("query", "")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2.5 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              className="h-10 shrink-0 rounded-full lg:hidden"
            >
              <SlidersHorizontalIcon className="size-4" />
              Filters
              {activeCount > 0 && (
                <span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>

            {isDirty && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="hidden shrink-0 text-muted-foreground lg:inline-flex"
              >
                <RotateCcwIcon className="size-4" />
                Reset
              </Button>
            )}
          </div>

          {/* Row 2 — structured filters (collapsible on mobile) */}
          <div
            className={cn(
              "mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]",
              !mobileOpen && "hidden lg:grid",
            )}
          >
            {/* Category */}
            <Select
              value={filters.category}
              onValueChange={(v) => update("category", (v ?? "all") as Filters["category"])}
              items={categoryItems}
            >
              <SelectTrigger className="h-9 w-full bg-card">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City */}
            <Select
              value={filters.city}
              onValueChange={(v) => update("city", v ?? "all")}
              items={{ all: "All cities", ...Object.fromEntries(CITIES.map((c) => [c, c])) }}
            >
              <SelectTrigger className="h-9 w-full bg-card">
                <SelectValue placeholder="All cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Free-on date */}
            <div className="flex h-9 items-center gap-2 rounded-lg border border-input bg-card pr-2 pl-2.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
              <label htmlFor="free-on" className="shrink-0 text-xs text-muted-foreground">
                Free on
              </label>
              <input
                id="free-on"
                type="date"
                value={filters.date}
                min={dayOffset(0)}
                max={dayOffset(59)}
                onChange={(e) => update("date", e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
              {filters.date && (
                <button
                  type="button"
                  onClick={() => update("date", "")}
                  aria-label="Clear date"
                  className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <XIcon className="size-3" />
                </button>
              )}
            </div>

            {/* Price range */}
            <div className="flex h-9 flex-col justify-center rounded-lg border border-input bg-card px-2.5 py-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">Price / hr</span>
                <span className="font-medium tabular-nums">
                  £{filters.price[0]} – £{filters.price[1]}
                  {filters.price[1] === PRICE_MAX ? "+" : ""}
                </span>
              </div>
              <Slider
                value={filters.price}
                onValueChange={handlePrice}
                min={0}
                max={PRICE_MAX}
                step={5}
                aria-label="Maximum hourly price"
                className="mt-1.5"
              />
            </div>

            {/* Capacity */}
            <Select
              value={String(filters.capacity)}
              onValueChange={(v) => update("capacity", Number(v ?? 0))}
              items={capacityItems}
            >
              <SelectTrigger className="h-9 w-full bg-card">
                <SelectValue placeholder="Any capacity" />
              </SelectTrigger>
              <SelectContent>
                {capacityOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={filters.sort}
              onValueChange={(v) => update("sort", (v ?? "recommended") as SortKey)}
              items={sortItems}
            >
              <SelectTrigger className="h-9 w-full bg-card">
                <SelectValue placeholder="Recommended" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {sortLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile reset */}
          {isDirty && mobileOpen && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-2.5 w-full lg:hidden"
            >
              <RotateCcwIcon className="size-4" />
              Reset all filters
            </Button>
          )}
        </div>
      </div>

      {/* ---------------- Results ---------------- */}
      <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-heading text-xl font-semibold text-foreground">
              {results.length}
            </span>{" "}
            {results.length === 1 ? "studio" : "studios"}
            {isDirty ? " match your filters" : " available"}
            {filters.date && (
              <span className="ml-2 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs">
                free on {filters.date}
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Sorted by {sortLabels[filters.sort].toLowerCase()}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={SearchXIcon}
              title="No studios match those filters"
              description="Try widening the price range, clearing the date, or searching another city — there are spaces waiting."
              action={
                <Button onClick={clearFilters} className="rounded-full px-6">
                  <RotateCcwIcon className="size-4" />
                  Reset filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((studio, index) => (
              <StudioCard
                key={studio.id}
                studio={studio}
                priority={index < 3}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
