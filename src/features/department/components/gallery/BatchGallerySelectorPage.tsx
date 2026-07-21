"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ChevronRight, ChevronLeft, Layers, ImageIcon, Users, BookOpen, Clock, Calendar, UploadCloud, Search as SearchIcon, Image as ImageIconLucide } from "lucide-react";

export interface BatchGallerySelectorPageProps {
  slug: string;
  galleryType: "freshers" | "farewell";
  level: "ug" | "pg";
}

interface BatchData {
  id: string;
  year: string;
  program: string;
  coverImage: string | null;
  totalPhotos: number;
  totalCapacity: number;
  contributors: number;
  albums: number;
  lastUpdated: string;
  badge: "New" | "Most Popular" | "Recently Updated" | "Featured" | "Archived" | null;
}

export const BatchGallerySelectorPage: React.FC<BatchGallerySelectorPageProps> = ({
  slug,
  galleryType,
  level
}) => {
  const router = useRouter();
  
  const titlePrefix = level === "ug" ? "UNDERGRADUATE" : "POSTGRADUATE";
  const galleryTitle = galleryType.charAt(0).toUpperCase() + galleryType.slice(1);
  const programTitle = level === "ug" ? "UG" : "PG";

  // Generate Mock Data
  const currentYear = new Date().getFullYear();
  const batches: BatchData[] = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const startYear = currentYear - i;
      const endYear = level === "ug" ? startYear + 4 : startYear + 2;
      const batchYear = `${startYear}–${endYear}`;
      
      const totalPhotos = i === 0 ? 0 : Math.floor(Math.random() * 200) + 50;
      const totalCapacity = i === 0 ? 100 : totalPhotos + Math.floor(Math.random() * 50);
      const contributors = i === 0 ? 0 : Math.floor(Math.random() * 50) + 5;
      const albums = i === 0 ? 0 : Math.floor(Math.random() * 10) + 2;
      
      let badge: BatchData["badge"] = null;
      if (i === 0) badge = "New";
      else if (i === 1) badge = "Recently Updated";
      else if (i === 2) badge = "Most Popular";
      else if (i > 10) badge = "Archived";
      
      // Assign cover image priorities
      let coverImage: string | null = null;
      if (i > 0) {
        coverImage = `/hero/hero-${(i % 4) + 1}.webp`; // Mock placeholder logic for 1 or 2
      }
      
      return {
        id: batchYear,
        year: batchYear,
        program: programTitle,
        coverImage,
        totalPhotos,
        totalCapacity,
        contributors,
        albums,
        lastUpdated: i === 0 ? "Not started" : `2 days ago`,
        badge
      };
    });
  }, [currentYear, level, programTitle]);

  const stats = useMemo(() => {
    return {
      totalBatches: batches.length,
      totalPhotos: batches.reduce((acc, b) => acc + b.totalPhotos, 0),
      totalContributors: batches.reduce((acc, b) => acc + b.contributors, 0),
      oldestGallery: batches[batches.length - 1].year,
      latestGallery: batches[0].year,
    };
  }, [batches]);

  const featuredBatches = batches.filter(b => b.totalPhotos > 0).slice(0, 3);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"Newest" | "Oldest" | "A-Z" | "Most Photos">("Newest");

  const filteredBatches = useMemo(() => {
    let result = batches;
    if (searchQuery) {
      result = result.filter(b => b.year.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    switch (sortBy) {
      case "Oldest":
        result = [...result].sort((a, b) => a.year.localeCompare(b.year));
        break;
      case "A-Z":
        result = [...result].sort((a, b) => a.year.localeCompare(b.year));
        break;
      case "Most Photos":
        result = [...result].sort((a, b) => b.totalPhotos - a.totalPhotos);
        break;
      case "Newest":
      default:
        result = [...result].sort((a, b) => b.year.localeCompare(a.year));
        break;
    }
    return result;
  }, [batches, searchQuery, sortBy]);

  const handleSelectBatch = (batchName: string) => {
    router.push(`/departments/${slug}/gallery/${galleryType}/${level}/${batchName}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1E1B1C] pb-24">
      {/* 1 & 2. PREMIUM DARK HERO & FEATURED ARCHIVES */}
      <div className="relative w-full min-h-[340px] lg:min-h-[380px] bg-[#4B0015] overflow-hidden flex flex-col mb-10 shadow-xl">
        {/* Blurred Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero/campus-hero-1.webp" 
            alt="Ravenshaw Campus"
            fill
            className="object-cover blur-[8px] scale-110 opacity-40"
            priority
          />
          {/* Black gradient overlay with soft vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>
          {/* Gold accent lines */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] flex-1 flex flex-col pt-6 pb-8 justify-center">
          
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs sm:text-sm font-medium text-white/60 mb-6 sm:mb-8">
            <Link href={`/departments/${slug}/gallery`} className="hover:text-white transition-colors">Department Gallery</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/30 shrink-0" />
            <Link href={`/departments/${slug}/gallery/${galleryType}`} className="hover:text-white transition-colors">{galleryTitle}</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/30 shrink-0" />
            <span className="text-white">{titlePrefix}</span>
          </nav>

          {/* Featured Archives Heading */}
          <div className="mb-6 sm:mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif tracking-tight mb-2 sm:mb-3"
            >
              Featured Archives
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm sm:text-base text-white/70 font-medium max-w-xl"
            >
              Explore the most recently updated batch memory collections.
            </motion.p>
          </div>

          {/* Featured Cards Carousel */}
          {featuredBatches.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-4 sm:gap-6 pb-2 snap-x snap-mandatory hide-scrollbar"
            >
              {featuredBatches.map((batch) => {
                const progressPercentage = batch.totalCapacity > 0 ? Math.min(100, Math.round((batch.totalPhotos / batch.totalCapacity) * 100)) : 0;
                return (
                  <motion.div
                    key={`featured-${batch.id}`}
                    whileHover={{ y: -5 }}
                    className="snap-start flex-none w-[85%] sm:w-[60%] lg:w-auto relative rounded-[20px] sm:rounded-[24px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300"
                    onClick={() => handleSelectBatch(batch.year)}
                  >
                    <div className="aspect-[16/9] w-full bg-[#1E1B1C] relative overflow-hidden">
                      {batch.coverImage ? (
                        <Image
                          src={batch.coverImage}
                          alt={`${batch.year} Cover`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1E1B1C] to-black">
                          <ImageIconLucide className="w-10 h-10 text-white/20" />
                        </div>
                      )}
                      
                      {/* Dark Gradient Overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                      
                      {/* Card Content */}
                      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <div className="text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1 line-clamp-1">{batch.program}</div>
                            <h3 className="text-lg sm:text-2xl font-bold font-serif leading-none line-clamp-1">{batch.year}</h3>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[9px] sm:text-[10px] font-bold text-white/60 uppercase tracking-wider mb-0.5">Completion</div>
                            <div className="text-xs sm:text-sm font-black text-[#D4AF37]">{progressPercentage}%</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-medium text-white/80 mb-3 sm:mb-4">
                          <div className="flex items-center gap-1.5">
                            <ImageIconLucide className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
                            <span>{batch.totalPhotos} Photos</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
                            <span>{batch.contributors}</span>
                          </div>
                        </div>

                        <div className="pt-3 sm:pt-4 border-t border-white/20 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[9px] sm:text-xs text-white/50">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="line-clamp-1">Updated {batch.lastUpdated}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] sm:text-sm font-bold text-[#D4AF37] group-hover:text-[#F1C40F] transition-colors shrink-0">
                            Explore
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* 4. SEARCH TOOLBAR */}
      <div id="batch-explorer" className="sticky top-[72px] lg:top-[88px] z-30 bg-[#FFFDF8]/90 backdrop-blur-xl border-y border-[#EADFCF] py-4 mb-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7476]" />
              <input 
                type="text" 
                placeholder="Search batches..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#EADFCF] rounded-xl text-sm font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white border border-[#EADFCF] rounded-xl p-1 shrink-0">
              {(["Newest", "Oldest", "A-Z", "Most Photos"] as const).map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    sortBy === option 
                    ? "bg-[#5B001B] text-white shadow-sm" 
                    : "text-[#7A7476] hover:bg-[#FAF8F5]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. BATCH EXPLORER GRID */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {filteredBatches.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredBatches.map((batch) => {
              const progressPercentage = batch.totalCapacity > 0 ? Math.min(100, Math.round((batch.totalPhotos / batch.totalCapacity) * 100)) : 0;
              
              return (
                <motion.div
                  key={`batch-${batch.id}`}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[24px] border border-[#EADFCF] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col"
                  onClick={() => handleSelectBatch(batch.year)}
                >
                  {/* Top: Cover Image */}
                  <div className="aspect-[4/3] w-full bg-[#FAF8F5] relative overflow-hidden">
                    {batch.coverImage ? (
                      <Image
                        src={batch.coverImage}
                        alt={`${batch.year} Cover`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIconLucide className="w-10 h-10 text-[#EADFCF]" />
                      </div>
                    )}
                    {/* Badge */}
                    {batch.badge && (
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
                        <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md border ${
                          batch.badge === 'New' ? 'bg-emerald-500/90 text-white border-emerald-400' :
                          batch.badge === 'Most Popular' ? 'bg-[#D4AF37]/90 text-white border-[#D4AF37]' :
                          batch.badge === 'Archived' ? 'bg-[#1E1B1C]/80 text-white border-white/20' :
                          'bg-white/90 text-[#1E1B1C] border-white/50'
                        }`}>
                          {batch.badge}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B1C]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Center & Bottom: Content */}
                  <div className="p-3 sm:p-6 flex-1 flex flex-col">
                    <div className="mb-3 sm:mb-4">
                      <div className="text-[9px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-0.5 sm:mb-1 line-clamp-1">{batch.program}</div>
                      <h3 className="text-sm sm:text-xl font-bold font-serif text-[#1E1B1C] line-clamp-1">{batch.year}</h3>
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6 mt-auto">
                      {/* Gallery Progress */}
                      <div>
                        <div className="flex items-center justify-between text-[9px] sm:text-xs font-semibold text-[#7A7476] mb-1 sm:mb-1.5">
                          <span className="line-clamp-1">{batch.totalPhotos} / {batch.totalCapacity} <span className="hidden sm:inline">Photos</span></span>
                          <span className="text-[#5B001B] ml-1">{progressPercentage}%</span>
                        </div>
                        <div className="w-full h-1 sm:h-1.5 bg-[#FAF8F5] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F] rounded-full transition-all duration-1000"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Meta stats */}
                      <div className="flex items-center gap-2 sm:gap-4 text-[9px] sm:text-xs font-medium text-[#7A7476] flex-wrap">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          <span className="line-clamp-1">{batch.albums} <span className="hidden sm:inline">Albums</span></span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          <span className="line-clamp-1">{batch.contributors}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-4 border-t border-[#EADFCF] flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs text-[#7A7476]">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        <span className="line-clamp-1">Updated {batch.lastUpdated}</span>
                      </div>
                      <div className="text-[#5B001B] font-bold text-[10px] sm:text-sm flex items-center gap-0.5 sm:gap-1 group-hover:text-[#D4AF37] transition-colors shrink-0">
                        Explore
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* 6. EMPTY STATE */
          <div className="bg-white rounded-[32px] border border-[#EADFCF] p-12 lg:p-24 text-center max-w-4xl mx-auto shadow-sm">
            <div className="w-24 h-24 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIconLucide className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#1E1B1C] mb-4">
              No memories found
            </h3>
            <p className="text-base text-[#7A7476] mb-8 max-w-lg mx-auto">
              We couldn't find any batches matching your search. Please adjust your filters or try a different term.
            </p>
            <button 
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-[#5B001B] text-white rounded-xl font-bold shadow-lg shadow-[#5B001B]/20 hover:bg-[#7A102F] transition-all inline-flex items-center gap-2"
            >
              <SearchIcon className="w-4 h-4" />
              Clear Search
            </button>
          </div>
        )}
        
        {/* Global Empty State (If batches array was empty) */}
        {batches.length === 0 && (
          <div className="bg-white rounded-[32px] border border-[#EADFCF] p-12 lg:p-24 text-center max-w-4xl mx-auto shadow-sm">
            <div className="w-24 h-24 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-6">
              <UploadCloud className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#1E1B1C] mb-4">
              This batch hasn't started preserving memories yet.
            </h3>
            <p className="text-base text-[#7A7476] mb-8 max-w-lg mx-auto">
              Be the first to preserve memories from this batch. Upload photos to start the gallery.
            </p>
            <button 
              className="px-6 py-3 bg-[#5B001B] text-white rounded-xl font-bold shadow-lg shadow-[#5B001B]/20 hover:bg-[#7A102F] transition-all inline-flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Photos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
