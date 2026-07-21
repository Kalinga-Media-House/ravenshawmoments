import { createClient } from "@/lib/supabase/server";
import { USER_ROLES } from "@/constants";
import { CompetitionDraftValues } from "../schema/adminCompetitionSchema";
import { CompetitionItem } from "../types/competition";
import { mapDatabaseToCompetitionItem } from "./competitionService";

/**
 * Validates that the current authenticated user has administrative privileges.
 * Throws an error if unauthorized.
 * Returns the profile ID of the admin.
 */
async function verifyAdminAccess(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Unauthorized: Profile not found.");
  }

  // @ts-ignore
  const isAdmin = [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MODERATOR].includes(profile.role as any);
  if (!isAdmin) {
    throw new Error("Forbidden: Administrator privileges required.");
  }

  // @ts-ignore
  return profile.id;
}

export async function getAdminCompetitionById(id: string): Promise<CompetitionItem | null> {
  await verifyAdminAccess();
  
  const supabase = await createClient();

  const { data: comp, error } = await supabase
    .from("competitions")
    .select(`
      *,
      competition_categories ( id, name, slug, description ),
      media_files ( id, storage_bucket, storage_path, alt_text ),
      competition_prizes ( * )
    `)
    .eq("id", id)
    .single();

  if (error || !comp) {
    return null;
  }

  return mapDatabaseToCompetitionItem(comp);
}

/**
 * Creates or updates a competition using the atomic workflow RPC.
 * @param data Validated form payload
 * @param existingId Optional ID of existing competition
 * @returns The competition's ID
 */
export async function saveCompetitionAtomic(data: CompetitionDraftValues, existingId?: string): Promise<string> {
  const adminProfileId = await verifyAdminAccess();
  const supabase = await createClient();

  let competitionId = existingId;
  let isNew = false;

  // 1. Create Skeleton Row if New
  if (!competitionId) {
    isNew = true;
    const skeletonPayload = {
      title: data.title,
      slug: data.slug.toLowerCase().trim(),
      category_id: data.categoryId,
      competition_status: "draft",
      is_public: false,
      created_by: adminProfileId,
    };

    const { data: result, error: insertError } = await supabase
      .from("competitions")
      // @ts-ignore
      .insert([skeletonPayload])
      .select("id")
      .single();

    if (insertError) {
      console.error("Error creating competition skeleton:", insertError);
      if (insertError.code === '23505' && insertError.message.includes('slug')) {
        throw new Error(`The slug "${skeletonPayload.slug}" is already in use.`);
      }
      throw new Error("Failed to create competition skeleton.");
    }
    // @ts-ignore
    competitionId = result.id;
  }

  if (!competitionId) throw new Error("Competition ID not found.");

  // 2. Prepare RPC Payload
  const { publicationAction } = data;
  let isPublic = false;
  let scheduledPublishAt = null;

  if (publicationAction === "publish_now") {
    isPublic = true;
  } else if (publicationAction === "schedule" && data.scheduledPublishAt) {
    isPublic = true;
    scheduledPublishAt = data.scheduledPublishAt;
  } else if (publicationAction === "draft") {
    isPublic = false;
  } else if (publicationAction === "preserve") {
    // If preserve, omit is_public and scheduled_publish_at to keep existing state,
    // or we fetch existing if needed. The RPC allows missing fields (doesn't mutate them).
    // Actually, we must supply them if we want to change them.
    // If we omit them, the RPC does `COALESCE(p_payload->>'is_public', ...)` Wait, no, Migration 045 checks `jsonb_object_keys(p_payload)`. 
    // If key is present, it updates it. So we omit the keys entirely for 'preserve'.
  }

  const rpcPayload: Record<string, any> = {
    title: data.title,
    slug: data.slug.toLowerCase().trim(),
    category_id: data.categoryId,
    short_description: data.shortDescription || null,
    description: data.description || null,
    rules: data.rules || null,
    important_information: data.importantInformation || null,
    competition_level: data.level,
    competition_mode: data.mode,
    min_team_size: data.minTeamSize || null,
    max_team_size: data.maxTeamSize || null,
    starts_at: data.startsAt || null,
    ends_at: data.endsAt || null,
    registration_open_at: data.registrationOpenAt || null,
    registration_close_at: data.registrationCloseAt || null,
    registration_fee: data.registrationFee !== undefined ? data.registrationFee : null,
    registration_approval_mode: data.registrationApprovalMode || null,
    waitlist_enabled: data.waitlistEnabled || false,
    participation_certificate_enabled: data.participationCertificateEnabled || false,
    merit_certificate_enabled: data.meritCertificateEnabled || false,
    winner_certificate_enabled: data.winnerCertificateEnabled || false,
    certificate_verification_enabled: data.certificateVerificationEnabled || false,
    certificate_delivery_method: data.certificateDeliveryMethod || null,
    featured_media_id: data.featuredMediaId || null,
    department_id: data.organizerType === "department" ? (data.departmentId || null) : null,
    hostel_id: data.organizerType === "hostel" ? (data.hostelId || null) : null,
    organization_id: data.organizerType === "organization" ? (data.organizationId || null) : null,
    venue_name: data.venueName || null,
    allow_team: data.allowTeam || false,
    eligible_participant_types: data.eligibleParticipantTypes || null,
    submission_requirements: data.submissionRequirements || null,
    refund_configuration: data.refundConfiguration || null,
    prizes: data.prizes || null,
    eligibility_configuration: data.eligibilityConfiguration || null,
    external_participants_allowed: data.externalParticipantsAllowed || false,
    external_participation_level: data.externalParticipationLevel || null,
  };

  if (publicationAction !== "preserve") {
    rpcPayload.is_public = isPublic;
    rpcPayload.scheduled_publish_at = scheduledPublishAt;
  }

  // 3. Call RPC
  // @ts-ignore
  const { error: rpcError } = await supabase.rpc("save_competition_workflow", {
    p_competition_id: competitionId,
    p_payload: rpcPayload,
  });

  if (rpcError) {
    console.error("RPC Error:", rpcError);
    // If it was a new skeleton, we should ideally delete it on failure to prevent orphans.
    if (isNew) {
      await supabase.from("competitions").delete().eq("id", competitionId);
    }
    
    // Attempt to extract friendly message if it's a validation error
    throw new Error(rpcError.message || "Validation failed during atomic save.");
  }

  // Fields not in the Migration 045 allowlist (internal_notes, venue_details, reporting_instructions)
  // have been marked as (Deferred) in the UI and are not persisted here to strictly adhere to the atomic single-RPC workflow constraint.

  return competitionId;
}
