import Image from "next/image";
import Link from "next/link";
import { HeartIcon, MapPinIcon, StarIcon, UsersIcon } from "lucide-react";
import { cn } from "cn";
import type { Studio } from "@/types/studio";
import { categoryLabels } from "@/data/categories";
import { img } from "@/lib/images";
import { FavoriteButton } from "./favorite-button";
import { Badge } from "@/components/ui/badge";

function Rating({
  rating,
  reviewCount,
  className,
}: {
  rating: number;
  reviewCount: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        className,
      )}
    >
      <StarIcon className="size-3.5 fill-current text-amber-500" />
      {rating.toFixed(1)}
      <span className="font-normal text-muted-foreground">
        ({reviewCount})
      </span>
    </span>
  );
}

interface StudioCardProps {
  studio: Studio;
  variant?: "standard" | "editorial" | "compact";
  /** Forces a specific aspect ratio on the media. */
  ratio?: "video" | "square" | "portrait" | "wide";
  priority?: boolean;
  className?: string;
}

/**
 * Primary studio presentation. Three variants cover grid, feature and list
 * layouts so the same data drives every surface.
 */
export function StudioCard({
  studio,
  variant = "standard",
  ratio = "video",
  priority = false,
  className,
}: StudioCardProps) {
  const href = `/studios/${studio.slug}`;

  const ratios = {
    video: "aspect-[4/3]",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[16/10]",
  } as const;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-4 rounded-xl border border-border bg-card p-2.5 pr-4 outline-none transition-colors hover:border-primary/30 focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
      >
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={img(studio.images[0], "thumb")}
            alt={studio.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{studio.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {studio.location}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold">£{studio.hourlyPrice}</p>
          <p className="text-xs text-muted-foreground">per hour</p>
        </div>
        <HeartIcon className="size-4 shrink-0 text-muted-foreground" />
      </Link>
    );
  }

  if (variant === "editorial") {
    return (
      <Link
        href={href}
        className={cn(
          "group relative block overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          ratios[ratio],
          className,
        )}
      >
        <Image
          src={img(studio.images[0], "gallery")}
          alt={studio.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="zoom-media object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit bg-background/15 text-foreground ring-1 ring-foreground/20 backdrop-blur-md">
                {categoryLabels[studio.category]}
              </Badge>
              <h3 className="font-heading text-xl leading-tight font-semibold text-white sm:text-2xl">
                {studio.name}
              </h3>
            </div>
            <FavoriteButton studioId={studio.id} studioName={studio.name} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="size-3.5" />
              {studio.location}
            </span>
            <Rating
              rating={studio.rating}
              reviewCount={studio.reviewCount}
              className="text-white"
            />
            <span className="ml-auto font-medium text-white">
              £{studio.hourlyPrice}
              <span className="font-normal text-white/60">/hr</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-muted",
          ratios[ratio],
        )}
      >
        <Image
          src={img(studio.images[0], "card")}
          alt={studio.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="zoom-media object-cover"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className="bg-background/85 text-foreground backdrop-blur-md">
            {categoryLabels[studio.category]}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <FavoriteButton studioId={studio.id} studioName={studio.name} />
        </div>
        <div className="absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          £{studio.hourlyPrice}/hr
        </div>
      </div>

      <div className="flex flex-col gap-1.5 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-base leading-snug font-semibold tracking-[-0.01em] transition-colors group-hover:text-primary">
            {studio.name}
          </h3>
          <Rating
            rating={studio.rating}
            reviewCount={studio.reviewCount}
            className="pt-0.5"
          />
        </div>
        <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <MapPinIcon className="size-3.5 shrink-0" />
          {studio.location}
        </p>
        <p className="inline-flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <UsersIcon className="size-3.5" />
            {studio.capacity} people
          </span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
          <span>{studio.size} m²</span>
        </p>
      </div>
    </Link>
  );
}
