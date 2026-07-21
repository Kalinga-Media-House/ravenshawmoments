export default function AchievementsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-44 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-4 w-56 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
        </div>
        <div className="h-10 w-40 rounded-lg bg-[#2D1F23] animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#2D1F23] bg-[#1A1214] p-6 space-y-3">
            <div className="flex justify-between">
              <div className="h-5 w-40 rounded bg-[#2D1F23] animate-pulse" />
              <div className="h-5 w-16 rounded-full bg-[#2D1F23] animate-pulse" />
            </div>
            <div className="h-3 w-full rounded bg-[#2D1F23]/40 animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-[#2D1F23]/40 animate-pulse" />
            <div className="h-3 w-24 rounded bg-[#2D1F23]/60 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
