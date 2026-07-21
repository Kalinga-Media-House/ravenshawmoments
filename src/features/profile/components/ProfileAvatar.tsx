import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface ProfileAvatarProps {
  src?: string | null;
  name?: string | null;
  isVerified?: boolean;
  size?: AvatarSize;
  className?: string;
  showBadge?: boolean;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-10 text-xs",
  md: "size-16 text-base",
  lg: "size-24 sm:size-28 text-xl font-bold",
  xl: "size-28 sm:size-36 text-2xl font-black",
};

const badgeSizeClasses: Record<AvatarSize, string> = {
  sm: "size-3.5 -bottom-0 -right-0",
  md: "size-5 -bottom-0.5 -right-0.5",
  lg: "size-7 -bottom-1 -right-1",
  xl: "size-8 sm:size-9 -bottom-1.5 -right-1.5",
};

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "RM";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ProfileAvatar({
  src,
  name = "User",
  isVerified = false,
  size = "md",
  className,
  showBadge = true,
}: ProfileAvatarProps) {
  return (
    <div className={cn("relative inline-block shrink-0", className)}>
      <Avatar
        className={cn(
          "border-4 border-background shadow-xl transition-all duration-300",
          size === "xl" || size === "lg" ? "ring-2 ring-[#D4AF37]/60" : "ring-1 ring-[#D4AF37]/30",
          sizeClasses[size]
        )}
      >
        {src ? <AvatarImage src={src} alt={name || "User avatar"} className="object-cover" /> : null}
        <AvatarFallback className="bg-gradient-to-br from-[#2A0810] via-[#4A0E1B] to-[#6B001E] text-[#D4AF37] font-black tracking-tight select-none">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {isVerified && showBadge && (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full bg-background text-[#D4AF37] shadow-md ring-2 sm:ring-3 ring-background transition-transform hover:scale-110",
            badgeSizeClasses[size]
          )}
          title="Verified Ravenshaw Profile"
        >
          <CheckCircle2 className="size-full fill-current text-[#D4AF37] stroke-[#8F0028]" />
        </span>
      )}
    </div>
  );
}
