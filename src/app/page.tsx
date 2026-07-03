"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  { id: 1, image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920" },
  { id: 2, image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920" },
  { id: 3, image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      
      {/* ================= HERO SLIDER ================= */}
      <div className="relative h-[520px] md:h-[600px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="w-full h-full bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            </div>
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white z-20">
          <h1 className="text-5xl md:text-7xl font-bold font-serif drop-shadow-lg tracking-tight">Ravenshaw Moments</h1>
          <p className="text-xl md:text-3xl text-gray-200 mt-3 drop-shadow-md font-light">One Platform. Every Ravenshawian.</p>
          <p className="text-base md:text-lg text-gray-300 mt-1 drop-shadow-md">Connect. Discover. Grow.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="bg-[#5d0f0f] hover:bg-[#801111] text-white px-6 py-3 rounded-md font-medium transition shadow-lg flex items-center gap-2">Explore Departments <span>→</span></button>
            <button className="bg-white text-[#5d0f0f] hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition shadow-lg flex items-center gap-2">View Notifications <span>🔔</span></button>
          </div>
        </div>

        {/* Arrows */}
        <button onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-[#5d0f0f]/80 text-white hover:bg-[#5d0f0f] transition"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <button onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-[#5d0f0f]/80 text-white hover:bg-[#5d0f0f] transition"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
        
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-white w-8" : "bg-white/60"}`} />
          ))}
        </div>
      </div>

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT + CENTER COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 1. EXPLORE SECTION */}
            <div>
              <h2 className="text-2xl font-bold text-[#5d0f0f] mb-6">Explore Ravenshaw</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: '🏛️', label: 'Departments', desc: 'Explore all departments' },
                  { icon: '🏠', label: 'Hostels', desc: 'Find hostel information' },
                  { icon: '👥', label: 'Organizations', desc: 'Student organizations' },
                  { icon: '🏗️', label: 'Facilities', desc: 'Explore university facilities' },
                  { icon: '🏆', label: 'Achievers', desc: 'Meet our achievers' },
                  { icon: '👥', label: 'Team', desc: 'Meet our team' },
                  { icon: '🔔', label: 'Notifications', desc: 'Latest announcements' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-md transition-all text-center cursor-pointer border border-gray-100 h-full flex flex-col items-center justify-between group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-[#fce6e6] flex items-center justify-center text-[#5d0f0f] text-2xl mb-3 group-hover:bg-[#5d0f0f] group-hover:text-white transition-colors">{item.icon}</div>
                      <h3 className="font-semibold text-[14px] text-[#333]">{item.label}</h3>
                      <p className="text-[11px] text-gray-500 mt-1 px-2">{item.desc}</p>
                    </div>
                    <div className="mt-3 text-[#5d0f0f] text-xs font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">→</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. DEPARTMENTS SECTION */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#5d0f0f]">Departments</h2>
                <Link href="/departments" className="text-sm text-[#5d0f0f] font-medium hover:underline">View All →</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: 'Science', count: '12 Departments', icon: '🔬' },
                  { name: 'Commerce', count: '5 Departments', icon: '📊' },
                  { name: 'Arts', count: '8 Departments', icon: '🎨' },
                  { name: 'Management', count: '3 Departments', icon: '💼' },
                  { name: 'Law', count: '2 Departments', icon: '⚖️' },
                ].map((d, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer">
                    <div className="h-24 bg-gray-200 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-3 right-3 text-white text-xs font-medium truncate">{d.name}</div>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-[11px] text-gray-500">{d.count}</span>
                      <span className="text-[#5d0f0f] text-xs">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. HOSTELS + ORGS SPLIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hostels */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#5d0f0f]">Hostels</h2>
                  <Link href="/hostels" className="text-sm text-[#5d0f0f] font-medium hover:underline">View All →</Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'East Hostel', type: 'Boys Hostel' },
                    { name: 'West Hostel', type: 'Boys Hostel' },
                    { name: 'Ladies Hostel', type: 'Girls Hostel' },
                  ].map((h, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer">
                      <div className="h-20 bg-gray-200 relative bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-[13px] font-medium text-[#333]">{h.name}</p>
                        <p className="text-[10px] text-gray-500">{h.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orgs */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#5d0f0f]">Student Organizations</h2>
                  <Link href="/organizations" className="text-sm text-[#5d0f0f] font-medium hover:underline">View All →</Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'NSS', sub: 'National Service Scheme', icon: '🌿' },
                    { name: 'NCC', sub: 'National Cadet Corps', icon: '🪖' },
                    { name: 'Placement Cell', sub: 'Career & Placements', icon: '💼' },
                    { name: 'Rotaract Club', sub: 'Service Above Self', icon: '🔄' },
                  ].map((o, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-md transition text-center h-full flex flex-col items-center justify-center cursor-pointer">
                      <div className="text-3xl mb-1">{o.icon}</div>
                      <p className="text-[13px] font-bold text-[#5d0f0f]">{o.name}</p>
                      <p className="text-[9px] text-gray-500">{o.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 1. NOTIFICATIONS */}
            <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#5d0f0f] text-[15px]">Latest Notifications</h3>
                <Link href="/notifications" className="text-[11px] text-[#5d0f0f] font-medium hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Semester Registration Open', time: '2 hours ago' },
                  { title: 'Scholarship Notice', time: '5 hours ago' },
                  { title: 'Holiday Notification', time: '1 day ago' },
                  { title: 'NSS Special Camp', time: '2 days ago' },
                ].map((n, i) => (
                  <div key={i} className="flex gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-[13px] font-medium text-[#333] leading-tight">{n.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    <span className="ml-auto text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100 h-fit flex-shrink-0">New</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. QUICK LINKS */}
            <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
              <h3 className="font-bold text-[#5d0f0f] text-[15px] mb-4">Quick Links</h3>
              <div className="space-y-2">
                {['Academic Calendar', 'Examination', 'Admission', 'Results', 'E-Library', 'Student Login'].map((link, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 cursor-pointer hover:text-[#5d0f0f] transition">
                    <span className="text-[13px] text-gray-700 flex items-center gap-2"><span className="text-[#5d0f0f]">📄</span> {link}</span>
                    <span className="text-gray-400 text-xs">›</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. UPCOMING EVENTS */}
            <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#5d0f0f] text-[15px]">Upcoming Events</h3>
                <Link href="/events" className="text-[11px] text-[#5d0f0f] font-medium hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {[
                  { date: '25 MAY', title: 'World Environment Day', sub: 'Awareness Program' },
                  { date: '05 JUN', title: 'Ravenshaw Foundation Day', sub: 'Celebration' },
                  { date: '21 JUN', title: 'International Yoga Day', sub: 'Yoga & Wellness' },
                ].map((e, i) => (
                  <div key={i} className="flex gap-3 items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-[#fce6e6] text-[#5d0f0f] rounded flex flex-col items-center justify-center text-[9px] font-bold leading-tight">
                      <span>{e.date.split(' ')[0]}</span>
                      <span>{e.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#333]">{e.title}</p>
                      <p className="text-[10px] text-gray-400">{e.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= STATS BANNER ================= */}
      <div className="bg-[#5d0f0f] py-10">
        <div className="max-w-[1280px] mx-auto px-4">
          <h2 className="text-white text-2xl font-bold text-center mb-8">Ravenshaw in Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-white divide-x-0 md:divide-x divide-white/20">
            <div><div className="text-4xl mb-1">30+</div><div className="text-[11px] opacity-80 uppercase tracking-wider">Departments</div></div>
            <div><div className="text-4xl mb-1">10,000+</div><div className="text-[11px] opacity-80 uppercase tracking-wider">Students</div></div>
            <div><div className="text-4xl mb-1">12</div><div className="text-[11px] opacity-80 uppercase tracking-wider">Hostels</div></div>
            <div><div className="text-4xl mb-1">25+</div><div className="text-[11px] opacity-80 uppercase tracking-wider">Organizations</div></div>
            <div><div className="text-4xl mb-1">500+</div><div className="text-[11px] opacity-80 uppercase tracking-wider">Faculty Members</div></div>
          </div>
        </div>
      </div>

      {/* ================= ABOUT SECTION ================= */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold text-[#5d0f0f] mb-3">About Ravenshaw Moments</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">Ravenshaw Moments is the official digital platform connecting every student, department, hostel, and organization of Ravenshaw University. Our mission is to build a strong, informed, and united community.</p>
          <button className="bg-[#5d0f0f] hover:bg-[#801111] text-white px-6 py-2.5 rounded text-sm font-medium transition">Learn More About Us</button>
        </div>
        <div className="md:w-1/2 h-48 md:h-auto rounded-xl overflow-hidden shadow-md">
          <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800" alt="Campus" className="w-full h-full object-cover" />
        </div>
      </div>

    </div>
  );
}