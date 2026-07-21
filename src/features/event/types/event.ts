export type EventCategory = 
  | "Academic" 
  | "Cultural" 
  | "Competition" 
  | "Seminar" 
  | "Workshop" 
  | "Sports" 
  | "Department" 
  | "Hostel" 
  | "Organization" 
  | "Reunion" 
  | "Celebration"
  | "Other"
  | "University Event" // Keeping existing for backwards compatibility
  | "Hostel Event";    // Keeping existing for backwards compatibility

export type EventStatus = "Upcoming" | "Ongoing" | "Past";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: EventCategory;
  imageUrl?: string;
  imageAlt?: string;
  organizerType?: "University" | "Department" | "Hostel" | "Organization";
  organizerName?: string;
  departmentName?: string;
  hostelName?: string;
  organizationName?: string;
  location?: string;
  startsAt: string; // ISO string
  endsAt?: string; // ISO string
  time?: string;
  registrationStartsAt?: string;
  registrationEndsAt?: string;
  registrationRequired: boolean;
  registrationStatus: "Open" | "Closed" | "Not Required";
  registrationFee?: number;
  featured?: boolean;
  href: string;
  searchKeywords: string[];
  
  // Optional detailed fields for Event Details page
  eventMode?: "Online" | "Offline" | "Hybrid";
  eligibility?: string;
  contactInformation?: string;
  availableSeats?: number;
  highlights?: string[];
  schedule?: {
    time: string;
    title: string;
    description?: string;
    speaker?: string;
    venue?: string;
  }[];
  galleryImages?: {
    url: string;
    alt: string;
  }[];
  instructions?: string[];
}
