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
  sm: "h-10 w-10 text-xs",
  md: "h-16 w-16 text-base",
  lg: "h-24 w-24 sm:h-28 sm:w-28 text-xl font-bold",
  xl: "h-28 w-28 sm:h-36 sm:w-36 text-2xl font-bold",
};

const badgeSizeClasses: Record<AvatarSize, string> = {
  sm: "h-3 w-3 -bottom-0 -right-0",
  md: "h-4 w-4 -bottom-0.5 -right-0.5",
  lg: "h-6 w-6 -bottom-1 -right-1",
  xl: "h-7 w-7 -bottom-1 -right-1",
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
      <Avatar className={cn("border-2 border-background shadow-sm ring-1 ring-border/50", sizeClasses[size])}>
        {src ? <AvatarImage src={src} alt={name || "User avatar"} className="object-cover" /> : null}
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold select-none">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {isVerified && showBadge && (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full bg-background text-blue-500 shadow-xs ring-2 ring-background",
            badgeSizeClasses[size]
          )}
          title="Verified Ravenshaw Profile"
        >
          <CheckCircle2 className="h-full w-full fill-current text-blue-500 stroke-background" />
        </span>
      )}
    </div>
  );
}
