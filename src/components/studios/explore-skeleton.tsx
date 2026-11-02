/**
 * Loading skeleton for /studios — used by both the route `loading.tsx` and
 * the Suspense boundary around search-param-dependent UI.
 */

export function ExploreSkeleton({
  includeHeader = false,
}: {
  includeHeader?: boolean;
}) {
  return (
    <div aria-busy="true" aria-label="Loading studios">
      {includeHeader && (
        <div className="mx-auto max-w-[1440px] px-5 pt-12 pb-8 sm:px-8 lg:px-12">
          <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
          <div className="mt-5 h-11 w-3/4 max-w-2xl animate-pulse rounded-lg bg-muted" />
          <div className="mt-4 h-5 w-1/2 max-w-lg animate-pulse rounded bg-muted" />
        </div>
      )}

      {/* Filter bar placeholder */}
      <div className="border-y border-border bg-background/80">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-4 sm:px-8 lg:flex-row lg:px-12">
          <div className="h-10 flex-1 animate-pulse rounded-full bg-muted" />
          <div className="hidden gap-2.5 lg:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-32 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Results placeholder */}
      <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-24 sm:px-8 lg:px-12">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3.5">
              <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3.5 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
