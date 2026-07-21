import React from "react";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { PublicAlumniProfile } from "../types/alumni";
import { AlumniCard } from "./AlumniCard";

interface AlumniDirectoryGridProps {
  alumni: PublicAlumniProfile[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

const ITEMS_PER_PAGE = 12;

export const AlumniDirectoryGrid: React.FC<AlumniDirectoryGridProps> = ({
  alumni,
  currentPage,
  onPageChange,
  onResetFilters,
  isFiltered,
}) => {
  if (alumni.length === 0) {
    if (isFiltered) {
      return (
        <section aria-label="No Search Results" className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 border border-[#520016]/10 text-center space-y-5 bg-[#FFF9F4]">
            <div className="w-14 h-14 rounded-2xl bg-[#520016]/10 border border-[#520016]/20 flex items-center justify-center text-[#520016] mx-auto">
              <SearchX className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#520016]">
                No Alumni Profiles Found
              </h3>
              <p className="text-sm sm:text-base text-[#4A4346] leading-relaxed">
                We could not find a public alumni profile matching your search
                or selected filters. Try another keyword or clear the filters.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#520016] text-[#F2B936] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#68001C] transition-all"
            >
              Clear Search and Filters
            </button>
          </div>
        </section>
      );
    }
    return null;
  }

  const totalPages = Math.ceil(alumni.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAlumni = alumni.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageClick = (page: number) => {
    onPageChange(page);
    if (typeof window !== "undefined") {
      const el = document.getElementById("alumni-grid-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <section
      id="alumni-grid-section"
      aria-label="Alumni Profiles Grid"
      className="py-10 px-4 sm:px-6 lg:px-8 scroll-mt-28"
    >
      <div className="max-w-[1180px] mx-auto space-y-10">
        {/* Responsive Grid - 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedAlumni.map((alumnus, index) => (
            <AlumniCard key={alumnus.id} alumnus={alumnus} index={index} />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav
            aria-label="Alumni Directory Pagination"
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#D1CCC9]/40"
          >
            <p className="text-xs font-bold text-[#4A4346]">
              Page <span className="text-[#520016]">{currentPage}</span> of{" "}
              <span className="text-[#520016]">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D1CCC9] bg-white text-xs font-bold text-[#520016] hover:border-[#F2B936] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1 hidden sm:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show a window of pages around the current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageClick(page)}
                          aria-current={currentPage === page ? "page" : undefined}
                          className={`w-9 h-9 rounded-xl text-xs font-black transition-colors ${
                            currentPage === page
                              ? "bg-[#520016] text-white"
                              : "bg-white border border-[#D1CCC9] text-[#4A4346] hover:text-[#520016] hover:border-[#520016]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-[#4A4346] px-1">...</span>;
                    }
                    return null;
                  }
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  handlePageClick(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D1CCC9] bg-white text-xs font-bold text-[#520016] hover:border-[#F2B936] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
};
