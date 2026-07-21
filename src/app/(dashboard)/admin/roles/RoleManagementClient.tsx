"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, Users, LayoutDashboard, UserCheck, Shield, History, Archive, Globe2 } from "lucide-react";
import { OverviewCards } from "./components/OverviewCards";
import { AdminMembersTab } from "./components/AdminMembersTab";
import { UserSearchTab } from "./components/UserSearchTab";
import { VerificationCenterTab } from "./components/VerificationCenterTab";
import { UnclaimedProfilesTab } from "./components/UnclaimedProfilesTab";
import { AuditHistoryTab } from "./components/AuditHistoryTab";
import { ExternalParticipantsTab } from "./components/ExternalParticipantsTab";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "members", label: "Admin Members", icon: Shield },
  { id: "users", label: "User Directory", icon: Users },
  { id: "external", label: "External Participants", icon: Globe2 },
  { id: "verification", label: "Profile Verification", icon: UserCheck },
  { id: "unclaimed", label: "Unclaimed Profiles", icon: Archive },
  { id: "audit", label: "Audit History", icon: History },
];

function RoleManagementTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Sync tab state with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("overview");
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`/admin/roles?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Architecture Info */}
      <div className="bg-[#FFFDF8] rounded-xl border border-[#E8B83F]/20 p-5 mb-6">
        <h3 className="text-sm font-bold text-[#171214] flex items-center gap-2 mb-2">
          <ShieldAlert className="w-4 h-4 text-[#E8B83F]" />
          Administrative Center Rules
        </h3>
        <ul className="text-xs text-[#756A6E] space-y-1 list-disc list-inside">
          <li>Only <strong>Super Admins</strong> can assign or revoke the Admin role.</li>
          <li>Community identity roles (Student, Alumni, Teacher, CR, BMC) are managed independently.</li>
          <li>Profile verification confirms identity but does not grant administrative privileges.</li>
          <li>All critical actions are securely recorded in the platform audit log.</li>
        </ul>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#8F0028]/[0.08] overflow-x-auto scrollbar-hide">
        <nav className="flex items-center gap-1 min-w-max pb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                  isActive
                    ? "border-[#8F0028] text-[#8F0028]"
                    : "border-transparent text-[#756A6E] hover:text-[#171214] hover:bg-[#8F0028]/[0.02]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#8F0028]" : "opacity-60"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-2 min-h-[400px]">
        {activeTab === "overview" && <OverviewCards onNavigate={handleTabChange} />}
        {activeTab === "members" && <AdminMembersTab />}
        {activeTab === "users" && <UserSearchTab />}
        {activeTab === "external" && <ExternalParticipantsTab />}
        {activeTab === "verification" && <VerificationCenterTab />}
        {activeTab === "unclaimed" && <UnclaimedProfilesTab />}
        {activeTab === "audit" && <AuditHistoryTab />}
      </div>
    </div>
  );
}

export function RoleManagementClient() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading tabs...</div>}>
      <RoleManagementTabs />
    </Suspense>
  );
}
