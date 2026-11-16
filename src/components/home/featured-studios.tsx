import type { IStudio } from "@/types/studio";
import { SectionHeader } from "@/components/shared/section-header";
import { StudioCard } from "@/components/studio/studio-card";
import { connection } from "next/server";

const STUDIOS_LIMIT = 6;

async function fetchFeaturedStudios(): Promise<IStudio[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SERVER_BASE_URL is not defined");
    return [];
  }

  try {
    const response = await fetch(`${baseUrl}/studios?limit=${STUDIOS_LIMIT}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Studios request failed (${response.status})`);
      return [];
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      console.error("Studios response was not a list");
      return [];
    }

    const studios: IStudio[] = [];
    for (const s of (data as IStudio[]).slice(0, STUDIOS_LIMIT)) {
      const id = s._id || s.id;
      if (id) {
        studios.push({ ...s, id });
      }
    }
    return studios;
  } catch (error) {
    console.error("Failed to load featured studios:", error);
    return [];
  }
}

/**
 * Six featured spaces in an editorial composition: one tall portrait, one
 * wide feature, and four standard cards — deliberately not a uniform grid.
 *
 * Data is fetched live from the studios API. Missing studios are simply
 * omitted so the grid never receives `undefined`.
 */
export const FeaturedStudios = async () => {
  await connection();

  const studios = await fetchFeaturedStudios();
  const [first, second, ...rest] = studios;

  return (
    <section
      aria-labelledby="featured-heading"
      className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <SectionHeader
        eyebrow="Handpicked"
        title={
          <span id="featured-heading">
            Spaces our community
            <br className="hidden sm:block" /> keeps coming back to.
          </span>
        }
        description="Studios with character, caretakers who care, and light worth scheduling your day around."
        action={{ label: "Explore all studios", href: "/studios" }}
        className="mb-12 lg:mb-16"
      />

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
        {first && (
          <StudioCard
            studio={first}
            variant="editorial"
            ratio="portrait"
            priority
            className="lg:col-span-4 lg:row-span-2"
            reviewHref={`/studios/${first.slug}/reviews`}
          />
        )}

        {second && (
          <StudioCard
            studio={second}
            variant="editorial"
            ratio="wide"
            className="lg:col-span-8"
            reviewHref={`/studios/${second.slug}/reviews`}
          />
        )}

        {rest.map((studio, index) => (
          <StudioCard
            key={studio.id}
            studio={studio}
            ratio="video"
            className={index < 2 ? "lg:col-span-4" : "lg:col-span-6"}
            reviewHref={`/studios/${studio.slug}/reviews`}
          />
        ))}
      </div>
    </section>
  );
};
