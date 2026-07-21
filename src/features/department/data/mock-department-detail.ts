// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/data/mock-department-detail.ts
// Purpose   : Dynamic mock data generators & fallback templates for Department Detail Page
// =============================================================================

import React from "react";

export interface DepartmentFacultyMock {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  researchArea: string;
  email: string;
  profileUrl: string;
  avatarUrl?: string;
  isHod?: boolean;
}

export interface DepartmentCRMock {
  id: string;
  name: string;
  batch: string;
  role: string;
  session: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface DepartmentStudentMock {
  id: string;
  name: string;
  batch: string;
  course: "UG" | "PG" | "Ph.D.";
  year: string;
  avatarUrl?: string;
  verified: boolean;
  /** Roll numbers are restricted to authorized users (Admin/CR/Student) and omitted from public cards/data */
  rollNumber?: string;
  achievements?: {
    id: string;
    title: string;
    category: "NET" | "JRF" | "GATE" | "IIT JAM" | "NEET" | "UPSC" | "OPSC" | "SSC" | "Campus Placement" | "Scholarships" | "Research Publications" | "Sports" | "Cultural Awards" | "International Achievements";
    year?: string;
  }[];
}

export interface ClassRepresentativeMock {
  id: string;
  name: string;
  avatarUrl?: string;
  roleTitle: "Class Representative" | "Research Coordinator" | "Ph.D. Representative" | string;
  badge: string; // e.g. "Active CR (2025–26)" or "Former CR (2024–25)"
  batchName: string; // e.g. "2025–2029"
  program: "UG" | "PG" | "M.Phil" | "Ph.D." | string;
  academicYear: string; // e.g. "2025–26", "2024–25", "2023–24", "2022–23"
  startDate: string;
  endDate: string;
  status: "Active" | "Former";
  email: string;
  phone?: string;
  permissions: string[]; // e.g. ["add_students", "edit_students", "upload_photos", "post_freshers", "post_farewell", "publish_achievements", "post_notices", "update_gallery"]
}

export interface DepartmentBatchMock {
  id: string;
  name: string;
  course: "UG" | "PG" | "M.Phil" | "Ph.D." | string;
  academicYear: string;
  studentCount: number;
  activeCR?: ClassRepresentativeMock;
  historicalCRs?: ClassRepresentativeMock[];
  cr: {
    name: string;
    avatarUrl?: string;
    role: string;
    email: string;
  };
  students: DepartmentStudentMock[];
  batchAchievements: {
    id: string;
    studentName: string;
    studentPhotoUrl?: string;
    examOrAward: string;
    year: string;
    detail: string;
  }[];
  batchGallery?: DepartmentGalleryMock[];
}




export interface DepartmentGalleryMock {
  id: string;
  title: string;
  category: "Department" | "Freshers" | "Farewell" | "Seminars" | "Workshops" | "Guest Lectures" | "Industrial Visits" | "Competitions" | "Sports" | "Celebrations" | "Convocation" | "Batch Memories" | "Labs" | "Department fest" | "Department memories" | "Achievements" | string;
  batchYear?: string; // e.g. "2025–2029 Gallery", "2024–2028 Gallery"
  departmentSlug?: string;
  imageUrl: string;
  date: string;
  photographer?: string;
  event?: string;
  taggedStudents?: string[];
  taggedFaculty?: string[];
  likesCount?: number;
}



export interface DepartmentAchievementMock {
  id: string;
  title: string;
  recipient: string;
  category: "Students" | "Faculty" | "Research" | "Awards" | "Competitions" | "Placements" | "Gold Medalists" | "Publications" | "Alumni" | string;
  subCategory?: "Distinguished Alumni" | "Gold Medalists" | "Competitive Exam Success" | "Research & Innovation" | string;
  date: string;
  description: string;
  badge: string;
  batch?: string;
  currentPosition?: string;
  award?: string;
  exam?: string;
  photoUrl?: string;
}



export interface DepartmentProgramMock {
  id: string;
  level: "UG" | "PG" | "M.Phil" | "PhD";
  degree: string;
  duration: string;
  seats: string;
  intake?: string;
  description: string;
  eligibility: string;
  syllabusUrl?: string;
}





/**
 * Generates comprehensive rich fallback data for any department based on slug & name.
 */
export function generateDepartmentMockData(deptName: string, deptSlug: string, establishedYear = 1949, category = "Science") {
  const cleanName = deptName || "Academic Studies";

  const faculty: DepartmentFacultyMock[] = [
    {
      id: `fac-${deptSlug}-hod`,
      name: `Prof. (Dr.) Subhashree Mohanty`,
      designation: "Professor & Head of Department",
      qualification: "Ph.D., Post-Doc (Oxford), F.A.Sc.",
      researchArea: `Advanced ${cleanName} Theory, Applied Methods & Quantum Systems`,
      email: `hod.${deptSlug}@ravenshawuniversity.ac.in`,
      profileUrl: `/profile/fac-${deptSlug}-hod`,
      isHod: true,
    },
    {
      id: `fac-${deptSlug}-1`,
      name: `Dr. Ansuman Das`,
      designation: "Associate Professor",
      qualification: "Ph.D. (IIT Kharagpur)",
      researchArea: `Computational ${cleanName} & Numerical Modeling`,
      email: `ansuman.${deptSlug}@ravenshawuniversity.ac.in`,
      profileUrl: `/profile/fac-${deptSlug}-1`,
    },
    {
      id: `fac-${deptSlug}-2`,
      name: `Dr. Priyadarshini Rath`,
      designation: "Assistant Professor",
      qualification: "Ph.D. (University of Delhi)",
      researchArea: `Applied ${cleanName} & Interdisciplinary Studies`,
      email: `priya.${deptSlug}@ravenshawuniversity.ac.in`,
      profileUrl: `/profile/fac-${deptSlug}-2`,
    },
    {
      id: `fac-${deptSlug}-3`,
      name: `Dr. Debasis Satapathy`,
      designation: "Assistant Professor",
      qualification: "Ph.D. (IISc Bangalore)",
      researchArea: `Experimental Analytics & Heritage Preservation`,
      email: `debasis.${deptSlug}@ravenshawuniversity.ac.in`,
      profileUrl: `/profile/fac-${deptSlug}-3`,
    },
    {
      id: `fac-${deptSlug}-4`,
      name: `Dr. Archana Mishra`,
      designation: "Assistant Professor",
      qualification: "Ph.D. (Utkal University)",
      researchArea: `Empirical Research & Pedagogical Innovation`,
      email: `archana.${deptSlug}@ravenshawuniversity.ac.in`,
      profileUrl: `/profile/fac-${deptSlug}-4`,
    },
    {
      id: `fac-${deptSlug}-5`,
      name: `Mr. Bikash Ranjan Sahoo`,
      designation: "Assistant Professor",
      qualification: "M.Phil., NET-JRF",
      researchArea: `Quantitative Methodologies & Contemporary ${cleanName}`,
      email: `bikash.${deptSlug}@ravenshawuniversity.ac.in`,
      profileUrl: `/profile/fac-${deptSlug}-5`,
    },
  ];

  const currentCR: DepartmentCRMock = {
    id: `cr-${deptSlug}-2025`,
    name: "Soumya Ranjan Behera",
    batch: "2023 - 2026",
    role: "Undergraduate Class Representative (B.Sc / B.A Final Year)",
    session: "2025 - 2026",
    email: `cr.${deptSlug}@ravenshawmoments.com`,
    phone: "+91 98610 XXXXX",
  };

  const students: DepartmentStudentMock[] = [
    { id: `stu-1`, name: "Aarav Patnaik", batch: "2023 - 2026", course: "UG", year: "Final Year", verified: true },
    { id: `stu-2`, name: "Sikha Satapathy", batch: "2024 - 2026", course: "PG", year: "2nd Year", verified: true },
    { id: `stu-3`, name: "Chandan Kumar Nayak", batch: "2023 - 2026", course: "UG", year: "Final Year", verified: true },
    { id: `stu-4`, name: "Lipsa Priyadarshini", batch: "2024 - 2027", course: "UG", year: "2nd Year", verified: true },
    { id: `stu-5`, name: "Manish Ranjan Das", batch: "2022 - 2026", course: "Ph.D.", year: "Research Scholar", verified: true },
    { id: `stu-6`, name: "Smruti Rekha Sahoo", batch: "2024 - 2026", course: "PG", year: "1st Year", verified: true },
    { id: `stu-7`, name: "Deepak Parida", batch: "2025 - 2028", course: "UG", year: "1st Year", verified: true },
    { id: `stu-8`, name: "Swagatika Mohanty", batch: "2023 - 2026", course: "UG", year: "Final Year", verified: true },
    { id: `stu-9`, name: "Ankit Tripathy", batch: "2024 - 2027", course: "UG", year: "2nd Year", verified: true },
  ];



  const gallery: DepartmentGalleryMock[] = [
    // Department
    { id: `gal-dept-1`, title: `${cleanName} Heritage Block Exterior & Main Portico`, category: "Department", imageUrl: "/hero/hero-1.webp", date: "Jan 2026" },
    { id: `gal-dept-2`, title: `Central Corridor & Academic Wing`, category: "Department", imageUrl: "/hero/hero-5.webp", date: "Dec 2025" },
    { id: `gal-dept-3`, title: `Seminar Library & Reading Room`, category: "Department", imageUrl: "/images/competitions/general-default.webp", date: "Nov 2025" },

    // Freshers
    { id: `gal-fresh-1`, title: `Freshers Welcome & Orientation Ceremony`, category: "Freshers", imageUrl: "/hero/hero-3.webp", date: "Aug 2025" },
    { id: `gal-fresh-2`, title: `Batch 2025-28 Introductory Cultural Evening`, category: "Freshers", imageUrl: "/images/competitions/culture-default.webp", date: "Aug 2025" },

    // Farewell
    { id: `gal-fare-1`, title: `Valedictory & Farewell Ceremony for Graduating Batch`, category: "Farewell", imageUrl: "/hero/hero-2.webp", date: "Apr 2025" },
    { id: `gal-fare-2`, title: `Senior Batch Keepsake & Group Photograph`, category: "Farewell", imageUrl: "/images/competitions/poetry-default.webp", date: "Apr 2025" },

    // Seminars
    { id: `gal-sem-1`, title: `National Colloquium on Applied ${cleanName}`, category: "Seminars", imageUrl: "/hero/hero-4.webp", date: "Nov 2025" },
    { id: `gal-sem-2`, title: `Keynote Address by Visiting Distinguished Professor`, category: "Seminars", imageUrl: "/images/competitions/debate-default.webp", date: "Oct 2025" },

    // Workshops
    { id: `gal-work-1`, title: `Hands-on Analytical Modeling & Computational Workshop`, category: "Workshops", imageUrl: "/images/competitions/design-default.webp", date: "Sep 2025" },
    { id: `gal-work-2`, title: `Research Methodology & Data Synthesis Bootcamp`, category: "Workshops", imageUrl: "/images/competitions/innovation-default.webp", date: "Jul 2025" },

    // Department Fest
    { id: `gal-fest-1`, title: `Annual Departmental Fest & Cultural Extravaganza`, category: "Department Fest", imageUrl: "/images/competitions/music-default.webp", date: "Dec 2025" },
    { id: `gal-fest-2`, title: `Inter-College Quiz & Debate Championship Finals`, category: "Department Fest", imageUrl: "/images/competitions/quiz-default.webp", date: "Dec 2025" },

    // Achievements
    { id: `gal-ach-1`, title: `Gold Medalist Felicitation & Endowment Ceremony`, category: "Achievements", imageUrl: "/images/competitions/hero-competition.webp", date: "May 2025" },
    { id: `gal-ach-2`, title: `University Inter-Departmental Sports Trophy Winners`, category: "Achievements", imageUrl: "/images/competitions/sports-default.webp", date: "Jan 2026" },

    // Laboratories
    { id: `gal-lab-1`, title: `Advanced Analytical Instrumentation & Research Lab`, category: "Laboratories", imageUrl: "/hero/hero-1.webp", date: "Jan 2026" },
    { id: `gal-lab-2`, title: `Postgraduate Experimental Simulation Rig`, category: "Laboratories", imageUrl: "/images/competitions/photography-default.webp", date: "Dec 2025" },
  ];



  const achievements: DepartmentAchievementMock[] = [
    { id: `ach-alm-1`, title: "Senior Project Director at ISRO", recipient: "Dr. Sandeep Kumar Behera", category: "Awards", subCategory: "Distinguished Alumni", date: "2026", description: `Leading satellite trajectory optimization and deep space telemetry protocols.`, badge: "Distinguished Alumni", batch: "2008 - 2011", currentPosition: "Senior Scientist & Project Director, ISRO" },
    { id: `ach-alm-2`, title: "District Magistrate & Collector", recipient: "Priyanka Mishra, IAS", category: "Awards", subCategory: "Distinguished Alumni", date: "2025", description: `Spearheading administrative modernization and smart governance initiatives in Odisha.`, badge: "Distinguished Alumni", batch: "2012 - 2015", currentPosition: "IAS Officer / District Collector" },
    { id: `ach-gm-1`, title: "Chancellor's Gold Medal for Academic Excellence", recipient: "Soumya Ranjan Behera", category: "Gold Medalists", subCategory: "Gold Medalists", date: "2025", description: `Awarded for securing the highest cumulative GPA across the entire Faculty of ${category}.`, badge: "Gold Medal", batch: "2022 - 2025", award: "UG Gold Medalist" },
    { id: `ach-gm-2`, title: "Postgraduate University Topper & Gold Medalist", recipient: "Sikha Satapathy", category: "Gold Medalists", subCategory: "Gold Medalists", date: "2025", description: `First rank holder in M.Sc. examinations across all affiliated colleges and campuses.`, badge: "Rank Holder", batch: "2023 - 2025", award: "PG Gold Medalist" },
    { id: `ach-exam-1`, title: "All India Rank 18 in GATE Examination", recipient: "Smruti Rekha Sahoo", category: "Competitions", subCategory: "Competitive Exam Success", date: "2026", description: `Qualified for Prime Minister's Research Fellowship (PMRF) across premier IITs/IISc.`, badge: "GATE AIR 18", batch: "2024 - 2026", exam: "GATE" },
    { id: `ach-exam-2`, title: "UGC-NET JRF Qualified (99.4 Percentile)", recipient: "Rajat Kumar Das", category: "Competitions", subCategory: "Competitive Exam Success", date: "2025", description: `Cleared Junior Research Fellowship in general category on first attempt.`, badge: "NET JRF", batch: "2022 - 2026", exam: "UGC-NET JRF" },
    { id: `ach-res-1`, title: "National Science Foundation Research Grant (₹45 Lakhs)", recipient: "Prof. (Dr.) Subhashree Mohanty & Team", category: "Research", subCategory: "Research & Innovation", date: "2025 - 2028", description: `Major multi-year research project on sustainable computational modeling and data theory.`, badge: "Research Grant" },
    { id: `ach-res-2`, title: "Student Patent: AI-Driven Environmental Monitoring System", recipient: "Manish Ranjan Das & Doctoral Group", category: "Research", subCategory: "Research & Innovation", date: "2025", description: `Published Indian Patent (#IN20251104892) for real-time predictive analytics in coastal weather forecasting.`, badge: "Patent Published" },
  ];



  const programs: DepartmentProgramMock[] = [
    {
      id: `prog-${deptSlug}-ug`,
      level: "UG",
      degree: `B.Sc. / B.A. Honours in ${cleanName}`,
      duration: "3 Years / 4 Years (NEP)",
      seats: "64 Seats / Batch",
      intake: "64 Seats",
      description: `Comprehensive undergraduate foundation covering theoretical rigor, modern practical laboratories, and interdisciplinary electives in ${cleanName}.`,
      eligibility: "10+2 with minimum 60% aggregate and qualification in Higher Secondary / CUET.",
      syllabusUrl: `/syllabus/${deptSlug}-ug.pdf`,
    },
    {
      id: `prog-${deptSlug}-pg`,
      level: "PG",
      degree: `M.Sc. / M.A. in ${cleanName}`,
      duration: "2 Years (4 Semesters)",
      seats: "32 Seats / Batch",
      intake: "32 Seats",
      description: `Advanced postgraduate degree emphasizing research methodology, specialized seminar tracks, and cutting-edge industry & analytical applications.`,
      eligibility: "Bachelor's Honours degree in relevant discipline with minimum 55% marks + CPET clearance.",
      syllabusUrl: `/syllabus/${deptSlug}-pg.pdf`,
    },
    {
      id: `prog-${deptSlug}-mphil`,
      level: "M.Phil",
      degree: `Master of Philosophy in ${cleanName}`,
      duration: "1 Year (Advanced Research)",
      seats: "8 Seats / Batch",
      intake: "8 Seats",
      description: `Pre-doctoral research specialization focused on thesis dissertation, literature synthesis, and academic teaching practicums.`,
      eligibility: "Postgraduate degree in relevant specialization with minimum 55% aggregate.",
      syllabusUrl: `/syllabus/${deptSlug}-mphil.pdf`,
    },
    {
      id: `prog-${deptSlug}-phd`,
      level: "PhD",
      degree: `Doctor of Philosophy (Ph.D.) in ${cleanName}`,
      duration: "3 - 5 Years (Doctoral Research)",
      seats: "12 Research Scholars",
      intake: "12 Scholars",
      description: `Premier doctoral research program producing internationally published dissertations across theoretical, applied, and interdisciplinary frontiers.`,
      eligibility: "Postgraduate / M.Phil qualification plus UGC-NET / GATE / Ravenshaw RET fellowship clearance.",
      syllabusUrl: `/syllabus/${deptSlug}-phd.pdf`,
    },
  ];

  const commonCRPermissions = [
    "add_students",
    "edit_students",
    "upload_photos",
    "post_freshers",
    "post_farewell",
    "publish_achievements",
    "post_notices",
    "update_gallery"
  ];

  const batches: DepartmentBatchMock[] = [
    {
      id: `batch-${deptSlug}-ug-2025`,
      name: `B.Sc. / B.A. Honours Batch 2025–2029`,
      course: "UG",
      academicYear: "2025–2029",
      studentCount: 64,
      activeCR: {
        id: `cr-${deptSlug}-ug-2025`,
        name: "Soumya Ranjan Behera",
        roleTitle: "Class Representative (1st Year)",
        badge: "Active CR (2025–26 Session)",
        batchName: "2025–2029",
        program: "UG",
        academicYear: "2025–26",
        startDate: "2025-07-15",
        endDate: "2026-05-30",
        status: "Active",
        email: `cr.${deptSlug}.2025@ravenshawmoments.com`,
        phone: "+91 98610 12345",
        permissions: commonCRPermissions,
      },
      historicalCRs: [
        {
          id: `cr-${deptSlug}-ug-2025-y1`,
          name: "Soumya Ranjan Behera",
          roleTitle: "Class Representative (1st Year)",
          badge: "Active CR (2025–26)",
          batchName: "2025–2029",
          program: "UG",
          academicYear: "2025–26",
          startDate: "2025-07-15",
          endDate: "2026-05-30",
          status: "Active",
          email: `cr.${deptSlug}.2025@ravenshawmoments.com`,
          permissions: commonCRPermissions,
        }
      ],
      cr: {
        name: "Soumya Ranjan Behera",
        role: "Class Representative (1st Year)",
        email: `cr.${deptSlug}.2025@ravenshawmoments.com`,
      },
      students: [
        { id: `stu-${deptSlug}-ug1`, name: "Soumya Ranjan Behera", batch: "2025–2029", course: "UG", year: "1st Year", verified: true },
        { id: `stu-${deptSlug}-ug2`, name: "Aarav Patnaik", batch: "2025–2029", course: "UG", year: "1st Year", verified: true },
        { id: `stu-${deptSlug}-ug3`, name: "Lipsa Priyadarshini", batch: "2025–2029", course: "UG", year: "1st Year", verified: true },
        { id: `stu-${deptSlug}-ug4`, name: "Deepak Parida", batch: "2025–2029", course: "UG", year: "1st Year", verified: true },
      ],
      batchAchievements: [
        { id: `ba-1`, studentName: "Soumya Ranjan Behera", examOrAward: "Scholarships", year: "2025", detail: "National Merit Scholarship (Inspire Fellowship Scheme)" },
        { id: `ba-2`, studentName: "Lipsa Priyadarshini", examOrAward: "Sports", year: "2025", detail: "Gold Medal in State Inter-University Athletics Championship" },
      ],
      batchGallery: [
        { id: `bg-ug25-1`, title: "Freshers Induction Meet 2025", category: "Freshers", imageUrl: "/hero/hero-1.webp", date: "August 2025", departmentSlug: deptSlug },
        { id: `bg-ug25-2`, title: "Batch Orientation & Campus Tour", category: "Department", imageUrl: "/hero/hero-3.webp", date: "August 2025", departmentSlug: deptSlug },
      ]
    },
    {
      id: `batch-${deptSlug}-ug-2024`,
      name: `B.Sc. / B.A. Honours Batch 2024–2028`,
      course: "UG",
      academicYear: "2024–2028",
      studentCount: 62,
      activeCR: {
        id: `cr-${deptSlug}-ug-2024`,
        name: "Chandan Kumar Nayak",
        roleTitle: "Class Representative (2nd Year)",
        badge: "Active CR (2025–26 Session)",
        batchName: "2024–2028",
        program: "UG",
        academicYear: "2025–26",
        startDate: "2025-07-01",
        endDate: "2026-05-30",
        status: "Active",
        email: `cr.${deptSlug}.2024@ravenshawmoments.com`,
        phone: "+91 94371 23456",
        permissions: commonCRPermissions,
      },
      historicalCRs: [
        {
          id: `cr-${deptSlug}-ug-2024-y2`,
          name: "Chandan Kumar Nayak",
          roleTitle: "Class Representative (2nd Year)",
          badge: "Active CR (2025–26)",
          batchName: "2024–2028",
          program: "UG",
          academicYear: "2025–26",
          startDate: "2025-07-01",
          endDate: "2026-05-30",
          status: "Active",
          email: `cr.${deptSlug}.2024@ravenshawmoments.com`,
          permissions: commonCRPermissions,
        },
        {
          id: `cr-${deptSlug}-ug-2024-y1`,
          name: "Swagatika Mohanty",
          roleTitle: "Class Representative (1st Year)",
          badge: "Former CR (2024–25)",
          batchName: "2024–2028",
          program: "UG",
          academicYear: "2024–25",
          startDate: "2024-07-15",
          endDate: "2025-05-30",
          status: "Former",
          email: `swagatika.2024@ravenshawmoments.com`,
          permissions: [],
        }
      ],
      cr: {
        name: "Chandan Kumar Nayak",
        role: "Class Representative (2nd Year)",
        email: `cr.${deptSlug}.2024@ravenshawmoments.com`,
      },
      students: [
        { id: `stu-${deptSlug}-ug24-1`, name: "Chandan Kumar Nayak", batch: "2024–2028", course: "UG", year: "2nd Year", verified: true },
        { id: `stu-${deptSlug}-ug24-2`, name: "Swagatika Mohanty", batch: "2024–2028", course: "UG", year: "2nd Year", verified: true },
        { id: `stu-${deptSlug}-ug24-3`, name: "Ankit Tripathy", batch: "2024–2028", course: "UG", year: "2nd Year", verified: true },
      ],
      batchAchievements: [
        { id: `ba-3`, studentName: "Ankit Tripathy", examOrAward: "IIT JAM", year: "2025", detail: "All India Rank 42 in IIT JAM Examination" },
        { id: `ba-4`, studentName: "Swagatika Mohanty", examOrAward: "Cultural Awards", year: "2025", detail: "1st Prize in National Youth Festival Classical Debate" },
      ],
      batchGallery: [
        { id: `bg-ug24-1`, title: "Practical Workshop & Instrumentation Lab", category: "Laboratories", imageUrl: "/hero/hero-2.webp", date: "November 2025", departmentSlug: deptSlug },
        { id: `bg-ug24-2`, title: "Inter-Department Debate Competition", category: "Achievements", imageUrl: "/images/competitions/debate.webp", date: "October 2025", departmentSlug: deptSlug },
      ]
    },
    {
      id: `batch-${deptSlug}-ug-2023`,
      name: `B.Sc. / B.A. Honours Batch 2023–2027`,
      course: "UG",
      academicYear: "2023–2027",
      studentCount: 60,
      activeCR: {
        id: `cr-${deptSlug}-ug-2023`,
        name: "Sashikanta Ray",
        roleTitle: "Class Representative (3rd Year)",
        badge: "Active CR (2025–26 Session)",
        batchName: "2023–2027",
        program: "UG",
        academicYear: "2025–26",
        startDate: "2025-07-01",
        endDate: "2026-05-30",
        status: "Active",
        email: `cr.${deptSlug}.2023@ravenshawmoments.com`,
        phone: "+91 97760 34567",
        permissions: commonCRPermissions,
      },
      historicalCRs: [
        {
          id: `cr-${deptSlug}-ug-2023-y3`,
          name: "Sashikanta Ray",
          roleTitle: "Class Representative (3rd Year)",
          badge: "Active CR (2025–26)",
          batchName: "2023–2027",
          program: "UG",
          academicYear: "2025–26",
          startDate: "2025-07-01",
          endDate: "2026-05-30",
          status: "Active",
          email: `cr.${deptSlug}.2023@ravenshawmoments.com`,
          permissions: commonCRPermissions,
        },
        {
          id: `cr-${deptSlug}-ug-2023-y2`,
          name: "Priyanka Mishra",
          roleTitle: "Class Representative (2nd Year)",
          badge: "Former CR (2024–25)",
          batchName: "2023–2027",
          program: "UG",
          academicYear: "2024–25",
          startDate: "2024-07-01",
          endDate: "2025-05-30",
          status: "Former",
          email: `priyanka.2023@ravenshawmoments.com`,
          permissions: [],
        },
        {
          id: `cr-${deptSlug}-ug-2023-y1`,
          name: "Devi Prasad Rout",
          roleTitle: "Class Representative (1st Year)",
          badge: "Former CR (2023–24)",
          batchName: "2023–2027",
          program: "UG",
          academicYear: "2023–24",
          startDate: "2023-07-15",
          endDate: "2024-05-30",
          status: "Former",
          email: `deviprasad.2023@ravenshawmoments.com`,
          permissions: [],
        }
      ],
      cr: {
        name: "Sashikanta Ray",
        role: "Class Representative (3rd Year)",
        email: `cr.${deptSlug}.2023@ravenshawmoments.com`,
      },
      students: [
        { id: `stu-${deptSlug}-ug23-1`, name: "Sashikanta Ray", batch: "2023–2027", course: "UG", year: "3rd Year", verified: true },
        { id: `stu-${deptSlug}-ug23-2`, name: "Priyanka Mishra", batch: "2023–2027", course: "UG", year: "3rd Year", verified: true },
      ],
      batchAchievements: [
        { id: `ba-5`, studentName: "Sashikanta Ray", examOrAward: "Campus Placement", year: "2026", detail: "Pre-Placement Offer (PPO) at Google & TCS Innovation Labs" },
        { id: `ba-6`, studentName: "Priyanka Mishra", examOrAward: "UPSC", year: "2025", detail: "Cleared Combined Defense Services (CDS) Written Exam" },
      ],
      batchGallery: [
        { id: `bg-ug23-1`, title: "National Level Symposium & Presentation", category: "Seminars", imageUrl: "/hero/hero-4.webp", date: "January 2026", departmentSlug: deptSlug },
        { id: `bg-ug23-2`, title: "Annual Sports Meet Contingent", category: "Department Fest", imageUrl: "/images/competitions/sports.webp", date: "December 2025", departmentSlug: deptSlug },
      ]
    },
    {
      id: `batch-${deptSlug}-ug-2022`,
      name: `B.Sc. / B.A. Honours Batch 2022–2026`,
      course: "UG",
      academicYear: "2022–2026",
      studentCount: 58,
      activeCR: {
        id: `cr-${deptSlug}-ug-2022`,
        name: "Rajat Kumar Das",
        roleTitle: "Class Representative (Final Year)",
        badge: "Active CR (2025–26 Session)",
        batchName: "2022–2026",
        program: "UG",
        academicYear: "2025–26",
        startDate: "2025-07-01",
        endDate: "2026-05-30",
        status: "Active",
        email: `cr.${deptSlug}.2022@ravenshawmoments.com`,
        phone: "+91 99370 45678",
        permissions: commonCRPermissions,
      },
      historicalCRs: [
        {
          id: `cr-${deptSlug}-ug-2022-y4`,
          name: "Rajat Kumar Das",
          roleTitle: "Class Representative (4th Year)",
          badge: "Active CR (2025–26)",
          batchName: "2022–2026",
          program: "UG",
          academicYear: "2025–26",
          startDate: "2025-07-01",
          endDate: "2026-05-30",
          status: "Active",
          email: `cr.${deptSlug}.2022@ravenshawmoments.com`,
          permissions: commonCRPermissions,
        },
        {
          id: `cr-${deptSlug}-ug-2022-y3`,
          name: "Abinash Mohapatra",
          roleTitle: "Class Representative (3rd Year)",
          badge: "Former CR (2024–25)",
          batchName: "2022–2026",
          program: "UG",
          academicYear: "2024–25",
          startDate: "2024-07-01",
          endDate: "2025-05-30",
          status: "Former",
          email: `abinash.2022@ravenshawmoments.com`,
          permissions: [],
        },
        {
          id: `cr-${deptSlug}-ug-2022-y2`,
          name: "Snigdha Rani Sahoo",
          roleTitle: "Class Representative (2nd Year)",
          badge: "Former CR (2023–24)",
          batchName: "2022–2026",
          program: "UG",
          academicYear: "2023–24",
          startDate: "2023-07-01",
          endDate: "2024-05-30",
          status: "Former",
          email: `snigdha.2022@ravenshawmoments.com`,
          permissions: [],
        },
        {
          id: `cr-${deptSlug}-ug-2022-y1`,
          name: "Rajat Kumar Das",
          roleTitle: "Class Representative (1st Year)",
          badge: "Former CR (2022–23)",
          batchName: "2022–2026",
          program: "UG",
          academicYear: "2022–23",
          startDate: "2022-07-15",
          endDate: "2023-05-30",
          status: "Former",
          email: `cr.${deptSlug}.2022@ravenshawmoments.com`,
          permissions: [],
        }
      ],
      cr: {
        name: "Rajat Kumar Das",
        role: "Class Representative (Final Year)",
        email: `cr.${deptSlug}.2022@ravenshawmoments.com`,
      },
      students: [
        { id: `stu-${deptSlug}-ug22-1`, name: "Rajat Kumar Das", batch: "2022–2026", course: "UG", year: "Final Year", verified: true },
      ],
      batchAchievements: [
        { id: `ba-7`, studentName: "Rajat Kumar Das", examOrAward: "NET", year: "2025", detail: "UGC-NET Qualified with 99.4 Percentile" },
      ],
      batchGallery: [
        { id: `bg-ug22-1`, title: "Final Year Farewell Ceremony & Convocation Prep", category: "Farewell", imageUrl: "/hero/hero-5.webp", date: "April 2026", departmentSlug: deptSlug },
      ]
    },
    {
      id: `batch-${deptSlug}-pg-2025`,
      name: `M.Sc. / M.A. Post-Graduate Batch 2025–2027`,
      course: "PG",
      academicYear: "2025–2027",
      studentCount: 32,
      activeCR: {
        id: `cr-${deptSlug}-pg-2025`,
        name: "Sikha Satapathy",
        roleTitle: "Class Representative (1st Year PG)",
        badge: "Active CR (2025–26 Session)",
        batchName: "2025–2027",
        program: "PG",
        academicYear: "2025–26",
        startDate: "2025-07-15",
        endDate: "2026-05-30",
        status: "Active",
        email: `cr.pg.${deptSlug}.2025@ravenshawmoments.com`,
        phone: "+91 94370 56789",
        permissions: commonCRPermissions,
      },
      historicalCRs: [
        {
          id: `cr-${deptSlug}-pg-2025-y1`,
          name: "Sikha Satapathy",
          roleTitle: "Class Representative (1st Year PG)",
          badge: "Active CR (2025–26)",
          batchName: "2025–2027",
          program: "PG",
          academicYear: "2025–26",
          startDate: "2025-07-15",
          endDate: "2026-05-30",
          status: "Active",
          email: `cr.pg.${deptSlug}.2025@ravenshawmoments.com`,
          permissions: commonCRPermissions,
        }
      ],
      cr: {
        name: "Sikha Satapathy",
        role: "Class Representative (1st Year PG)",
        email: `cr.pg.${deptSlug}.2025@ravenshawmoments.com`,
      },
      students: [
        { id: `stu-${deptSlug}-pg25-1`, name: "Sikha Satapathy", batch: "2025–2027", course: "PG", year: "1st Year", verified: true },
        { id: `stu-${deptSlug}-pg25-2`, name: "Smruti Rekha Sahoo", batch: "2025–2027", course: "PG", year: "1st Year", verified: true },
      ],
      batchAchievements: [
        { id: `ba-8`, studentName: "Sikha Satapathy", examOrAward: "JRF", year: "2026", detail: "Junior Research Fellowship (CSIR/UGC-NET JRF) Awardee" },
        { id: `ba-9`, studentName: "Smruti Rekha Sahoo", examOrAward: "GATE", year: "2026", detail: "All India Rank 18 in GATE Examination" },
      ],
      batchGallery: [
        { id: `bg-pg25-1`, title: "PG Freshers Orientation & Research Briefing", category: "Freshers", imageUrl: "/hero/hero-1.webp", date: "August 2025", departmentSlug: deptSlug },
      ]
    },
    {
      id: `batch-${deptSlug}-pg-2024`,
      name: `M.Sc. / M.A. Post-Graduate Batch 2024–2026`,
      course: "PG",
      academicYear: "2024–2026",
      studentCount: 30,
      activeCR: {
        id: `cr-${deptSlug}-pg-2024`,
        name: "Subham Kumar Sahoo",
        roleTitle: "Class Representative (2nd Year PG)",
        badge: "Active CR (2025–26 Session)",
        batchName: "2024–2026",
        program: "PG",
        academicYear: "2025–26",
        startDate: "2025-07-01",
        endDate: "2026-05-30",
        status: "Active",
        email: `cr.pg.${deptSlug}.2024@ravenshawmoments.com`,
        phone: "+91 98611 67890",
        permissions: commonCRPermissions,
      },
      historicalCRs: [
        {
          id: `cr-${deptSlug}-pg-2024-y2`,
          name: "Subham Kumar Sahoo",
          roleTitle: "Class Representative (2nd Year PG)",
          badge: "Active CR (2025–26)",
          batchName: "2024–2026",
          program: "PG",
          academicYear: "2025–26",
          startDate: "2025-07-01",
          endDate: "2026-05-30",
          status: "Active",
          email: `cr.pg.${deptSlug}.2024@ravenshawmoments.com`,
          permissions: commonCRPermissions,
        },
        {
          id: `cr-${deptSlug}-pg-2024-y1`,
          name: "Tanmayee Rath",
          roleTitle: "Class Representative (1st Year PG)",
          badge: "Former CR (2024–25)",
          batchName: "2024–2026",
          program: "PG",
          academicYear: "2024–25",
          startDate: "2024-07-15",
          endDate: "2025-05-30",
          status: "Former",
          email: `tanmayee.2024@ravenshawmoments.com`,
          permissions: [],
        }
      ],
      cr: {
        name: "Subham Kumar Sahoo",
        role: "Class Representative (2nd Year PG)",
        email: `cr.pg.${deptSlug}.2024@ravenshawmoments.com`,
      },
      students: [
        { id: `stu-${deptSlug}-pg24-1`, name: "Subham Kumar Sahoo", batch: "2024–2026", course: "PG", year: "2nd Year", verified: true },
      ],
      batchAchievements: [
        { id: `ba-10`, studentName: "Subham Kumar Sahoo", examOrAward: "Campus Placement", year: "2026", detail: "Recruited by Deloitte & PwC India Consulting (₹14.5 LPA)" },
      ],
      batchGallery: [
        { id: `bg-pg24-1`, title: "Advanced Data Colloquium & Dissertation Lab", category: "Workshops", imageUrl: "/hero/hero-3.webp", date: "February 2026", departmentSlug: deptSlug },
      ]
    },
    {
      id: `batch-${deptSlug}-phd-2024`,
      name: `Doctoral Research Scholars (2024 Admission Batch)`,
      course: "Ph.D.",
      academicYear: "2024 Admission",
      studentCount: 12,
      activeCR: {
        id: `cr-${deptSlug}-phd-2024`,
        name: "Manish Ranjan Das",
        roleTitle: "Research Coordinator",
        badge: "Research Coordinator",
        batchName: "2024 Admission",
        program: "Ph.D.",
        academicYear: "2025–26",
        startDate: "2024-08-01",
        endDate: "2026-07-31",
        status: "Active",
        email: `phd.${deptSlug}@ravenshawmoments.com`,
        phone: "+91 97761 78901",
        permissions: commonCRPermissions,
      },
      historicalCRs: [
        {
          id: `cr-${deptSlug}-phd-2024-y1`,
          name: "Manish Ranjan Das",
          roleTitle: "Research Coordinator",
          badge: "Research Coordinator",
          batchName: "2024 Admission",
          program: "Ph.D.",
          academicYear: "2025–26",
          startDate: "2024-08-01",
          endDate: "2026-07-31",
          status: "Active",
          email: `phd.${deptSlug}@ravenshawmoments.com`,
          permissions: commonCRPermissions,
        }
      ],
      cr: {
        name: "Manish Ranjan Das",
        role: "Research Coordinator",
        email: `phd.${deptSlug}@ravenshawmoments.com`,
      },
      students: [
        { id: `stu-${deptSlug}-phd1`, name: "Manish Ranjan Das", batch: "Admission Year 2024", course: "Ph.D.", year: "Senior Scholar", verified: true },
        { id: `stu-${deptSlug}-phd2`, name: "Dr. Niharika Sahoo", batch: "Admission Year 2024", course: "Ph.D.", year: "Research Fellow", verified: true },
      ],
      batchAchievements: [
        { id: `ba-11`, studentName: "Manish Ranjan Das", examOrAward: "Research Publications", year: "2025", detail: "2 Scopus Q1 Indexed Papers published in IEEE Transactions" },
        { id: `ba-12`, studentName: "Dr. Niharika Sahoo", examOrAward: "International Achievements", year: "2025", detail: "Max Planck Fellowship for Visiting Doctoral Exchange" },
      ],
      batchGallery: [
        { id: `bg-phd24-1`, title: "Annual Doctoral Colloquium & Paper Presentations", category: "Seminars", imageUrl: "/hero/hero-4.webp", date: "January 2026", departmentSlug: deptSlug },
      ]
    },
  ];





  return {
    faculty,
    currentCR,
    students,
    batches,
    gallery,
    achievements,
    programs,
  };
}
