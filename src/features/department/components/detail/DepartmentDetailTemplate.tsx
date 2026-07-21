"use client";

import React from "react";
import { DepartmentHeroSection } from "./DepartmentHeroSection";
import { DepartmentStickyNav } from "./DepartmentStickyNav";
import { DepartmentAboutSection } from "./DepartmentAboutSection";
import { DepartmentProgramsSection } from "./DepartmentProgramsSection";
import { DepartmentFacultySection } from "./DepartmentFacultySection";
import { DepartmentStudentsSection } from "./DepartmentStudentsSection";
import { DepartmentAchievementsSection } from "./DepartmentAchievementsSection";
import { DepartmentGalleryHub } from "./DepartmentGalleryHub";
import { 
  generateDepartmentMockData, 
  DepartmentFacultyMock, 
  DepartmentStudentMock, 

} from "../../data/mock-department-detail";

export interface DepartmentDetailTemplateProps {
  department: {
    id: string;
    name: string;
    slug: string;
    description: string;
    established_year?: number;
    office_location?: string;
  };
  staticData?: {
    category?: string;
    establishedYear?: number;
    motto?: string;
    vision?: string;
    mission?: string;
    academicExcellence?: string;
    studentCount?: number;
    facultyCount?: number;


  };
  liveData: {
    teachers: Array<{
      id: string;
      designation_title: string;
      is_hod?: boolean;
      contact_email?: string;
      profile?: {
        full_name?: string;
        avatar_url?: string;
      };
    }>;
    students: Array<{
      id: string;
      profile?: {
        full_name?: string;
        avatar_url?: string;
      };
    }>;


  };
}

export const DepartmentDetailTemplate: React.FC<DepartmentDetailTemplateProps> = ({
  department,
  staticData,
  liveData,
}) => {
  const name = department.name;
  const slug = department.slug;
  const category = staticData?.category || "Science";
  const establishedYear = department.established_year || staticData?.establishedYear || 1949;
  const description = department.description;
  const motto = staticData?.motto || "Exploring the Frontiers of Knowledge & Heritage";
  const officeLocation = department.office_location || "Ravenshaw University Campus, Cuttack, Odisha";

  // Generate dynamic mock fallback data tailored to this department slug
  const mockData = generateDepartmentMockData(name, slug, establishedYear, category);

  // Merge live Supabase records with rich fallback mock arrays
  const faculty: DepartmentFacultyMock[] = liveData.teachers.length > 0 ? liveData.teachers.map((t, idx) => ({
    id: t.id,
    name: t.profile?.full_name || `Faculty Member ${idx + 1}`,
    designation: t.designation_title || "Assistant Professor",
    qualification: "Ph.D., Scholar",
    researchArea: `Advanced ${name} & Interdisciplinary Research`,
    email: t.contact_email || `${slug}.faculty@ravenshawuniversity.ac.in`,
    profileUrl: `/profile/${t.id}`,
    avatarUrl: t.profile?.avatar_url,
    isHod: t.is_hod,
  })) : mockData.faculty;

  const hodTeacher = faculty.find((f) => f.isHod) || faculty[0];

  const students: DepartmentStudentMock[] = liveData.students.length > 0 ? liveData.students.map((s, idx) => ({
    id: s.id,
    name: s.profile?.full_name || `Student ${idx + 1}`,
    batch: "2023 - 2026",
    course: idx % 3 === 0 ? "PG" : "UG",
    year: idx % 2 === 0 ? "Final Year" : "2nd Year",
    avatarUrl: s.profile?.avatar_url,
    verified: true,
  })) : mockData.students;





  const studentCount = liveData.students.length > 0 ? liveData.students.length : (staticData?.studentCount || mockData.students.length);
  const facultyCount = liveData.teachers.length > 0 ? liveData.teachers.length : (staticData?.facultyCount || mockData.faculty.length);

  const achievementsCount = mockData.achievements.length;
  const programsCount = mockData.programs.length;

  const galleryCount = mockData.gallery.length;



  return (
    <article className="min-h-screen bg-[#FFFDF8] pb-28 text-[#1E1B1C]">
      {/* 1. HERO SECTION */}
      <DepartmentHeroSection
        name={name}
        slug={slug}
        category={category}
        establishedYear={establishedYear}
        description={description}
        motto={motto}
        officeLocation={officeLocation}
        studentCount={studentCount}
        facultyCount={facultyCount}

        achievementsCount={achievementsCount}

      />

      {/* 2. STICKY DEPARTMENT NAVIGATION */}
      <DepartmentStickyNav
        facultyCount={facultyCount}
        studentsCount={studentCount}
        programsCount={programsCount}
        achievementsCount={achievementsCount}
        galleryCount={galleryCount}


      />

      {/* 4. OVERVIEW SECTION (With HOD Card) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] mt-12 sm:mt-16 space-y-16 sm:space-y-24">
        <DepartmentAboutSection
          name={name}
          slug={slug}
          description={description}
          establishedYear={establishedYear}
          category={category}
          vision={staticData?.vision}
          mission={staticData?.mission}
          academicExcellence={staticData?.academicExcellence}
          motto={motto}
          officeLocation={officeLocation}
          hodTeacher={hodTeacher}
        />

        {/* 5. ACADEMIC PROGRAMS */}
        <DepartmentProgramsSection
          programs={mockData.programs}
          departmentName={name}
        />

        {/* 6. FACULTY MEMBERS */}
        <DepartmentFacultySection
          faculty={faculty}
          departmentName={name}
        />

        {/* 4. STUDENT ECOSYSTEM & BATCH COHORTS */}
        <DepartmentStudentsSection
          students={students}
          batches={(mockData as any).batches || []}
          departmentName={name}
          slug={slug}
        />

        {/* 9. GALLERY HUB */}
        <DepartmentGalleryHub
          departmentName={name}
          slug={slug}
        />

        {/* 10. ACHIEVEMENTS */}
        <DepartmentAchievementsSection
          achievements={mockData.achievements}
          departmentName={name}
          slug={slug}
        />


      </div>
    </article>
  );
};
