import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  Maximize2Icon,
  RulerIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { getRelatedStudios } from "@/data/studios";
import type { Studio } from "@/types/studio";
import { categoryLabels } from "@/data/categories";
import { reviewsFor } from "@/data/reviews";
import { img } from "@/lib/images";
import { Gallery } from "@/components/studios/gallery";
import { BookingCard } from "@/components/studios/booking-card";
import { AmenityIcon } from "@/components/studios/amenity-icon";
import { StudioCard } from "@/components/studio/studio-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";



export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return { title: "Studio not found — StudioSpace" };
    }

    const studio: Studio = await response.json();

    return {
      title: `${studio.name} — StudioSpace`,
      description: studio.description,
    };
  } catch {
    return { title: "StudioSpace" };
  }
};


const StudioDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
 const { slug } = await params;

const response = await fetch(
  `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${slug}`,
  {
    cache: "no-store",
  }
);

if (!response.ok) {
  notFound();
}

const studioData: Studio = await response.json();

const studioId = studioData._id ?? studioData.id;

if (!studioId) {
  notFound();
}

const studio: Studio = {
  ...studioData,
  id: studioData._id ?? studioData.id ?? "",
};
 const related = getRelatedStudios(studio, 3);
const reviews = studio.reviewCount > 0 ? reviewsFor(studioId) : [];
  const specs = [
    { icon: UsersIcon, label: "Capacity", value: `${studio.capacity} people` },
    { icon: RulerIcon, label: "Floor area", value: `${studio.size} m²` },
    {
      icon: SparklesIcon,
      label: "Discipline",
      value: categoryLabels[studio.category],
    },
    { icon: Maximize2Icon, label: "Minimum", value: "1 hour" },
  ];

  return (
    <article className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
      {/* ---------- Breadcrumb ---------- */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/studios"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
          All studios
        </Link>
      </nav>

      {/* ---------- Title block ---------- */}
      <header className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              {categoryLabels[studio.category]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {studio.location}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-medium">
              <StarIcon className="size-4 fill-current text-amber-500" />
              {studio.rating.toFixed(1)}
              <span className="font-normal text-muted-foreground">
                ({studio.reviewCount} reviews)
              </span>
            </span>
          </div>

          <h1 className="font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-balance">
            {studio.name}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground text-balance">
            {studio.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {studio.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* ---------- Gallery ---------- */}
      <div className="mt-8">
        <Gallery images={studio.images} name={studio.name} />
      </div>

      {/* ---------- Body ---------- */}
      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Booking column — first on mobile, sticky rail on desktop */}
        <aside className="order-first lg:order-none lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <BookingCard studio={studio} />
        </aside>

        <div className="flex flex-col gap-14 lg:col-span-7">
          {/* About */}
          <section aria-labelledby="about-space">
            <h2
              id="about-space"
              className="font-heading text-2xl font-semibold tracking-[-0.02em]"
            >
              About this space
            </h2>
            <p className="mt-4 text-[15px] leading-[1.75] text-muted-foreground">
              {studio.longDescription}
            </p>
          </section>

          {/* Specs */}
          <section aria-label="Space specifications">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map((spec) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={spec.label}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3.5"
                  >
                    <Icon className="size-4 text-primary" strokeWidth={1.75} />
                    <dt className="text-xs text-muted-foreground">
                      {spec.label}
                    </dt>
                    <dd className="font-heading text-sm font-semibold tracking-[-0.01em]">
                      {spec.value}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>

          {/* Amenities */}
          <section aria-labelledby="amenities-heading">
            <h2
              id="amenities-heading"
              className="font-heading text-2xl font-semibold tracking-[-0.02em]"
            >
              What this space offers
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {studio.amenities.map((amenity) => (
                <li
                  key={amenity.name}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm"
                >
                  <AmenityIcon
                    name={amenity.icon}
                    className="size-4 shrink-0 text-primary"
                  />
                  {amenity.name}
                </li>
              ))}
            </ul>
          </section>

          {/* Host */}
         {studio.host && (
  <section aria-labelledby="host-heading">
            <h2
              id="host-heading"
              className="font-heading text-2xl font-semibold tracking-[-0.02em]"
            >
              Your host
            </h2>
            <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-start">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image
                  src={img(studio.host.avatar, "avatar")}
                  alt={studio.host.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-heading font-semibold">
                    {studio.host.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {studio.host.role} · Hosting since {studio.host.since}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground text-balance">
                  {studio.host.bio}
                </p>
                <Badge className="mt-1 w-fit bg-primary/10 text-primary hover:bg-primary/10">
                  Identity verified
                </Badge>
              </div>
            </div>
          </section>
)}

          {/* Reviews */}
          <section aria-labelledby="reviews-heading">
            <div className="flex items-end justify-between gap-4">
              <h2
                id="reviews-heading"
                className="font-heading text-2xl font-semibold tracking-[-0.02em]"
              >
                What creators say
              </h2>
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl font-semibold tabular-nums">
                  {studio.rating.toFixed(1)}
                </span>
                <div className="flex flex-col">
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`size-3.5 ${
                          i < Math.round(studio.rating)
                            ? "fill-current text-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {studio.reviewCount} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <figure
                  key={review.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <figcaption className="flex items-center gap-3">
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={img(review.avatar, "avatar")}
                        alt=""
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {review.author}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {review.role}
                      </p>
                    </div>
                  </figcaption>
                  <span className="flex" aria-label={`${review.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`size-3.5 ${
                          i < review.rating
                            ? "fill-current text-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </span>
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    {review.text}
                  </blockquote>
                  <p className="mt-auto pt-1 text-xs text-muted-foreground/70">
                    {review.date}
                  </p>
                </figure>
              ))}
            </div>
          </section>

          {/* Related */}
          <section aria-labelledby="related-heading">
            <SectionHeader
              eyebrow="Keep looking"
              title={
                <span id="related-heading">Similar spaces</span>
              }
              action={{ label: "All studios", href: "/studios" }}
              className="mb-6"
            />
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
              {related.map((s) => (
                <StudioCard key={s.id} studio={s} ratio="video" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
};

export default StudioDetailsPage;
