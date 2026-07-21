export default function ProgramsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-4 w-64 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-[#2D1F23] animate-pulse" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 flex-1 max-w-sm rounded-lg bg-[#2D1F23] animate-pulse" />
        <div className="h-10 w-28 rounded-lg bg-[#2D1F23] animate-pulse" />
      </div>
      <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214]">
        <div className="border-b border-[#2D1F23] p-4 flex gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-20 rounded bg-[#2D1F23] animate-pulse" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-[#2D1F23] p-4 flex gap-8">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 w-24 rounded bg-[#2D1F23]/60 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
