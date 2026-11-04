import { SectionHeader } from "@/components/shared/section-header";
import { StudioCard } from "@/components/studio/studio-card";
import { featuredStudios } from "@/data/studios";

// fetch data here — the homepage reads the featured subset from the catalogue.

/**
 * Six featured spaces in an editorial composition: one tall portrait, one
 * wide feature, and four standard cards — deliberately not a uniform grid.
 */
export const FeaturedStudios = () => {
  const [first, second, ...rest] = featuredStudios;

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
        {/* Tall portrait — anchors the left column */}
        <StudioCard
          studio={first}
          variant="editorial"
          ratio="portrait"
          priority
          className="lg:col-span-4 lg:row-span-2"
        />

        {/* Wide feature — top right */}
        <StudioCard
          studio={second}
          variant="editorial"
          ratio="wide"
          className="lg:col-span-8"
        />

        {/* Four standard cards below — last pair widens to fill the row */}
        {rest.map((studio, index) => (
          <StudioCard
            key={studio.id}
            studio={studio}
            ratio="video"
            className={index < 2 ? "lg:col-span-4" : "lg:col-span-6"}
          />
        ))}
      </div>
    </section>
  );
};
