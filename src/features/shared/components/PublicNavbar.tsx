"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      // Close mobile menu
      if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest('#mobile-menu-button')) {
          setMobileMenuOpen(false);
        }
      }

      // Close desktop dropdowns
      if (activeDropdown && desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, activeDropdown]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const navStructure = [
    { name: "Home", href: "/", isDropdown: false },
    { 
      name: "About", 
      isDropdown: true,
      id: "about",
      items: [
        { name: "About Ravenshaw Moments", href: "/about" },
        { name: "Achievements & Legacy", href: "/achievements" },
      ]
    },
    { 
      name: "Academics", 
      isDropdown: true,
      id: "academics",
      items: [
        { name: "Departments", href: "/departments" },
        { name: "RHSS (+2)", href: "/rhss" },
        { name: "Verify Certificate", href: "/certificates" },
        { name: "Placements", href: "/placements" },
      ]
    },
    { 
      name: "Campus Life", 
      isDropdown: true,
      id: "campus-life",
      items: [
        { name: "Hostels", href: "/hostels" },
        { name: "Organizations", href: "/organizations" },
        { name: "Events", href: "/events" },
        { name: "Competitions", href: "/competitions" },
      ]
    },
    { 
      name: "Media", 
      isDropdown: true,
      id: "media",
      items: [
        { name: "Moments Gallery", href: "/gallery" },
        { name: "Latest News", href: "/news" },
        { name: "Publications", href: "/publications" },
      ]
    },
    { 
      name: "Community", 
      isDropdown: true,
      id: "community",
      items: [
        { name: "Alumni Network", href: "/alumni" },
        { name: "Alumni Jobs", href: "/alumni/jobs" },
        { name: "Business Directory", href: "/businesses" },
        { name: "Memories & Stories", href: "/memories" },
      ]
    },
    { 
      name: "Support", 
      isDropdown: true,
      id: "support",
      items: [
        { name: "Support the Platform", href: "/donations" },
        { name: "Contact Us", href: "/contact" },
      ]
    }
  ];

  const handleDropdownClick = (id: string) => {
    setActiveDropdown(prev => prev === id ? null : id);
  };

  const handleMobileAccordionClick = (id: string) => {
    setMobileExpanded(prev => prev === id ? null : id);
  };

  const isActiveLink = (href?: string) => pathname === href;
  const isDropdownActive = (items: {href: string}[]) => items.some(item => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[60] transition-all duration-300 heritage-navbar backdrop-blur-[14px] backdrop-saturate-150"
        style={{ boxShadow: "0 4px 18px rgba(35, 0, 10, 0.12)" }}
      >
        <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)]">
          <div className="flex items-center justify-between h-[72px] sm:h-[76px] min-[1150px]:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              aria-label="Ravenshaw Moments Home"
              className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F] rounded-md"
            >
              <div className="relative w-10 h-10 sm:w-[42px] sm:h-[42px] min-[1150px]:w-[44px] min-[1150px]:h-[44px] transition-transform group-hover:scale-105 shrink-0">
                <Image 
                  src="/logo.webp" 
                  alt="Ravenshaw Moments Logo" 
                  fill 
                  className="object-contain"
                  sizes="(max-width: 1149px) 42px, 44px"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[15px] sm:text-[17px] min-[1150px]:text-[21px] font-bold text-white uppercase tracking-[0.06em] leading-none mb-[3px] min-[1150px]:mb-[4px]">
                  Ravenshaw
                </span>
                <span className="text-[10px] sm:text-[11.5px] min-[1150px]:text-[14px] font-medium text-[#D8CFCC] uppercase tracking-[0.20em] leading-none pl-[1px]">
                  Moments
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav ref={desktopNavRef} className="hidden min-[1150px]:flex items-center gap-8">
              {navStructure.map((navItem) => {
                if (!navItem.isDropdown) {
                  const isActive = isActiveLink(navItem.href);
                  return (
                    <Link
                      key={navItem.name}
                      href={navItem.href!}
                      className={`relative py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F] rounded-sm group ${
                        isActive
                          ? "text-[#E8B83F]"
                          : "text-[#FFF9F1]/80 hover:text-[#E8B83F]"
                      }`}
                    >
                      {navItem.name}
                      <span className={`absolute bottom-0 left-0 h-[2px] bg-[#E8B83F] rounded-t-sm origin-left transition-transform duration-300 ease-out ${
                        isActive ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                      }`} />
                    </Link>
                  );
                }

                const isActive = isDropdownActive(navItem.items!);
                const isOpen = activeDropdown === navItem.id;

                return (
                  <div key={navItem.id} className="relative">
                    <button
                      onClick={() => handleDropdownClick(navItem.id!)}
                      aria-expanded={isOpen}
                      aria-controls={`dropdown-${navItem.id}`}
                      className={`flex items-center gap-1 relative py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F] rounded-sm group ${
                        isActive || isOpen
                          ? "text-[#E8B83F]"
                          : "text-[#FFF9F1]/80 hover:text-[#E8B83F]"
                      }`}
                    >
                      {navItem.name}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      <span className={`absolute bottom-0 left-0 h-[2px] bg-[#E8B83F] rounded-t-sm origin-left transition-transform duration-300 ease-out ${
                        (isActive && !isOpen) ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                      }`} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          id={`dropdown-${navItem.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-[#450011] border border-white/10 rounded-lg shadow-xl overflow-hidden py-1 z-[60]"
                        >
                          {navItem.items!.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className={`block px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:bg-white/5 ${
                                isActiveLink(item.href)
                                  ? "text-[#E8B83F] bg-white/5 font-medium"
                                  : "text-[#FFF9F1] hover:text-[#E8B83F] hover:bg-white/5"
                              }`}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="hidden min-[1150px]:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-[#FFF9F1]/90 hover:text-[#E8B83F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F] rounded-sm px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium px-5 py-2.5 rounded-full bg-[#E8B83F] text-[#450011] shadow-sm transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Join Platform
              </Link>
            </div>

            {/* Mobile/Tablet Menu Toggle */}
            <button
              id="mobile-menu-button"
              className="flex min-[1150px]:hidden relative w-11 h-11 items-center justify-center rounded-full text-[#FFF9F1] transition-colors hover:bg-white/10 hover:text-[#E8B83F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <span 
                  className={`absolute h-[2px] w-5 bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileMenuOpen ? 'rotate-45 scale-110' : '-translate-y-[6px]'}`}
                />
                <span 
                  className={`absolute h-[2px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileMenuOpen ? 'w-0 opacity-0' : 'w-5 opacity-100'}`}
                />
                <span 
                  className={`absolute h-[2px] w-5 bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileMenuOpen ? '-rotate-45 scale-110' : 'translate-y-[6px]'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Mobile/Tablet Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            ref={menuRef}
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-[1150px]:hidden fixed top-[88px] left-0 right-0 mx-auto w-[92vw] max-w-[400px] z-[50] overflow-hidden rounded-[24px] bg-[#2A000B] border border-white/15 shadow-2xl max-h-[calc(100vh-110px)] overflow-y-auto"
          >
            <div className="p-3 w-full">
              <nav className="flex flex-col space-y-1">
                {navStructure.map((navItem) => {
                  if (!navItem.isDropdown) {
                    const isActive = isActiveLink(navItem.href);
                    return (
                      <Link
                        key={navItem.name}
                        href={navItem.href!}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`relative flex items-center px-4 py-3.5 rounded-[14px] text-[0.95rem] font-medium transition-colors ${
                          isActive
                            ? "bg-white/10 text-[#E8B83F]"
                            : "text-[#FFF9F1] hover:bg-white/5"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#E8B83F] rounded-r-full" />
                        )}
                        {navItem.name}
                      </Link>
                    );
                  }

                  const isActiveGroup = isDropdownActive(navItem.items!);
                  const isExpanded = mobileExpanded === navItem.id;

                  return (
                    <div key={navItem.id} className="flex flex-col">
                      <button
                        onClick={() => handleMobileAccordionClick(navItem.id!)}
                        aria-expanded={isExpanded}
                        aria-controls={`mobile-accordion-${navItem.id}`}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-[14px] text-[0.95rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F] ${
                          isActiveGroup || isExpanded
                            ? "text-[#E8B83F] bg-white/5"
                            : "text-[#FFF9F1] hover:bg-white/5"
                        }`}
                      >
                        {navItem.name}
                        <ChevronDown size={18} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            id={`mobile-accordion-${navItem.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 pr-2"
                          >
                            <div className="flex flex-col py-2 border-l-2 border-white/10 ml-4 space-y-1">
                              {navItem.items!.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block px-4 py-2.5 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F] ${
                                    isActiveLink(item.href)
                                      ? "text-[#E8B83F] font-medium bg-white/5"
                                      : "text-[#FFF9F1]/80 hover:text-[#E8B83F] hover:bg-white/5"
                                  }`}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-white/15 flex flex-row gap-3 px-1 pb-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center h-[44px] rounded-[14px] border border-white/20 text-sm font-medium text-[#FFF9F1] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B83F]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center h-[44px] rounded-[14px] bg-[#E8B83F] text-[#450011] text-sm font-medium shadow-sm transition-transform hover:bg-[#F5C76A] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF9F1]"
                >
                  Join Platform
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
