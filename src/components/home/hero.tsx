import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  Building2Icon,
  Circle,
  MapPinIcon,
  StarIcon,
  VerifiedIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "cn";
import { img } from "@/lib/images";
import { ApertureMark } from "@/components/brand/logo";
import type { Studio } from "@/types/studio";

interface PlatformStats {
  totalStudios: number;
  totalCities: number;
  averageRating: number;
}

async function fetchStats(): Promise<PlatformStats | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_BASE_URL is not defined");
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/stats`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Stats request failed (${response.status})`);
      return null;
    }

    const data: unknown = await response.json();

    if (
      !data ||
      typeof data !== "object" ||
      !("totalStudios" in data) ||
      !("totalCities" in data) ||
      !("averageRating" in data)
    ) {
      console.error("Stats response was malformed");
      return null;
    }

    return data as PlatformStats;
  } catch (error) {
    console.error("Failed to load stats:", error);
    return null;
  }
}

async function fetchHeroStudio(): Promise<Studio | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_BASE_URL is not defined");
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/studios/hero`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Hero studio request failed (${response.status})`);
      return null;
    }

    const data: unknown = await response.json();

    if (!data || typeof data !== "object") {
      return null;
    }

    const studio = data as Studio;
    if (!studio.slug || !studio.name || !studio.location || !studio.images?.[0]) {
      return null;
    }

    return studio;
  } catch (error) {
    console.error("Failed to load hero studio:", error);
    return null;
  }
}

/**
 * Photography-first hero: oversized editorial headline on a narrow left
 * column, cinematic imagery bleeding off the right edge, plus a floating
 * studio card for depth. Deliberately not a centred hero.
 *
 * Platform statistics and the floating studio card are fetched live from
 * the backend. Missing data is omitted rather than fabricated.
 */
export const Hero = async () => {
  const [stats, studio] = await Promise.all([
    fetchStats(),
    fetchHeroStudio(),
  ]);

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 lg:pt-16 lg:pb-24">
      {/* Soft brand wash — kept subtle so purple stays an accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[480px] rounded-full bg-brand-lavender/25 blur-[120px] dark:bg-brand-violet/20"
      />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* ---------- Copy column ---------- */}
        <div className="flex flex-col gap-7 lg:col-span-5">
          <span className="eyebrow inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-muted-foreground">
            <ApertureMark className="size-3.5 text-primary" />
            Find Your Space. Create Your Vision.
          </span>

          <h1 className="font-heading text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance">
            Space to Create Something{" "}
            <span className="text-primary">Extraordinary.</span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
            Discover inspiring creative spaces designed to bring your next big
            idea to life.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              render={<Link href="/studios" />}
              size="lg"
              className="h-12 rounded-full px-7 text-[15px] font-medium"
            >
              Explore Spaces
              <ArrowRightIcon className="ml-1 size-4" />
            </Button>
            <Button
              render={<Link href="/dashboard/listings/new" />}
              variant="outline"
              size="lg"
              className="h-12 rounded-full px-7 text-[15px] font-medium"
            >
              List Your Studio
            </Button>
          </div>

          {/* Stats — three compact cards */}
          {stats && (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Card
                className={cn(
                  "rounded-xl border border-border/50 bg-card p-3 transition-all duration-300",
                  "hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5",
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-start w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    <Building2Icon className="size-[13px]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Circle className="size-[11px] shrink-0 text-purple-500" />
                    <span className="font-semibold text-base text-muted-foreground">
                      {stats.totalStudios}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      Studios
                    </span>
                  </div>
                </div>
              </Card>
              <Card
                className={cn(
                  "rounded-xl border border-border/50 bg-card p-3 transition-all duration-300",
                  "hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5",
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-start w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <MapPinIcon className="size-[13px]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Circle className="size-[11px] shrink-0 text-blue-500" />
                    <span className="font-semibold text-base text-muted-foreground">
                      {stats.totalCities}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      Cities
                    </span>
                  </div>
                </div>
              </Card>
              <Card
                className={cn(
                  "rounded-xl border border-border/50 bg-card p-3 transition-all duration-300",
                  "hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5",
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-start w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <StarIcon className="size-[13px]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Circle className="size-[11px] shrink-0 text-amber-500" />
                    <span className="font-semibold text-base text-muted-foreground">
                      {stats.averageRating}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      Avg. rating
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* ---------- Imagery column ---------- */}
        <div className="relative lg:col-span-7">
          {/* Main cinematic frame — bleeds toward the right edge */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted sm:aspect-[5/4] lg:aspect-[4/3.4] lg:-mr-12 lg:rounded-l-2xl lg:rounded-r-none xl:-mr-20">
            <Image
              src={img("1607462109225-6b64ae2dd3cb", "hero")}
              alt="A photography studio lit with softboxes and a seamless backdrop"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10" />

            {/* Floating detail — verified badge */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-md sm:top-6 sm:left-6">
              <VerifiedIcon className="size-3.5 text-primary" />
              Every space verified
            </div>
          </div>

          {/* Floating studio card — overlaps the main frame */}
          {studio && (
            <Link
              href={`/studios/${studio.slug}`}
              className="group absolute -bottom-6 left-4 flex w-[min(20rem,calc(100%-2rem))] items-center gap-3 rounded-xl border border-border bg-card/95 p-2.5 pr-4 shadow-xl backdrop-blur-sm outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/50 sm:left-8 lg:-bottom-8 lg:left-0"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={img(studio.images[0], "thumb")}
                  alt={studio.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {studio.name}
                </p>
                <p className="inline-flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPinIcon className="size-3 shrink-0" />
                  {studio.location}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                {typeof studio.rating === "number" && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium">
                    <StarIcon className="size-3 fill-current text-amber-500" />
                    {studio.rating}
                  </span>
                )}
                {typeof studio.hourlyPrice === "number" && (
                  <span className="text-xs text-muted-foreground">
                    £{studio.hourlyPrice}/hr
                  </span>
                )}
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
