"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  ClockIcon,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { fetchStudioReviews, type Review } from "@/lib/api/studios";
import type { Studio } from "@/types/studio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReviewSortKey = "newest" | "oldest" | "highest-rating" | "lowest-rating";

const SORT_OPTIONS: Array<{ value: ReviewSortKey; label: string }> = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest-rating", label: "Highest Rating" },
  { value: "lowest-rating", label: "Lowest Rating" },
];

interface StudioReviewEntry {
  studio: Studio;
  reviews: Review[];
}

const ReviewsPage = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [studioReviews, setStudioReviews] = React.useState<
    StudioReviewEntry[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sortKey, setSortKey] = React.useState<ReviewSortKey>("newest");

  React.useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.email) {
          setStudioReviews([]);
          setLoading(false);
          return;
        }

        const studiosResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/my-studios/${encodeURIComponent(user.email)}`,
          { cache: "no-store" },
        );

        if (!studiosResponse.ok) {
          throw new Error("Failed to fetch studios");
        }

        const studiosData: unknown = await studiosResponse.json();
        if (!Array.isArray(studiosData)) {
          throw new Error("Studios response was not a list");
        }

        const myStudios: Studio[] = studiosData as Studio[];

        if (myStudios.length === 0) {
          setStudioReviews([]);
          setLoading(false);
          return;
        }

        const results: StudioReviewEntry[] = await Promise.all(
          myStudios.map(async (studio) => {
            const studioId = studio.id ?? studio._id ?? "";
            const reviews = await fetchStudioReviews(studioId);
            return { studio, reviews };
          }),
        );

        if (!cancelled) {
          setStudioReviews(results);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load reviews. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  // Flatten all reviews with studio context, sort, then re-group by studio.
  // Never mutates the original API data.
  const sortedStudioReviews = React.useMemo(() => {
    if (studioReviews.length === 0) return [];

    // Flatten into { studio, review } pairs without mutating originals.
    const flat: Array<{ studio: Studio; review: Review }> = [];
    studioReviews.forEach(({ studio, reviews }) => {
      reviews.forEach((review) => {
        flat.push({ studio, review });
      });
    });

    const sorted = [...flat].sort((a, b) => {
      const aDate = new Date(a.review.date).getTime();
      const bDate = new Date(b.review.date).getTime();

      switch (sortKey) {
        case "newest":
          return bDate - aDate;
        case "oldest":
          return aDate - bDate;
        case "highest-rating":
          if (b.review.rating !== a.review.rating) {
            return b.review.rating - a.review.rating;
          }
          return bDate - aDate;
        case "lowest-rating":
          if (a.review.rating !== b.review.rating) {
            return a.review.rating - b.review.rating;
          }
          return bDate - aDate;
        default:
          return bDate - aDate;
      }
    });

    // Re-group by studio, preserving studio info and sorted review order.
    const groupedMap = new Map<string, StudioReviewEntry>();
    sorted.forEach(({ studio, review }) => {
      const key = studio.id ?? studio._id ?? "";
      const existing = groupedMap.get(key);
      if (existing) {
        existing.reviews.push(review);
      } else {
        groupedMap.set(key, {
          studio,
          reviews: [review],
        });
      }
    });

    return Array.from(groupedMap.values());
  }, [studioReviews, sortKey]);

  const totalReviewCount = studioReviews.reduce(
    (sum, entry) => sum + entry.reviews.length,
    0,
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-muted-foreground">Loading reviews…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              window.location.reload();
            }}
            className="mt-4 rounded-full px-6"
          >
            <ClockIcon className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (studioReviews.length === 0 || totalReviewCount === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
        <Card className="gap-3">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                  Reviews
                </CardTitle>
                <CardDescription>
                  Reviews across your studios
                </CardDescription>
              </div>
              <Link
                href="/dashboard"
                className="text-xs text-primary hover:text-primary-800 transition-colors"
              >
                <ArrowUpRightIcon className="size-3.5 shrink-0" />
                Back to dashboard
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No reviews found across your studios.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
      <Card className="gap-3">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="font-heading text-lg tracking-[-0.01em]">
                Reviews
              </CardTitle>
              <CardDescription>
                {totalReviewCount} review{totalReviewCount !== 1 ? "s" : ""}
                across your studios
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={sortKey}
                onValueChange={(v) =>
                  setSortKey((v ?? "newest") as ReviewSortKey)
                }
              >
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {sortedStudioReviews.map((entry) => {
              const studioId = entry.studio.id ?? entry.studio._id ?? "";
              return (
                <div
                  key={studioId}
                  className="border border-border rounded-lg p-3 mb-3"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">
                      {entry.studio.name}
                    </h4>
                    <StatusBadge
                      status={entry.studio.status}
                      kind="listing"
                    />
                  </div>
                  {entry.reviews.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No reviews yet.
                    </p>
                  ) : (
                    entry.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex flex-col gap-2 mt-2"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {review.author}
                          </p>
                          <span className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`size-3 ${
                                  i < review.rating
                                    ? "text-amber-500"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.date}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsPage;
