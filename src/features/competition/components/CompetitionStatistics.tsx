"use client";

import React from "react";
import { Trophy, Calendar, Grid, Globe } from "lucide-react";
import { CompetitionItem } from "../types/competition";
import { computeCompetitionStatus } from "../utils/competitionStatus";

export interface CompetitionStatisticsProps {
  competitions: CompetitionItem[];
}

export const CompetitionStatistics: React.FC<CompetitionStatisticsProps> = ({
  competitions,
}) => {
  const openCount = competitions.filter(
    (item) => computeCompetitionStatus(item) === "Registration Open"
  ).length;

  const now = new Date();
  const upcomingCount = competitions.filter(
    (item) => new Date(item.startDate) > now
  ).length;

  const categoryCount = new Set(competitions.map((item) => item.category)).size;

  const externalCount = competitions.filter(
    (item) => item.externalParticipantsAllowed === true
  ).length;

  const stats = [
    {
      label: "Open Competitions",
      value: openCount,
      icon: Trophy,
      description: "Registration currently open",
    },
    {
      label: "Upcoming Competitions",
      value: upcomingCount,
      icon: Calendar,
      description: "Scheduled future competitions",
    },
    {
      label: "Competition Categories",
      value: categoryCount,
      icon: Grid,
      description: "Diverse competitive disciplines",
    },
    {
      label: "External Opportunities",
      value: externalCount,
      icon: Globe,
      description: "Open to eligible external colleges",
    },
  ];

  return (
    <section aria-label="Competition Statistics" className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className="group relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-[5px]"
              style={{
                background: 'radial-gradient(circle at top right, rgba(242, 190, 62, 0.12), transparent 42%), linear-gradient(135deg, #3D0010 0%, #5C071D 50%, #790E2D 100%)',
                border: '1px solid rgba(224, 171, 45, 0.35)',
                boxShadow: '0 10px 30px rgba(67, 0, 20, 0.16), 0 2px 8px rgba(67, 0, 20, 0.10)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 38px rgba(67, 0, 20, 0.24), 0 4px 12px rgba(67, 0, 20, 0.14)';
                e.currentTarget.style.borderColor = 'rgba(224, 171, 45, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(67, 0, 20, 0.16), 0 2px 8px rgba(67, 0, 20, 0.10)';
                e.currentTarget.style.borderColor = 'rgba(224, 171, 45, 0.35)';
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.82)' }}>
                  {stat.label}
                </span>
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'rgba(242, 190, 62, 0.12)',
                    border: '1px solid rgba(242, 190, 62, 0.55)',
                    color: '#F2BE3E'
                  }}
                >
                  <IconComponent className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {stat.value}
                </div>
                <p className="text-[11px] sm:text-xs font-medium mt-1" style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
