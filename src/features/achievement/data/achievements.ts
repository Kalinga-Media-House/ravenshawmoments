import { AchievementItem } from "../types/achievement";

// TODO: Replace with Supabase integration
// These records are sourced from the verified TEMPORARY_ACHIEVEMENTS on the homepage.
export const ACHIEVEMENT_ITEMS: AchievementItem[] = [
  {
    id: "ach-1",
    slug: "a-journey-of-dedication",
    title: "Turning Dreams Into Achievements",
    shortDescription: "A story of determination, learning, perseverance, and the courage to continue moving forward through every challenge.",
    category: "Academic",
    level: "Institutional",
    achieverType: "Student",
    achieverName: "A Journey of Dedication", // As per homepage data structure mapping
    achievedAt: "2026-01-01T00:00:00Z", // Approximated from "2026"
    publishedAt: "2026-01-01T00:00:00Z",
    featured: true,
    verified: true,
    tags: ["Academic Excellence", "Dedication"]
  },
  {
    id: "ach-2",
    slug: "leading-through-service",
    title: "Creating Change Together",
    shortDescription: "Celebrating students who transform ideas into meaningful action and inspire others through leadership, responsibility, and service.",
    category: "Leadership",
    level: "Institutional",
    achieverType: "Student", // Derived from "Student Community"
    achieverName: "Leading Through Service",
    achievedAt: "2026-01-01T00:00:00Z",
    publishedAt: "2026-01-01T00:00:00Z",
    featured: false,
    verified: true,
    tags: ["Leadership and Service", "Action"]
  },
  {
    id: "ach-3",
    slug: "beyond-the-classroom",
    title: "Where Passion Finds Its Stage",
    shortDescription: "Honouring creativity, innovation, culture, talent, and the confidence to share meaningful ideas with the world.",
    category: "Culture",
    level: "Institutional",
    achieverType: "Team", // Derived from "Ravenshaw Community"
    achieverName: "Beyond the Classroom",
    achievedAt: "2026-01-01T00:00:00Z",
    publishedAt: "2026-01-01T00:00:00Z",
    featured: false,
    verified: true,
    tags: ["Talent", "Creativity"]
  }
];

export const getAchievementBySlug = (slug: string): AchievementItem | undefined =>
  ACHIEVEMENT_ITEMS.find((item) => item.slug === slug);
