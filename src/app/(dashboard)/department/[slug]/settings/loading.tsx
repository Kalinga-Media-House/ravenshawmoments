export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-4 w-80 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-10 w-32 rounded-lg bg-[#2D1F23] animate-pulse" />
        </div>
      </div>
      <div className="flex gap-1 rounded-lg border border-[#2D1F23] bg-[#1A1214] p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-md bg-[#2D1F23] animate-pulse" />
        ))}
      </div>
      <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-[#2D1F23] animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-[#2D1F23]/60 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
