import {
  CompassIcon,
  FrameIcon,
  CalendarCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { cn } from "cn";
import { SectionHeader } from "@/components/shared/section-header";

const steps = [
  {
    icon: CompassIcon,
    number: "01",
    title: "Discover",
    description:
      "Search by craft, city and light. Filter to the room that fits your shoot, session or class.",
  },
  {
    icon: FrameIcon,
    number: "02",
    title: "Explore",
    description:
      "Walk the gallery, check amenities, capacity and the hours the space is actually free.",
  },
  {
    icon: CalendarCheckIcon,
    number: "03",
    title: "Reserve",
    description:
      "Pick your window, confirm the details and hold the room. No phone tag, no back-and-forth.",
  },
  {
    icon: SparklesIcon,
    number: "04",
    title: "Create",
    description:
      "Show up, plug in and make the thing you came to make. The space is yours for the hours booked.",
  },
];

/**
 * Four-step explainer. Numbered rules connect the steps on desktop like a
 * contact sheet; they stack with left rules on mobile.
 */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <SectionHeader
        eyebrow="How it works"
        title={
          <span id="how-heading">
            From first search
            <br className="hidden sm:block" /> to first take.
          </span>
        }
        description="Four steps, no friction. The platform handles the logistics so you can keep your attention on the work."
        align="center"
        className="mb-14 lg:mb-20"
      />

      <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.number}
              className={cn(
                "relative lg:px-8",
                index === 0 && "lg:pl-0",
                !isLast && "lg:border-r lg:border-border",
                isLast && "lg:pr-0",
              )}
            >
              {/* Connector rule with node */}
              <div className="relative mb-7 flex items-center gap-4">
                <span
                  aria-hidden
                  className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                {!isLast && (
                  <span
                    aria-hidden
                    className="hidden h-px flex-1 bg-linear-to-r from-border to-border lg:block"
                  />
                )}
              </div>

              <p className="eyebrow text-muted-foreground">{step.number}</p>
              <h3 className="mt-2 font-heading text-xl font-semibold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-muted-foreground text-balance">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
