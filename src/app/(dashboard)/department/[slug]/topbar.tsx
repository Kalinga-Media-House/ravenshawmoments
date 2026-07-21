"use client";

import Link from "next/link";
import { Bell, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";

interface TopbarProps {
  departmentName: string;
  userEmail: string;
  slug: string;
}

export function DepartmentTopbar({ departmentName, userEmail, slug }: TopbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#2D1F23] bg-[#1A1214]/80 backdrop-blur-xl px-4 lg:px-8">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg text-[#8B7078] hover:bg-[#2D1F23] hover:text-[#F5E6EA] transition-colors"
        aria-label="Toggle mobile menu"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 text-sm">
        <Link href="/dashboard" className="text-[#8B7078] hover:text-[#F5E6EA] transition-colors">
          Home
        </Link>
        <span className="text-[#2D1F23]">/</span>
        <Link
          href={`/department/${slug}`}
          className="text-[#8B7078] hover:text-[#F5E6EA] transition-colors"
        >
          {departmentName}
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#8B7078] hover:bg-[#2D1F23] hover:text-[#F5E6EA] transition-colors">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#9B3A4D] text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 rounded-lg border border-[#2D1F23] bg-[#0F0A0B] px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#7C2D3E] to-[#9B3A4D]">
            <User size={14} className="text-white" />
          </div>
          <span className="hidden md:block text-sm text-[#F5E6EA] truncate max-w-[160px]">
            {userEmail}
          </span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-[#0F0A0B]/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {[
              { label: "Dashboard", href: `/department/${slug}` },
              { label: "Settings", href: `/department/${slug}/settings` },
              { label: "Programs", href: `/department/${slug}/programs` },
              { label: "Faculty", href: `/department/${slug}/faculty` },
              { label: "Students", href: `/department/${slug}/students` },
              { label: "Gallery", href: `/department/${slug}/gallery` },
              { label: "Content", href: `/department/${slug}/content` },
              { label: "Achievements", href: `/department/${slug}/achievements` },
              { label: "Media", href: `/department/${slug}/media` },
              { label: "Verifications", href: `/department/${slug}/verification` },
              { label: "Analytics", href: `/department/${slug}/analytics` },
              { label: "SEO", href: `/department/${slug}/seo` },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-[#8B7078] hover:bg-[#2D1F23] hover:text-[#F5E6EA] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
