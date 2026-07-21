"use client";

import React from "react";
import { Clock, MapPin, User, Calendar } from "lucide-react";
import { CompetitionItem } from "../types/competition";

export interface CompetitionScheduleProps {
  competition: CompetitionItem;
}

export const CompetitionSchedule: React.FC<CompetitionScheduleProps> = ({
  competition,
}) => {
  if (!competition.schedule || competition.schedule.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="competition-schedule-heading">
      <div 
        className="rounded-3xl p-6 sm:p-8 lg:p-10 space-y-8"
        style={{
          background: 'linear-gradient(135deg, #32000D 0%, #500619 50%, #690B27 100%)',
          border: '1px solid rgba(228, 181, 54, 0.28)',
          boxShadow: '0 10px 28px rgba(61, 0, 18, 0.16)'
        }}
      >
        <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.50)', color: '#E4B536' }}>
            <Clock className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2
            id="competition-schedule-heading"
            className="text-xl sm:text-2xl font-black tracking-tight"
            style={{ color: '#FFFFFF' }}
          >
            Competition Schedule
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 space-y-8" style={{ borderColor: 'rgba(228, 181, 54, 0.40)' }}>
          {competition.schedule.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline dot */}
              <span
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 shadow"
                style={{ background: '#500619', borderColor: '#E4B536' }}
                aria-hidden="true"
              />

              <div 
                className="p-5 sm:p-6 rounded-2xl transition-all duration-300 space-y-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.10)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider" style={{ color: '#E4B536' }}>
                    {item.time}
                  </span>
                  {item.date && (
                    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{item.date}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black" style={{ color: '#FFFFFF' }}>
                  {item.activity}
                </h3>

                {item.description && (
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
                    {item.description}
                  </p>
                )}

                {(item.venue || item.coordinator) && (
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.10)', color: 'rgba(255, 255, 255, 0.70)' }}>
                    {item.venue && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" style={{ color: '#E4B536' }} aria-hidden="true" />
                        <span>{item.venue}</span>
                      </span>
                    )}
                    {item.coordinator && (
                      <span className="inline-flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" style={{ color: '#E4B536' }} aria-hidden="true" />
                        <span>{item.coordinator}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
