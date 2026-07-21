"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Share2, 
  MessageSquare, 
  Users, 
  Calendar,
  Send
} from "lucide-react";
import { DepartmentGalleryMock } from "../../data/mock-department-detail";
import { SectionHeader, EmptyState } from "./common";

// Pool of real local campus, building, laboratory, and student event photographs
const LOCAL_CAMPUS_ARCHIVE = [
  "/hero/hero-1.webp",
  "/hero/hero-2.webp",
  "/hero/hero-3.webp",
  "/hero/hero-4.webp",
  "/hero/hero-5.webp",
  "/images/competitions/hero-competition.webp",
  "/images/competitions/culture-default.webp",
  "/images/competitions/debate-default.webp",
  "/images/competitions/design-default.webp",
  "/images/competitions/general-default.webp",
  "/images/competitions/innovation-default.webp",
  "/images/competitions/music-default.webp",
  "/images/competitions/photography-default.webp",
  "/images/competitions/poetry-default.webp",
  "/images/competitions/quiz-default.webp",
  "/images/competitions/sports-default.webp",
];

// Helper: Ensures future database URLs work seamlessly, while blocking any legacy logo/placeholder URLs
const resolveGalleryImage = (url?: string, idx: number = 0): string => {
  if (!url || url.includes("logo") || url === "/images/hero/hero-1.webp" || url === "/images/hero/hero-2.webp" || url === "/images/hero/hero-3.webp" || url === "/images/hero/hero-4.webp") {
    return LOCAL_CAMPUS_ARCHIVE[idx % LOCAL_CAMPUS_ARCHIVE.length];
  }
  return url;
};

// Warm Ivory & Gold subtle SVG blur data URL for instant blur placeholder transition
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkFGOEZFIi8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIgb3BhY2l0eT0iMC4wNiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzVBMDAxNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Q0QUYzNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==";

export interface DepartmentGallerySectionProps {
  gallery: DepartmentGalleryMock[];
  departmentName: string;
  slug?: string;
}

export const DepartmentGallerySection: React.FC<DepartmentGallerySectionProps> = ({
  gallery,
  departmentName,
  slug,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "comments" | "tagged">("details");
  const [commentInput, setCommentInput] = useState("");
  const [commentsList, setCommentsList] = useState<Record<string, string[]>>({
    g1: ["Such a memorable day for our department!", "Proud of our seniors and mentors!"],
    g2: ["State of the art equipment in the lab!"],
  });
  const [isPending, startTransition] = useTransition();

  if (!gallery || gallery.length === 0) {
    return null;
  }

  // Exact categories required for standard university archives + dynamic additions
  const standardCategories = [
    "All",
    "Department",
    "Freshers",
    "Farewell",
    "Seminars",
    "Workshops",
    "Department Fest",
    "Achievements",
    "Laboratories",
  ];
  const categories = Array.from(
    new Set([
      ...standardCategories,
      ...gallery.map((g) => g.category),
    ])
  );

  const filteredGallery = selectedCategory === "All"
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  const closeLightbox = () => {
    setLightboxIndex(null);
    setActiveTab("details");
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && filteredGallery.length > 1) {
      setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && filteredGallery.length > 1) {
      setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  const handleAddComment = (id: string) => {
    if (!commentInput.trim()) return;
    setCommentsList((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), commentInput.trim()],
    }));
    setCommentInput("");
  };

  return (
    <section id="gallery" className="scroll-mt-32 pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-[#EADED2]">
      <SectionHeader
        title="Department Gallery & Memories"
        subtitle={`Visual archive of academic blocks, seminar halls, laboratories, and campus moments of ${departmentName}.`}
        badgeText={`${gallery.length} Curated Captures`}
        badgeIcon={ImageIcon}
        actionButton={
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#FAF8F5] border border-[#EADFCF] overflow-x-auto max-w-full shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => startTransition(() => setSelectedCategory(cat))}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[#5B001B] text-white shadow-sm"
                    : "text-[#4A4446] hover:text-[#1E1B1C] hover:bg-[#EADFCF]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        }
      />

      <div
        className={`transition-opacity duration-300 ${
          isPending ? "opacity-50 scale-[0.99]" : "opacity-100 scale-100"
        }`}
      >
        {filteredGallery.length === 0 ? (
          <EmptyState
            title="No images in this category yet"
            description="Explore other categories to view university campus captures and department memories."
          />
        ) : (
          /* Uniform Grid with Same Aspect Ratio & 20px Rounded Corners */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredGallery.map((item, idx) => {
              const cleanImageSrc = resolveGalleryImage(item.imageUrl, idx);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.08, 0.4) }}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative rounded-[20px] overflow-hidden bg-[#FAF8F5] border border-[#EADFCF] shadow-xs hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex flex-col justify-between"
                  whileHover={{ y: -6, scale: 1.01 }}
                >
                  {/* Uniform Aspect Ratio Container (aspect-16/10) */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#EADFCF]/30">
                    <Image
                      src={cleanImageSrc}
                      alt={item.title}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Clean Card Footer */}
                  <div className="p-4 sm:p-5 bg-[#FFFDF8] border-t border-[#EADFCF]/60 flex flex-col justify-between flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#5B001B] text-white">
                        {item.category}
                      </span>
                      <span className="text-xs text-[#7A7476] flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-[#D4AF37]" />
                        {item.date}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#1E1B1C] group-hover:text-[#5B001B] transition-colors leading-snug font-serif line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Premium Lightbox with Download, Share, Comments & Tagged People */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 border border-white/20 shadow-lg"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {filteredGallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevPhoto}
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 border border-white/20 shadow-lg"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={nextPhoto}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 border border-white/20 shadow-lg"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl w-full max-h-[90vh] bg-[#FFFDF8] rounded-[32px] overflow-hidden border-2 border-[#D4AF37] shadow-2xl flex flex-col lg:flex-row z-40"
            >
              {/* Left/Top: Image Showcase */}
              <div className="flex-1 bg-black relative min-h-[360px] lg:min-h-[580px] flex items-center justify-center p-4">
                <Image
                  src={resolveGalleryImage(filteredGallery[lightboxIndex].imageUrl, lightboxIndex)}
                  alt={filteredGallery[lightboxIndex].title}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-contain"
                />
              </div>

              {/* Right/Bottom: Interactive Panel (Download, Share, Comments, Tagged People) */}
              <div className="w-full lg:w-96 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#EADFCF] bg-[#FFFDF8] p-6 max-h-[50vh] lg:max-h-[90vh] overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#5B001B] text-white">
                      {filteredGallery[lightboxIndex].category}
                    </span>
                    <span className="text-xs text-[#7A7476] font-semibold">
                      {filteredGallery[lightboxIndex].date}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-[#1E1B1C] font-serif leading-tight">
                    {filteredGallery[lightboxIndex].title}
                  </h3>

                  {/* Actions Bar: Download & Share */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#EADFCF]">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading high-resolution image (${filteredGallery[lightboxIndex!].title})...`)}
                      className="flex-1 py-2.5 px-4 rounded-full bg-[#5B001B] hover:bg-[#720022] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Download className="w-4 h-4 text-[#D4AF37]" />
                      <span>Download</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Share link copied to clipboard!`)}
                      className="py-2.5 px-4 rounded-full bg-[#FAF8F5] hover:bg-[#EADFCF] text-[#1E1B1C] text-xs font-extrabold border border-[#EADFCF] flex items-center justify-center gap-2 transition-all"
                    >
                      <Share2 className="w-4 h-4 text-[#5B001B]" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Tabs: Comments vs Tagged People */}
                  <div className="flex items-center gap-2 mt-6 border-b border-[#EADFCF] pb-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("details")}
                      className={`text-xs font-black pb-1 border-b-2 transition-colors ${
                        activeTab === "details" ? "border-[#5B001B] text-[#5B001B]" : "border-transparent text-[#7A7476]"
                      }`}
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("comments")}
                      className={`text-xs font-black pb-1 border-b-2 transition-colors flex items-center gap-1 ${
                        activeTab === "comments" ? "border-[#5B001B] text-[#5B001B]" : "border-transparent text-[#7A7476]"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Comments ({commentsList[filteredGallery[lightboxIndex].id]?.length || 0})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("tagged")}
                      className={`text-xs font-black pb-1 border-b-2 transition-colors flex items-center gap-1 ${
                        activeTab === "tagged" ? "border-[#5B001B] text-[#5B001B]" : "border-transparent text-[#7A7476]"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Tagged (3)</span>
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="mt-4 text-xs sm:text-sm">
                    {activeTab === "details" && (
                      <div className="space-y-3 text-[#4A4446]">
                        <p><strong>Department:</strong> {departmentName}</p>
                        <p><strong>Captured during:</strong> {filteredGallery[lightboxIndex].title}</p>
                        <p><strong>Archived:</strong> High-resolution verified departmental media asset.</p>
                      </div>
                    )}

                    {activeTab === "comments" && (
                      <div className="space-y-3">
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                          {(commentsList[filteredGallery[lightboxIndex].id] || []).length === 0 ? (
                            <p className="text-xs text-[#7A7476] italic">No comments yet. Be the first to share your thoughts!</p>
                          ) : (
                            (commentsList[filteredGallery[lightboxIndex].id] || []).map((c, i) => (
                              <div key={i} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EADFCF] text-xs">
                                <span className="font-bold text-[#5B001B]">Ravenshaw Scholar: </span>
                                <span>{c}</span>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment(filteredGallery[lightboxIndex!].id)}
                            className="flex-1 px-3 py-2 rounded-full bg-white border border-[#EADFCF] focus:border-[#5B001B] text-xs outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(filteredGallery[lightboxIndex!].id)}
                            className="w-8 h-8 rounded-full bg-[#5B001B] text-white flex items-center justify-center hover:bg-[#720022] transition-colors shrink-0"
                          >
                            <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "tagged" && (
                      <div className="space-y-2">
                        {["Prof. A. Mohanty (HOD)", "Subham Sekhar (CR)", "Ankita Priyadarshini"].map((person, i) => (
                          <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF8F5] border border-[#EADFCF]">
                            <div className="w-7 h-7 rounded-full bg-[#5B001B] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                              {person[0]}
                            </div>
                            <span className="font-bold text-[#1E1B1C] text-xs">{person}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EADFCF] text-[11px] text-[#7A7476] flex items-center justify-between">
                  <span>Photo ID: #{filteredGallery[lightboxIndex].id.toUpperCase()}</span>
                  <span>Ravenshaw Moments Media</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
