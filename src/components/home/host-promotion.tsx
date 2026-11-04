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
 * left-weighted scrim, plus a proof strip. Also serves as the #about anchor:
 * it tells the StudioSpace story alongside the CTA.
 */
export const HostPromotion = () => {
  return (
    <section id="about" aria-labelledby="host-heading" className="px-5 sm:px-8 lg:px-12">
      {/* Fixed ink surface — must NOT use bg-foreground, which flips to a
          light value in dark mode and would break the white type above. */}
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-2xl bg-[#171326]">
        <div className="relative grid grid-cols-1 lg:grid-cols-2">
          {/* ---------- Copy ---------- */}
          <div className="relative z-10 flex flex-col justify-center gap-7 px-6 py-14 sm:px-10 lg:py-20 xl:px-16">
            <span className="eyebrow text-brand-lavender">For studio owners</span>

            <h2
              id="host-heading"
              className="font-heading text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-white"
            >
              Your Space Has a Story.{" "}
              <span className="text-brand-lavender">Let Creators Tell It.</span>
            </h2>

            <p className="max-w-lg text-base leading-relaxed text-white/70 text-balance sm:text-lg">
              Empty hours cost more than busy ones. Open your doors to
              photographers, filmmakers, podcasters and makers in your city —
              and turn the space you already have into steady income.
            </p>

            <ul className="flex flex-col gap-2.5">
              {promises.map((promise) => (
                <li
                  key={promise}
                  className="inline-flex items-center gap-3 text-sm text-white/85 sm:text-[15px]"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-violet text-white">
                    <CheckIcon className="size-3" strokeWidth={3} />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Button
                render={<Link href="/dashboard/listings/new" />}
                size="lg"
                className="h-12 rounded-full bg-brand-violet px-7 text-[15px] text-white hover:bg-brand-purple"
              >
                List Your Studio
                <ArrowRightIcon className="ml-1 size-4" />
              </Button>
              <Button
                render={<Link href="/studios" />}
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-white/25 bg-transparent px-7 text-[15px] text-white hover:bg-white/10 hover:text-white"
              >
                See how it works
              </Button>
            </div>
          </div>

          {/* ---------- Photography ---------- */}
          <div className="relative min-h-[18rem] lg:min-h-[34rem]">
            <Image
              src={img("1497215728101-856f4ea42174", "gallery")}
              alt="A bright, well-kept studio space ready for its next booking"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-r from-[#171326] via-[#171326]/30 to-transparent lg:from-[#171326] lg:via-[#171326]/10"
            />

            {/* Floating occupancy card */}
            <div className="absolute right-5 bottom-5 w-56 rounded-xl border border-white/15 bg-black/45 p-4 backdrop-blur-md sm:right-8 sm:bottom-8">
              <p className="text-xs text-white/60">Last month, hosts earned</p>
              <p className="font-heading mt-1 text-3xl font-semibold text-white">
                £2,840
                <span className="text-base font-normal text-white/60"> avg.</span>
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-4/5 rounded-full bg-brand-lavender" />
              </div>
              <p className="mt-2 text-[11px] text-white/50">
                Top 20% of active studios
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
