"use client";

import React, { useEffect, useState } from "react";
import { Users, Shield, UserCheck, Archive, Globe2, AlertCircle } from "lucide-react";
import { getManagementOverviewCounts, OverviewCounts } from "@/app/actions/userManagement";
import { StatGrid } from "@/features/shared/components/statistics/StatGrid";
import { StatCard } from "@/features/shared/components/statistics/StatCard";
import { WidgetError } from "@/features/shared/components/dashboard/Widget";

interface OverviewCardsProps {
  onNavigate: (tabId: string) => void;
}

export function OverviewCards({ onNavigate }: OverviewCardsProps) {
  const [counts, setCounts] = useState<OverviewCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      const result = await getManagementOverviewCounts();
      if (result.success && result.counts) {
        setCounts(result.counts);
      } else {
        setError(result.error || "Failed to load counts");
      }
      setLoading(false);
    }
    fetchCounts();
  }, []);

  const cards = [
    {
      id: "users",
      title: "Total Users",
      label: "Registered on platform",
      count: counts?.totalUsers,
      icon: <Users className="size-5" />,
      tab: "users",
      variant: "default" as const,
    },
    {
      id: "admins",
      title: "Total Admins",
      label: "Platform administrators",
      count: counts?.totalAdmins,
      icon: <Shield className="size-5" />,
      tab: "members",
      variant: "maroon" as const,
    },
    {
      id: "crs",
      title: "Total CRs",
      label: "Department representatives",
      count: counts?.totalCRs,
      icon: <Users className="size-5" />,
      tab: "members",
      variant: "default" as const,
    },
    {
      id: "bmcs",
      title: "Total BMCs",
      label: "Hostel representatives",
      count: counts?.totalBMCs,
      icon: <Users className="size-5" />,
      tab: "members",
      variant: "default" as const,
    },
    {
      id: "verifications",
      title: "Pending Verifications",
      label: "Profile requests to review",
      count: counts?.pendingVerifications,
      icon: <UserCheck className="size-5" />,
      tab: "verification",
      variant: "default" as const,
    },
    {
      id: "unclaimed",
      title: "Unclaimed Profiles",
      label: "Pre-created profiles",
      count: counts?.unclaimedProfiles,
      icon: <Archive className="size-5" />,
      tab: "unclaimed",
      variant: "default" as const,
    },
    {
      id: "external",
      title: "External Participants",
      label: "Other college participants",
      count: counts?.externalParticipants,
      icon: <Globe2 className="size-5" />,
      tab: "external",
      variant: "default" as const,
    },
  ];

  if (error) {
    return <WidgetError message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <StatGrid cols={3} className="gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onNavigate(card.tab)}
          className="cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none"
        >
          <StatCard
            title={card.title}
            value={card.count?.toLocaleString() ?? "0"}
            label={card.label}
            icon={card.icon}
            isLoading={loading}
            variant={card.variant}
            className="h-full"
          />
        </div>
      ))}
    </StatGrid>
  );
}
