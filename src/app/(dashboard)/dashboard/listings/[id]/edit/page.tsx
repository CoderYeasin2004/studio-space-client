import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { myListings } from "@/data/bookings";
import { ListingForm } from "@/components/dashboard/listing-form";

export async function generateStaticParams() {
  return myListings.map((studio) => ({ id: studio.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  "use cache";
  const { id } = await params;
  const studio = myListings.find((s) => s.id === id);
  if (!studio) return { title: "Listing not found — StudioSpace" };
  return { title: `Edit ${studio.name} — StudioSpace` };
}

/** Edit an existing listing, prefilled from the mock catalogue. */
export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studio = myListings.find((s) => s.id === id);
  if (!studio) notFound();

  return (
    <div className="flex flex-col gap-7">
      <div>
        <span className="eyebrow text-primary">Host</span>
        <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
          Edit {studio.name}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Update the details, adjust what&apos;s included, then save. Changes
          stay local to this demo session.
        </p>
      </div>

      <ListingForm initial={studio} listingId={studio.id} />
    </div>
  );
}
