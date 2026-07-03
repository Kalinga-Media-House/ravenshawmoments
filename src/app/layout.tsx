import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ravenshaw Moments",
  description: "One Platform. Every Ravenshawian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#f8f9fa] text-gray-900`}>
        
        {/* ================= NAVBAR ================= */}
        <header className="sticky top-0 z-50 bg-[#5d0f0f] text-white shadow-md">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/20 shadow-sm">
                <span className="font-serif font-bold text-xl">R</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif font-bold text-sm tracking-[0.15em]">RAVENSHAW</span>
                <span className="text-[10px] tracking-[0.2em] opacity-80 mt-0.5">MOMENTS</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center h-full gap-1 text-[14px] font-medium tracking-wide">
              <Link href="/" className="px-4 h-full flex items-center border-b-[3px] border-[#d19a9a] hover:bg-white/5 transition text-white">Home</Link>
              <Link href="/departments" className="px-4 h-full flex items-center hover:bg-white/5 transition text-white/90 hover:text-white">Departments</Link>
              <Link href="/hostels" className="px-4 h-full flex items-center hover:bg-white/5 transition text-white/90 hover:text-white">Hostels</Link>
              <Link href="/organizations" className="px-4 h-full flex items-center hover:bg-white/5 transition text-white/90 hover:text-white">Organizations</Link>
              <Link href="/facilities" className="px-4 h-full flex items-center hover:bg-white/5 transition text-white/90 hover:text-white">Facilities</Link>
              <Link href="/achievers" className="px-4 h-full flex items-center hover:bg-white/5 transition text-white/90 hover:text-white">Achievers</Link>
              <Link href="/team" className="px-4 h-full flex items-center hover:bg-white/5 transition text-white/90 hover:text-white">Team</Link>
              <Link href="/notifications" className="px-4 h-full flex items-center hover:bg-white/5 transition text-white/90 hover:text-white">Notifications</Link>
              
              {/* "More" Dropdown */}
              <div className="relative group h-full flex items-center">
                <button className="px-4 h-full flex items-center gap-1 hover:bg-white/5 transition text-white/90 hover:text-white cursor-pointer">
                  More <span className="text-[10px] ml-1">▼</span>
                </button>
                <div className="absolute top-[72px] right-0 w-[200px] bg-white text-gray-800 shadow-[0_10px_25px_rgba(0,0,0,0.15)] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:scale-100 scale-95 border border-gray-100 overflow-hidden z-50">
                  <div className="py-2 flex flex-col">
                    <Link href="/about" className="px-5 py-2.5 hover:bg-gray-50 text-[14px] transition flex items-center gap-3">
                      <span className="text-[#a31f1f]">📄</span> About
                    </Link>
                    <Link href="/gallery" className="px-5 py-2.5 hover:bg-gray-50 text-[14px] transition flex items-center gap-3">
                      <span className="text-[#a31f1f]">🖼️</span> Gallery
                    </Link>
                    <Link href="/alumni" className="px-5 py-2.5 hover:bg-gray-50 text-[14px] transition flex items-center gap-3">
                      <span className="text-[#a31f1f]">🎓</span> Alumni
                    </Link>
                    <Link href="/news" className="px-5 py-2.5 hover:bg-gray-50 text-[14px] transition flex items-center gap-3">
                      <span className="text-[#a31f1f]">📰</span> News / Vlogs
                    </Link>
                    <Link href="/voice" className="px-5 py-2.5 hover:bg-gray-50 text-[14px] transition flex items-center gap-3">
                      <span className="text-[#a31f1f]">🎙️</span> Voice of Ravenshaw
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button className="p-2 hover:bg-white/10 rounded-full transition hidden sm:block">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              
              {/* Dark Mode */}
              <button className="p-2 hover:bg-white/10 rounded-full transition hidden sm:block">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              </button>

              {/* Notifications Bell with Red Dot */}
              <button className="p-2 hover:bg-white/10 rounded-full transition hidden sm:block relative">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#5d0f0f]"></span>
              </button>

              {/* Login Button */}
              <Link href="/login">
                <button className="bg-white text-[#5d0f0f] hover:bg-gray-100 px-4 py-1.5 h-[34px] rounded-full text-[13px] font-semibold transition shadow-sm flex items-center gap-1.5">
                  <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  Login
                </button>
              </Link>

              {/* Mobile Hamburger */}
              <button className="lg:hidden p-2 hover:bg-white/10 rounded-full transition">
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="bg-[#5d0f0f] text-white pt-12 pb-4 border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
             
             {/* Brand */}
             <div className="space-y-3">
               <div className="flex items-center gap-2">
                 <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                   <span className="font-serif font-bold text-xl">R</span>
                 </div>
                 <div className="flex flex-col leading-tight">
                   <span className="font-serif font-bold text-sm tracking-wider">RAVENSHAW</span>
                   <span className="text-[10px] tracking-widest opacity-80">MOMENTS</span>
                 </div>
               </div>
               <p className="text-xs text-gray-300 leading-relaxed">One Platform. Every Ravenshawian.<br/>Let's unite and build a stronger community.</p>
               <div className="flex gap-3 pt-2">
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition cursor-pointer"><span className="text-xs">f</span></div>
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition cursor-pointer"><span className="text-xs">x</span></div>
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition cursor-pointer"><span className="text-xs">ig</span></div>
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition cursor-pointer"><span className="text-xs">in</span></div>
               </div>
             </div>

             {/* Quick Links */}
             <div>
               <h4 className="font-bold text-xs mb-4 uppercase tracking-wider">Quick Links</h4>
               <ul className="space-y-2 text-xs text-gray-300">
                 <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                 <li><Link href="/departments" className="hover:text-white transition">Departments</Link></li>
                 <li><Link href="/hostels" className="hover:text-white transition">Hostels</Link></li>
                 <li><Link href="/organizations" className="hover:text-white transition">Organizations</Link></li>
                 <li><Link href="/students" className="hover:text-white transition">Students</Link></li>
                 <li><Link href="/news" className="hover:text-white transition">News / Vlogs</Link></li>
               </ul>
             </div>

             {/* Resources */}
             <div>
               <h4 className="font-bold text-xs mb-4 uppercase tracking-wider">Resources</h4>
               <ul className="space-y-2 text-xs text-gray-300">
                 <li><Link href="/notifications" className="hover:text-white transition">Notifications</Link></li>
                 <li><Link href="/facilities" className="hover:text-white transition">Facilities</Link></li>
                 <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                 <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
               </ul>
             </div>

             {/* Contact */}
             <div>
               <h4 className="font-bold text-xs mb-4 uppercase tracking-wider">Contact Us</h4>
               <ul className="space-y-2 text-xs text-gray-300">
                 <li className="flex items-start gap-2"><span className="mt-0.5">📍</span> Ravenshaw University, Cuttack, Odisha, India</li>
                 <li className="flex items-center gap-2"><span>✉️</span> contact@ravenshawmoments.in</li>
               </ul>
             </div>
          </div>
          <div className="border-t border-white/10 pt-4 text-center text-[10px] text-gray-400">
            © 2026 Ravenshaw Moments. All rights reserved.
          </div>
        </footer>

      </body>
    </html>
  );
}