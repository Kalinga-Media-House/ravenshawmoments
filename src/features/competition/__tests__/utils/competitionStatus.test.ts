import { describe, it, expect } from 'vitest';
import { 
  computeCompetitionStatus, 
  computeRegistrationStatus,
  resolveFeaturedCompetition 
} from '../../utils/competitionStatus';
import { CompetitionItem } from '../../types/competition';

describe('competitionStatus', () => {
  const baseItem = {
    id: 'test-1',
    slug: 'test-1',
    title: 'Test',
    category: 'General',
    categoryId: 'cat-1',
    level: 'university',
    createdAt: new Date().toISOString(),
    registrationRequired: true,
    href: '/competitions/test-1'
  } as CompetitionItem;

  const now = new Date('2026-07-01T12:00:00Z');

  describe('resolveFeaturedCompetition', () => {
    it('returns null if no candidates', () => {
      expect(resolveFeaturedCompetition([], now)).toBeNull();
    });

    it('Priority 1: Selects Ongoing over Registration Open and Upcoming', () => {
      const ongoing: CompetitionItem = { ...baseItem, id: 'c1', startsAt: '2026-06-01T00:00:00Z', endsAt: '2026-08-01T00:00:00Z' };
      const regOpen: CompetitionItem = { ...baseItem, id: 'c2', registrationOpenAt: '2026-06-01T00:00:00Z', registrationDeadline: '2026-08-01T00:00:00Z' };
      const upcoming: CompetitionItem = { ...baseItem, id: 'c3', startsAt: '2026-09-01T00:00:00Z' };

      const result = resolveFeaturedCompetition([regOpen, upcoming, ongoing], now);
      expect(result?.id).toBe('c1');
    });

    it('Priority 2: Selects Registration Open over Upcoming', () => {
      const regOpen: CompetitionItem = { ...baseItem, id: 'c2', registrationOpenAt: '2026-06-01T00:00:00Z', registrationDeadline: '2026-08-01T00:00:00Z' };
      const upcoming: CompetitionItem = { ...baseItem, id: 'c3', startsAt: '2026-09-01T00:00:00Z' };

      const result = resolveFeaturedCompetition([upcoming, regOpen], now);
      expect(result?.id).toBe('c2');
    });

    it('Priority 3: Selects Most Recently Created Upcoming over Older Upcoming', () => {
      const upcomingNewer: CompetitionItem = { ...baseItem, id: 'c4', startsAt: '2026-09-01T00:00:00Z', createdAt: '2026-06-15T00:00:00Z', registrationOpenAt: '2026-08-01T00:00:00Z' };
      const upcomingOlder: CompetitionItem = { ...baseItem, id: 'c5', startsAt: '2026-09-01T00:00:00Z', createdAt: '2026-05-15T00:00:00Z', registrationOpenAt: '2026-08-01T00:00:00Z' };

      const result = resolveFeaturedCompetition([upcomingOlder, upcomingNewer], now);
      expect(result?.id).toBe('c4');
    });

    it('Priority 4: Fallback to nearest startsAt if createdAt ties', () => {
      const tieCreate = '2026-06-15T00:00:00Z';
      const regOpenAt = '2026-08-01T00:00:00Z'; // Ensure it's not Registration Open
      const upcomingFurther: CompetitionItem = { ...baseItem, id: 'c6', startsAt: '2026-10-01T00:00:00Z', createdAt: tieCreate, registrationOpenAt: regOpenAt };
      const upcomingNearest: CompetitionItem = { ...baseItem, id: 'c7', startsAt: '2026-09-01T00:00:00Z', createdAt: tieCreate, registrationOpenAt: regOpenAt };

      const result = resolveFeaturedCompetition([upcomingFurther, upcomingNearest], now);
      expect(result?.id).toBe('c7');
    });
  });

  describe('Registration Status', () => {
    it('returns Registration Not Required if fee is 0 and no open date', () => {
      const comp: CompetitionItem = { ...baseItem, registrationRequired: false, registrationFee: 0 };
      expect(computeRegistrationStatus(comp, now)).toBe('Registration Not Required');
    });

    it('returns Seats Full if availableSeats is 0', () => {
      const comp: CompetitionItem = { ...baseItem, registrationRequired: true, totalSeats: 100, availableSeats: 0 };
      expect(computeRegistrationStatus(comp, now)).toBe('Seats Full');
    });

    it('returns Registration Closing Soon if within threshold', () => {
      const comp: CompetitionItem = { ...baseItem, registrationRequired: true, registrationDeadline: '2026-07-01T20:00:00Z' }; // 8 hours away
      expect(computeRegistrationStatus(comp, now)).toBe('Registration Closing Soon');
    });
  });
});
