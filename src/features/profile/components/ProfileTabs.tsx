"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { User, Image as ImageIcon, Trophy, Award, Shield } from "lucide-react";

export type ProfileTabKey = "overview" | "gallery" | "timeline" | "certificates" | "settings";

export interface ProfileTabsProps {
  activeTab?: ProfileTabKey;
  onTabChange?: (tab: ProfileTabKey) => void;
  tabUrls?: Partial<Record<ProfileTabKey, string>>;
  isOwner?: boolean;
  galleryCount?: number;
  achievementsCount?: number;
  certificatesCount?: number;
  overviewContent?: React.ReactNode;
  galleryContent?: React.ReactNode;
  timelineContent?: React.ReactNode;
  certificatesContent?: React.ReactNode;
  settingsContent?: React.ReactNode;
  className?: string;
}

export function ProfileTabs({
  activeTab: controlledTab,
  onTabChange,
  tabUrls,
  isOwner = false,
  galleryCount = 0,
  achievementsCount = 0,
  certificatesCount = 0,
  overviewContent,
  galleryContent,
  timelineContent,
  certificatesContent,
  settingsContent,
  className,
}: ProfileTabsProps) {
  const [internalTab, setInternalTab] = React.useState<ProfileTabKey>("overview");
  const currentTab = controlledTab ?? internalTab;

  const handleSelect = (key: ProfileTabKey) => {
    if (onTabChange) {
      onTabChange(key);
    } else {
      setInternalTab(key);
    }
  };

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: User },
    { key: "gallery" as const, label: "Gallery", icon: ImageIcon, badge: galleryCount },
    { key: "timeline" as const, label: "Journey & Honors", icon: Trophy, badge: achievementsCount },
    { key: "certificates" as const, label: "Certificates", icon: Award, badge: certificatesCount },
    ...(isOwner ? [{ key: "settings" as const, label: "Privacy & Settings", icon: Shield }] : []),
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="border-b border-border/60 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-2 sm:gap-6 min-w-max pb-px" aria-label="Profile navigation tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.key;
            const url = tabUrls?.[tab.key];

            const navClassName = cn(
              "flex items-center gap-2 py-3 px-1 border-b-2 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap",
              isActive
                ? "border-primary text-primary drop-shadow-2xs"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            );

            const content = (
              <>
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{tab.label}</span>
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span
                    className={cn(
                      "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </>
            );

            if (url) {
              return (
                <Link
                  key={tab.key}
                  href={url}
                  className={navClassName}
                  aria-current={isActive ? "page" : undefined}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSelect(tab.key)}
                className={navClassName}
                aria-current={isActive ? "page" : undefined}
              >
                {content}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-2">
        {currentTab === "overview" && overviewContent}
        {currentTab === "gallery" && galleryContent}
        {currentTab === "timeline" && timelineContent}
        {currentTab === "certificates" && certificatesContent}
        {currentTab === "settings" && isOwner && settingsContent}
      </div>
    </div>
  );
}
