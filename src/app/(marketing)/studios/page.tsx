import { Suspense } from "react";
import type { Metadata } from "next";
import { ExploreView } from "@/components/studios/explore-view";
import { ExploreSkeleton } from "@/components/studios/explore-skeleton";

export const metadata: Metadata = {
  title: "Explore Studios — StudioSpace",
  description:
    "Search and filter creative studios by craft, city, price, capacity and date — photography lofts, film stages, podcast rooms and more.",
};

/**
 * Explore page. The header and layout are a static shell; the filterable
 * results read the URL (`?category=` deep links) and stream in behind a
 * Suspense boundary, as required by `cacheComponents`.
 */
export default function ExplorePage() {
  return (
    <>
      <header className="mx-auto max-w-[1440px] px-5 pt-12 pb-8 sm:px-8 lg:px-12 lg:pt-16">
        <span className="eyebrow text-primary">Explore studios</span>
        <h1 className="mt-3 font-heading text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
          Find the room your
          <br className="hidden sm:block" /> work deserves.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
          Filter by craft, city, budget and the hours you actually need.
          Every space is visited, photographed and rated by our community.
        </p>
      </header>

      <Suspense fallback={<ExploreSkeleton />}>
        <ExploreView />
      </Suspense>
    </>
  );
}
