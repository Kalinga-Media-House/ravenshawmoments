export default function ContentLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-44 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-4 w-64 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-[#2D1F23] animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-5 flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 rounded bg-[#2D1F23] animate-pulse" />
              <div className="h-3 w-96 rounded bg-[#2D1F23]/40 animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 rounded-md bg-[#2D1F23] animate-pulse" />
              <div className="h-8 w-8 rounded-md bg-[#2D1F23] animate-pulse" />
              <div className="h-8 w-8 rounded-md bg-[#2D1F23] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
