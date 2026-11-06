/**
 * Loading skeleton for the FeaturedStudios section. Matches the editorial
 * grid layout of the real component to avoid layout shift while data streams
 * in.
 */
export const FeaturedStudiosSkeleton = () => {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mb-12 lg:mb-16">
        <div className="h-9 w-48 animate-pulse rounded-full bg-muted" />
        <div className="mt-2 h-11 w-3/4 max-w-2xl animate-pulse rounded-lg bg-muted" />
        <div className="mt-4 h-5 w-1/2 max-w-lg animate-pulse rounded bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
        {/* Tall portrait placeholder */}
        <div className="lg:col-span-4 lg:row-span-2">
          <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-muted" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>

        {/* Wide feature placeholder */}
        <div className="lg:col-span-8">
          <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-muted" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-muted" />
        </div>

        {/* Four standard cards placeholders */}
        <div className="lg:col-span-4">
          <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="lg:col-span-4">
          <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </section>
  );
};
