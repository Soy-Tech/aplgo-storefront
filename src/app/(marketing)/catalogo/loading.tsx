export default function CatalogoLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="h-9 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="mb-10 flex justify-center gap-2">
        {[80, 100, 110, 90].map((w, i) => (
          <div
            key={i}
            className="h-9 animate-pulse rounded-full bg-muted"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card">
            <div className="h-44 animate-pulse rounded-t-lg bg-muted" />
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-5 w-36 animate-pulse rounded bg-muted" />
              <div className="h-8 w-20 animate-pulse rounded bg-muted" />
              <div className="space-y-1.5">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
