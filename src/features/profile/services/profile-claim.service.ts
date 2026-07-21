// =============================================================================
// Ravenshaw Moments
// File      : src/features/profile/services/profile-claim.service.ts
// Purpose   : Student Profile Claiming & Contribution Proof Service
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { ProfileRepository } from "@/lib/repositories/profile.repository";
import { profileClaimSchema, contributionProofSchema } from "@/lib/validation/profile-system";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/types";
import { uploadContributionProofFile } from "@/lib/storage";
import { ProfileNotFoundError } from "./profile.service";

export const profileClaimService = {
  /**
   * Submits an existing student Roll Number profile claim request.
   */
  claimProfile: async (authUserId: string, rawData: Record<string, unknown>): Promise<void> => {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new ProfileRepository(supabase);

    const validated = profileClaimSchema.parse(rawData);
    const profile = await repo.findByAuthUserId(authUserId);

    if (!profile) {
      throw new ProfileNotFoundError("Profile required before submitting claim.");
    }

    await repo.insertClaimRequest({
      profile_id: profile.id,
      claimant_auth_user_id: authUserId,
      verification_status: "pending",
      supporting_document_url: validated.supporting_document_url,
      remarks: `Claimed roll number: ${validated.roll_number}`,
    });

    logger.info(`Service: Roll number claim submitted by user ${authUserId}`);
  },

  /**
   * Submits a private supporting contribution proof document.
   */
  submitContributionProofService: async (
    authUserId: string,
    file: File,
    rawData: Record<string, unknown>
  ): Promise<ApiResponse<{ proof_id: string }>> => {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new ProfileRepository(supabase);

    const profile = await repo.findByAuthUserId(authUserId);
    if (!profile) {
      return { success: false, error: { code: "PROFILE_NOT_FOUND", message: "Profile not found." } };
    }

    // @ts-ignore
    const uploadResult = await uploadContributionProofFile(supabase, String(profile.id), file);
    if (!uploadResult.success || !uploadResult.data) {
      return { success: false, error: uploadResult.error };
    }

    const validated = contributionProofSchema.parse({
      ...rawData,
      media_file_id: uploadResult.data.media_file_id,
    });

    const proofRecord = await repo.insertContributionProof({
      profile_id: profile.id,
      media_file_id: validated.media_file_id,
      title: validated.title,
      description: validated.description,
      amount_reference: validated.amount_reference,
      verification_status: "pending",
    });

    logger.info(`Service: Contribution proof ${proofRecord.id} saved for ${profile.id}`);
    return { success: true, data: { proof_id: String(proofRecord.id) } };
  },
};
