"use client";

import * as React from "react";
import { HeartIcon } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { StudioCard } from "@/components/studio/studio-card";
import { EmptyState } from "@/components/shared/empty-state";
import { fetchStudios } from "@/lib/api/studios";
import type { Studio } from "@/types/studio";

/** Live favourites list — reflects heart toggles anywhere on the site.
 *  Fetches the studio catalogue from the API and resolves favourites
 *  against the authenticated/guest user's saved IDs.
 */
export const FavoritesPanel = () => {
  const { ids } = useFavorites();
  const [studioList, setStudioList] = React.useState<Studio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetchStudios().then((data) => {
      if (Array.isArray(data)) {
        setStudioList(data as Studio[]);
        setLoading(false);
      } else {
        setLoading(false);
        setError(true);
      }
    }).catch(() => {
      setLoading(false);
      setError(true);
    });
  }, []);

  const favorites = studioList.filter((studio) => ids.has(studio.id ?? ""));

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="h-8 w-32 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-1/2 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={HeartIcon}
        title="Unable to load favourites"
        description="Could not load studio data. Please try again."
        className="py-10"
      />
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={HeartIcon}
        title="No favourites yet"
        description="Tap the heart on any studio and it will show up here."
        className="py-10"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {favorites.slice(0, 4).map((studio) => (
        <StudioCard key={studio.id} studio={studio} variant="compact" />
      ))}
      {favorites.length > 4 && (
        <p className="pt-1 text-center text-xs text-muted-foreground">
          +{favorites.length - 4} more saved
        </p>
      )}
    </div>
  );
};
