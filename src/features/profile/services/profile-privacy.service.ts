// =============================================================================
// Ravenshaw Moments
// File      : src/features/profile/services/profile-privacy.service.ts
// Purpose   : User-Controlled Privacy Toggles & Access Control Service
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { ProfileRepository } from "@/lib/repositories/profile.repository";
import { privacySettingsSchema } from "@/lib/validation/profile-system";
import { logger } from "@/lib/logger";
import { ProfileNotFoundError } from "./profile.service";

export const profilePrivacyService = {
  /**
   * Updates user-controlled privacy toggles.
   */
  updatePrivacySettings: async (authUserId: string, rawData: Record<string, unknown>): Promise<void> => {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new ProfileRepository(supabase);

    const validated = privacySettingsSchema.parse(rawData);
    const profile = await repo.findByAuthUserId(authUserId);

    if (!profile) {
      throw new ProfileNotFoundError("Profile required to set privacy toggles.");
    }

    await repo.upsertPrivacySettings({
      profile_id: profile.id,
      ...validated,
      updated_at: new Date().toISOString(),
    });

    logger.info(`Service: Privacy settings updated for profile ${profile.id}`);
  },
};
