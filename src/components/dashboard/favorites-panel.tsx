"use client";

import { HeartIcon } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { studios } from "@/data/studios";
import { StudioCard } from "@/components/studio/studio-card";
import { EmptyState } from "@/components/shared/empty-state";

// fetch data here — favourites resolve against the studio catalogue here.

/** Live favourites list — reflects heart toggles anywhere on the site. */
export const FavoritesPanel = () => {
  const { ids } = useFavorites();
  const favorites = studios.filter((studio) => ids.has(studio.id));

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
