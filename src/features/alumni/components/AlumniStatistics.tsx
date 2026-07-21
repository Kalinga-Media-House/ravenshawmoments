import React from "react";
import { Users, Building2, Calendar, Globe } from "lucide-react";
import { PublicAlumniProfile } from "../types/alumni";

interface AlumniStatisticsProps {
  alumni: PublicAlumniProfile[];
}

export const AlumniStatistics: React.FC<AlumniStatisticsProps> = ({
  alumni,
}) => {
  if (alumni.length === 0) {
    return null;
  }

  const totalProfiles = alumni.length;

  const departmentsSet = new Set(
    alumni
      .map((a) => a.departmentName)
      .filter((dept): dept is string => typeof dept === "string" && dept.trim().length > 0)
  );

  const batchesSet = new Set(
    alumni
      .map((a) => a.batch || a.graduationYear)
      .filter((b): b is string => typeof b === "string" && b.trim().length > 0)
  );

  const countriesSet = new Set(
    alumni
      .map((a) => a.country)
      .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
  );

  const stats = [
    {
      label: "Alumni Profiles",
      value: totalProfiles.toLocaleString(),
      icon: Users,
    },
    {
      label: "Departments Represented",
      value: departmentsSet.size.toLocaleString(),
      icon: Building2,
    },
    {
      label: "Batches Represented",
      value: batchesSet.size.toLocaleString(),
      icon: Calendar,
    },
    {
      label: "Countries Represented",
      value: countriesSet.size.toLocaleString(),
      icon: Globe,
    },
  ];

  return (
    <section aria-label="Alumni Statistics" className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rm-glass-card rounded-2xl p-5 border border-white/10 flex items-center gap-4 hover:border-[var(--color-rm-gold)]/40 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)] shrink-0">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-bold text-white/70 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
