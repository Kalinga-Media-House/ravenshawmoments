"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, FileText, ExternalLink, ChevronRight, Trophy, Building2, Tent, GraduationCap, Megaphone, Calendar, FileCheck, Landmark, Briefcase, Award } from "lucide-react";

// TEMPORARY HOMEPAGE PREVIEW DATA
// Replace with server-fetched platform notification data after backend approval.
const TEMPORARY_NOTIFICATIONS = [
  {
    id: "n-1",
    title: "Inter-University Debate Championship 2027 Registration Open",
    category: "Competition",
    date: "2026-08-15",
    isNew: true,
    hasPdf: true,
    hasExternalLink: false,
  },
  {
    id: "n-2",
    title: "Revised Academic Calendar for Autumn Semester 2026",
    category: "University Notice",
    date: "2026-08-14",
    isNew: true,
    hasPdf: true,
    hasExternalLink: false,
  },
  {
    id: "n-3",
    title: "Call for Papers: Ravenshaw Research Journal 2026-27",
    category: "Opportunity",
    date: "2026-08-12",
    isNew: false,
    hasPdf: false,
    hasExternalLink: true,
  },
  {
    id: "n-4",
    title: "Annual Alumni Meet 'Generations' Scheduled for December",
    category: "Event",
    date: "2026-08-10",
    isNew: false,
    hasPdf: false,
    hasExternalLink: false,
  },
  {
    id: "n-5",
    title: "Hostel Allotment List (Phase 1) Published for First Year Students",
    category: "Hostel",
    date: "2026-08-08",
    isNew: false,
    hasPdf: true,
    hasExternalLink: false,
  },
];

const CategoryIcon = ({ category }: { category: string }) => {
  const iconProps = { className: "w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-maroon)]" };
  switch (category) {
    case "Competition": return <Trophy {...iconProps} />;
    case "University Notice": return <Landmark {...iconProps} />;
    case "Event": return <Calendar {...iconProps} />;
    case "Registration": return <FileCheck {...iconProps} />;
    case "Department": return <Building2 {...iconProps} />;
    case "Hostel": return <Tent {...iconProps} />;
    case "Scholarship": return <GraduationCap {...iconProps} />;
    case "Opportunity": return <Briefcase {...iconProps} />;
    case "Result": return <Award {...iconProps} />;
    case "General Announcement": 
    default: return <Megaphone {...iconProps} />;
  }
};

export const LatestNotifications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [notifications, setNotifications] = useState<typeof TEMPORARY_NOTIFICATIONS>([]);
  
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(TEMPORARY_NOTIFICATIONS.slice(0, 30));
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Smooth Auto-Scroll Logic
  useEffect(() => {
    if (isLoading || hasError || notifications.length === 0) return;
    
    const viewport = scrollViewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    let animationFrameId: number;
    let isPaused = false;
    let scrollPos = viewport.scrollTop;
    
    const scroll = () => {
      if (!isPaused && viewport && content) {
        // The content div contains two identical lists.
        const firstListHeight = content.scrollHeight / 2;
        
        // Sync scrollPos if user manually scrolled
        if (Math.abs(viewport.scrollTop - scrollPos) > 1.5) {
          scrollPos = viewport.scrollTop;
        }

        scrollPos += 0.4; // Scroll speed (pixels per frame)

        if (scrollPos >= firstListHeight) {
          scrollPos -= firstListHeight;
        }
        
        viewport.scrollTop = scrollPos;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    const handleInteractionStart = () => { isPaused = true; };
    const handleInteractionEnd = () => { isPaused = false; };

    viewport.addEventListener('mouseenter', handleInteractionStart);
    viewport.addEventListener('mouseleave', handleInteractionEnd);
    viewport.addEventListener('touchstart', handleInteractionStart, { passive: true });
    viewport.addEventListener('touchend', handleInteractionEnd);
    viewport.addEventListener('focusin', handleInteractionStart);
    viewport.addEventListener('focusout', handleInteractionEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      viewport.removeEventListener('mouseenter', handleInteractionStart);
      viewport.removeEventListener('mouseleave', handleInteractionEnd);
      viewport.removeEventListener('touchstart', handleInteractionStart);
      viewport.removeEventListener('touchend', handleInteractionEnd);
      viewport.removeEventListener('focusin', handleInteractionStart);
      viewport.removeEventListener('focusout', handleInteractionEnd);
    };
  }, [isLoading, hasError, notifications.length]);

  const renderNotification = (notif: typeof TEMPORARY_NOTIFICATIONS[0], isDuplicate = false) => (
    <div 
      key={isDuplicate ? `dup-${notif.id}` : notif.id} 
      className="notification-item group relative px-4 sm:px-6 py-3 sm:py-4 flex items-start gap-3 sm:gap-4 hover:bg-[var(--color-maroon)]/[0.02] transition-colors cursor-pointer"
      onClick={() => {
        if (notif.hasPdf || notif.hasExternalLink) {
          alert("This is a preview. The actual link will open securely in a new tab.");
        } else {
          alert("This is a preview. The detailed notification view will open here.");
        }
      }}
      role="link"
      tabIndex={isDuplicate ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
           e.preventDefault();
           if (notif.hasPdf || notif.hasExternalLink) alert("This is a preview. The actual link will open securely in a new tab.");
           else alert("This is a preview. The detailed notification view will open here.");
        }
      }}
    >
      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-maroon)]/5 shrink-0 mt-0.5">
        <CategoryIcon category={notif.category} />
      </div>
      <div className="flex-1 min-w-0 pr-4 sm:pr-6">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--color-maroon)]/10 text-[#5A0018]">
            {notif.category}
          </span>
          {notif.isNew && (
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-wider bg-[#B1123D] text-white">
              New
            </span>
          )}
        </div>
        <h4 className="text-[0.85rem] sm:text-[0.95rem] font-bold text-[#171214] leading-snug mb-1.5 group-hover:text-[var(--color-maroon)] transition-colors pr-2">
          {notif.title}
        </h4>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[0.7rem] sm:text-xs font-medium text-[#756A6E]">
          <span className="flex items-center gap-1 whitespace-nowrap">
            {new Date(notif.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {notif.hasPdf && (
            <span className="flex items-center gap-1 text-[var(--color-maroon)]">
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> PDF Attached
            </span>
          )}
          {notif.hasExternalLink && (
            <span className="flex items-center gap-1 text-[var(--color-maroon)]">
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> External Link
            </span>
          )}
        </div>
      </div>
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus:opacity-100 group-focus:translate-x-0 transition-all">
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-maroon)]" />
      </div>
    </div>
  );

  return (
    <section 
      aria-labelledby="latest-notifications-heading"
      className="notification-card w-full bg-white rounded-2xl border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-[305px] sm:h-[380px] lg:h-[430px]"
    >
      <style>{`
        .rm-custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--color-maroon) #f5f5f5;
          -webkit-overflow-scrolling: touch;
        }
        .rm-custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .rm-custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 8px;
        }
        .rm-custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--color-maroon);
          border-radius: 8px;
        }
        .rm-custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #5A0018;
        }
        
        .notification-header {
          position: relative;
          z-index: 10;
        }

        .notification-item {
          min-height: 112px;
          height: auto;
        }

        .notification-scroll-track {
          will-change: transform;
        }
      `}</style>

      {/* Header */}
      <div className="notification-header flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 bg-[var(--color-maroon-dark)] border-b border-white/10 shrink-0 h-[52px] sm:h-[64px] lg:h-[72px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h3 id="latest-notifications-heading" className="text-base sm:text-lg font-bold text-white leading-tight">Latest Notifications</h3>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={scrollViewportRef}
        className="notification-scroll-viewport flex flex-col flex-1 bg-white overflow-y-auto overflow-x-hidden relative rm-custom-scrollbar"
        tabIndex={0}
      >
        {isLoading && (
          <div className="flex flex-col divide-y divide-black/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-5 sm:px-6 py-4 sm:py-5 flex items-start gap-3 sm:gap-4 animate-pulse">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/5 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-black/5 rounded w-3/4" />
                  <div className="h-3 bg-black/5 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {hasError && !isLoading && (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center h-full min-h-[200px]">
            <p className="text-sm font-medium text-[#756A6E] mb-3">Notifications could not be loaded.</p>
            <button 
              onClick={() => { setIsLoading(true); setHasError(false); setTimeout(() => { setNotifications(TEMPORARY_NOTIFICATIONS.slice(0,30)); setIsLoading(false); }, 800); }}
              className="text-sm font-bold text-[var(--color-maroon)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] rounded px-2"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !hasError && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center h-full min-h-[200px]">
            <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-black/10 mb-4" />
            <h4 className="text-sm sm:text-base font-bold text-[#171214] mb-2">No notifications available at the moment.</h4>
            <p className="text-xs sm:text-sm text-[#756A6E] max-w-[280px]">Important announcements, competitions, events, and official updates will appear here.</p>
          </div>
        )}

        {!isLoading && !hasError && notifications.length > 0 && (
          <div ref={contentRef} className="notification-scroll-track flex flex-col">
            {/* Original notification list */}
            <div className="flex flex-col divide-y divide-black/5">
              {notifications.map(n => renderNotification(n, false))}
            </div>
            
            {/* Duplicate notification list for seamless looping */}
            <div className="flex flex-col divide-y divide-black/5" aria-hidden="true">
              {notifications.map(n => renderNotification(n, true))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
