export default function FacultyLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-4 w-64 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-[#2D1F23] animate-pulse" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 flex-1 max-w-sm rounded-lg bg-[#2D1F23] animate-pulse" />
        <div className="h-10 w-28 rounded-lg bg-[#2D1F23] animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#2D1F23] animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 rounded bg-[#2D1F23] animate-pulse" />
                <div className="h-3 w-24 rounded bg-[#2D1F23]/60 animate-pulse" />
              </div>
            </div>
            <div className="h-3 w-full rounded bg-[#2D1F23]/40 animate-pulse" />
            <div className="h-3 w-3/4 rounded bg-[#2D1F23]/40 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
