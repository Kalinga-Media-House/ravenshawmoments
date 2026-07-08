import * as React from "react";
import { cn } from "@/lib/utils";
import { ProfileType } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export interface ProfileBannerProps {
  coverUrl?: string | null;
  profileType?: ProfileType;
  isOwner?: boolean;
  onEditCover?: () => void;
  className?: string;
}

const typeGradients: Record<string, string> = {
  student: "from-blue-600 via-indigo-600 to-purple-700",
  teacher: "from-amber-600 via-orange-600 to-red-700",
  alumni: "from-emerald-600 via-teal-600 to-cyan-700",
  department_cr: "from-indigo-700 via-purple-700 to-pink-700",
  hostel_bmc: "from-cyan-600 via-blue-600 to-indigo-700",
  organization_admin: "from-violet-700 via-purple-700 to-fuchsia-700",
  contributor: "from-rose-600 via-pink-600 to-purple-700",
  volunteer: "from-green-600 via-emerald-600 to-teal-700",
  default: "from-slate-700 via-gray-800 to-zinc-900",
};

export function ProfileBanner({
  coverUrl,
  profileType = "student",
  isOwner = false,
  onEditCover,
  className,
}: ProfileBannerProps) {
  const gradientClass = typeGradients[profileType] || typeGradients.default;

  return (
    <div
      className={cn(
        "relative h-40 sm:h-56 md:h-64 w-full overflow-hidden rounded-t-2xl bg-gradient-to-r",
        gradientClass,
        className
      )}
    >
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt="Profile Cover Banner"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {isOwner && onEditCover && (
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={onEditCover}
            className="h-8 gap-1.5 bg-background/80 text-foreground backdrop-blur-md hover:bg-background shadow-sm text-xs font-medium"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Edit Cover</span>
          </Button>
        </div>
      )}
    </div>
  );
}
