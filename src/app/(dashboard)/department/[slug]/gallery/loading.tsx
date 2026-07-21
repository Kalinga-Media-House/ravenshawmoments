export default function GalleryLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 rounded-lg bg-[#2D1F23] animate-pulse" />
          <div className="h-4 w-56 rounded-lg bg-[#2D1F23]/60 animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-[#2D1F23] animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#2D1F23] bg-[#1A1214] overflow-hidden">
            <div className="aspect-video bg-[#2D1F23] animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-40 rounded bg-[#2D1F23] animate-pulse" />
              <div className="h-3 w-24 rounded bg-[#2D1F23]/60 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
