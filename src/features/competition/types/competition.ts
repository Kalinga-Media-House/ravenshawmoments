// Represented as string to accommodate both the new centralized categories
// and legacy backward compatibility categories.
export type CompetitionCategory = string;

export type CompetitionLevel =
  | "department"
  | "hostel"
  | "university"
  | "inter_university"
  | "district"
  | "state"
  | "national"
  | "Other";

export type CompetitionStatus =
  | "Registration Opens Soon"
  | "Registration Open"
  | "Registration Closed"
  | "Upcoming"
  | "Ongoing"
  | "Completed"
  | "Results Published"
  | "Cancelled"
  | "Draft";

export type RegistrationStatus =
  | "Registration Opens Soon"
  | "Registration Open"
  | "Registration Closed"
  | "Registration Closing Soon"
  | "Registration Not Required"
  | "Seats Full"
  | "Waitlist Available";

export type OrganizerType = "University" | "Department" | "Hostel" | "Organization";

export type ParticipantType = "Student" | "Teacher" | "Alumni" | "External Participant";

export type CompetitionMode = "offline" | "online" | "hybrid";

export interface CompetitionPrize {
  id: string;
  positionName: string;
  prizeTitle: string;
  monetaryAmount: number;
  currency: string;
  includesTrophy: boolean;
  includesCertificate: boolean;
  additionalDescription?: string;
  displayOrder: number;
}

export interface HighlightItem {
  id: string;
  title?: string;
  description: string;
  displayOrder: number;
}

export interface ImportantInfoItem {
  id: string;
  content: string;
  severity?: "info" | "warning" | "alert";
  displayOrder: number;
}

export interface CertificateConfiguration {
  participationEnabled: boolean;
  meritEnabled: boolean;
  winnerEnabled: boolean;
  deliveryMethod: "digital_only" | "physical_only" | "both";
}

export interface RegistrationConfiguration {
  approvalMode: "automatic" | "manual";
  waitlistEnabled: boolean;
}

export interface CompetitionItem {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  category: CompetitionCategory;
  categoryId: string; // The canonical ID for relationships
  level: CompetitionLevel;
  
  // Timestamps
  createdAt: string;
  
  // Media
  coverImage?: string;
  imageAlt?: string;

  // Organizers
  organizerName?: string;
  organizerType?: OrganizerType;
  organizerSlug?: string;
  departmentId?: string;
  hostelId?: string;
  organizationId?: string;

  // Scheduling
  startsAt?: string; // ISO string
  endsAt?: string; // ISO string
  registrationOpenAt?: string; // ISO string
  registrationDeadline?: string; // ISO string
  submissionOpenAt?: string;
  submissionDeadline?: string;
  resultDate?: string;

  // Venue & Mode
  mode: CompetitionMode;
  venueName?: string;
  venueDetails?: string;
  reportingInstructions?: string;

  // Eligibility & Participation
  allowTeam: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  externalParticipantsAllowed: boolean;
  externalParticipationLevel?: string;
  eligibleParticipantTypes?: string[];
  eligibilityConfiguration?: any;

  // Registration
  registrationRequired: boolean;
  registrationFee?: number;
  currency?: string;
  totalSeats?: number;
  availableSeats?: number;
  
  // Prizes
  prizes: CompetitionPrize[];

  // Legal & Config
  rules?: string[];
  highlights?: HighlightItem[];
  importantInformation?: ImportantInfoItem[];
  submissionRequirements?: any;
  certificateConfiguration?: CertificateConfiguration;
  registrationConfiguration?: RegistrationConfiguration;
  internalNotes?: string;

  // Status
  status: CompetitionStatus;
  registrationStatus: RegistrationStatus;
  publishedAt?: string; // ISO string
  isFeatured?: boolean;
  
  // SEO & Routing
  href: string;
  searchKeywords?: string[];
  
  // Legacy/Computed fields for UI backward compatibility
  featured?: boolean;
  participationMode: "Individual" | "Team";
  venue: string;
  eligibility: string;
  startDate: string;
  startTime?: string;
  teamAllowed?: boolean;
  minimumTeamSize?: number;
  maximumTeamSize?: number;
  
  /** @deprecated Migrate to prizes array */
  firstPrize?: any;
  /** @deprecated Migrate to prizes array */
  secondPrize?: any;
  /** @deprecated Migrate to prizes array */
  thirdPrize?: any;
  /** @deprecated Migrate to prizes array */
  participationRecognition?: any;
  /** @deprecated */
  certificateDetails?: any;
  /** @deprecated */
  resultsData?: any;
  /** @deprecated */
  externalRegistrationUrl?: string;
  /** @deprecated */
  teamLeaderRequired?: boolean;
  /** @deprecated */
  submissionRequired?: boolean;
  /** @deprecated */
  submissionDetails?: any;
  /** @deprecated */
  schedule?: any[];
  /** @deprecated */
  tags?: string[];
  /** @deprecated */
  relatedAchievementSlugs?: string[];
  teamMemberEligibility?: string;
  
  // More legacy fields
  /** @deprecated */
  eventSlug?: string;
  /** @deprecated */
  eventName?: string;
  /** @deprecated */
  prizeInformation?: string;
  /** @deprecated */
  certificateAvailable?: boolean;
  /** @deprecated */
  resultPublished?: boolean;
  /** @deprecated */
  galleryImages?: any[];
  /** @deprecated */
  contactInformation?: any;
}
