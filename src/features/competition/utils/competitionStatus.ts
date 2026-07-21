import { CompetitionItem, RegistrationStatus, CompetitionStatus } from "../types/competition";

export const DEFAULT_COMPETITION_CURRENCY = "INR";
export const REGISTRATION_CLOSING_THRESHOLD_HOURS = 24;

export function computeCompetitionStatus(competition: CompetitionItem, now = new Date()): CompetitionStatus {
  if (competition.status === 'Cancelled' || competition.status === 'Draft') {
    return competition.status;
  }

  // NOTE: Results Published must be determined by the authoritative existence of results,
  // which should be passed into this function via competition.status if known,
  // or it relies on the service layer checking `competition_results`.
  if (competition.status === 'Results Published') {
    return 'Results Published';
  }

  const end = competition.endsAt ? new Date(competition.endsAt) : null;
  if (end && now > end) {
    return 'Completed';
  }

  const start = competition.startsAt ? new Date(competition.startsAt) : null;
  if (start && end && now >= start && now <= end) {
    return 'Ongoing';
  }

  if (competition.registrationOpenAt && competition.registrationDeadline) {
    const regOpen = new Date(competition.registrationOpenAt);
    const regClose = new Date(competition.registrationDeadline);
    if (now >= regOpen && now <= regClose) {
      return 'Registration Open';
    }
  }

  return 'Upcoming';
}

export function computeRegistrationStatus(competition: CompetitionItem, now = new Date()): RegistrationStatus {
  if (competition.status === 'Cancelled') return 'Registration Closed';
  if (competition.status === 'Results Published') return 'Registration Closed';

  const compStatus = computeCompetitionStatus(competition, now);
  if (compStatus === 'Completed') return 'Registration Closed';
  if (compStatus === 'Ongoing') return 'Registration Closed';

  if (!competition.registrationRequired && competition.registrationFee === 0) {
    return 'Registration Not Required';
  }

  if (competition.totalSeats && competition.availableSeats !== undefined && competition.availableSeats <= 0) {
    return 'Seats Full';
  }

  if (competition.registrationDeadline && now > new Date(competition.registrationDeadline)) {
    return 'Registration Closed';
  }

  if (competition.registrationOpenAt && now < new Date(competition.registrationOpenAt)) {
    return 'Registration Opens Soon';
  }

  if (competition.registrationDeadline) {
    const hoursRemaining = (new Date(competition.registrationDeadline).getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursRemaining > 0 && hoursRemaining <= REGISTRATION_CLOSING_THRESHOLD_HOURS) {
      return 'Registration Closing Soon';
    }
  }

  return 'Registration Open';
}

/**
 * Resolves the deterministic featured competition from a list of candidates.
 * Candidates must already be public, non-draft, non-cancelled, non-archived, non-deleted.
 * 
 * Priority 1: Ongoing public competition.
 * Priority 2: Registration-open public competition.
 * Priority 3: Most recently created upcoming public competition.
 * Priority 4: Nearest upcoming public competition (fallback if timestamps tie/fail).
 */
export function resolveFeaturedCompetition(candidates: CompetitionItem[], now = new Date()): CompetitionItem | null {
  if (!candidates || candidates.length === 0) return null;

  // Pre-calculate status for all candidates
  const withStatus = candidates.map(comp => ({
    comp,
    status: computeCompetitionStatus(comp, now),
    regStatus: computeRegistrationStatus(comp, now)
  }));

  // Priority 1: Ongoing
  const ongoing = withStatus.filter(c => c.status === 'Ongoing');
  if (ongoing.length > 0) {
    return ongoing.sort((a, b) => {
      // Tie-breaker: nearest end date
      const endA = a.comp.endsAt ? new Date(a.comp.endsAt).getTime() : 0;
      const endB = b.comp.endsAt ? new Date(b.comp.endsAt).getTime() : 0;
      return endA - endB;
    })[0].comp;
  }

  // Priority 2: Registration Open
  const regOpen = withStatus.filter(c => 
    c.regStatus === 'Registration Open' || c.regStatus === 'Registration Closing Soon'
  );
  if (regOpen.length > 0) {
    return regOpen.sort((a, b) => {
      // Tie-breaker: nearest registration deadline
      const deadA = a.comp.registrationDeadline ? new Date(a.comp.registrationDeadline).getTime() : Infinity;
      const deadB = b.comp.registrationDeadline ? new Date(b.comp.registrationDeadline).getTime() : Infinity;
      if (deadA !== deadB) return deadA - deadB;
      return a.comp.id.localeCompare(b.comp.id);
    })[0].comp;
  }

  // Priority 3: Upcoming (Most recently created first, fallback to nearest startsAt)
  const upcoming = withStatus.filter(c => c.status === 'Upcoming' && c.comp.startsAt && new Date(c.comp.startsAt) > now);
  if (upcoming.length > 0) {
    return upcoming.sort((a, b) => {
      const createdA = a.comp.createdAt ? new Date(a.comp.createdAt).getTime() : 0;
      const createdB = b.comp.createdAt ? new Date(b.comp.createdAt).getTime() : 0;
      
      if (createdA !== createdB) {
        return createdB - createdA; // DESC (most recently created)
      }
      
      const startA = new Date(a.comp.startsAt!).getTime();
      const startB = new Date(b.comp.startsAt!).getTime();
      if (startA !== startB) return startA - startB; // ASC (nearest starts_at)
      
      return a.comp.id.localeCompare(b.comp.id);
    })[0].comp;
  }

  // If no prioritized matches, fallback to first valid item
  return candidates[0];
}
