import React from "react";
import { Metadata } from "next";
import { DepartmentsDirectory } from "@/features/department/components";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const metadata: Metadata = {
  title: "Departments Directory | Ravenshaw Moments",
  description: "Browse all 25+ academic departments at Ravenshaw University. Explore our departments, connect with students and alumni, and discover their academic legacy.",
};

export const revalidate = 3600;

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8] text-[#2D1F1F]">
      {/* 1. Hero Section */}
      <InnerPageHero
        title="Explore Our Departments"
        eyebrow="Academic Directory"
        description="Browse our historic and modern academic departments. Each department preserves decades of scholarly achievements, student memories, faculty research, and global alumni networks."
        quote="Every department carries a legacy. Every batch adds a new chapter."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Departments" }
        ]}
        backgroundImage={innerPageHeroImages.departments}
      />

      {/* 2 & 3. Search, Filter & Department Cards Grid (Ultra-Premium Apple/Linear Minimal Theme) */}
      <DepartmentsDirectory />
    </div>
  );
}
