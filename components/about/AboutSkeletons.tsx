export function CambodiaSectionSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="border-y border-slate/60 dark:border-slate/15 bg-slate/[0.045] py-14 sm:py-16"
    >
      <div className="shell">
        <div className="h-3 w-40 animate-pulse rounded bg-slate/15" />
        <div className="mt-4 h-8 w-full max-w-md animate-pulse rounded bg-slate/15" />
        <div className="mt-4 h-3 w-full max-w-xl animate-pulse rounded bg-slate/10" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="rounded-xl border border-slate/60 dark:border-slate/15 bg-panel p-5"
            >
              <div className="h-3 w-24 animate-pulse rounded bg-slate/10" />
              <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate/15" />
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 rounded-xl border border-slate/60 dark:border-slate/15 bg-panel p-6">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="space-y-3">
                <div className="h-3 w-32 animate-pulse rounded bg-slate/15" />
                <div className="h-2 w-full animate-pulse rounded-full bg-slate/10" />
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-xl border border-slate/60 dark:border-slate/15 bg-panel p-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="h-4 w-full animate-pulse rounded bg-slate/10"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlacesSectionSkeleton() {
  return (
    <section aria-hidden="true" className="shell py-14 sm:py-16">
      <div className="h-3 w-32 animate-pulse rounded bg-slate/15" />
      <div className="mt-4 h-8 w-full max-w-sm animate-pulse rounded bg-slate/15" />
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-slate/60 dark:border-slate/15 bg-panel"
          >
            <div className="aspect-[1.5] w-full animate-pulse bg-slate/10" />
            <div className="space-y-3 p-5">
              <div className="h-2.5 w-24 animate-pulse rounded bg-slate/10" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate/15" />
              <div className="h-2.5 w-full animate-pulse rounded bg-slate/10" />
              <div className="h-2.5 w-5/6 animate-pulse rounded bg-slate/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
