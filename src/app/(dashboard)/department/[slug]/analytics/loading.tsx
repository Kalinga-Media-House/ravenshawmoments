export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="h-8 w-36 rounded-lg bg-[#2D1F23] animate-pulse" />
        <div className="h-4 w-64 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-3">
            <div className="h-3 w-20 rounded bg-[#2D1F23] animate-pulse" />
            <div className="h-8 w-16 rounded bg-[#2D1F23] animate-pulse" />
            <div className="h-3 w-24 rounded bg-[#2D1F23]/60 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-4">
            <div className="h-5 w-32 rounded bg-[#2D1F23] animate-pulse" />
            <div className="h-48 w-full rounded bg-[#2D1F23]/40 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
