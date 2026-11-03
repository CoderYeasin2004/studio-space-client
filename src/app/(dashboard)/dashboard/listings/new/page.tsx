import type { Metadata } from "next";
import { ListingForm } from "@/components/dashboard/listing-form";

export const metadata: Metadata = {
  title: "New listing — StudioSpace",
};

/** Create a new studio listing. */
export default function NewListingPage() {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <span className="eyebrow text-primary">Host</span>
        <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
          List a new studio
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Fill in the essentials now — you can refine photos, pricing and
          availability before publishing.
        </p>
      </div>

      <ListingForm />
    </div>
  );
}
