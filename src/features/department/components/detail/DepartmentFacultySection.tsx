"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GraduationCap, Search, ArrowRight } from "lucide-react";
import { DepartmentFacultyMock } from "../../data/mock-department-detail";
import { SectionHeader, EmptyState } from "./common";

export interface DepartmentFacultySectionProps {
  faculty: DepartmentFacultyMock[];
  departmentName: string;
  slug?: string;
}

export const DepartmentFacultySection: React.FC<DepartmentFacultySectionProps> = ({
  faculty,
  departmentName,
  slug,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // References for pure 60fps transform animation and dragging
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const dragDistance = useRef(0);
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  const deptSlug = slug || departmentName.toLowerCase().replace(/\s+/g, "-");

  const filteredFaculty = !faculty
    ? []
    : faculty.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.researchArea.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Replicate enough times so one set is wider than any desktop display
  const repeatCount = Math.max(2, Math.ceil(14 / Math.max(1, filteredFaculty.length)));
  const singleSet = Array.from({ length: repeatCount })
    .flatMap(() => filteredFaculty)
    .map((item, index) => ({ ...item, uniqueKey: `${item.id}-${index}` }));

  // 60fps RequestAnimationFrame Loop
  useEffect(() => {
    if (filteredFaculty.length === 0 || isReducedMotion) return;

    let animationFrameId: number;

    const animate = () => {
      if (
        !isHovered &&
        !isInteracting &&
        !isDragging.current &&
        setRef.current &&
        trackRef.current
      ) {
        const setWidth = setRef.current.offsetWidth;
        if (setWidth > 0) {
          // Slow & elegant speed (~45 seconds per full loop)
          const speed = setWidth / (60 * 45);
          scrollPosition.current += speed;

          if (scrollPosition.current >= setWidth) {
            scrollPosition.current %= setWidth;
          }

          trackRef.current.style.transform = `translate3d(-${scrollPosition.current}px, 0, 0)`;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isInteracting, isReducedMotion, filteredFaculty.length]);

  const triggerResumeTimer = useCallback(() => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2000);
  }, []);

  // Mouse & Touch Dragging Handlers
  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    setIsDraggingState(true);
    setIsInteracting(true);
    startX.current = clientX;
    startScroll.current = scrollPosition.current;
    dragDistance.current = 0;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current || !setRef.current || !trackRef.current) return;
    const deltaX = clientX - startX.current;
    dragDistance.current += Math.abs(deltaX);

    const setWidth = setRef.current.offsetWidth;
    if (setWidth > 0) {
      let nextPos = startScroll.current - deltaX;
      if (nextPos >= setWidth) nextPos %= setWidth;
      if (nextPos < 0) nextPos = (nextPos % setWidth) + setWidth;

      scrollPosition.current = nextPos;
      trackRef.current.style.transform = `translate3d(-${scrollPosition.current}px, 0, 0)`;
    }
  };

  const handleDragEnd = () => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsDraggingState(false);
      triggerResumeTimer();
    }
  };

  // Wheel / Trackpad Scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (!setRef.current || !trackRef.current) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 1) return;

    setIsInteracting(true);
    const setWidth = setRef.current.offsetWidth;
    if (setWidth > 0) {
      let nextPos = scrollPosition.current + delta;
      if (nextPos >= setWidth) nextPos %= setWidth;
      if (nextPos < 0) nextPos = (nextPos % setWidth) + setWidth;

      scrollPosition.current = nextPos;
      trackRef.current.style.transform = `translate3d(-${scrollPosition.current}px, 0, 0)`;
    }
    triggerResumeTimer();
  };

  if (!faculty || faculty.length === 0) {
    return null;
  }

  return (
    <section id="faculty" className="scroll-mt-32 pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-[#EADED2] overflow-hidden">
      <SectionHeader
        title="Faculty Members & Mentors"
        subtitle={`Eminent professors, doctoral guides, and research supervisors leading ${departmentName}.`}
        badgeText={`${faculty.length} Academic Mentors`}
        badgeIcon={GraduationCap}
        actionButton={
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#7A7476] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search faculty by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FFFDF8] border border-[#EADFCF] focus:border-[#5B001B] text-xs sm:text-sm outline-none shadow-xs transition-colors"
            />
          </div>
        }
      />

      {filteredFaculty.length === 0 ? (
        <EmptyState
          title="No faculty members found"
          description="Try modifying your search filter above to discover department mentors."
        />
      ) : (
        /* Marquee Showcase Container */
        <div
          className={`relative w-full py-4 select-none ${
            isDraggingState ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleDragEnd();
          }}
          onMouseDown={(e) => handleDragStart(e.pageX)}
          onMouseMove={(e) => handleDragMove(e.pageX)}
          onMouseUp={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].pageX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].pageX)}
          onTouchEnd={handleDragEnd}
          onWheel={handleWheel}
        >
          {/* Subtle Left/Right Fade Edges for Apple/Netflix feel */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#FFFDF8] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#FFFDF8] to-transparent z-10 pointer-events-none" />

          {/* Marquee Track (renders 2 identical sets for seamless infinite loop) */}
          <div
            ref={trackRef}
            className="flex items-center gap-3.5 sm:gap-4 will-change-transform no-scrollbar"
            style={{ width: "max-content" }}
          >
            {/* SET A (measured by setRef for exact width calculation) */}
            <div ref={setRef} className="flex items-center gap-3.5 sm:gap-4 shrink-0">
              {singleSet.map((f) => {
                const facultySlug = f.id || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                return (
                  <div
                    key={`setA-${f.uniqueKey}`}
                    onClick={(e) => {
                      if (dragDistance.current > 5) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                      router.push(`/departments/${deptSlug}/faculty/${facultySlug}`);
                    }}
                    className="group text-left rounded-[18px] bg-[#FFFDF8] border border-[#EADFCF] p-3.5 sm:p-4 shadow-xs hover:shadow-xl hover:border-[#D4AF37] hover:bg-gradient-to-br hover:from-[#FFFDF8] hover:via-[#FAF6EE] hover:to-[#F3ECE1] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between relative overflow-hidden h-[215px] sm:h-[230px] w-[170px] sm:w-[190px] lg:w-[200px] xl:w-[215px] shrink-0 focus:outline-none focus:ring-2 focus:ring-[#5B001B] cursor-pointer"
                  >
                    {f.isHod && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#5B001B] text-white shadow-2xs z-10">
                        HOD
                      </span>
                    )}

                    <div className="flex flex-col items-center text-center space-y-2.5 my-auto w-full pt-2">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5B001B] border-1.5 border-[#D4AF37] shadow-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden flex items-center justify-center text-base sm:text-lg font-black text-[#D4AF37] shrink-0 mx-auto">
                        {f.avatarUrl ? (
                          <Image
                            src={f.avatarUrl}
                            alt={f.name}
                            fill
                            sizes="64px"
                            className="object-cover pointer-events-none"
                          />
                        ) : (
                          <span>{f.name.replace(/[^A-Z]/g, "").slice(0, 2) || "RM"}</span>
                        )}
                      </div>

                      <div className="space-y-0.5 w-full px-0.5">
                        <h3 className="text-[0.95rem] sm:text-[1rem] font-semibold text-[#1E1B1C] group-hover:text-[#5B001B] transition-colors leading-tight line-clamp-1 font-serif">
                          {f.name}
                        </h3>
                        <p className="text-[0.72rem] font-bold text-[#5B001B] line-clamp-1">
                          {f.designation}
                        </p>
                        <p className="text-[0.68rem] text-[#7A7476] font-medium line-clamp-1" title={f.researchArea}>
                          {f.researchArea}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2 border-t border-[#EADFCF]/60 w-full mt-2">
                      <span className="w-7 h-7 rounded-full bg-[#5B001B]/10 group-hover:bg-[#5B001B] text-[#5B001B] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SET B (Exact identical clone of Set A to create seamless infinite loop) */}
            <div className="flex items-center gap-3.5 sm:gap-4 shrink-0" aria-hidden="true">
              {singleSet.map((f) => {
                const facultySlug = f.id || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                return (
                  <div
                    key={`setB-${f.uniqueKey}`}
                    onClick={(e) => {
                      if (dragDistance.current > 5) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                      router.push(`/departments/${deptSlug}/faculty/${facultySlug}`);
                    }}
                    className="group text-left rounded-[18px] bg-[#FFFDF8] border border-[#EADFCF] p-3.5 sm:p-4 shadow-xs hover:shadow-xl hover:border-[#D4AF37] hover:bg-gradient-to-br hover:from-[#FFFDF8] hover:via-[#FAF6EE] hover:to-[#F3ECE1] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between relative overflow-hidden h-[215px] sm:h-[230px] w-[170px] sm:w-[190px] lg:w-[200px] xl:w-[215px] shrink-0 focus:outline-none focus:ring-2 focus:ring-[#5B001B] cursor-pointer"
                  >
                    {f.isHod && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#5B001B] text-white shadow-2xs z-10">
                        HOD
                      </span>
                    )}

                    <div className="flex flex-col items-center text-center space-y-2.5 my-auto w-full pt-2">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5B001B] border-1.5 border-[#D4AF37] shadow-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden flex items-center justify-center text-base sm:text-lg font-black text-[#D4AF37] shrink-0 mx-auto">
                        {f.avatarUrl ? (
                          <Image
                            src={f.avatarUrl}
                            alt={f.name}
                            fill
                            sizes="64px"
                            className="object-cover pointer-events-none"
                          />
                        ) : (
                          <span>{f.name.replace(/[^A-Z]/g, "").slice(0, 2) || "RM"}</span>
                        )}
                      </div>

                      <div className="space-y-0.5 w-full px-0.5">
                        <h3 className="text-[0.95rem] sm:text-[1rem] font-semibold text-[#1E1B1C] group-hover:text-[#5B001B] transition-colors leading-tight line-clamp-1 font-serif">
                          {f.name}
                        </h3>
                        <p className="text-[0.72rem] font-bold text-[#5B001B] line-clamp-1">
                          {f.designation}
                        </p>
                        <p className="text-[0.68rem] text-[#7A7476] font-medium line-clamp-1" title={f.researchArea}>
                          {f.researchArea}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2 border-t border-[#EADFCF]/60 w-full mt-2">
                      <span className="w-7 h-7 rounded-full bg-[#5B001B]/10 group-hover:bg-[#5B001B] text-[#5B001B] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
