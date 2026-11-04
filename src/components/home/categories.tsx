import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "cn";
import { categories } from "@/data/categories";
import { img } from "@/lib/images";
import { SectionHeader } from "@/components/shared/section-header";

/**
 * Five category tiles in a deliberately uneven arrangement: the first tile
 * spans two columns as a feature, the rest step down in size. Photography
 * carries the section; type sits on a gradient scrim.
 */
export const Categories = () => {
  const [feature, ...others] = categories;

  const spans: Record<string, string> = {
    "film-sound": "lg:col-span-4",
    podcast: "lg:col-span-3",
    music: "lg:col-span-4",
    art: "lg:col-span-3",
  };

  return (
    <section
      aria-labelledby="categories-heading"
      className="border-y border-border bg-muted/40 dark:bg-muted/20"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <SectionHeader
          eyebrow="Browse by craft"
          title={
            <span id="categories-heading">
              Every discipline has
              <br className="hidden sm:block" /> its own kind of room.
            </span>
          }
          description="From daylight cyc walls to treated podcast booths — start with what you make."
          className="mb-12 lg:mb-16"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">
          <CategoryTile
            category={feature}
            className={cn("sm:col-span-2 lg:col-span-5 lg:row-span-2", "aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]")}
            priority
          />
          {others.map((category) => (
            <CategoryTile
              key={category.id}
              category={category}
              className={cn(
                "aspect-[16/10]",
                spans[category.id],
                "lg:min-h-[12.5rem]",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryTile = ({
  category,
  className,
  priority = false,
}: {
  category: (typeof categories)[number];
  className?: string;
  priority?: boolean;
}) => {
  return (
    <Link
      href={`/studios?category=${category.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Image
        src={img(category.image, "card")}
        alt={category.name}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
        className="zoom-media object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-white/60">{category.count} spaces</p>
            <h3 className="mt-1.5 font-heading text-xl leading-tight font-semibold text-white sm:text-2xl">
              {category.name}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-white/70 text-balance">
              {category.tagline}
            </p>
          </div>
          <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
            <ArrowUpRightIcon className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};
