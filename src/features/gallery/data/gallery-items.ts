import { GalleryItem } from "../types/gallery";

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "mem-1",
    slug: "beautiful-evening-ravenshaw",
    title: "A Beautiful Evening at Ravenshaw",
    description: "Students enjoying a peaceful evening across the historic campus grounds.",
    category: "Campus Life",
    capturedAt: "July 2026",
    location: "Ravenshaw University Campus",
    imageUrl: "/hero/hero-1.webp",
    imageAlt: "A beautiful evening at Ravenshaw University campus",
    featured: true,
    href: "/gallery/beautiful-evening-ravenshaw",
    searchKeywords: ["campus", "evening", "peaceful", "historic", "grounds", "university"]
  },
  {
    id: "mem-2",
    slug: "celebrating-ravenshaw-excellence",
    title: "Celebrating Ravenshaw Excellence",
    description: "Honouring the dedication and achievements of our outstanding students.",
    category: "Achievements",
    capturedAt: "July 2026",
    location: "Ravenshaw University",
    imageUrl: "/hero/hero-2.webp",
    imageAlt: "Students celebrating excellence at Ravenshaw",
    featured: false,
    href: "/gallery/celebrating-ravenshaw-excellence",
    searchKeywords: ["achievement", "excellence", "outstanding", "students", "honour"]
  },
  {
    id: "mem-3",
    slug: "moments-bring-us-together",
    title: "Moments That Bring Us Together",
    description: "Building lifelong connections and collaborative spaces across academic departments.",
    category: "Departments",
    communityType: "Department",
    capturedAt: "June 2026",
    location: "Department Community",
    imageUrl: "/hero/hero-3.webp",
    imageAlt: "Department community gathering",
    featured: false,
    href: "/gallery/moments-bring-us-together",
    searchKeywords: ["department", "academic", "collaborative", "connections", "together"]
  },
  {
    id: "mem-4",
    slug: "more-than-rooms-family",
    title: "More Than Rooms, A Family",
    description: "Creating unforgettable memories and friendships within our vibrant hostels.",
    category: "Hostels",
    communityType: "Hostel",
    capturedAt: "June 2026",
    location: "Ravenshaw Hostels",
    imageUrl: "/hero/hero-4.webp",
    imageAlt: "Students sharing memories in Ravenshaw Hostels",
    featured: false,
    href: "/gallery/more-than-rooms-family",
    searchKeywords: ["hostel", "rooms", "family", "friendships", "vibrant", "residence"]
  },
  {
    id: "mem-5",
    slug: "celebrating-talent-tradition",
    title: "Celebrating Talent and Tradition",
    description: "Showcasing the incredible creativity and cultural heritage of Ravenshaw.",
    category: "Culture",
    capturedAt: "May 2026",
    location: "Ravenshaw University",
    imageUrl: "/hero/hero-5.webp",
    imageAlt: "Cultural programme at Ravenshaw",
    featured: false,
    href: "/gallery/celebrating-talent-tradition",
    searchKeywords: ["culture", "talent", "tradition", "heritage", "creativity", "programme"]
  }
];
