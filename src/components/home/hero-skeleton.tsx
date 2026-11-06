/**
 * Loading skeleton for the Hero section. Matches the dimensions and layout
 * of the real Hero to avoid layout shift while data streams in.
 */
export const HeroSkeleton = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 lg:pt-16 lg:pb-24">
      {/* Soft brand wash — kept subtle so purple stays an accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[480px] rounded-full bg-brand-lavender/25 blur-[120px] dark:bg-brand-violet/20"
      />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* ---------- Copy column ---------- */}
        <div className="flex flex-col gap-7 lg:col-span-5">
          <div className="h-9 w-48 animate-pulse rounded-full bg-muted" />
          <div className="mt-2 h-12 w-3/4 animate-pulse rounded-lg bg-muted" />
          <div className="mt-4 h-6 w-1/2 max-w-md animate-pulse rounded bg-muted" />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="h-12 w-32 animate-pulse rounded-full bg-muted" />
            <div className="h-12 w-32 animate-pulse rounded-full bg-muted" />
          </div>

          {/* Stats placeholder */}
          <dl className="mt-8 flex items-center gap-6 border-t border-border pt-6 sm:gap-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-10 w-24 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Imagery column ---------- */}
        <div className="relative lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted sm:aspect-[5/4] lg:aspect-[4/3.4] lg:-mr-12 lg:rounded-l-2xl lg:rounded-r-none xl:-mr-20">
            <div className="h-full w-full animate-pulse rounded-2xl bg-muted" />
            <div className="absolute top-4 left-4 h-8 w-24 animate-pulse rounded-full bg-muted" />
          </div>

          {/* Floating studio card placeholder */}
          <div
            className="absolute -bottom-6 left-4 flex w-[min(20rem,calc(100%-2rem))] items-center gap-3 rounded-xl border border-border bg-card/95 p-2.5 pr-4 shadow-xl backdrop-blur-sm sm:left-8 lg:-bottom-8 lg:left-0"
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              <div className="mt-0.5 h-3 w-12 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
