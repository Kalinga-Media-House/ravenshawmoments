import * as React from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Trophy, Award } from "lucide-react";

export interface ProfileStatsProps {
  galleryCount?: number;
  achievementsCount?: number;
  certificatesCount?: number;
  className?: string;
}

export function ProfileStats({
  galleryCount = 0,
  achievementsCount = 0,
  certificatesCount = 0,
  className,
}: ProfileStatsProps) {
  const stats = [
    { label: "Photos", value: galleryCount, icon: ImageIcon },
    { label: "Achievements", value: achievementsCount, icon: Trophy },
    { label: "Certificates", value: certificatesCount, icon: Award },
  ];

  return (
    <div
      className={cn(
        "flex items-center justify-around sm:justify-start gap-4 sm:gap-8 rounded-xl border bg-card/60 px-4 py-3 shadow-2xs backdrop-blur-xs",
        className
      )}
    >
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold leading-none text-foreground sm:text-base">
                {item.value.toLocaleString()}
              </div>
              <div className="text-[11px] font-medium text-muted-foreground mt-0.5">{item.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
