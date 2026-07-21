"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  GraduationCap,
  Users,
  BookOpen,
  Image,
  FileText,
  Trophy,
  Upload,
  ShieldCheck,
  BarChart3,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "", icon: LayoutDashboard },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Programs", href: "/programs", icon: BookOpen },
  { label: "Faculty", href: "/faculty", icon: Users },
  { label: "Students", href: "/students", icon: GraduationCap },
  { label: "Gallery", href: "/gallery", icon: Image },
  { label: "Content", href: "/content", icon: FileText },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Media Library", href: "/media", icon: Upload },
  { label: "Verifications", href: "/verification", icon: ShieldCheck },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "SEO", href: "/seo", icon: Search },
];

interface SidebarProps {
  slug: string;
  departmentName: string;
}

export function DepartmentSidebar({ slug, departmentName }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const basePath = `/department/${slug}`;

  return (
    <aside
      className={`sticky top-0 h-screen flex-shrink-0 border-r border-[#2D1F23] bg-[#1A1214] transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } hidden lg:flex flex-col`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#2D1F23] px-4">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C2D3E] to-[#9B3A4D]">
              <span className="text-xs font-bold text-white">
                {departmentName.charAt(0)}
              </span>
            </div>
            <span className="truncate text-sm font-semibold text-[#F5E6EA]">
              {departmentName}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#8B7078] hover:bg-[#2D1F23] hover:text-[#F5E6EA] transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const href = `${basePath}${item.href}`;
          const isActive =
            item.href === ""
              ? pathname === basePath || pathname === `${basePath}/`
              : pathname.startsWith(href);

          return (
            <Link
              key={item.label}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#7C2D3E]/20 to-transparent text-[#F5E6EA] border-l-2 border-[#9B3A4D]"
                  : "text-[#8B7078] hover:bg-[#2D1F23]/50 hover:text-[#F5E6EA]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                size={20}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? "text-[#9B3A4D]" : "text-[#8B7078] group-hover:text-[#9B3A4D]"
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-[#2D1F23] p-4">
          <p className="text-xs text-[#8B7078]">Department CMS v1.0</p>
        </div>
      )}
    </aside>
  );
}
