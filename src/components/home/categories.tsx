import Link from "next/link";
import {
  Camera,
  Circle,
  Clapperboard,
  Mic,
  Music2,
  Palette,
} from "lucide-react";
import { cn } from "cn";
import { categories } from "@/data/categories";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CategoryIcon = React.ComponentType<{ className?: string }>;

const categoryIcons: Record<string, CategoryIcon> = {
  photography: Camera,
  "film-sound": Clapperboard,
  podcast: Mic,
  music: Music2,
  art: Palette,
};

const categoryIconStyles: Record<string, string> = {
  photography: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  "film-sound": "bg-purple-500/10 text-purple-500 border border-purple-500/20",
  podcast: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
  music: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
  art: "bg-green-500/10 text-green-500 border border-green-500/20",
};

const categoryDotStyles: Record<string, string> = {
  photography: "text-blue-500",
  "film-sound": "text-purple-500",
  podcast: "text-pink-500",
  music: "text-orange-500",
  art: "text-green-500",
};

interface CategoryStats {
  [categoryId: string]: number;
}

async function fetchCategoryStats(): Promise<CategoryStats> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_BASE_URL is not defined");
    return {};
  }

  try {
    const response = await fetch(`${baseUrl}/stats/categories`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Category stats request failed (${response.status})`);
      return {};
    }

    const data: unknown = await response.json();

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      console.error("Category stats response was malformed");
      return {};
    }

    return data as CategoryStats;
  } catch (error) {
    console.error("Failed to load category stats:", error);
    return {};
  }
}

/**
 * Five category tiles in a single horizontal row on desktop, with icons
 * replacing the previous imagery. Each card links to the Explore page with
 * the category pre-selected. Category counts are fetched live from the API.
 */
export const Categories = async () => {
  const counts = await fetchCategoryStats();

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id];
            const iconStyle = categoryIconStyles[category.id];
            const count = counts[category.id] ?? 0;

            return (
              <Link
                key={category.id}
                href={`/studios?category=${category.id}`}
                className="block outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Card
                  className={cn(
                    "group h-full overflow-hidden border border-border/50 bg-card transition-all duration-300",
                    "hover:border-primary/50 hover:shadow-lg hover:-translate-y-1",
                  )}
                >
                  <CardHeader className="pb-2">
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl",
                        iconStyle,
                        "transition-colors duration-300 group-hover:scale-110",
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                  </CardHeader>
                  <CardContent
                    className={cn(
                      "pt-0 flex flex-col h-full",
                      "mt-auto gap-2",
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <CardTitle className="font-heading text-base leading-tight font-semibold">
                        {category.name}
                      </CardTitle>
                      <CardDescription
                        className={cn(
                          "mt-1 text-xs text-muted-foreground min-h-[3rem]",
                        )}
                      >
                        {category.tagline}
                      </CardDescription>
                    </div>
                    <div className="mt-auto flex items-center gap-1.5">
                      <Circle
                        className={cn(
                          "size-2 shrink-0",
                          categoryDotStyles[category.id],
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium text-muted-foreground",
                          count === 1 ? "font-semibold" : "font-normal",
                        )}
                      >
                        {count}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {count === 1 ? "Studio" : "Studios"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
