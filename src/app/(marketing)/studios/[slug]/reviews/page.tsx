import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, StarIcon } from "lucide-react";
import { img } from "@/lib/images";
import { fetchStudioReviews } from "@/lib/api/studios";
import type { Review } from "@/lib/api/studios";
import type { Studio } from "@/types/studio";

export const metadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${slug}`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      return { title: "Studio not found — StudioSpace" };
    }
    const studio: Studio = await response.json();
    return {
      title: `Reviews for ${studio.name} — StudioSpace`,
      description: `Read reviews for ${studio.name} — ${studio.location}`,
    };
  } catch {
    return { title: "Studio not found — StudioSpace" };
  }
};

const StudioReviewsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const studioResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${slug}`,
    { cache: "no-store" },
  );

  if (!studioResponse.ok) {
    notFound();
  }

  const studioData: Studio = await studioResponse.json();
  const studioId = studioData._id ?? studioData.id;

  if (!studioId) {
    notFound();
  }

  const reviews: Review[] = await fetchStudioReviews(studioId);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
      <nav aria-label="Breadcrumb">
        <Link
          href={`/studios/${slug}`}
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to studio
        </Link>
      </nav>

      <header className="mt-5 flex flex-col gap-3.5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3.5">
          <h1 className="font-heading text-[clamp(2rem,4vw,3rem)] leading-tight font-semibold tracking-[-0.03em] text-balance">
            Reviews for {studioData.name}
          </h1>
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-semibold tabular-nums">
              {averageRating}
            </span>
            <div className="flex flex-col">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`size-3.5 ${
                      i < Math.round(Number(averageRating))
                        ? "fill-current text-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </span>
              <span className="text-xs text-muted-foreground">
                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          </div>
        </div>
      </header>

      {reviews.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">
            No reviews yet for {studioData.name}. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedReviews.map((review) => (
            <figure
              key={review.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
            >
              <figcaption className="flex items-center gap-3">
                <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={img(review.author.substring(0, 1), "avatar")}
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
      )}
    </div>
  );
};

export default StudioReviewsPage;
