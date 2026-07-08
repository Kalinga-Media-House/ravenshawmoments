export const revalidate = 3600;
// =============================================================================
// Ravenshaw Moments
// File      : src/app/departments/[slug]/page.tsx
// Purpose   : Public Academic Department Page composing reusable UI components
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPublicDepartmentBySlug } from "@/app/actions/department";
import {
  DepartmentBanner,
  DepartmentHeader,
  DepartmentStats,
  DepartmentInfoCard,
  HODCard,
  TeacherGrid,
  CurrentCRCard,
  StudentSpotlight,
  GalleryGrid,
  NoticeList,
  UpcomingEvents,
  PublicationList,
  AchievementGrid,
  DepartmentContactCard,
} from "@/features/department/components";

interface DepartmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPublicDepartmentBySlug(slug);

  if (!res.success || !res.data) {
    return {
      title: "Department Not Found | Ravenshaw Moments",
      description: "Academic department details could not be found.",
    };
  }

  const { department } = res.data;
  const title = `${department.name} | Ravenshaw University`;
  const description =
    department.description || `Official page of the ${department.name} at Ravenshaw University.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: department.cover_url ? [{ url: department.cover_url }] : undefined,
    },
    alternates: {
      canonical: `/departments/${department.slug}`,
    },
  };
}

export default async function DepartmentDetailPage({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const res = await getPublicDepartmentBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const {
    department,
    teachers,
    students,
    activeCRs,
    notices,
    events,
    publications,
  } = res.data;

  // Find Head of Department (HOD) from faculty roster
  const hodTeacher = teachers.find((t) => t.is_hod) || undefined;
  // Active Class Representative (first active CR)
  const currentCR = activeCRs[0] || undefined;
  // Featured students for Student Spotlight
  const featuredStudents = students.filter((s) => s.is_featured);

  const statsObj = {
    department_id: department.id,
    department_name: department.name,
    department_slug: department.slug,
    is_active: department.is_active,
    is_verified: department.is_verified,
    total_students: students.length,
    total_teachers: teachers.length,
    total_crs: activeCRs.length,
    total_events: events.length,
    total_notices: notices.length,
    total_publications: publications.length,
    total_gallery_albums: 0,
    total_achievements: 0,
  };

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: department.name,
    description: department.description || "",
    url: `https://ravenshawmoments.com/departments/${department.slug}`,
    foundingDate: department.established_year ? String(department.established_year) : undefined,
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-10">
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/departments" className="hover:text-foreground transition-colors">
          Departments
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{department.short_name || department.name}</span>
      </nav>

      {/* Hero Section: Banner & Header */}
      <section className="space-y-6">
        <DepartmentBanner department={department} />
        <DepartmentHeader department={department} />
      </section>

      {/* Key Statistics */}
      <section aria-labelledby="dept-stats">
        <DepartmentStats stats={statsObj} />
      </section>

      {/* About, Vision, Mission */}
      <section aria-labelledby="dept-about">
        <DepartmentInfoCard department={department} />
      </section>

      {/* Leadership: HOD & Current CR */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {hodTeacher && <HODCard hod={hodTeacher} />}
        {currentCR && <CurrentCRCard currentCR={currentCR} />}
      </section>

      {/* Faculty Roster */}
      <section aria-labelledby="dept-faculty" className="space-y-4">
        <h2 id="dept-faculty" className="text-2xl font-bold tracking-tight text-foreground">
          Faculty Roster
        </h2>
        <TeacherGrid teachers={teachers} />
      </section>

      {/* Student Spotlight */}
      {featuredStudents.length > 0 && (
        <section aria-labelledby="dept-spotlight">
          <StudentSpotlight featuredStudents={featuredStudents} />
        </section>
      )}

      {/* Latest Notices */}
      <section aria-labelledby="dept-notices" className="space-y-4">
        <h2 id="dept-notices" className="text-2xl font-bold tracking-tight text-foreground">
          Latest Circulars & Notices
        </h2>
        <NoticeList notices={notices} />
      </section>

      {/* Upcoming Events */}
      <section aria-labelledby="dept-events" className="space-y-4">
        <h2 id="dept-events" className="text-2xl font-bold tracking-tight text-foreground">
          Upcoming Events & Seminars
        </h2>
        <UpcomingEvents events={events} />
      </section>

      {/* Department Gallery Preview */}
      <section aria-labelledby="dept-gallery" className="space-y-4">
        <h2 id="dept-gallery" className="text-2xl font-bold tracking-tight text-foreground">
          Gallery Preview
        </h2>
        <GalleryGrid items={[]} />
      </section>

      {/* Academic Honors & Achievements */}
      <section aria-labelledby="dept-achievements" className="space-y-4">
        <h2 id="dept-achievements" className="text-2xl font-bold tracking-tight text-foreground">
          Honors & Achievements
        </h2>
        <AchievementGrid achievements={[]} />
      </section>

      {/* Research Publications */}
      <section aria-labelledby="dept-publications" className="space-y-4">
        <h2 id="dept-publications" className="text-2xl font-bold tracking-tight text-foreground">
          Research Publications & Archives
        </h2>
        <PublicationList publications={publications} />
      </section>

      {/* Contact & Campus Office */}
      <section aria-labelledby="dept-contact">
        <DepartmentContactCard department={department} />
      </section>
    </main>
  );
}
