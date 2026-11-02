"use client";

import * as React from "react";
import { HeartIcon } from "lucide-react";
import { cn } from "cn";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "@/components/ui/toast";

/**
 * Heart toggle used on cards, galleries and detail pages.
 * Visual state only — backed by local storage.
 */
export function FavoriteButton({
  studioId,
  studioName,
  className,
  size = "md",
  showLabel = false,
}: {
  studioId: string;
  studioName: string;
  className?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(studioId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(studioId);
    if (!active) {
      toast.add({
        type: "success",
        title: "Saved to favourites",
        description: studioName,
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={
        active ? `Remove ${studioName} from favourites` : `Save ${studioName}`
      }
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full border border-background/60 bg-background/85 text-foreground shadow-sm backdrop-blur-md outline-none transition-all duration-200 hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95",
        size === "md" ? "size-9" : "size-7",
        active && "border-primary/50 text-primary",
        className,
      )}
    >
      <HeartIcon
        className={cn(
          size === "md" ? "size-4" : "size-3.5",
          active && "fill-current",
        )}
      />
      {showLabel && (
        <span className="pr-1 text-xs font-medium">
          {active ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
