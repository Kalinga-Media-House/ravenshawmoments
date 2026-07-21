export default function DepartmentLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-[#2D1F23] animate-pulse" />
        <div className="h-4 w-72 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-16 rounded bg-[#2D1F23] animate-pulse" />
                <div className="h-8 w-12 rounded bg-[#2D1F23] animate-pulse" />
                <div className="h-3 w-20 rounded bg-[#2D1F23]/60 animate-pulse" />
              </div>
              <div className="h-10 w-10 rounded-lg bg-[#2D1F23] animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-[#2D1F23] animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#2D1F23] animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-full rounded bg-[#2D1F23] animate-pulse" />
                <div className="h-2 w-20 rounded bg-[#2D1F23]/60 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-4">
          <div className="h-5 w-36 rounded bg-[#2D1F23] animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-[#2D1F23] animate-pulse" />
              <div className="h-3 w-16 rounded bg-[#2D1F23] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
