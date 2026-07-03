"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Moon, Menu, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-ravenshaw-800 shadow-lg h-16" : "bg-transparent h-20"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${scrolled ? "border-white/30 text-white" : "border-white/40 text-white"}`}>
              <span className="font-serif font-bold text-lg">R</span>
            </div>
            <div className="flex flex-col leading-tight hidden sm:block">
              <span className={`font-serif font-bold text-base tracking-wide ${scrolled ? "text-white" : "text-white"}`}>RAVENSHAW</span>
              <span className="text-[10px] tracking-widest opacity-80 text-white">MOMENTS</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white">
            <Link href="/" className="hover:text-ravenshaw-300 transition">Home</Link>
            <Link href="/departments" className="hover:text-ravenshaw-300 transition">Departments</Link>
            <Link href="/hostels" className="hover:text-ravenshaw-300 transition">Hostels</Link>
            <Link href="/organizations" className="hover:text-ravenshaw-300 transition">Organizations</Link>
            <Link href="/facilities" className="hover:text-ravenshaw-300 transition">Facilities</Link>
            <Link href="/achievers" className="hover:text-ravenshaw-300 transition">Achievers</Link>
            <Link href="/notifications" className="hover:text-ravenshaw-300 transition">Notifications</Link>
            
            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-ravenshaw-300 transition cursor-pointer py-2">
                More
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full mt-2 w-56 bg-white text-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <div className="py-2 flex flex-col">
                  <Link href="/about" className="px-4 py-2 hover:bg-gray-100 text-sm transition">About</Link>
                  <Link href="/gallery" className="px-4 py-2 hover:bg-gray-100 text-sm transition">Gallery</Link>
                  <Link href="/alumni" className="px-4 py-2 hover:bg-gray-100 text-sm transition">Alumni</Link>
                  <Link href="/news" className="px-4 py-2 hover:bg-gray-100 text-sm transition">News / Vlogs</Link>
                  <Link href="/clubs" className="px-4 py-2 hover:bg-gray-100 text-sm transition">Clubs</Link>
                  <Link href="/voice-of-ravenshaw" className="px-4 py-2 hover:bg-gray-100 text-sm transition">Voice of Ravenshaw</Link>
                  <Link href="/team" className="px-4 py-2 hover:bg-gray-100 text-sm transition">Team</Link>
                  <Link href="/radio" className="px-4 py-2 hover:bg-gray-100 text-sm transition">Ravenshaw Radio</Link>
                  <Link href="/rumun" className="px-4 py-2 hover:bg-gray-100 text-sm transition">RUMUN</Link>
                  <Link href="/tedex" className="px-4 py-2 hover:bg-gray-100 text-sm transition">Ravenshaw TedEx</Link>
                  <Link href="/film-society" className="px-4 py-2 hover:bg-gray-100 text-sm transition">Ravenshaw Film Society</Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3 text-white">
            <button className="p-2 hover:bg-white/10 rounded-full transition hidden sm:block"><Search className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-white/10 rounded-full transition hidden sm:block"><Moon className="w-5 h-5" /></button>
            <Link href="/login">
              <button className="bg-white text-ravenshaw-800 hover:bg-gray-100 px-4 py-1.5 h-8 rounded-md text-sm font-medium transition">Login</button>
            </Link>
            <button className="lg:hidden p-2 hover:bg-white/10 rounded-full transition"><Menu className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </header>
  );
}