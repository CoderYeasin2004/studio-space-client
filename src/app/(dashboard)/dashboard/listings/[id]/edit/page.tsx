import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Studio } from "@/types/studio";
import { ListingForm } from "@/components/dashboard/listing-form";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The edit route is fully dynamic — it resolves the id per request so a real
 * API decides what exists. That means no static shell to validate, which the
 * dashboard layout's `usePathname()` (a runtime value) could never satisfy
 * during prerender anyway.
 */
export const instant = false;

/**
 * No `generateStaticParams` on purpose: with `cacheComponents` it must return
 * at least one id, which means hardcoding data again. Leaving it out lets the
 * route render per request, so a real API lookup decides what exists.
 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const { id } = await params;
  const studio = await getListing(id);
  if (!studio) return { title: "Listing not found — StudioSpace" };
  return { title: `Edit ${studio.name} — StudioSpace` };
};

/** Edit an existing listing, prefilled from the fetched record. */
const EditListingPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  // `params` is awaited inside Suspense so the static shell can prerender
  // while the id is still unknown (required once generateStaticParams is gone).
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-72 max-w-full" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-8">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-52 w-full rounded-xl" />
            </div>
            <aside className="lg:col-span-4">
              <Skeleton className="h-80 w-full rounded-xl" />
            </aside>
          </div>
        </div>
      }
    >
      <EditListing params={params} />
    </Suspense>
  );
};

export default EditListingPage;

const EditListing = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const studio = await getListing(id);
  if (!studio) notFound();

  return (
    <div className="flex flex-col gap-7">
      <div>
        <span className="eyebrow text-primary">Host</span>
        <h2 className="mt-2.5 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
          Edit {studio.name}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Update the details, adjust what&apos;s included, then save. Changes will be saved to your studio listing.
        </p>
      </div>

      <ListingForm initial={studio} listingId={studio.id} />
    </div>
  );
};


const getListing = async (id: string): Promise<Studio | undefined> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch studio");
  }

  return response.json();
};
