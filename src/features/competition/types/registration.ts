import { CompetitionItem, ParticipantType } from "./competition";

export type ParticipantOrigin = "Ravenshawvian" | "External";

export type RavenshawParticipantType = "Student" | "Teacher" | "Alumni";

export type AcademicLevel = "+2" | "UG" | "PG" | "PhD";

export type EligibilityEvaluationStatus =
  | "Eligible"
  | "Eligibility Review Required"
  | "Not Eligible";

export type RegistrationStep = 1 | 2 | 3 | 4;

export interface TeamMemberInput {
  id: string;
  fullName: string;
  origin: ParticipantOrigin;
  institutionName?: string;
  academicLevel: AcademicLevel;
  departmentName?: string;
  batchOrSession?: string;
  email?: string;
}

export interface CompetitionRegistrationFormData {
  // Origin & Connection
  participantOrigin: ParticipantOrigin;
  ravenshawParticipantType: RavenshawParticipantType;

  // Ravenshaw Student fields
  fullName: string;
  academicLevel: AcademicLevel;
  department: string;
  batchOrSession: string;
  rollOrRegistrationNumber: string;
  hostelName: string;
  organizationName: string;

  // Ravenshaw Teacher fields
  teacherDesignation: string;
  teacherAppointmentYear: string;

  // Ravenshaw Alumni fields
  alumniGraduationBatch: string;

  // External Participant fields
  externalInstitutionName: string;
  externalAcademicLevel: AcademicLevel;
  externalProgramme: string;
  externalDepartment: string;
  externalBatch: string;
  externalStudentId: string;

  // Participation Details
  participationMode: "Individual" | "Team";
  teamName: string;
  teamLeaderName: string;
  teamMembers: TeamMemberInput[];

  // Contact Information
  email: string;
  phone: string;

  // Additional Information
  previousExperience: string;
  accessibilitySupportNeeded: boolean;
  accessibilitySupportDetails: string;

  // Rules Confirmation
  ruleAgreement: boolean;
  accuracyConfirmation: boolean;
  verificationAcknowledgement: boolean;
}

export interface EligibilityEvaluationResult {
  status: EligibilityEvaluationStatus;
  headline: string;
  message: string;
  details?: string[];
}
