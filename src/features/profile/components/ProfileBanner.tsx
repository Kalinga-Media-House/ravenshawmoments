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
  student: "from-[#4A0E1B] via-[#6B1526] to-[#801B30]",
  teacher: "from-[#3B1E1E] via-[#5C2B2B] to-[#7B3838]",
  alumni: "from-[#3A2424] via-[#593636] to-[#784A4A]",
  department_cr: "from-[#4B1A2A] via-[#6E263D] to-[#8F3350]",
  hostel_bmc: "from-[#3D141C] via-[#5C1E2A] to-[#7A2838]",
  organization_admin: "from-[#471724] via-[#6B2236] to-[#8C2C47]",
  contributor: "from-[#521927] via-[#752438] to-[#992E49]",
  volunteer: "from-[#421A22] via-[#632733] to-[#853444]",
  default: "from-[#4A0E1B] via-[#6B1526] to-[#801B30]",
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
