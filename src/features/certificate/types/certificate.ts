export type VerificationStatusType =
  | "Verified"
  | "Valid"
  | "Revoked"
  | "Expired"
  | "Superseded"
  | "Pending"
  | "NotFound"
  | "Prepared"
  | "Error";

export interface PublicRecipientProfile {
  name: string;
  profileImage?: string;
  profileType?: string;
  department?: string;
  batch?: string;
  profileSlug?: string;
}

export interface PublicIssuerInformation {
  issuingOrganization?: string;
  department?: string;
  hostel?: string;
  organization?: string;
  authorizedRole?: string;
  issueDate?: string;
}

export interface PublicCertificateDetails {
  certificateId: string;
  title: string;
  recipientName?: string;
  certificateType?: string;
  recognitionType?: string;
  competitionName?: string;
  competitionSlug?: string;
  eventName?: string;
  eventSlug?: string;
  achievementTitle?: string;
  achievementSlug?: string;
  position?: string;
  rank?: string;
  award?: string;
  participationCategory?: string;
  department?: string;
  hostel?: string;
  organization?: string;
  teamName?: string;
  institution?: string;
  issueDate?: string;
  issuingOrganization?: string;
  certificateStatus?: VerificationStatusType;
  verificationTimestamp?: string;
  isRevoked?: boolean;
  revocationNote?: string;
  expirationDate?: string;
  supersededByUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  recipientProfile?: PublicRecipientProfile;
  issuerInformation?: PublicIssuerInformation;
}

export interface VerificationLookupResult {
  status: VerificationStatusType;
  certificate?: PublicCertificateDetails;
  message?: string;
  errorCode?: string;
}
