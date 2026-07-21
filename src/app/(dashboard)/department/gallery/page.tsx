import { requireAuth } from "@/auth/guards/require-auth";

export default async function GalleryPage() {
  await requireAuth();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2">
          Create Album
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground">
            Cover Image
          </div>
          <div className="p-6">
            <h3 className="font-semibold">Annual Function 2026</h3>
            <p className="text-sm text-muted-foreground">Published • 12 photos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

