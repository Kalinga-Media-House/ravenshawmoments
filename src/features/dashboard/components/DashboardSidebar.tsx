"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  Building2,
  Home,
  Briefcase,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Activity,
  Trophy,
  PieChart,
  FileText,
  MessageSquareWarning,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  userRoleCode: string;
  profileType: string;
}

export function DashboardSidebar({ userRoleCode, profileType }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Do not render the main dashboard sidebar if we are in a dedicated workspace (like Department CMS)
  if (pathname.startsWith("/department/") && pathname.split("/").length > 2) {
    return null;
  }

  const isSuperAdmin = userRoleCode === "SUPER_ADMIN";
  const isAdmin = isSuperAdmin || userRoleCode === "ADMIN";
  const isRecruiter = userRoleCode === "RECRUITER" || profileType === "recruiter";
  const isDepartmentCR = profileType === "department_cr";
  const isHostelBMC = profileType === "hostel_bmc";
  const isOrgAdmin = profileType === "organization_admin";

  const mainNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/dashboard/profile", icon: User },
    { label: "Community Hub", href: "/community", icon: Users },
  ];

  const roleNav: { label: string; href: string; icon: any }[] = [];

  if (isDepartmentCR) {
    roleNav.push({ label: "My Departments", href: "/dashboard/departments", icon: Building2 });
  }
  if (isHostelBMC) {
    roleNav.push({ label: "My Hostels", href: "/dashboard/hostels", icon: Home });
  }
  if (isOrgAdmin) {
    roleNav.push({ label: "My Organizations", href: "/dashboard/organizations", icon: Users });
  }
  if (isRecruiter) {
    roleNav.push({ label: "Recruitment", href: "/dashboard/recruiter", icon: Briefcase });
  }

  const adminNav: { label: string; href: string; icon: any }[] = [];
  if (isAdmin) {
    adminNav.push(
      { label: "Competitions", href: "/admin/competitions", icon: Trophy },
      { label: "Donations", href: "/admin/donations", icon: Settings },
      { label: "Analytics", href: "/dashboard/admin/analytics", icon: PieChart },
      { label: "System Health", href: "/dashboard/admin/system-health", icon: Activity },
      { label: "Placements", href: "/dashboard/admin/placements", icon: Briefcase },
      { label: "Identity & Auth", href: "/dashboard/identity", icon: ShieldCheck },
      { label: "Reports", href: "/dashboard/admin/reports", icon: FileText },
      { label: "Community Moderation", href: "/dashboard/community/moderation", icon: MessageSquareWarning },
      { label: "Deleted Content", href: "/dashboard/community/deleted", icon: EyeOff }
    );
  }
  if (isSuperAdmin) {
    adminNav.push(
      { label: "Role Management", href: "/admin/roles", icon: ShieldCheck },
      { label: "Intelligence", href: "/dashboard/admin/intelligence", icon: Activity }
    );
  }

  const renderNavItems = (items: { label: string; href: string; icon: any }[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                isActive
                  ? "bg-[#E8B83F]/10 text-[#E8B83F]"
                  : "text-[#FFF9F1]/70 hover:bg-white/5 hover:text-[#FFF9F1]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={`size-5 shrink-0 transition-colors ${
                  isActive ? "text-[#E8B83F]" : "text-[#FFF9F1]/50 group-hover:text-[#E8B83F]/70"
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 flex items-center justify-center size-12 rounded-full bg-[#E8B83F] text-[#3A000E] shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Open Sidebar"
      >
        <Menu className="size-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-[#2D0B16] border-r border-white/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 h-[64px] sm:h-[72px]">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Navigation</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white"
                >
                  <ChevronLeft className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-[#E8B83F]/70 uppercase tracking-widest mb-3 px-3">Main</h3>
                  {renderNavItems(mainNav)}
                </div>
                {roleNav.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-[#E8B83F]/70 uppercase tracking-widest mb-3 px-3">Management</h3>
                    {renderNavItems(roleNav)}
                  </div>
                )}
                {adminNav.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-[#E8B83F]/70 uppercase tracking-widest mb-3 px-3">Administration</h3>
                    {renderNavItems(adminNav)}
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sticky top-[76px] h-[calc(100vh-76px)] border-r border-[#2D1F23] bg-[#1A050B] transition-all duration-300 shrink-0 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div>
            {!collapsed && <h3 className="text-[10px] font-bold text-[#E8B83F]/70 uppercase tracking-widest mb-3 px-3">Main</h3>}
            {renderNavItems(mainNav)}
          </div>
          {roleNav.length > 0 && (
            <div>
              {!collapsed && <h3 className="text-[10px] font-bold text-[#E8B83F]/70 uppercase tracking-widest mb-3 px-3">Management</h3>}
              {renderNavItems(roleNav)}
            </div>
          )}
          {adminNav.length > 0 && (
            <div>
              {!collapsed && <h3 className="text-[10px] font-bold text-[#E8B83F]/70 uppercase tracking-widest mb-3 px-3">Administration</h3>}
              {renderNavItems(adminNav)}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-[#2D1F23]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          </button>
        </div>
      </aside>
    </>
  );
}
