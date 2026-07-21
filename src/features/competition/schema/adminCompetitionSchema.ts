import { z } from "zod";

const CompetitionModeEnum = z.enum(["offline", "online", "hybrid"]);
const CompetitionLevelEnum = z.enum([
  "department",
  "hostel",
  "university",
  "inter_university",
  "district",
  "state",
  "national",
  "Other",
]);

// -------------------------------------------------------------------------
// Shared Zod schemas for the RPC
// -------------------------------------------------------------------------

export const basicInformationSchema = z.object({
  title: z.string().min(1, "Title is required").max(250, "Title is too long"),
  slug: z.string().min(1, "Slug is required").max(250, "Slug is too long").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().max(500, "Short description must be 500 characters or less").optional().nullable(),
  description: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
  featuredMediaId: z.string().uuid().optional().nullable(),
});

export const scheduleModeBaseSchema = z.object({
  mode: CompetitionModeEnum,
  registrationOpenAt: z.string().datetime().optional().nullable(),
  registrationCloseAt: z.string().datetime().optional().nullable(),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
  venueName: z.string().max(250).optional().nullable(),
  venueDetails: z.string().optional().nullable(),
  reportingInstructions: z.string().optional().nullable(),
});

export const scheduleModeSchema = scheduleModeBaseSchema.superRefine((data, ctx) => {
  const dates: { name: string; date: Date; path: string }[] = [];
  if (data.registrationOpenAt) dates.push({ name: "Registration Opening", date: new Date(data.registrationOpenAt), path: "registrationOpenAt" });
  if (data.registrationCloseAt) dates.push({ name: "Registration Closing", date: new Date(data.registrationCloseAt), path: "registrationCloseAt" });
  if (data.startsAt) dates.push({ name: "Event Start", date: new Date(data.startsAt), path: "startsAt" });
  if (data.endsAt) dates.push({ name: "Event End", date: new Date(data.endsAt), path: "endsAt" });

  for (let i = 0; i < dates.length - 1; i++) {
    if (dates[i].date > dates[i+1].date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${dates[i+1].name} cannot precede ${dates[i].name}`,
        path: [dates[i+1].path],
      });
    }
  }
});

export const eligibilityBaseSchema = z.object({
  categoryId: z.string().uuid("Please select a category"),
  level: CompetitionLevelEnum,
  allowTeam: z.boolean(),
  minTeamSize: z.number().int().min(1).optional().nullable(),
  maxTeamSize: z.number().int().min(1).optional().nullable(),
  externalParticipantsAllowed: z.boolean().optional().nullable(),
  externalParticipationLevel: z.string().optional().nullable(),
  eligibleParticipantTypes: z.array(z.string()).optional().nullable(),
  eligibilityConfiguration: z.record(z.string(), z.any()).optional().nullable(),
});

export const eligibilitySchema = eligibilityBaseSchema.superRefine((data, ctx) => {
  if (data.allowTeam) {
    if (data.minTeamSize && data.maxTeamSize && data.maxTeamSize < data.minTeamSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum team size must be greater than or equal to minimum team size",
        path: ["maxTeamSize"],
      });
    }
  }
  
  if (data.externalParticipantsAllowed && data.level !== "state") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "External participants are only available for State-level competitions.",
      path: ["externalParticipantsAllowed"],
    });
  }
});

export const rulesGuidelinesSchema = z.object({
  rules: z.string().optional().nullable(),
  importantInformation: z.array(z.any()).optional().nullable(),
});

export const registrationFeeSchema = z.object({
  registrationFee: z.number().min(0).optional().nullable(),
  registrationApprovalMode: z.string().optional().nullable(),
  waitlistEnabled: z.boolean().optional().nullable(),
  refundConfiguration: z.record(z.string(), z.any()).optional().nullable(),
});

export const prizeSchema = z.object({
  position: z.number().int().min(1),
  title: z.string().min(1),
  amount: z.number().min(0).optional().nullable(),
  currency: z.string().optional().nullable(),
});

export const prizesCertificatesSchema = z.object({
  prizes: z.array(prizeSchema).optional().nullable(),
  participationCertificateEnabled: z.boolean().optional().nullable(),
  meritCertificateEnabled: z.boolean().optional().nullable(),
  winnerCertificateEnabled: z.boolean().optional().nullable(),
  certificateVerificationEnabled: z.boolean().optional().nullable(),
  certificateDeliveryMethod: z.string().optional().nullable(),
});

export const organizerSupportBaseSchema = z.object({
  organizerType: z.enum(["ravenshaw_moments", "department", "hostel", "organization"]).optional(),
  departmentId: z.string().uuid().optional().nullable(),
  hostelId: z.string().uuid().optional().nullable(),
  organizationId: z.string().uuid().optional().nullable(),
});

export const organizerSupportSchema = organizerSupportBaseSchema.superRefine((data, ctx) => {
  if (data.organizerType === "department" && !data.departmentId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a department", path: ["departmentId"] });
  }
  if (data.organizerType === "hostel" && !data.hostelId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a hostel", path: ["hostelId"] });
  }
  if (data.organizerType === "organization" && !data.organizationId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a student organization", path: ["organizationId"] });
  }
});

export const submissionConfigSchema = z.object({
  submissionRequirements: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const reviewPublishSchema = z.object({
  publicationAction: z.enum(["preserve", "draft", "publish_now", "schedule"]),
  scheduledPublishAt: z.string().datetime().optional().nullable(),
});

export const competitionDraftBaseSchema = basicInformationSchema
  .merge(scheduleModeBaseSchema)
  .merge(eligibilityBaseSchema)
  .merge(rulesGuidelinesSchema)
  .merge(registrationFeeSchema)
  .merge(prizesCertificatesSchema)
  .merge(organizerSupportBaseSchema)
  .merge(submissionConfigSchema)
  .merge(reviewPublishSchema);

export const competitionDraftSchema = competitionDraftBaseSchema.superRefine((data, ctx) => {
  const dates: { name: string; date: Date; path: string }[] = [];
  if (data.registrationOpenAt) dates.push({ name: "Registration Opening", date: new Date(data.registrationOpenAt), path: "registrationOpenAt" });
  if (data.registrationCloseAt) dates.push({ name: "Registration Closing", date: new Date(data.registrationCloseAt), path: "registrationCloseAt" });
  if (data.startsAt) dates.push({ name: "Event Start", date: new Date(data.startsAt), path: "startsAt" });
  if (data.endsAt) dates.push({ name: "Event End", date: new Date(data.endsAt), path: "endsAt" });

  for (let i = 0; i < dates.length - 1; i++) {
    if (dates[i].date > dates[i+1].date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${dates[i+1].name} cannot precede ${dates[i].name}`,
        path: [dates[i+1].path],
      });
    }
  }
  
  if (data.allowTeam) {
    if (data.minTeamSize && data.maxTeamSize && data.maxTeamSize < data.minTeamSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum team size must be greater than or equal to minimum team size",
        path: ["maxTeamSize"],
      });
    }
  }

  if (data.publicationAction === "schedule" && !data.scheduledPublishAt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A scheduled publication date is required when scheduling.",
      path: ["scheduledPublishAt"],
    });
  }
  
  if (data.publicationAction === "schedule" && data.scheduledPublishAt) {
    if (new Date(data.scheduledPublishAt) <= new Date()) {
       ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Scheduled publication date must be in the future.",
        path: ["scheduledPublishAt"],
      });
    }
  }

  const orgIds = [data.departmentId, data.hostelId, data.organizationId].filter(Boolean);
  if (orgIds.length > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select only one organizer (Department, Hostel, or Organization).",
      path: ["departmentId"],
    });
  }
});

export const competitionPublishSchema = competitionDraftSchema.and(
  z.object({
    startsAt: z.string().datetime({ message: "Start date is required for publication" }),
    endsAt: z.string().datetime({ message: "End date is required for publication" }),
  })
);

export type CompetitionDraftValues = z.infer<typeof competitionDraftSchema>;
export type CompetitionPublishValues = z.infer<typeof competitionPublishSchema>;
