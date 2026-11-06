/**
 * Loading skeleton for the Categories section. Matches the 5-card horizontal
 * row layout of the real component to avoid layout shift while data streams
 * in.
 */
export const CategoriesSkeleton = () => {
  return (
    <section className="border-y border-border bg-muted/40 dark:bg-muted/20">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-12 lg:mb-16">
          <div className="h-9 w-48 animate-pulse rounded-full bg-muted" />
          <div className="mt-2 h-11 w-3/4 max-w-2xl animate-pulse rounded-lg bg-muted" />
          <div className="mt-4 h-5 w-1/2 max-w-lg animate-pulse rounded bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-full overflow-hidden rounded-xl border border-border/50 bg-card">
              <div className="h-32 flex items-center justify-center w-12 h-12 rounded-xl mx-auto bg-muted/50">
                <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="px-4 pt-4">
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                <div className="mt-1 h-3 w-full animate-pulse rounded bg-muted min-h-[3rem]" />
              </div>
              <div className="mt-auto flex items-center gap-1.5 px-4 pb-4">
                <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
