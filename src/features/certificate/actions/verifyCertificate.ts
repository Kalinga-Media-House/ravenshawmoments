"use server";

import { createClient } from "@/lib/supabase/server";
import {
  VerificationLookupResult,
  PublicCertificateDetails,
} from "../types/certificate";

export async function verifyCertificateAction(
  rawInput: string
): Promise<VerificationLookupResult> {
  const cleanCode = rawInput.trim();

  if (!cleanCode) {
    return {
      status: "Error",
      message: "Enter a certificate ID or verification code.",
    };
  }

  // Exact alphanumeric / hyphen formatting normalization
  const normalizedCode = cleanCode.toUpperCase();

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .or(
        `certificate_number.eq.${normalizedCode},qr_token.eq.${normalizedCode},public_id.eq.${normalizedCode}`
      )
      .limit(1)
      .maybeSingle();

    if (error) {
      return {
        status: "Error",
        message:
          "We could not complete the verification request. Please try again later.",
      };
    }

    if (!data) {
      return {
        status: "NotFound",
        message:
          "We could not find a publicly verifiable certificate matching the information entered. Check the certificate ID and try again.",
      };
    }

    const row = data as Record<string, unknown>;

    const isRevoked = Boolean(row.is_revoked);
    const certificateId =
      String(row.certificate_number || row.public_id || normalizedCode);
    const title = String(row.title || "Official Ravenshaw Certificate");
    const issuedOn = row.issued_on ? String(row.issued_on) : undefined;
    const issuedBy = row.issued_by ? String(row.issued_by) : "Ravenshaw Moments";
    const certType = row.certificate_type
      ? String(row.certificate_type)
      : "Achievement";

    const publicCertificate: PublicCertificateDetails = {
      certificateId,
      title,
      certificateType: certType,
      issueDate: issuedOn,
      issuingOrganization: issuedBy,
      isRevoked,
      certificateStatus: isRevoked ? "Revoked" : "Verified",
      verificationTimestamp: new Date().toISOString(),
      previewUrl: row.preview_media_url
        ? String(row.preview_media_url)
        : undefined,
      downloadUrl: row.pdf_media_url ? String(row.pdf_media_url) : undefined,
      issuerInformation: {
        issuingOrganization: issuedBy,
        issueDate: issuedOn,
      },
    };

    return {
      status: isRevoked ? "Revoked" : "Verified",
      certificate: publicCertificate,
    };
  } catch {
    return {
      status: "Error",
      message:
        "We could not complete the verification request. Please try again later.",
    };
  }
}
