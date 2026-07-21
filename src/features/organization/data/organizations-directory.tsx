import React from "react";
import { 
  Shield, 
  HeartHandshake, 
  Activity, 
  Trophy, 
  Music, 
  BookOpen,
  FlaskConical,
  TrendingUp,
  Users
} from "lucide-react";
import { OrganizationDirectoryItem } from "../types/directory";

export const DIRECTORY_ORGANIZATIONS: OrganizationDirectoryItem[] = [
  {
    id: "org-ncc",
    name: "National Cadet Corps",
    shortName: "NCC",
    slug: "ncc",
    category: "Service and Social Impact",
    shortDescription: "Building discipline, leadership, courage, service, and friendships through experiences that remain for life.",
    icon: <Shield className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/organizations/ncc",
    searchKeywords: ["ncc", "cadet", "corps", "service", "leadership", "discipline"]
  },
  {
    id: "org-nss",
    name: "National Service Scheme",
    shortName: "NSS",
    slug: "nss",
    category: "Service and Social Impact",
    shortDescription: "Connecting students through community service, social responsibility, meaningful action, and memories created while serving together.",
    icon: <HeartHandshake className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/organizations/nss",
    searchKeywords: ["nss", "service", "scheme", "social", "responsibility", "community"]
  },
  {
    id: "org-yrc",
    name: "Youth Red Cross",
    shortName: "YRC",
    slug: "youth-red-cross",
    category: "Service and Social Impact",
    shortDescription: "Dedicated to health, service, compassion, and shared experiences in helping others within and beyond the campus.",
    icon: <Activity className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/organizations/youth-red-cross",
    searchKeywords: ["yrc", "youth", "red", "cross", "service", "health", "compassion"]
  },
  {
    id: "org-sports",
    name: "Sports Community",
    slug: "sports-community",
    category: "Sports and Wellness",
    shortDescription: "Celebrating teamwork, determination, sporting achievements, campus competitions, and the friendships created beyond the field.",
    icon: <Trophy className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/organizations/sports-community",
    searchKeywords: ["sports", "athletic", "club", "wellness", "teamwork", "competitions", "athletics"]
  },
  {
    id: "org-cultural",
    name: "Cultural Community",
    slug: "cultural-community",
    category: "Culture and Creativity",
    shortDescription: "A space where creativity, music, dance, theatre, art, traditions, and unforgettable performances bring Ravenshawvians together.",
    icon: <Music className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/organizations/cultural-community",
    searchKeywords: ["cultural", "arts", "society", "creativity", "music", "dance", "theatre", "traditions", "dramatic"]
  },
  {
    id: "org-literary",
    name: "Literary Community",
    slug: "literary-community",
    category: "Culture and Creativity",
    shortDescription: "Encouraging ideas, writing, debate, expression, creativity, and conversations that inspire generations of students.",
    icon: <BookOpen className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/organizations/literary-community",
    searchKeywords: ["literary", "society", "ideas", "expression", "writing", "debate", "creativity"]
  },
  {
    id: "org-science",
    name: "Science Society",
    slug: "science-society",
    category: "Innovation and Professional Development",
    shortDescription: "Bringing together students passionate about scientific inquiry, innovation, academic events, and collaborative discovery.",
    icon: <FlaskConical className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/organizations/science-society",
    searchKeywords: ["science", "society", "innovation", "development", "academic", "inquiry"]
  },
  {
    id: "org-commerce",
    name: "Commerce Society",
    slug: "commerce-society",
    category: "Innovation and Professional Development",
    shortDescription: "Empowering students through events, discussions, professional development, and collaborative experiences in commerce and business.",
    icon: <TrendingUp className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/organizations/commerce-society",
    searchKeywords: ["commerce", "society", "business", "innovation", "development", "professional"]
  },
  {
    id: "org-student-union",
    name: "Student Union",
    slug: "student-union",
    category: "Leadership and Student Life",
    shortDescription: "Representing student voices, organizing campus events, developing leadership skills, and shaping the everyday student life at Ravenshaw.",
    icon: <Users className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/organizations/student-union",
    searchKeywords: ["student", "union", "leadership", "life", "voices", "events", "representation"]
  }
];
