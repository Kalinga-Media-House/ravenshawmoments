"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  Layers, 
  Clock, 
  ArrowUpDown,
  Sparkles,
  Check
} from "lucide-react";

export interface DepartmentBatchSelectorProps {
  /** Array of batch names for the active horizontal scroll bar (e.g. ["2025–2029", "2024–2028", ...]) */
  batches: string[];
  /** The currently selected batch string (e.g. "All Batches" or "2025–2029") */
  selectedBatch: string;
  /** Callback triggered when a batch pill is clicked */
  onSelectBatch: (batchName: string) => void;
  /** Optional mapping of batch names to their item/student counts */
  batchCounts?: Record<string, number>;
  /** Optional total count for "All Batches" */
  totalCount?: number;
  /** Optional current course level context ("UG" | "PG" | "Ph.D." | string) */
  currentLevel?: string;
  /** Optional complete directory of batches grouped by course level for the modal */
  allBatchesByLevel?: Record<string, string[] | undefined>;
  /** Callback triggered if the user selects a batch from a different level inside the modal */
  onSelectLevelBatch?: (level: string, batchName: string) => void;
  /** Whether to show the 'All Batches' pill at the beginning */
  showAllBatches?: boolean;
}

export const DepartmentBatchSelector: React.FC<DepartmentBatchSelectorProps> = ({
  batches = [],
  selectedBatch,
  onSelectBatch,
  batchCounts = {},
  totalCount,
  currentLevel = "UG",
  allBatchesByLevel,
  onSelectLevelBatch,
  showAllBatches = true,
}) => {
  // Scroll container ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalSortOrder, setModalSortOrder] = useState<"newest" | "oldest">("newest");

  // Most recent active batch is the first batch in the list
  const mostRecentBatch = useMemo(() => {
    if (batches.length > 0) return batches[0];
    return undefined;
  }, [batches]);

  // Scroll active batch or most recent batch into view on mount and when selectedBatch changes
  useEffect(() => {
    if (!scrollRef.current) return;

    const targetName = selectedBatch === "All Batches" ? (mostRecentBatch || "All Batches") : selectedBatch;
    const targetElement = scrollRef.current.querySelector(`[data-batch="${targetName}"]`) as HTMLElement | null;

    if (targetElement) {
      // Use smooth scroll into center view
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedBatch, mostRecentBatch]);

  // Mouse wheel scroll support for horizontal container
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current) {
      // If horizontal delta exists, let native scroll handle it; otherwise translate vertical scroll to horizontal
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY * 1.5;
      }
    }
  }, []);

  // Left & Right arrow scrolling
  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: amount,
        behavior: "smooth",
      });
    }
  };

  // Click & Drag mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    if (Math.abs(walk) > 5) {
      setDragMoved(true);
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Keyboard accessibility across batch pills inside horizontal bar
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const focusables = Array.from(
        scrollRef.current?.querySelectorAll<HTMLButtonElement>("button[data-batch]") || []
      );
      const currentIndex = focusables.findIndex(btn => btn === document.activeElement);
      if (currentIndex !== -1) {
        const nextIndex = e.key === "ArrowRight" 
          ? Math.min(focusables.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);
        focusables[nextIndex]?.focus();
      } else if (focusables.length > 0) {
        focusables[0].focus();
      }
    }
  };

  // Handle Recent button click
  const handleRecentClick = () => {
    if (mostRecentBatch) {
      onSelectBatch(mostRecentBatch);
      // Scroll to it directly
      const el = scrollRef.current?.querySelector(`[data-batch="${mostRecentBatch}"]`) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

  // Prepare grouped batch data for the modal
  const modalBatchesGrouped = useMemo(() => {
    // Only show batches for the current level (context-aware)
    const rawGroups: Record<string, string[] | undefined> = allBatchesByLevel
      ? { [currentLevel]: allBatchesByLevel[currentLevel] }
      : { [currentLevel]: batches };

    const result: Record<string, string[]> = {};

    Object.entries(rawGroups).forEach(([levelKey, batchList]) => {
      if (!batchList || batchList.length === 0) return;

      // Filter by search query
      let filtered = batchList.filter(b => 
        b.toLowerCase().includes(modalSearchQuery.toLowerCase().trim()) ||
        levelKey.toLowerCase().includes(modalSearchQuery.toLowerCase().trim())
      );

      // Sort
      filtered = [...filtered].sort((a, b) => {
        // Research Scholars always top for Ph.D. if newest, or bottom if oldest
        if (a === "Research Scholars") return modalSortOrder === "newest" ? -1 : 1;
        if (b === "Research Scholars") return modalSortOrder === "newest" ? 1 : -1;

        // Extract first 4 digits
        const yearA = parseInt(a.match(/\d{4}/)?.[0] || "0", 10);
        const yearB = parseInt(b.match(/\d{4}/)?.[0] || "0", 10);

        return modalSortOrder === "newest" ? yearB - yearA : yearA - yearB;
      });

      if (filtered.length > 0) {
        result[levelKey] = filtered;
      }
    });

    return result;
  }, [allBatchesByLevel, batches, currentLevel, modalSearchQuery, modalSortOrder]);

  return (
    <div className="w-full select-none">
      {/* Outer wrapper with Apple-inspired minimal styling */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#FFFDF8] border border-[#EADFCF] rounded-[24px] p-2.5 sm:p-3 shadow-2xs">
        
        {/* Left Side: Fixed Action Buttons ('All Batches' & 'Recent') */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
          {showAllBatches && (
            <button
              type="button"
              data-batch="All Batches"
              onClick={() => onSelectBatch("All Batches")}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-2xs ${
                selectedBatch === "All Batches"
                  ? "bg-[#5B001B] text-white shadow-sm border border-[#5B001B]"
                  : "bg-white text-[#7A7476] hover:bg-[#FAF6EE] hover:text-[#1E1B1C] border border-[#EADFCF]"
              }`}
            >
              <span>All Batches</span>
              {typeof totalCount === "number" && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  selectedBatch === "All Batches" ? "bg-white/20 text-white" : "bg-[#EADFCF]/70 text-[#5B001B]"
                }`}>
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {mostRecentBatch && (
            <button
              type="button"
              onClick={handleRecentClick}
              title="Jump to most recent active batch"
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-1.5 shadow-2xs ${
                selectedBatch === mostRecentBatch
                  ? "bg-[#D4AF37] text-[#1E1B1C] shadow-sm border border-[#D4AF37]"
                  : "bg-white text-[#7A7476] hover:bg-[#FAF6EE] hover:text-[#1E1B1C] border border-[#EADFCF]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5B001B]" />
              <span>Recent</span>
            </button>
          )}

          {/* Divider on Desktop */}
          <div className="hidden lg:block w-[1px] h-6 bg-[#EADFCF] mx-1" />
        </div>

        {/* Middle: Scrollable Horizontal Batch Track with Arrows */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 relative group/track">
          
          {/* Left Arrow Button (Desktop) */}
          <button
            type="button"
            onClick={() => scrollByAmount(-260)}
            aria-label="Scroll batch selector left"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/90 hover:bg-[#FAF6EE] text-[#5B001B] border border-[#EADFCF] shadow-xs shrink-0 transition-transform active:scale-95 z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Academic Batches Horizontal Selector"
            className={`flex items-center gap-2 overflow-x-auto py-1 px-1 scroll-smooth snap-x snap-mandatory focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-xl ${
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            } [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch]`}
          >
            {batches.map((batchName) => {
              const count = batchCounts[batchName];
              const isSelected = selectedBatch === batchName;

              return (
                <button
                  key={batchName}
                  type="button"
                  data-batch={batchName}
                  onClick={(e) => {
                    // Prevent triggering button if user was dragging
                    if (dragMoved) {
                      e.preventDefault();
                      return;
                    }
                    onSelectBatch(batchName);
                  }}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap snap-center shrink-0 flex items-center gap-1.5 shadow-2xs ${
                    isSelected
                      ? "bg-[#5B001B] text-white shadow-sm border border-[#5B001B] scale-[1.02]"
                      : "bg-white text-[#7A7476] hover:bg-[#FAF6EE] hover:text-[#1E1B1C] border border-[#EADFCF]"
                  }`}
                >
                  <span>{batchName}</span>
                  {typeof count === "number" && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#EADFCF]/60 text-[#5B001B]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button (Desktop) */}
          <button
            type="button"
            onClick={() => scrollByAmount(260)}
            aria-label="Scroll batch selector right"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/90 hover:bg-[#FAF6EE] text-[#5B001B] border border-[#EADFCF] shadow-xs shrink-0 transition-transform active:scale-95 z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: 'View All Batches' Trigger Button */}
        <div className="flex items-center justify-end shrink-0 pt-1 lg:pt-0 border-t lg:border-t-0 border-[#EADFCF]/60 lg:border-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#FAF6EE] hover:bg-[#5B001B] text-[#5B001B] hover:text-white border border-[#EADFCF] hover:border-[#5B001B] transition-all duration-300 flex items-center justify-center gap-2 shadow-2xs"
          >
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>View All Batches</span>
          </button>
        </div>
      </div>

      {/* VIEW ALL BATCHES MODAL / DRAWER */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-start items-start sm:justify-center sm:items-center pt-[92px] sm:pt-0 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-[#1E1B1C]/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-full sm:max-w-3xl bg-[#FFFDF8] border-t sm:border border-[#EADFCF] rounded-t-[20px] sm:rounded-[28px] shadow-2xl overflow-hidden z-10 flex flex-col h-[calc(100dvh-92px)] sm:h-auto sm:max-h-[85vh]"
            >
              {/* Modal Header (Sticky at top) */}
              <div className="p-4 sm:p-8 bg-gradient-to-r from-[#5B001B] to-[#3B0011] text-white relative shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-white flex items-center gap-2 sm:gap-2.5">
                      <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                      <span>
                        {currentLevel === "UG"
                          ? "Academic Batches Directory — Undergraduate"
                          : currentLevel === "PG"
                          ? "Academic Batches Directory — Postgraduate"
                          : "Research Scholar Directory"}
                      </span>
                    </h3>
                    <p className="text-[11px] sm:text-sm text-white/80 mt-1">
                      {currentLevel === "UG"
                        ? "Browse all past, present, and ongoing undergraduate student cohorts."
                        : currentLevel === "PG"
                        ? "Browse all past, present, and ongoing postgraduate student cohorts."
                        : "Browse the directory of doctoral research scholars and intakes."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close batch directory modal"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Modal Search & Sort Bar */}
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {/* Search Box */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={modalSearchQuery}
                      onChange={(e) => setModalSearchQuery(e.target.value)}
                      placeholder="Search batch year or programme... (e.g., 2024)"
                      className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/15 text-white placeholder-white/60 text-xs sm:text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    {modalSearchQuery && (
                      <button
                         type="button"
                         onClick={() => setModalSearchQuery("")}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sort Order Toggle */}
                  <div className="flex items-center bg-white/10 p-1 rounded-lg sm:rounded-xl border border-white/15 shrink-0">
                    <button
                      type="button"
                      onClick={() => setModalSortOrder("newest")}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 ${
                        modalSortOrder === "newest"
                          ? "bg-[#D4AF37] text-[#1E1B1C] shadow-xs"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      <span>Newest → Oldest</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalSortOrder("oldest")}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 ${
                        modalSortOrder === "oldest"
                          ? "bg-[#D4AF37] text-[#1E1B1C] shadow-xs"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>Oldest → Newest</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Body: Grouped Batches (Independently scrollable) */}
              <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-6 sm:space-y-8 divide-y divide-[#EADFCF]/60">
                {Object.keys(modalBatchesGrouped).length === 0 ? (
                  <div className="py-12 text-center text-[#7A7476]">
                    <Search className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-[#D4AF37]/60 mb-3" />
                    <p className="text-sm sm:text-base font-bold text-[#1E1B1C]">No matching batches found</p>
                    <p className="text-xs text-[#7A7476] mt-1">Try adjusting your search query or sorting options.</p>
                  </div>
                ) : (
                  Object.entries(modalBatchesGrouped).map(([levelName, levelBatches], groupIdx) => (
                    <div key={levelName} className={groupIdx > 0 ? "pt-5 sm:pt-6" : ""}>
                      <div className="flex items-center justify-between mb-3 sm:mb-4 hidden sm:flex">
                        <h4 className="text-sm sm:text-base font-black text-[#5B001B] tracking-wide uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                          <span>{levelName}</span>
                          <span className="text-xs font-semibold text-[#7A7476] lowercase">
                            ({levelBatches.length} {levelBatches.length === 1 ? "batch" : "batches"})
                          </span>
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5">
                        {levelBatches.map((bName) => {
                          const count = batchCounts[bName];
                          const isSelected = selectedBatch === bName;

                          return (
                            <button
                              key={bName}
                              type="button"
                              onClick={() => {
                                setIsModalOpen(false);
                                if (onSelectLevelBatch && levelName !== currentLevel) {
                                  onSelectLevelBatch(levelName, bName);
                                } else {
                                  onSelectBatch(bName);
                                }
                              }}
                              className={`p-2.5 sm:p-3 rounded-[14px] sm:rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between gap-1 group/item ${
                                isSelected
                                  ? "bg-[#5B001B] text-white border-[#5B001B] shadow-md ring-2 ring-[#D4AF37]"
                                  : "bg-white hover:bg-[#FAF6EE] text-[#1E1B1C] border-[#EADFCF] hover:border-[#5B001B]/50 shadow-2xs"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs sm:text-sm font-bold tracking-tight">
                                  {bName}
                                </span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center justify-between text-[10px] sm:text-[11px] opacity-80 mt-1">
                                <span>{levelName}</span>
                                {typeof count === "number" && (
                                  <span className="font-semibold">
                                    {count} {count === 1 ? "student" : "students"}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-5 bg-[#FAF6EE] border-t border-[#EADFCF] flex items-center justify-between text-[11px] sm:text-xs text-[#7A7476] shrink-0 pb-[env(safe-area-inset-bottom,12px)]">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Showing {Object.values(modalBatchesGrouped).reduce((acc, l) => acc + l.length, 0)} batches</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="font-bold text-[#5B001B] hover:underline"
                >
                  Close Directory
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
