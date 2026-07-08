import {
  ProfileHeaderSkeleton,
  ProfileCardSkeleton,
} from "@/features/profile/components";

export default function DashboardProfileLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="h-4 w-56 bg-muted rounded-md" />
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
    </div>
  );
}
