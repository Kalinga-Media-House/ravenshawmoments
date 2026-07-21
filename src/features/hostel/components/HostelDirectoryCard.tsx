import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HostelDirectoryItem } from "../types/directory";

interface HostelDirectoryCardProps {
  hostel: HostelDirectoryItem;
}

export const HostelDirectoryCard = ({ hostel }: HostelDirectoryCardProps) => {
  return (
    <Link 
      href={hostel.href}
      className="group flex flex-col h-full heritage-card-glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-heritage-gold)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)] focus-visible:ring-offset-2 relative"
    >
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-[var(--color-heritage-gold)] opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 sm:p-7 flex flex-col h-full mt-1">
        
        {/* Header: Icon & Category */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[var(--color-heritage-gold)]/10 border border-[var(--color-heritage-gold)]/20 shrink-0 group-hover:bg-[var(--color-heritage-gold)]/20 transition-colors duration-300">
            {hostel.icon && React.cloneElement(hostel.icon as React.ReactElement<any>, { className: 'w-5 h-5 heritage-icon' })}
          </div>
          <div className="flex flex-col">
            <span className="text-[0.7rem] font-bold tracking-wider text-[var(--color-heritage-gold)] uppercase">
              {hostel.genderCategory}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold heritage-card-title mb-3 leading-tight tracking-tight group-hover:text-[var(--color-heritage-gold)] transition-colors duration-300 line-clamp-2">
          {hostel.name}
        </h3>

        {/* Description */}
        <p className="text-[0.9rem] sm:text-[0.95rem] heritage-card-muted leading-relaxed mb-8 flex-grow">
          {hostel.shortDescription}
        </p>

        {/* CTA Area */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[0.9rem] font-bold text-[var(--color-heritage-gold)] opacity-90 group-hover:opacity-100 transition-colors duration-300">
            Explore Hostel
          </span>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[var(--color-heritage-gold)] group-hover:border-[var(--color-heritage-gold)] transition-colors duration-300">
            <ArrowRight className="w-4 h-4 text-[var(--color-heritage-gold)] group-hover:text-black transform transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5" strokeWidth={2.5} aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  );
};
