/**
 * Loading skeleton for the Hero slider. Matches the dimensions and layout of
 * the real Hero to avoid layout shift while the client component hydrates.
 */
export const HeroSkeleton = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div
          className="relative h-[58vh] lg:h-[64vh] max-h-[640px] lg:max-h-[720px] rounded-2xl bg-muted overflow-hidden"
        >
          <div className="h-full w-full animate-pulse bg-muted" />
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:mt-10 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex flex-col gap-4 max-w-[560px]">
            <div className="h-9 w-48 animate-pulse rounded-full bg-muted" />
            <div className="mt-3 h-[3rem] w-3/4 animate-pulse rounded-lg bg-muted" />
            <div className="mt-4 h-6 w-1/2 max-w-md animate-pulse rounded bg-muted" />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="h-11 w-32 animate-pulse rounded-full bg-muted" />
              <div className="h-11 w-32 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
