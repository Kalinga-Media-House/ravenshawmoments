export default function MediaLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-4 w-56 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-10 w-10 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-10 w-24 rounded-lg bg-[#2D1F23] animate-pulse" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="h-10 flex-1 max-w-sm rounded-lg bg-[#2D1F23] animate-pulse" />
        <div className="h-10 w-28 rounded-lg bg-[#2D1F23] animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#2D1F23] bg-[#1A1214] overflow-hidden">
            <div className="aspect-square bg-[#2D1F23] animate-pulse" />
            <div className="p-2 space-y-1">
              <div className="h-3 w-full rounded bg-[#2D1F23] animate-pulse" />
              <div className="h-2 w-12 rounded bg-[#2D1F23]/60 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
