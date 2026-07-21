"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  RotateCcw, 
  Download, 
  User, 
  ArrowRight
} from "lucide-react";
import { DepartmentStudentMock, DepartmentBatchMock, ClassRepresentativeMock } from "../../data/mock-department-detail";
import { DepartmentBatchSelector } from "./common";

export type StudentBadgeType = "CR" | "Gold Medalist" | "NET" | "JRF" | "GATE" | "IIT JAM" | "Placement" | "Sports" | "NSS" | "NCC" | string;

export interface ExtendedDepartmentStudent extends DepartmentStudentMock {
  gender?: "Male" | "Female" | "Other";
  badge?: StudentBadgeType;
}

export interface DepartmentStudentLevelDirectoryProps {
  levelParam: "ug" | "pg" | "phd";
  departmentName: string;
  slug: string;
  initialStudents?: ExtendedDepartmentStudent[];
  initialBatches?: DepartmentBatchMock[];
}

export const DepartmentStudentLevelDirectory: React.FC<DepartmentStudentLevelDirectoryProps> = ({
  levelParam,
  departmentName,
  slug,
  initialStudents = [],
}) => {
  const router = useRouter();
  const deptSlug = slug || departmentName.toLowerCase().replace(/\s+/g, "-");

  // Normalize Level
  const courseLevel: "UG" | "PG" | "Ph.D." = 
    levelParam === "ug" ? "UG" : levelParam === "pg" ? "PG" : "Ph.D.";
  
  const levelTitle = 
    levelParam === "ug" ? "Undergraduate (UG)" : levelParam === "pg" ? "Postgraduate (PG)" : "Doctoral (Ph.D.)";

  // Scalable Batches directory across all academic levels
  const allBatchesByLevel: Record<string, string[]> = useMemo(() => {
    return {
      UG: [
        "2025–2029", "2024–2028", "2023–2027", "2022–2026",
        "2021–2025", "2020–2024", "2019–2023", "2018–2022", "2017–2021"
      ],
      PG: [
        "2025–2027", "2024–2026", "2023–2025", "2022–2024",
        "2021–2023", "2020–2022", "2019–2021", "2018–2020"
      ],
      "Ph.D.": [
        "Research Scholars", "2025", "2024", "2023", "2022",
        "2021", "2020", "2019", "2018"
      ],
    };
  }, []);

  const batchNames = useMemo(() => {
    return allBatchesByLevel[courseLevel] || allBatchesByLevel["UG"];
  }, [allBatchesByLevel, courseLevel]);

  // Normalize batch string to URL slug (e.g. "2025–2029" -> "2025-2029", "Research Scholars" -> "research-scholars")
  const formatBatchSlug = (batchStr: string) => {
    return batchStr
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/–/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  // Ensure robust student list for the selected level
  const studentsList: ExtendedDepartmentStudent[] = useMemo(() => {
    const existing = initialStudents.filter(s => s.course === courseLevel);
    if (existing.length >= 12) return existing;

    const firstNames = ["Soumya", "Chandan", "Sashikanta", "Ankit", "Subham", "Priyanka", "Deepak", "Rakesh", "Smaranika", "Biswajit", "Ayesha", "Debasish", "Aditi", "Pradyumna", "Tanmay", "Roshni", "Alok", "Kiran", "Meera", "Swagatika", "Bikash", "Lipika", "Manas", "Niladri", "Pooja", "Samir", "Sonali", "Tapas"];
    const lastNames = ["Behera", "Nayak", "Ray", "Tripathy", "Patra", "Dash", "Rath", "Mishra", "Panda", "Mohanty", "Sahoo", "Pradhan", "Jena", "Biswal", "Panigrahi", "Rout", "Mahapatra", "Kar", "Senapati"];
    const possibleBadges: (StudentBadgeType | undefined)[] = ["CR", "Gold Medalist", "NET", "JRF", "GATE", "IIT JAM", "Placement", "Sports", "NSS", "NCC", undefined, undefined, undefined, undefined];
    const genders: ("Male" | "Female")[] = ["Male", "Male", "Female", "Male", "Female", "Female", "Male", "Male", "Female", "Male"];

    const generated: ExtendedDepartmentStudent[] = [];
    
    batchNames.forEach((bName, bIdx) => {
      const count = courseLevel === "UG" ? 18 : courseLevel === "PG" ? 14 : 10;
      
      for (let i = 1; i <= count; i++) {
        const fn = firstNames[(bIdx * count + i) % firstNames.length];
        const ln = lastNames[(bIdx * i + 3) % lastNames.length];
        const gender = genders[(bIdx + i) % genders.length];
        
        let badge: StudentBadgeType | undefined = undefined;
        if (i === 1) badge = "CR";
        else if (i === 2 && courseLevel !== "Ph.D.") badge = "Gold Medalist";
        else if (i === 3 && courseLevel === "PG") badge = "NET";
        else if (i === 4 && courseLevel === "UG") badge = "IIT JAM";
        else {
          const picked = possibleBadges[(bIdx * 7 + i) % possibleBadges.length];
          if (picked) badge = picked;
        }

        generated.push({
          id: `${levelParam}-${formatBatchSlug(bName)}-${i}`,
          name: `${fn} ${ln}`,
          batch: bName,
          course: courseLevel,
          year: bName,
          verified: true,
          gender: gender,
          badge: badge,
          achievements: badge && badge !== "CR" ? [{ 
            id: `ach-${i}`, 
            title: badge, 
            category: (badge === "NET" || badge === "JRF" || badge === "GATE" || badge === "IIT JAM" || badge === "Sports" ? badge : "Research Publications") as DepartmentStudentMock["achievements"] extends (infer A)[] | undefined ? A extends { category: infer C } ? C : never : never
          }] : undefined
        });
      }
    });

    return generated;
  }, [initialStudents, courseLevel, levelParam, batchNames]);

  // Current CR mapping per batch
  const crMap = useMemo(() => {
    const map: Record<string, ClassRepresentativeMock> = {};
    batchNames.forEach((bName, idx) => {
      const crStudent = studentsList.find(s => s.batch === bName && (s.badge === "CR" || s.name.includes("Soumya") || s.name.includes("Chandan")));
      const crName = crStudent ? crStudent.name : idx === 0 ? "Soumya Ranjan Behera" : idx === 1 ? "Chandan Kumar Nayak" : "Sashikanta Ray";
      
      map[bName] = {
        id: crStudent ? crStudent.id : `cr-${levelParam}-${idx}`,
        name: crName,
        roleTitle: courseLevel === "Ph.D." ? "Research Coordinator" : "Class Representative (CR)",
        badge: `Current CR`,
        batchName: bName,
        program: courseLevel,
        academicYear: "2026–27",
        startDate: "2026-07-01",
        endDate: "2027-05-31",
        status: "Active",
        email: `cr.${deptSlug}.${bName.replace(/[^0-9]/g, "") || "doc"}@ravenshawmoments.com`,
        phone: "+91 98610 12345",
        permissions: []
      };
    });
    return map;
  }, [batchNames, studentsList, courseLevel, levelParam, deptSlug]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const bParam = params.get("batch");
      if (bParam) return bParam;
    }
    return "All Batches";
  });
  const [genderFilter, setGenderFilter] = useState<string>("All");
  const [achievementFilter, setAchievementFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"name-asc" | "newest" | "oldest">("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const itemsPerPage = 24;

  // Compute item counts for all batches across all academic tracks for the modal and track
  const batchCountsMap = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(allBatchesByLevel).flat().forEach(bName => {
      counts[bName] = studentsList.filter(s => s.batch === bName).length;
    });
    return counts;
  }, [allBatchesByLevel, studentsList]);

  // Handle cross-level batch selection from the modal
  const handleSelectLevelBatch = (targetLevel: string, batchName: string) => {
    if (targetLevel === courseLevel) {
      setSelectedBatch(batchName);
      setCurrentPage(1);
    } else {
      const levelRoute = targetLevel === "UG" ? "ug" : targetLevel === "PG" ? "pg" : "phd";
      router.push(`/departments/${deptSlug}/students/${levelRoute}?batch=${encodeURIComponent(batchName)}`);
    }
  };

  // Active CR Card selection
  const activeCR = useMemo(() => {
    if (selectedBatch !== "All Batches" && crMap[selectedBatch]) {
      return crMap[selectedBatch];
    }
    return crMap[batchNames[0]];
  }, [selectedBatch, crMap, batchNames]);

  // Filtered and Sorted Students
  const filteredStudents = useMemo(() => {
    return studentsList.filter(s => {
      // Search by name only
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        if (!matchName) return false;
      }
      // Batch
      if (selectedBatch !== "All Batches" && s.batch !== selectedBatch) {
        return false;
      }
      // Gender
      if (genderFilter !== "All" && s.gender !== genderFilter) {
        return false;
      }
      // Achievement Badge
      if (achievementFilter !== "All") {
        if (!s.badge || s.badge !== achievementFilter) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return b.batch.localeCompare(a.batch);
      if (sortBy === "oldest") return a.batch.localeCompare(b.batch);
      return 0;
    });
  }, [studentsList, searchQuery, selectedBatch, genderFilter, achievementFilter, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBatch("All Batches");
    setGenderFilter("All");
    setAchievementFilter("All");
    setSortBy("name-asc");
    setCurrentPage(1);
  };

  const activeFiltersCount = 
    (selectedBatch !== "All Batches" ? 1 : 0) +
    (genderFilter !== "All" ? 1 : 0) +
    (achievementFilter !== "All" ? 1 : 0);

  const startItem = filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, filteredStudents.length);

  // Helper method returning JSX element for Sidebar Filters (avoiding nested component definition)
  const renderSidebarFilters = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B001B] mb-2">
          Search Students
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#7A7476] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by student name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#EADFCF] focus:border-[#5B001B] text-xs sm:text-sm outline-none shadow-2xs transition-colors text-[#1E1B1C]"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7476] hover:text-[#5B001B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Batch List */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B001B] mb-2">
          Batch List
        </label>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 no-scrollbar">
          <button
            type="button"
            onClick={() => { setSelectedBatch("All Batches"); setCurrentPage(1); }}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
              selectedBatch === "All Batches"
                ? "bg-[#5B001B] text-white shadow-2xs"
                : "bg-[#FFFDF8] text-[#4A4547] hover:bg-[#FAF6EE] border border-[#EADFCF]"
            }`}
          >
            <span>All Batches</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${selectedBatch === "All Batches" ? "bg-white/20 text-white" : "bg-[#EADFCF]/60 text-[#5B001B]"}`}>
              {studentsList.length}
            </span>
          </button>
          {batchNames.map((bName) => {
            const count = batchCountsMap[bName] || 0;
            const isSelected = selectedBatch === bName;
            return (
              <button
                key={bName}
                type="button"
                onClick={() => { setSelectedBatch(bName); setCurrentPage(1); }}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-[#5B001B] text-white shadow-2xs"
                    : "bg-[#FFFDF8] text-[#4A4547] hover:bg-[#FAF6EE] border border-[#EADFCF]"
                }`}
              >
                <span>{bName}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? "bg-white/20 text-white" : "bg-[#EADFCF]/60 text-[#5B001B]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B001B] mb-2">
          Gender
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {["All", "Male", "Female"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => { setGenderFilter(g); setCurrentPage(1); }}
              className={`py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                genderFilter === g
                  ? "bg-[#5B001B] text-white shadow-2xs"
                  : "bg-[#FFFDF8] text-[#4A4547] hover:bg-[#FAF6EE] border border-[#EADFCF]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Achievement Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B001B] mb-2">
          Achievements &amp; Badges
        </label>
        <select
          value={achievementFilter}
          onChange={(e) => { setAchievementFilter(e.target.value); setCurrentPage(1); }}
          className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF8] border border-[#EADFCF] focus:border-[#5B001B] text-xs font-semibold text-[#1E1B1C] outline-none shadow-2xs transition-colors"
        >
          <option value="All">All Achievements</option>
          <option value="CR">Class Representatives (CR)</option>
          <option value="Gold Medalist">Gold Medalists</option>
          <option value="NET">NET Qualified</option>
          <option value="JRF">JRF Scholars</option>
          <option value="GATE">GATE Qualified</option>
          <option value="IIT JAM">IIT JAM Qualified</option>
          <option value="Placement">Campus Placed</option>
          <option value="Sports">Sports Champions</option>
          <option value="NSS">NSS Volunteers</option>
          <option value="NCC">NCC Cadets</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B001B] mb-2">
          Sort Students By
        </label>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value as "name-asc" | "newest" | "oldest"); setCurrentPage(1); }}
          className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF8] border border-[#EADFCF] focus:border-[#5B001B] text-xs font-semibold text-[#1E1B1C] outline-none shadow-2xs transition-colors"
        >
          <option value="name-asc">Student Name (A – Z)</option>
          <option value="newest">Batch (Newest First)</option>
          <option value="oldest">Batch (Oldest First)</option>
        </select>
      </div>

      {/* Reset Filters */}
      <div className="pt-2">
        <button
          type="button"
          onClick={resetFilters}
          className="w-full py-2.5 rounded-xl bg-[#FAF6EE] hover:bg-[#F3ECE1] text-[#5B001B] border border-[#EADFCF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F6F1] text-[#1E1B1C] selection:bg-[#5B001B] selection:text-white pb-24">
      {/* Top Banner & Breadcrumb Area */}
      <div className="w-full bg-[#FFFDF8] border-b border-[#EADFCF] pt-8 sm:pt-10 pb-8 shadow-2xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-[#7A7476] mb-4">
            <Link href={`/departments/${deptSlug}`} className="hover:text-[#5B001B] transition-colors font-medium">
              Department of {departmentName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#4A4547] font-medium">Students</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#5B001B] font-bold">{levelTitle}</span>
          </nav>

          {/* Large Title & Description */}
          <div className="max-w-3xl space-y-2">
            <h1 className="font-black text-[#1E1B1C] tracking-tight leading-[1.15] font-serif" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
              {courseLevel} Student Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#7A7476] leading-relaxed">
              Browse students batch-wise, explore Class Representatives, achievements and student profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT SIDEBAR (sticky on desktop, hidden on mobile) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-[#FFFDF8] border border-[#EADFCF] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EADFCF]">
              <h2 className="text-sm font-black text-[#1E1B1C] font-serif flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#5B001B]" />
                <span>Filters &amp; Search</span>
              </h2>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5B001B] text-white">
                  {activeFiltersCount} Active
                </span>
              )}
            </div>
            {renderSidebarFilters()}
          </aside>

          {/* RIGHT CONTENT (lg:col-span-9) */}
          <main className="lg:col-span-9 space-y-6 sm:space-y-8 min-w-0 w-full overflow-hidden sm:overflow-visible">
            
            {/* Mobile Slide Drawer Trigger */}
            <div className="lg:hidden flex items-center justify-between gap-3 pb-2">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="w-full py-3 px-4 rounded-[16px] bg-[#5B001B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Filter className="w-4 h-4 text-[#D4AF37]" />
                <span>Filter &amp; Search Students</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#D4AF37] text-[#1E1B1C] font-black">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* SCALABLE BATCH SELECTOR (Horizontal Scroll, Recent, & View All Modal) */}
            <DepartmentBatchSelector
              batches={batchNames}
              selectedBatch={selectedBatch}
              onSelectBatch={(bName) => {
                setSelectedBatch(bName);
                setCurrentPage(1);
              }}
              batchCounts={batchCountsMap}
              totalCount={studentsList.length}
              currentLevel={courseLevel}
              allBatchesByLevel={allBatchesByLevel}
              onSelectLevelBatch={handleSelectLevelBatch}
            />

            {/* CURRENT CR CARD */}
            {activeCR ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-[20px] bg-gradient-to-br from-[#1B171A] to-[#3A111A] border border-white/[0.08] p-5 sm:p-8 shadow-md text-white relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 w-full"
              >
                <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-gradient-to-tl from-[#D4AF37]/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 relative z-10 w-full sm:w-auto">
                  {/* Photo */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#5B001B] border-2 border-[#D4AF37] shadow-md overflow-hidden flex items-center justify-center text-xl sm:text-2xl font-black text-[#D4AF37] shrink-0">
                    {activeCR.avatarUrl ? (
                      <Image
                        src={activeCR.avatarUrl}
                        alt={activeCR.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span>{activeCR.name.replace(/[^A-Z]/g, "").slice(0, 2) || "CR"}</span>
                    )}
                  </div>

                  {/* CR Info */}
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#D4AF37] text-[#1E1B1C] shadow-2xs">
                        {activeCR.badge || "Current CR"}
                      </span>
                      <span className="text-xs font-semibold text-white/70">
                        Session {activeCR.academicYear}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-serif leading-tight">
                      {activeCR.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#D4AF37]">
                      {activeCR.roleTitle} &bull; Batch {activeCR.batchName}
                    </p>
                    <p className="text-xs text-[#CFCFCF]">
                      Department of {departmentName}
                    </p>
                  </div>
                </div>

                {/* View Profile Button */}
                <div className="w-full sm:w-auto shrink-0 relative z-10 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      const batchSlug = formatBatchSlug(activeCR.batchName);
                      const crId = activeCR.id || formatBatchSlug(activeCR.name);
                      router.push(`/departments/${deptSlug}/students/${levelParam}/${batchSlug}/${crId}`);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E3B341] text-[#1E1B1C] font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-[20px] bg-[#FFFDF8] border border-[#EADFCF] p-6 text-center shadow-xs">
                <p className="text-xs sm:text-sm text-[#7A7476] font-medium">
                  No Class Representative currently assigned for this cohort.
                </p>
              </div>
            )}

            {/* TOP TOOLBAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-[#EADFCF] text-xs sm:text-sm w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 font-bold text-[#1E1B1C] text-center sm:text-left w-full sm:w-auto">
                <span>Total Students: <strong className="text-[#5B001B] font-extrabold">{filteredStudents.length}</strong></span>
                <span className="text-[#EADFCF] hidden sm:inline">&bull;</span>
                <span className="text-[#7A7476] font-medium w-full sm:w-auto">
                  Showing {startItem} &ndash; {endItem} of {filteredStudents.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Search in toolbar */}
                <div className="relative hidden sm:block w-48">
                  <Search className="w-3.5 h-3.5 text-[#7A7476] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search students..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#EADFCF] focus:border-[#5B001B] text-xs outline-none shadow-2xs"
                  />
                </div>

                {/* Export (Disabled Future Feature) */}
                <button
                  type="button"
                  disabled
                  title="Export feature coming soon"
                  className="px-3.5 py-1.5 rounded-xl border border-[#EADFCF] bg-[#EADFCF]/30 text-[#7A7476] font-bold text-xs flex items-center gap-1.5 shadow-2xs opacity-60 cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export List</span>
                </button>
              </div>
            </div>

            {/* STUDENT GRID */}
            {filteredStudents.length === 0 ? (
              <div className="rounded-[20px] bg-[#FFFDF8] border border-[#EADFCF] p-12 text-center space-y-4 shadow-sm max-w-xl mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-[#5B001B]/10 text-[#5B001B] flex items-center justify-center mx-auto">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#1E1B1C] font-serif">
                  No students found.
                </h3>
                <p className="text-xs sm:text-sm text-[#7A7476]">
                  Try adjusting your search query, batch cohort, or achievement filters to view results.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#5B001B] text-white font-bold text-xs shadow-sm hover:bg-[#7a0024] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[1600px]:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 w-full">
                {paginatedStudents.map((s, idx) => {
                  const batchSlug = formatBatchSlug(s.batch);
                  const studentSlug = s.id || formatBatchSlug(s.name);
                  return (
                    <motion.button
                      key={s.id}
                      type="button"
                      onClick={() => router.push(`/departments/${deptSlug}/students/${levelParam}/${batchSlug}/${studentSlug}`)}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.2) }}
                      whileHover={{ y: -6 }}
                      className="group text-center rounded-[20px] bg-[#FFFDF8] border border-[#EADFCF] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#5B001B]"
                    >
                      {/* Avatar */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#5B001B] border-2 border-[#D4AF37] shadow-xs group-hover:scale-105 transition-transform duration-300 overflow-hidden flex items-center justify-center text-lg sm:text-xl font-black text-[#D4AF37] shrink-0 mx-auto mb-3">
                        {s.avatarUrl ? (
                          <Image
                            src={s.avatarUrl}
                            alt={s.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <span>{s.name.replace(/[^A-Z]/g, "").slice(0, 2) || "ST"}</span>
                        )}
                      </div>

                      {/* Name & Current Batch */}
                      <div className="space-y-1 my-auto w-full">
                        <h4 className="text-sm sm:text-[0.9375rem] font-semibold text-[#1E1B1C] group-hover:text-[#5B001B] transition-colors line-clamp-1 font-serif leading-tight">
                          {s.name}
                        </h4>
                        <p className="text-xs text-[#7A7476] font-medium tracking-tight">
                          {s.course} {s.batch}
                        </p>
                      </div>

                      {/* Current badges & View Profile */}
                      <div className="pt-2.5 mt-2.5 border-t border-[#EADFCF]/60 w-full flex flex-col items-center gap-1.5">
                        {s.badge ? (
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest ${
                            s.badge === "CR" 
                              ? "bg-[#5B001B] text-white shadow-2xs" 
                              : s.badge === "Gold Medalist" 
                              ? "bg-[#D4AF37] text-[#1E1B1C] font-black" 
                              : "bg-[#5B001B]/10 text-[#5B001B] border border-[#5B001B]/20"
                          }`}>
                            {s.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#7A7476]/70 font-medium truncate">
                            Student Profile
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#5B001B] group-hover:text-[#D4AF37] transition-colors">
                          <span>View Profile</span>
                          <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-[#EADFCF]">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: "smooth" }); }}
                  className="px-4 py-2 rounded-xl border border-[#EADFCF] bg-[#FFFDF8] text-xs font-bold text-[#1E1B1C] hover:border-[#5B001B] disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 400, behavior: "smooth" }); }}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? "bg-[#5B001B] text-white shadow-sm"
                            : "bg-[#FFFDF8] border border-[#EADFCF] text-[#1E1B1C] hover:bg-[#FAF6EE]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 400, behavior: "smooth" }); }}
                  className="px-4 py-2 rounded-xl border border-[#EADFCF] bg-[#FFFDF8] text-xs font-bold text-[#1E1B1C] hover:border-[#5B001B] disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* MOBILE SLIDE DRAWER / BOTTOM SHEET */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-[#FFFDF8] rounded-t-[28px] p-6 pt-4 z-50 lg:hidden max-h-[85vh] overflow-y-auto border-t border-[#EADFCF] shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-[#EADFCF] rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EADFCF]">
                <h3 className="text-base font-black text-[#1E1B1C] font-serif">
                  Filters &amp; Search
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-full bg-[#FAF6EE] text-[#5B001B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderSidebarFilters()}
              <div className="pt-6 mt-4 border-t border-[#EADFCF]">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#5B001B] text-white font-bold text-sm shadow-md"
                >
                  Show Results ({filteredStudents.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
