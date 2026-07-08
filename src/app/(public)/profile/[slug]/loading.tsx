import {
  ProfileHeaderSkeleton,
  ProfileCardSkeleton,
  GalleryGridSkeleton,
} from "@/features/profile/components";

export default function PublicProfileLoading() {
  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-pulse">
      <div className="h-4 w-48 bg-muted rounded-md" />
      <ProfileHeaderSkeleton />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 bg-muted rounded-xl" />
        <div className="h-20 bg-muted rounded-xl" />
        <div className="h-20 bg-muted rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="md:col-span-2">
          <ProfileCardSkeleton />
        </div>
        <div>
          <ProfileCardSkeleton />
        </div>
      </div>
      <div className="pt-6">
        <GalleryGridSkeleton count={4} />
      </div>
    </main>
  );
}
