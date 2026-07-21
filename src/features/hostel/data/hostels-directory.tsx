import React from "react";
import { 
  Building2, 
  Home, 
  Castle, 
  Landmark, 
  BookMarked,
  Trees,
  Flower2
} from "lucide-react";
import { HostelDirectoryItem } from "../types/directory";

export const DIRECTORY_HOSTELS: HostelDirectoryItem[] = [
  // Boys' Hostels
  {
    id: "hostel-east",
    name: "East Hostel",
    slug: "east-hostel",
    genderCategory: "Boys' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with East Hostel.",
    icon: <Building2 className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/east-hostel",
    searchKeywords: ["east", "boys", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-west",
    name: "West Hostel",
    slug: "west-hostel",
    genderCategory: "Boys' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with West Hostel.",
    icon: <Home className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/west-hostel",
    searchKeywords: ["west", "boys", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-jc",
    name: "J.C. Hostel",
    slug: "jc-hostel",
    genderCategory: "Boys' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with J.C. Hostel.",
    icon: <Landmark className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/jc-hostel",
    searchKeywords: ["jc", "j.c.", "boys", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-new",
    name: "New Hostel",
    slug: "new-hostel",
    genderCategory: "Boys' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with New Hostel.",
    icon: <Castle className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/new-hostel",
    searchKeywords: ["new", "boys", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-new-pg",
    name: "New P.G. Hostel",
    slug: "new-pg-hostel",
    genderCategory: "Boys' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with New P.G. Hostel.",
    icon: <Building2 className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/new-pg-hostel",
    searchKeywords: ["new pg", "new p.g.", "boys", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-dharmapada",
    name: "Dharmapada Hostel",
    slug: "dharmapada-hostel",
    genderCategory: "Boys' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with Dharmapada Hostel.",
    icon: <Home className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/dharmapada-hostel",
    searchKeywords: ["dharmapada", "boys", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-lalitgiri",
    name: "Lalitgiri Hostel",
    slug: "lalitgiri-hostel",
    genderCategory: "Boys' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with Lalitgiri Hostel.",
    icon: <Trees className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/lalitgiri-hostel",
    searchKeywords: ["lalitgiri", "boys", "hostel", "accommodation", "residence"]
  },

  // Girls' Hostels
  {
    id: "hostel-parija",
    name: "Parija Hostel",
    slug: "parija-hostel",
    genderCategory: "Girls' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with Parija Hostel.",
    icon: <Flower2 className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/parija-hostel",
    searchKeywords: ["parija", "girls", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-kathajodi",
    name: "Kathajodi Hostel",
    slug: "kathajodi-hostel",
    genderCategory: "Girls' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with Kathajodi Hostel.",
    icon: <BookMarked className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/kathajodi-hostel",
    searchKeywords: ["kathajodi", "girls", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-bhargabi",
    name: "Bhargabi Hostel",
    slug: "bhargabi-hostel",
    genderCategory: "Girls' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with Bhargabi Hostel.",
    icon: <Landmark className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/bhargabi-hostel",
    searchKeywords: ["bhargabi", "girls", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-devi",
    name: "Devi Hostel",
    slug: "devi-hostel",
    genderCategory: "Girls' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with Devi Hostel.",
    icon: <Building2 className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/devi-hostel",
    searchKeywords: ["devi", "girls", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-daya",
    name: "Daya Hostel",
    slug: "daya-hostel",
    genderCategory: "Girls' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with Daya Hostel.",
    icon: <Castle className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/daya-hostel",
    searchKeywords: ["daya", "girls", "hostel", "accommodation", "residence"]
  },
  {
    id: "hostel-mahanadi",
    name: "Mahanadi Hostel",
    slug: "mahanadi-hostel",
    genderCategory: "Girls' Hostels",
    shortDescription: "Explore students, alumni, teachers, batches, memories, events, achievements, and stories connected with Mahanadi Hostel.",
    icon: <Home className="w-5 h-5 text-[#D9A441]" aria-hidden="true" />,
    href: "/hostels/mahanadi-hostel",
    searchKeywords: ["mahanadi", "girls", "hostel", "accommodation", "residence"]
  }
];
