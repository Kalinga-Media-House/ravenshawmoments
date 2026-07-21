export default function SeoLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-36 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-[#2D1F23] animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-28 rounded bg-[#2D1F23] animate-pulse" />
              <div className="h-10 w-full rounded-lg bg-[#2D1F23]/60 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-[#2D1F23] animate-pulse" />
          <div className="h-32 w-full rounded-lg bg-[#2D1F23]/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
