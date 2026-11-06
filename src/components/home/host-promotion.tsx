import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { img } from "@/lib/images";

const promises = [
  "List free — you only pay when you earn",
  "Set your own rates, hours and house rules",
  "Calendar sync and instant booking requests",
];

/**
 * Host promotion. Full-bleed photographic band with the headline set over a
 * left-weighted scrim. Tells the StudioSpace story alongside the CTA.
 */
export const HostPromotion = () => {
  return (
    <section id="about" aria-labelledby="host-heading" className="px-5 sm:px-8 lg:px-12">
      {/* Fixed ink surface — must NOT use bg-foreground, which flips to a
          light value in dark mode and would break the white type above. */}
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-2xl bg-[#171326]">
        <div className="relative grid grid-cols-1 lg:grid-cols-2">
          {/* ---------- Copy ---------- */}
          <div className="relative z-10 flex flex-col justify-center gap-8 px-6 py-14 sm:px-10 lg:py-24 xl:px-16">
            <span className="eyebrow text-brand-lavender">For studio owners</span>

            <h2
              id="host-heading"
              className="font-heading text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-white"
            >
              Your Space Has a Story.{" "}
              <span className="text-brand-lavender">Let Creators Tell It.</span>
            </h2>

            <p className="max-w-lg text-base leading-[1.6] text-white/80 text-balance sm:text-lg">
              Empty hours cost more than busy ones. Open your doors to
              photographers, filmmakers, podcasters and makers in your city —
              and turn the space you already have into steady income.
            </p>

            <ul className="flex flex-col gap-3">
              {promises.map((promise) => (
                <li
                  key={promise}
                  className="inline-flex items-center gap-3 text-sm text-white/90 sm:text-[15px]"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-violet text-white transition-transform duration-300 group-hover:scale-110">
                    <CheckIcon className="size-4" strokeWidth={3} />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Button
                render={<Link href="/dashboard/listings/new" />}
                size="lg"
                className="h-12 rounded-full bg-brand-violet px-7 text-[15px] text-white transition-all duration-300 hover:bg-brand-purple hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:outline-none group"
              >
                List Your Studio
                <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
              <Button
                render={<Link href="/studios" />}
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-white/25 bg-transparent px-7 text-[15px] text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                See how it works
              </Button>
            </div>
          </div>

          {/* ---------- Photography ---------- */}
          <div className="relative min-h-[18rem] lg:min-h-[34rem] overflow-hidden group">
            <Image
              src={img("1497215728101-856f4ea42174", "gallery")}
              alt="A bright, well-kept studio space ready for its next booking"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-r from-[#171326] via-[#171326]/30 to-transparent lg:from-[#171326] lg:via-[#171326]/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
