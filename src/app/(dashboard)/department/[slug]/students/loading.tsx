export default function StudentsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-52 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
        </div>
      </div>
      <div className="flex gap-1 rounded-lg border border-[#2D1F23] bg-[#1A1214] p-1 w-fit">
        {["Verified", "Pending", "Rejected"].map((tab) => (
          <div key={tab} className="h-9 w-24 rounded-md bg-[#2D1F23] animate-pulse" />
        ))}
      </div>
      <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214]">
        <div className="border-b border-[#2D1F23] p-4 flex gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-20 rounded bg-[#2D1F23] animate-pulse" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-[#2D1F23] p-4 flex gap-8">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="h-4 w-24 rounded bg-[#2D1F23]/60 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
