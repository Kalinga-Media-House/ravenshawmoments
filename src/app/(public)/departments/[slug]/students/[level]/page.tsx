import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicDepartmentBySlug } from "@/app/actions/department";
import { DIRECTORY_DEPARTMENTS } from "@/features/department/data/departments-directory";
import { DepartmentStudentLevelDirectory, ExtendedDepartmentStudent } from "@/features/department/components/detail";
import { generateDepartmentMockData } from "@/features/department/data/mock-department-detail";

export const revalidate = 3600;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; level: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug, level } = resolvedParams;
  const staticDept = DIRECTORY_DEPARTMENTS.find(d => d.slug === slug);
  const titleName = staticDept ? staticDept.name : slug.replace(/-/g, ' ');
  const levelTitle = level === "ug" ? "Undergraduate (UG)" : level === "pg" ? "Postgraduate (PG)" : "Doctoral (Ph.D.)";

  return {
    title: `${levelTitle} Students | Department of ${titleName} | Ravenshaw University`,
    description: `Browse ${levelTitle} students, class representatives (CR), batches, achievements, and memories for the Department of ${titleName} at Ravenshaw University.`,
    openGraph: {
      title: `${levelTitle} Student Directory - Department of ${titleName}`,
      description: `Explore student cohorts and academic leaders of the ${titleName} Department.`,
      url: `https://ravenshawmoments.com/departments/${slug}/students/${level}`,
      siteName: "Ravenshaw Moments",
      type: "website",
    },
  };
}

export default async function DepartmentStudentDirectoryPage({
  params,
}: {
  params: Promise<{ slug: string; level: string }>;
}) {
  const resolvedParams = await params;
  const { slug, level } = resolvedParams;

  const validLevels = ["ug", "pg", "phd"];
  if (!validLevels.includes(level.toLowerCase())) {
    notFound();
  }

  // 1. Fetch live Supabase department data and static directory definition
  const res = await getPublicDepartmentBySlug(slug);
  const staticDept = DIRECTORY_DEPARTMENTS.find(d => d.slug === slug);

  if (!res.success && !staticDept) {
    notFound();
  }

  const liveDept = res.success ? res.data.department : null;
  const departmentName = liveDept?.name || staticDept?.name || slug.replace(/-/g, " ");

  // Generate department mock fallback data
  const mockData = generateDepartmentMockData(
    departmentName, 
    slug, 
    staticDept?.establishedYear || 1949, 
    staticDept?.category || "Science"
  );

  // Merge database students with comprehensive mock fallback students
  const liveStudents = res.success ? (res.data.students || []) : [];
  const mockStudents = mockData.students || [];

  return (
    <DepartmentStudentLevelDirectory
      levelParam={level.toLowerCase() as "ug" | "pg" | "phd"}
      departmentName={departmentName}
      slug={slug}
      initialStudents={[...liveStudents, ...mockStudents] as ExtendedDepartmentStudent[]}
      initialBatches={mockData.batches || []}
    />
  );
}
