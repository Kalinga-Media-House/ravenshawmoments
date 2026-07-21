"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronRight, MapPin, Clock } from "lucide-react";
import { CompetitionItem } from "../types/competition";
import { format } from "date-fns";

type UpcomingCompetitionsProps = {
  competitions: CompetitionItem[];
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const UpcomingCompetitions: React.FC<UpcomingCompetitionsProps> = ({ competitions }) => {
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[currentMonthIndex]);

  // Filter competitions strictly for upcoming status
  const upcomingCompetitions = competitions.filter(
    (c) => new Date(c.startDate) > new Date()
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Filter for the selected month tab
  const monthCompetitions = competitions.filter((c) => {
    const d = new Date(c.startDate);
    return MONTHS[d.getMonth()] === selectedMonth;
  });

  return (
    <section className="w-full">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Left Column: Upcoming Timeline */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6" style={{ color: '#E4B536' }} />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#352A2E' }}>
              Upcoming Events
            </h2>
          </div>

          <div className="space-y-4">
            {upcomingCompetitions.slice(0, 4).map((comp) => {
              const startDate = new Date(comp.startDate);
              return (
                <div 
                  key={comp.id} 
                  className="group flex gap-4 p-4 rounded-2xl transition-all duration-300"
                  style={{
                    background: 'radial-gradient(circle at top right, rgba(228, 181, 54, 0.11), transparent 38%), linear-gradient(135deg, #36000E 0%, #52071B 52%, #710D2A 100%)',
                    border: '1px solid rgba(228, 181, 54, 0.30)',
                    boxShadow: '0 8px 24px rgba(61, 0, 18, 0.13), 0 2px 7px rgba(61, 0, 18, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.62)';
                    e.currentTarget.style.boxShadow = '0 14px 34px rgba(61, 0, 18, 0.22), 0 4px 12px rgba(61, 0, 18, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.30)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(61, 0, 18, 0.13), 0 2px 7px rgba(61, 0, 18, 0.08)';
                  }}
                >
                  <div 
                    className="flex flex-col items-center justify-center min-w-[70px] px-3 py-2 rounded-xl text-center transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.07)',
                      border: '1px solid rgba(228, 181, 54, 0.65)',
                      boxShadow: 'inset 0 0 18px rgba(228, 181, 54, 0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.85)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.65)';
                    }}
                  >
                    <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#E4B536' }}>
                      {format(startDate, "MMM")}
                    </span>
                    <span className="text-2xl font-black leading-none mt-1" style={{ color: '#FFFFFF' }}>
                      {format(startDate, "dd")}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg font-bold transition-colors line-clamp-1" style={{ color: '#FFFFFF' }}>
                      {comp.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.72)' }}>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: '#E4B536' }} />
                        <span>{comp.startTime || "09:00 AM"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" style={{ color: '#E4B536' }} />
                        <span className="line-clamp-1">{comp.venue}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex items-center justify-center">
                    <Link
                      href={`/competitions/${comp.slug}`}
                      className="p-2 transition-transform duration-300 group-hover:translate-x-[4px]"
                      aria-label={`View details for ${comp.title}`}
                    >
                      <ChevronRight className="w-5 h-5 transition-colors duration-300 group-hover:brightness-125" style={{ color: '#E4B536' }} />
                    </Link>
                  </div>
                </div>
              );
            })}
            
            {upcomingCompetitions.length === 0 && (
              <div className="p-8 text-center rounded-2xl flex flex-col items-center justify-center space-y-3" style={{ background: '#FFFDF9', border: '1px solid rgba(228, 181, 54, 0.3)' }}>
                <Calendar className="w-8 h-8" style={{ color: '#E4B536' }} />
                <p className="font-medium text-[#4A3036]">No upcoming events scheduled currently.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Explore by Month */}
        <div className="flex-1 lg:max-w-md">
          <div 
            className="p-6 sm:p-8 rounded-3xl h-full"
            style={{
              background: 'radial-gradient(circle at top right, rgba(228, 181, 54, 0.12), transparent 42%), linear-gradient(145deg, #35000E 0%, #510719 55%, #690B25 100%)',
              border: '1px solid rgba(228, 181, 54, 0.30)',
              boxShadow: '0 12px 32px rgba(61, 0, 18, 0.17), 0 3px 9px rgba(61, 0, 18, 0.09)'
            }}
          >
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6" style={{ color: '#FFFFFF' }}>
              Explore by Month
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {MONTHS.map((month) => {
                const isSelected = selectedMonth === month;
                return (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-250"
                    style={isSelected ? {
                      background: '#E4B536',
                      borderColor: '#E4B536',
                      color: '#3B0011',
                      boxShadow: '0 5px 15px rgba(228, 181, 54, 0.24)'
                    } : {
                      background: 'rgba(255, 255, 255, 0.065)',
                      border: '1px solid rgba(228, 181, 54, 0.35)',
                      color: 'rgba(255, 255, 255, 0.86)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(228, 181, 54, 0.14)';
                        e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.72)';
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.065)';
                        e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.35)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.86)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {month}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {monthCompetitions.length > 0 ? (
                monthCompetitions.map((comp) => (
                  <Link 
                    href={`/competitions/${comp.slug}`} 
                    key={comp.id}
                    className="block p-4 rounded-xl hover:bg-white/5 border hover:border-[var(--color-rm-gold)]/50 transition-all duration-300 group"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm sm:text-base font-bold group-hover:text-[#E4B536] transition-colors line-clamp-1" style={{ color: '#FFFFFF' }}>
                          {comp.title}
                        </h4>
                        <p className="text-xs font-medium mt-1 line-clamp-1" style={{ color: 'rgba(255, 255, 255, 0.72)' }}>
                          {comp.organizerName} • {comp.category}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 transition-colors flex-shrink-0 mt-1" style={{ color: '#E4B536' }} />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-6 text-center flex flex-col items-center justify-center space-y-2">
                  <Calendar className="w-6 h-6" style={{ color: 'rgba(228, 181, 54, 0.4)' }} />
                  <p className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.67)' }}>
                    No competitions found in {selectedMonth}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};
