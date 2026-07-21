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
        "flex items-center justify-around sm:justify-start gap-4 sm:gap-8 heritage-card-glass px-5 py-3.5 transition-all duration-200 hover:shadow-md rounded-2xl",
        className
      )}
    >
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex items-center gap-3 text-center sm:text-left group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 border border-white/15 heritage-icon shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Icon className="size-4 text-[var(--color-heritage-gold)]" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold leading-none heritage-card-title">
                {item.value.toLocaleString()}
              </div>
              <div className="text-xs font-medium heritage-card-muted mt-0.5">{item.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
