import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { CompetitionItem, CompetitionPrize } from "../types/competition";
import { computeCompetitionStatus, computeRegistrationStatus, DEFAULT_COMPETITION_CURRENCY } from "../utils/competitionStatus";
import { getCompetitionFallbackImage } from "../utils/images";

export function applyPublicVisibilityFilters(query: any) {
  const now = new Date().toISOString();
  return query
    .eq('is_public', true)
    .in('competition_status', ['registration_open', 'registration_closed', 'submission_open', 'submission_closed', 'judging', 'completed'])
    .not('published_at', 'is', null)
    .lte('published_at', now)
    .or(`scheduled_publish_at.is.null,scheduled_publish_at.lte."${now}"`);
}

export function mapDatabaseToCompetitionItem(comp: any, activeRegistrations?: number, hasResults?: boolean): CompetitionItem {
  // Map fields needed for status computation first
  const mappedComp: any = {
    ...comp,
    status: hasResults ? "Results Published" : (comp.competition_status === 'draft' ? 'Draft' : comp.competition_status === 'cancelled' ? 'Cancelled' : 'To be announced'),
    endsAt: comp.ends_at,
    startsAt: comp.starts_at,
    registrationOpenAt: comp.registration_open_at,
    registrationDeadline: comp.registration_close_at,
    registrationFee: comp.registration_fee !== null ? Number(comp.registration_fee) : undefined,
    registrationRequired: !!comp.registration_open_at,
    totalSeats: comp.max_participants,
    availableSeats: comp.max_participants !== null && activeRegistrations !== undefined ? Math.max(0, comp.max_participants - activeRegistrations) : comp.max_participants,
  };

  const status = computeCompetitionStatus(mappedComp);
  mappedComp.status = status; // Re-assign the computed status
  const registrationStatus = computeRegistrationStatus(mappedComp);

  const prizes: CompetitionPrize[] = comp.competition_prizes ? comp.competition_prizes.map((p: any) => ({
    id: p.id,
    positionName: p.position_name,
    prizeTitle: p.prize_title,
    monetaryAmount: p.monetary_amount,
    currency: p.currency || DEFAULT_COMPETITION_CURRENCY,
    includesTrophy: p.includes_trophy,
    includesCertificate: p.includes_certificate,
    additionalDescription: p.additional_description,
    displayOrder: p.display_order
  })) : [];

  return {
    id: comp.id,
    slug: comp.slug,
    title: comp.title,
    shortDescription: comp.short_description || comp.description?.substring(0, 150) || "",
    fullDescription: comp.description || "",
    category: comp.competition_categories?.name || "Other",
    categoryId: comp.category_id,
    level: comp.competition_level || "university",
    createdAt: comp.created_at,
    
    // Media
    coverImage: (comp.media_files?.storage_bucket && comp.media_files?.storage_path) 
      ? `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(comp.media_files.storage_bucket)}/${comp.media_files.storage_path.split('/').map((s: string) => encodeURIComponent(s)).join('/')}`
      : getCompetitionFallbackImage(comp.competition_categories?.name),
    imageAlt: comp.title,

    // Organizers
    organizerName: comp.departments?.name || comp.hostels?.name || comp.organizations?.name || "Ravenshaw Moments",
    organizerType: comp.departments ? "Department" : comp.hostels ? "Hostel" : comp.organizations ? "Organization" : comp.profiles ? "University" : undefined,
    organizerSlug: comp.departments?.slug || comp.hostels?.slug || comp.organizations?.slug || undefined,
    departmentId: comp.department_id || undefined,
    hostelId: comp.hostel_id || undefined,
    organizationId: comp.organization_id || undefined,

    // Scheduling
    startsAt: comp.starts_at,
    endsAt: comp.ends_at,
    registrationOpenAt: comp.registration_open_at,
    registrationDeadline: comp.registration_close_at,
    submissionOpenAt: comp.submission_open_at,
    submissionDeadline: comp.submission_close_at,
    resultDate: comp.result_date,

    // Venue & Mode
    mode: comp.mode || "offline",
    venueName: comp.venue_name,
    venueDetails: comp.venue_details,
    reportingInstructions: comp.reporting_instructions,

    // Eligibility & Participation
    allowTeam: comp.allow_team || false,
    minTeamSize: comp.min_team_size,
    maxTeamSize: comp.max_team_size,
    externalParticipantsAllowed: comp.external_participants_allowed || false,
    externalParticipationLevel: comp.external_participation_level,
    eligibleParticipantTypes: comp.eligible_participant_types || [],
    eligibilityConfiguration: comp.eligibility_configuration,

    // Registration
    registrationRequired: !!comp.registration_open_at,
    registrationFee: mappedComp.registrationFee,
    currency: DEFAULT_COMPETITION_CURRENCY,
    totalSeats: comp.max_participants,
    availableSeats: mappedComp.availableSeats,
    
    // Prizes
    prizes: prizes,

    // Legal & Config
    rules: comp.rules ? comp.rules.split("\n") : [],
    highlights: comp.highlights || [],
    importantInformation: comp.important_information || [],
    submissionRequirements: comp.submission_requirements,

    // Legacy UI mapping fields
    startDate: comp.starts_at || comp.registration_open_at || new Date().toISOString(),
    startTime: comp.starts_at ? new Date(comp.starts_at).toLocaleTimeString() : undefined,
    venue: comp.venue_name || "Ravenshaw Campus",
    internalNotes: comp.internal_notes,
    participationMode: comp.allow_team ? "Team" : "Individual",
    teamAllowed: comp.allow_team || false,
    minimumTeamSize: comp.min_team_size,
    maximumTeamSize: comp.max_team_size,
    teamMemberEligibility: comp.eligibility_configuration?.teamMemberEligibility || "All team members must meet general eligibility.",
    eligibility: comp.eligible_participant_types?.join(", ") || (comp.eligibility_configuration ? JSON.stringify(comp.eligibility_configuration) : "Open to all"),
    searchKeywords: [comp.title, comp.competition_categories?.name || ""].filter(Boolean),
    
    // Status
    status,
    registrationStatus,
    
    // SEO & Routing
    href: `/competitions/${comp.slug}`
  };
}

export async function getCompetitions(): Promise<CompetitionItem[]> {
  const supabase = await createClient();

  try {
    const query = supabase
      .from("competitions")
      .select(`
        *,
        competition_categories ( name ),
        departments ( name, slug ),
        hostels ( name, slug ),
        organizations ( name, slug ),
        profiles:created_by ( full_name ),
        media_files:featured_media_id ( storage_bucket, storage_path ),
        competition_prizes ( * )
      `);

    applyPublicVisibilityFilters(query).order("created_at", { ascending: false });

    const { data: competitions, error } = await query;

    if (error) {
      console.error("Error fetching competitions:", error);
      return [];
    }

    if (!competitions || competitions.length === 0) {
      return [];
    }

    return competitions.map(c => mapDatabaseToCompetitionItem(c));
  } catch (err) {
    console.error("Failed to fetch competitions:", err);
    return [];
  }
}

export async function getCompetitionBySlug(slug: string): Promise<CompetitionItem | null> {
  const supabase = await createClient();

  try {
    const query = supabase
      .from("competitions")
      .select(`
        *,
        competition_categories ( name ),
        departments ( name, slug ),
        hostels ( name, slug ),
        organizations ( name, slug ),
        profiles:created_by ( full_name ),
        media_files:featured_media_id ( storage_bucket, storage_path ),
        competition_prizes ( * )
      `)
      .eq("slug", slug);

    const finalQuery = applyPublicVisibilityFilters(query).single();
    
    const { data: comp, error } = await finalQuery;

    if (error || !comp) {
      console.error("Competition not found:", error);
      return null;
    }

    // 1. Authoritative check for results existence
    const { data: resultsData } = await supabase
      .from("competition_results")
      .select("id")
      .eq("competition_id", comp.id)
      .eq("result_status", "published")
      .limit(1);
    
    const hasResults = !!(resultsData && resultsData.length > 0);

    // 2. Authoritative check for capacity
    let activeRegistrations: number | undefined;
    if (comp.max_participants) {
      const { count } = await supabase
        .from("competition_registrations")
        .select("id", { count: "exact", head: true })
        .eq("competition_id", comp.id)
        .in("registration_status", ["registered", "submitted"]);
      activeRegistrations = count || 0;
    }

    return mapDatabaseToCompetitionItem(comp, activeRegistrations, hasResults);
  } catch (err) {
    console.error("Failed to fetch competition:", err);
    return null;
  }
}

export async function getRelatedCompetitions(
  categoryId: string, 
  excludeId: string, 
  level: string, 
  limit: number = 3
): Promise<CompetitionItem[]> {
  const supabase = await createClient();
  const results: CompetitionItem[] = [];
  const selectedIds = new Set<string>();
  selectedIds.add(excludeId);

  const baseQuery = () => {
    const q = supabase
    .from("competitions")
    .select(`
      *,
      competition_categories ( name ),
      departments ( name, slug ),
      hostels ( name, slug ),
      organizations ( name, slug ),
      profiles:created_by ( full_name ),
      media_files:featured_media_id ( storage_bucket, storage_path ),
      competition_prizes ( * )
    `);
    return applyPublicVisibilityFilters(q);
  };

  // Priority 1: Same category
  if (results.length < limit) {
    const { data: catData } = await baseQuery()
      .eq('category_id', categoryId)
      .neq('id', excludeId)
      .order('starts_at', { ascending: true, nullsFirst: false })
      .order('id', { ascending: true })
      .limit(limit);
      
    if (catData) {
      catData.forEach((c: any) => {
        if (!selectedIds.has(c.id)) {
          results.push(mapDatabaseToCompetitionItem(c));
          selectedIds.add(c.id);
        }
      });
    }
  }

  // Priority 2: Same level
  if (results.length < limit) {
    const { data: levelData } = await baseQuery()
      .eq('competition_level', level)
      .not('id', 'in', Array.from(selectedIds))
      .order('starts_at', { ascending: true, nullsFirst: false })
      .order('id', { ascending: true })
      .limit(limit - results.length);
      
    if (levelData) {
      levelData.forEach((c: any) => {
        if (!selectedIds.has(c.id)) {
          results.push(mapDatabaseToCompetitionItem(c));
          selectedIds.add(c.id);
        }
      });
    }
  }

  // Priority 3: Upcoming
  if (results.length < limit) {
    const nowISO = new Date().toISOString();
    const { data: upcomingData } = await baseQuery()
      .gt('starts_at', nowISO)
      .not('id', 'in', Array.from(selectedIds))
      .order('starts_at', { ascending: true })
      .order('id', { ascending: true })
      .limit(limit - results.length);
      
    if (upcomingData) {
      upcomingData.forEach((c: any) => {
        if (!selectedIds.has(c.id)) {
          results.push(mapDatabaseToCompetitionItem(c));
          selectedIds.add(c.id);
        }
      });
    }
  }

  // Priority 4: Other active
  if (results.length < limit) {
    const { data: otherData } = await baseQuery()
      .not('id', 'in', Array.from(selectedIds))
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .limit(limit - results.length);
      
    if (otherData) {
      otherData.forEach((c: any) => {
        if (!selectedIds.has(c.id)) {
          results.push(mapDatabaseToCompetitionItem(c));
          selectedIds.add(c.id);
        }
      });
    }
  }

  return results.slice(0, limit);
}

export async function getPreviousCompetition(currentStartsAt: string | undefined, currentId: string): Promise<CompetitionItem | null> {
  if (!currentStartsAt) return null;
  const supabase = await createClient();

  const getBaseQuery = () => {
    const q = supabase
    .from("competitions")
    .select(`
      *,
      competition_categories ( name ),
      departments ( name, slug ),
      hostels ( name, slug ),
      organizations ( name, slug ),
      profiles:created_by ( full_name ),
      media_files:featured_media_id ( storage_bucket, storage_path ),
      competition_prizes ( * )
    `);
    return applyPublicVisibilityFilters(q).not('starts_at', 'is', null);
  };

  // Fallback compound logic using two bounded queries since PostgREST OR across cols is tricky
  // 1. Same timestamp, lesser ID
  const { data: sameDateData } = await getBaseQuery()
    .eq('starts_at', currentStartsAt)
    .lt('id', currentId)
    .order('starts_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(1);

  if (sameDateData && sameDateData.length > 0) {
    return mapDatabaseToCompetitionItem(sameDateData[0]);
  }

  // 2. Strictly older timestamp
  const { data: olderData } = await getBaseQuery()
    .lt('starts_at', currentStartsAt)
    .order('starts_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(1);

  if (olderData && olderData.length > 0) {
    return mapDatabaseToCompetitionItem(olderData[0]);
  }

  return null;
}

export async function getNextCompetition(currentStartsAt: string | undefined, currentId: string): Promise<CompetitionItem | null> {
  if (!currentStartsAt) return null;
  const supabase = await createClient();

  const getBaseQuery = () => {
    const q = supabase
    .from("competitions")
    .select(`
      *,
      competition_categories ( name ),
      departments ( name, slug ),
      hostels ( name, slug ),
      organizations ( name, slug ),
      profiles:created_by ( full_name ),
      media_files:featured_media_id ( storage_bucket, storage_path ),
      competition_prizes ( * )
    `);
    return applyPublicVisibilityFilters(q).not('starts_at', 'is', null);
  };

  // 1. Same timestamp, greater ID
  const { data: sameDateData } = await getBaseQuery()
    .eq('starts_at', currentStartsAt)
    .gt('id', currentId)
    .order('starts_at', { ascending: true })
    .order('id', { ascending: true })
    .limit(1);

  if (sameDateData && sameDateData.length > 0) {
    return mapDatabaseToCompetitionItem(sameDateData[0]);
  }

  // 2. Strictly newer timestamp
  const { data: newerData } = await getBaseQuery()
    .gt('starts_at', currentStartsAt)
    .order('starts_at', { ascending: true })
    .order('id', { ascending: true })
    .limit(1);

  if (newerData && newerData.length > 0) {
    return mapDatabaseToCompetitionItem(newerData[0]);
  }

  return null;
}

