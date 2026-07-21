import { EventItem } from "../types/event";

export const EVENTS: EventItem[] = [
  {
    id: "evt-1",
    slug: "foundation-day-2027",
    category: "University Event",
    title: "Ravenshaw Foundation Day Celebration",
    description: "Join the Ravenshaw community in celebrating its history, achievements, traditions, and generations of inspiring journeys.",
    shortDescription: "Celebrate Ravenshaw's rich history and legacy.",
    startsAt: "2027-01-20T10:00:00Z",
    time: "10:00 AM",
    location: "Ravenshaw University Campus",
    organizerType: "University",
    organizerName: "Ravenshaw University",
    featured: true, // Marking this as featured since it was the featured event on the homepage
    href: "/events/foundation-day-2027",
    registrationRequired: false,
    registrationStatus: "Not Required",
    searchKeywords: ["foundation", "celebration", "history", "achievements", "traditions", "legacy", "university"]
  },
  {
    id: "evt-2",
    slug: "inter-department-cultural-competition-2027",
    category: "Competition",
    title: "Inter Department Cultural Competition",
    description: "Celebrate creativity, talent, music, dance, theatre, and the spirit of friendly competition across departments.",
    shortDescription: "Annual inter-department cultural competition featuring dance, music, and theatre.",
    startsAt: "2027-02-08T11:00:00Z",
    time: "11:00 AM",
    location: "Seven Pillars of Wisdom Convention Centre",
    organizerType: "University",
    href: "/events/inter-department-cultural-competition-2027",
    registrationRequired: true,
    registrationStatus: "Open",
    searchKeywords: ["competition", "cultural", "creativity", "talent", "music", "dance", "theatre", "department"],
    eventMode: "Offline",
    eligibility: "All currently enrolled Ravenshaw University students",
    contactInformation: "cultural.committee@ravenshawuniversity.ac.in",
    availableSeats: 500,
    registrationFee: 150,
    highlights: [
      "Group Dance Competition (Folk & Contemporary)",
      "Solo & Group Singing",
      "One-act plays & Theatre",
      "Celebrity Alumni Guest Judges"
    ],
    schedule: [
      {
        time: "11:00 AM",
        title: "Inauguration Ceremony",
        description: "Lighting of the lamp by the Vice Chancellor",
        venue: "Main Hall"
      },
      {
        time: "12:00 PM",
        title: "Dance Performances",
        description: "Group and Solo dance competitions begin",
        venue: "Main Hall"
      },
      {
        time: "03:30 PM",
        title: "Theatre & Drama",
        description: "One-act plays by department teams",
        venue: "Main Hall"
      }
    ],
    galleryImages: [
      { url: "/images/hero/hero-1.webp", alt: "Students performing cultural dance" },
      { url: "/images/hero/hero-2.webp", alt: "Theatre performance at Ravenshaw" }
    ],
    instructions: [
      "Participants must carry their valid University ID cards.",
      "Reporting time for participants is strictly 9:30 AM.",
      "Use of props involving fire or water is strictly prohibited on stage."
    ]
  },
  {
    id: "evt-3",
    slug: "student-research-innovation-seminar-2027",
    category: "Academic",
    title: "Student Research and Innovation Seminar",
    description: "Explore student ideas, research, innovation, academic achievements, and conversations that inspire future possibilities.",
    shortDescription: "Explore student research, innovation, and academic achievements.",
    startsAt: "2027-02-15T14:00:00Z",
    time: "2:00 PM",
    location: "Ravenshaw University",
    organizerType: "University",
    href: "/events/student-research-innovation-seminar-2027",
    registrationRequired: true,
    registrationStatus: "Open",
    searchKeywords: ["academic", "research", "innovation", "seminar", "student", "achievements"]
  },
  {
    id: "evt-4",
    slug: "hostel-cultural-evening-2027",
    category: "Hostel Event",
    title: "Hostel Cultural Evening",
    description: "An evening of friendship, performances, celebrations, traditions, and memories shared across hostel communities.",
    shortDescription: "A vibrant evening of cultural performances by hostel communities.",
    startsAt: "2027-03-05T18:00:00Z",
    time: "6:00 PM",
    location: "Ravenshaw Hostel Community",
    organizerType: "Hostel",
    href: "/events/hostel-cultural-evening-2027",
    registrationRequired: false,
    registrationStatus: "Not Required",
    searchKeywords: ["hostel", "cultural", "evening", "performances", "celebrations", "traditions", "friendship"]
  }
];
