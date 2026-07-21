"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronDown, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DashboardNavbarProps {
  userFullName: string;
  userRole: string;
  avatarUrl?: string;
}

export function DashboardNavbar({ userFullName, userRole, avatarUrl }: DashboardNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const getInitials = (name: string) => {
    if (!name?.trim()) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isDropdownOpen, mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className="sticky top-0 z-[60] w-full heritage-navbar backdrop-blur-[14px] backdrop-saturate-150 transition-all duration-300"
        style={{ boxShadow: "0 4px 18px rgba(35, 0, 10, 0.12)" }}
      >
        <div className="container mx-auto px-[clamp(1rem,4vw,3rem)]">
          <div className="flex items-center justify-between h-[64px] sm:h-[72px] min-[1150px]:h-[76px]">
            <div className="flex items-center md:gap-8 min-[1150px]:gap-10">
              {/* Logo — matches PublicNavbar exactly */}
              <Link
                href="/"
                aria-label="Ravenshaw Moments Home"
                className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F] rounded-md"
              >
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 min-[1150px]:w-[42px] min-[1150px]:h-[42px] transition-transform group-hover:scale-105 shrink-0">
                  <Image
                    src="/logo.webp"
                    alt="Ravenshaw Moments Logo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 639px) 36px, (max-width: 1149px) 40px, 42px"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[14px] sm:text-[16px] min-[1150px]:text-[19px] font-bold text-white uppercase tracking-[0.06em] leading-none mb-[2px] min-[1150px]:mb-[3px]">
                    Ravenshaw
                  </span>
                  <span className="text-[9px] sm:text-[10.5px] min-[1150px]:text-[13px] font-medium text-[#D8CFCC] uppercase tracking-[0.20em] leading-none pl-[1px]">
                    Moments
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation - Removed in favor of DashboardSidebar */}
              <nav className="hidden md:flex items-center gap-6 min-[1150px]:gap-8" aria-label="Dashboard Navigation">
              </nav>
            </div>

            {/* Desktop User Profile Control */}
            <div className="hidden md:flex items-center gap-3" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#3A000E]/40 border border-[#E8B83F]/20 hover:border-[#E8B83F]/40 hover:bg-[#3A000E]/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8B83F]/50"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex flex-col items-end text-right">
                  <span className="text-[13px] font-semibold text-white leading-tight">
                    {userFullName?.trim() || "Member"}
                  </span>
                  <span className="text-[10px] font-medium text-[#E8B83F] uppercase tracking-[0.08em] leading-tight mt-0.5">
                    {userRole ? userRole.replace(/_/g, " ") : "MEMBER"}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#3A000E] border border-[#E8B83F]/40 flex items-center justify-center overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={userFullName || "User"} className="w-full h-full object-cover" />
                  ) : userFullName?.trim() ? (
                    <span className="text-[11px] font-bold text-[#E8B83F]">
                      {getInitials(userFullName)}
                    </span>
                  ) : (
                    <User className="w-4 h-4 text-[#E8B83F]" />
                  )}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-4 top-full mt-2 w-52 rounded-xl border border-white/[0.1] bg-[#3A000E] shadow-2xl py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 z-[70]">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#FFF9F1]/85 hover:bg-white/[0.06] hover:text-white transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-[#E8B83F]/70" />
                    My Profile
                  </Link>
                  <div className="h-px bg-white/[0.08] mx-3 my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#FFF9F1]/70 hover:bg-white/[0.06] hover:text-[#FFF9F1] transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-[#FFF9F1]/50" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="dashboard-mobile-menu-button"
              className="flex md:hidden relative w-11 h-11 items-center justify-center rounded-full text-[#FFF9F1] transition-colors hover:bg-white/10 hover:text-[#E8B83F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="dashboard-mobile-navigation"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <span
                  className={`absolute h-[2px] w-5 bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileMenuOpen ? "rotate-45 scale-110" : "-translate-y-[6px]"}`}
                />
                <span
                  className={`absolute h-[2px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileMenuOpen ? "w-0 opacity-0" : "w-5 opacity-100"}`}
                />
                <span
                  className={`absolute h-[2px] w-5 bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileMenuOpen ? "-rotate-45 scale-110" : "translate-y-[6px]"}`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div
          id="dashboard-mobile-navigation"
          className="md:hidden fixed top-[64px] sm:top-[72px] left-0 right-0 z-[55] bg-[#2A000B] border-t border-white/[0.08] shadow-2xl max-h-[calc(100vh-64px)] overflow-y-auto"
        >
          <div className="container mx-auto px-4 py-5 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
              <div className="w-10 h-10 rounded-full bg-[#3A000E] border border-[#E8B83F]/40 flex items-center justify-center overflow-hidden shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userFullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-[#E8B83F]">
                    {getInitials(userFullName)}
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{userFullName}</span>
                <span className="text-[10px] font-medium text-[#E8B83F] uppercase tracking-[0.08em]">
                  {userRole ? userRole.replace(/_/g, " ") : "MEMBER"}
                </span>
              </div>
            </div>

            {/* Nav Links - Removed in favor of DashboardSidebar */}
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`relative flex items-center px-4 py-3 rounded-xl text-[0.95rem] font-medium transition-colors ${
                  pathname === "/dashboard/profile"
                    ? "bg-white/[0.08] text-[#E8B83F]"
                    : "text-[#FFF9F1] hover:bg-white/[0.04]"
                }`}
              >
                {pathname === "/dashboard/profile" && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#E8B83F] rounded-r-full" />
                )}
                My Profile
              </Link>
            </nav>

            {/* Sign Out */}
            <div className="pt-3 border-t border-white/[0.08]">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 px-4 py-3 text-[0.95rem] font-medium text-[#FFF9F1]/70 hover:text-[#FFF9F1] hover:bg-white/[0.04] rounded-xl w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
