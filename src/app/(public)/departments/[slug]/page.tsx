import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicDepartmentBySlug } from "@/app/actions/department";
import { DIRECTORY_DEPARTMENTS } from "@/features/department/data/departments-directory";
import { DepartmentDetailTemplate } from "@/features/department/components/detail";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const staticDept = DIRECTORY_DEPARTMENTS.find(d => d.slug === slug);
  const titleName = staticDept ? staticDept.name : slug.replace(/-/g, ' ');

  return {
    title: `${titleName} Department | Ravenshaw University`,
    description: staticDept?.description || `Explore academic programs, faculty, alumni, memories, and achievements of the Department of ${titleName} at Ravenshaw University.`,
    openGraph: {
      title: `Department of ${titleName} - Ravenshaw Moments`,
      description: staticDept?.description || `Official community & heritage archive for ${titleName} Department at Ravenshaw University.`,
      url: `https://ravenshawmoments.com/departments/${slug}`,
      siteName: "Ravenshaw Moments",
      images: [
        {
          url: "/images/hero/hero-1.webp",
          width: 1200,
          height: 630,
          alt: `Department of ${titleName} at Ravenshaw University`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Department of ${titleName} | Ravenshaw Moments`,
      description: staticDept?.description || `Official digital heritage archive and community for the Department of ${titleName}.`,
    },
  };
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 1. Fetch live Supabase department data
  const res = await getPublicDepartmentBySlug(slug);
  const staticDept = DIRECTORY_DEPARTMENTS.find(d => d.slug === slug);

  // If neither Supabase record nor static directory definition exists, 404
  if (!res.success && !staticDept) {
    notFound();
  }

  // Graceful data fallback merging live Supabase with static Directory items
  const liveDept = res.success ? res.data.department : null;
  const department = {
    id: liveDept?.id || staticDept?.id || `dept-${slug}`,
    name: liveDept?.name || staticDept?.name || slug.replace(/-/g, " "),
    slug: slug,
    description: liveDept?.description || staticDept?.description || `The Department of ${slug.replace(/-/g, " ")} at Ravenshaw University promotes rigorous academic inquiry and student excellence.`,
    established_year: liveDept?.established_year || staticDept?.establishedYear || 1949,
    office_location: liveDept?.office_location || "Ravenshaw University Campus, Cuttack, Odisha",
  };

  const teachers = res.success ? res.data.teachers : [];
  const students = res.success ? res.data.students : [];


  return (
    <DepartmentDetailTemplate
      department={department}
      staticData={staticDept}
      liveData={{
        teachers,
        students,

      }}
    />
  );
}
