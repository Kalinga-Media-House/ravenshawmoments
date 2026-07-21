export default function VerificationLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-[#2D1F23] animate-pulse" />
        <div className="h-4 w-64 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
      </div>
      <div className="flex gap-1 rounded-lg border border-[#2D1F23] bg-[#1A1214] p-1 w-fit">
        {["Pending", "Approved", "Rejected"].map((tab) => (
          <div key={tab} className="h-9 w-24 rounded-md bg-[#2D1F23] animate-pulse" />
        ))}
      </div>
      <div className="rounded-xl border border-[#2D1F23] bg-[#1A1214]">
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
