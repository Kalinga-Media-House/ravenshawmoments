import React from "react";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniDepartmentProps {
  alumnus: PublicAlumniProfile;
}

export const AlumniDepartment: React.FC<AlumniDepartmentProps> = ({
  alumnus,
}) => {
  if (!alumnus.departmentName) {
    return null;
  }

  const deptSlug =
    alumnus.departmentSlug ||
    alumnus.departmentName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return (
    <section aria-labelledby="alumni-department-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rm-glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--color-rm-gold)]">
            <Building2 className="w-4 h-4" aria-hidden="true" />
            <span>My Department</span>
          </div>
          <h2
            id="alumni-department-heading"
            className="text-xl sm:text-2xl font-black text-white"
          >
            {alumnus.departmentName}
          </h2>
          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
            Connected to the Department of {alumnus.departmentName}
            {alumnus.batch && ` : Batch ${alumnus.batch}`}
            {alumnus.programme && ` : ${alumnus.programme}`}. Celebrating the
            academics, teachers, and legacy of this vibrant department community.
          </p>
        </div>

        {deptSlug && (
          <Link
            href={`/departments/${deptSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-[var(--color-rm-maroon)]/80 transition-all shrink-0 shadow-md"
          >
            <span>Explore Department</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
};
