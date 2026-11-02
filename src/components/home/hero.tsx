import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  MapPinIcon,
  StarIcon,
  VerifiedIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { img } from "@/lib/images";
import { ApertureMark } from "@/components/brand/logo";

const stats = [
  { value: "1,240+", label: "Studios" },
  { value: "38", label: "Cities" },
  { value: "4.9", label: "Avg. rating" },
];

/**
 * Photography-first hero: oversized editorial headline on a narrow left
 * column, cinematic imagery bleeding off the right edge, plus a floating
 * studio card for depth. Deliberately not a centred hero.
 */
export function Hero() {
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

          {/* Stats — hairline separated, editorial */}
          <dl className="mt-2 flex items-center gap-6 border-t border-border pt-6 sm:gap-10">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <dt className="order-2 text-xs tracking-wide text-muted-foreground uppercase">
                  {s.label}
                </dt>
                <dd className="font-heading text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
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
          <Link
            href="/studios/lumen-daylight-loft"
            className="group absolute -bottom-6 left-4 flex w-[min(20rem,calc(100%-2rem))] items-center gap-3 rounded-xl border border-border bg-card/95 p-2.5 pr-4 shadow-xl backdrop-blur-sm outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/50 sm:left-8 lg:-bottom-8 lg:left-0"
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={img("1560787313-5dff3307e257", "thumb")}
                alt="Lumen Daylight Loft"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                Lumen Daylight Loft
              </p>
              <p className="inline-flex items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPinIcon className="size-3 shrink-0" />
                Shoreditch, London
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="inline-flex items-center gap-0.5 text-xs font-medium">
                <StarIcon className="size-3 fill-current text-amber-500" />
                4.9
              </span>
              <span className="text-xs text-muted-foreground">£85/hr</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
