import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  CategoryHero,
  CategoryActiveCompetitionCard,
  CategoryWinnersGallery,
  CategoryWinnersArchive,
  CategoryLeaderboardSection
} from "../../components/portal";

// Mock Next Navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/competitions/categories/debate",
  useSearchParams: () => new URLSearchParams()
}));

describe("Category Portal UI Components", () => {
  const dummyCategory = {
    id: "cat-1",
    name: "Debate",
    slug: "debate",
    description: "Official Ravenshaw Debate Portal",
    display_order: 10,
    is_active: true
  };

  describe("CategoryHero", () => {
    it("renders category title, description, and breadcrumb navigation", () => {
      render(<CategoryHero category={dummyCategory} />);
      expect(screen.getAllByText("Debate").length).toBeGreaterThan(0);
      expect(screen.getByText("Official Ravenshaw Debate Portal")).toBeDefined();
      expect(screen.getByText("Competitions")).toBeDefined();
    });
  });

  describe("CategoryActiveCompetitionCard", () => {
    it("renders empty state when no competition is open", () => {
      render(<CategoryActiveCompetitionCard competition={null} categoryName="Debate" />);
      expect(screen.getByText("No Active Competitions Open")).toBeDefined();
    });

    it("renders free active competition with Register Now and View Details links", () => {
      const activeComp = {
        id: "comp-1",
        slug: "debate-open",
        title: "Ravenshaw Annual Debate",
        shortDescription: "Debate event",
        level: "University" as any,
        statusLabel: "Registration Open" as const,
        registrationOpenAt: null,
        registrationCloseAt: new Date(Date.now() + 86400000).toISOString(),
        competitionDate: null,
        venueOrMode: "Main Hall",
        eligibilitySummary: "All students",
        feeLabel: "Free",
        isPaid: false,
        coverImage: "/images/competitions/debate-default.webp"
      };

      render(<CategoryActiveCompetitionCard competition={activeComp} categoryName="Debate" />);
      expect(screen.getByText("Ravenshaw Annual Debate")).toBeDefined();
      expect(screen.getByText("Free Entry")).toBeDefined();
      expect(screen.getByText("Register Now")).toBeDefined();
    });

    it("renders paid competition fee display without checkout trigger", () => {
      const paidComp = {
        id: "comp-2",
        slug: "paid-debate",
        title: "Inter-University Championship",
        shortDescription: "Paid event",
        level: "Inter-University" as any,
        statusLabel: "Registration Open" as const,
        registrationOpenAt: null,
        registrationCloseAt: null,
        competitionDate: null,
        venueOrMode: "Auditorium",
        eligibilitySummary: "Open",
        feeLabel: "₹100",
        isPaid: true,
        coverImage: "/images/competitions/debate-default.webp"
      };

      render(<CategoryActiveCompetitionCard competition={paidComp} categoryName="Debate" />);
      expect(screen.getByText("Fee: ₹100 (Payment Required)")).toBeDefined();
    });
  });

  describe("CategoryWinnersGallery", () => {
    it("renders published winners grouped by level with 1st, 2nd, and 3rd place badges", () => {
      const mockEdition = {
        editionYear: 2026,
        editionMonth: 6,
        editionDate: "2026-06-15T10:00:00Z",
        levelGroups: [
          {
            level: "university" as const,
            competitions: [
              {
                competitionId: "c-1",
                competitionSlug: "debate-cup",
                competitionTitle: "Debate Cup",
                competitionLevel: "university" as const,
                podium: [
                  {
                    resultId: "res-1",
                    outcome: "first" as const,
                    profileId: "p-1",
                    profileSlug: "p-1",
                    displayName: "Aarav Sharma",
                    publicAffiliation: "Computer Science",
                    isExternal: false
                  },
                  {
                    resultId: "res-2",
                    outcome: "second" as const,
                    profileId: "p-2",
                    profileSlug: "p-2",
                    displayName: "Meera Das",
                    publicAffiliation: "English",
                    isExternal: false
                  }
                ]
              }
            ]
          }
        ]
      };

      render(
        <CategoryWinnersGallery
          edition={mockEdition}
          categoryName="Debate"
        />
      );

      expect(screen.getByText("Current Monthly Winners")).toBeDefined();
      expect(screen.getByText("June 2026")).toBeDefined();
      expect(screen.getByText("1st Place")).toBeDefined();
      expect(screen.getByText("Aarav Sharma")).toBeDefined();
      expect(screen.getByText("2nd Place")).toBeDefined();
      expect(screen.getByText("Meera Das")).toBeDefined();
    });
  });

  describe("CategoryWinnersArchive", () => {
    it("renders archive filter selects for Year, Month, and Competition Level", () => {
      render(<CategoryWinnersArchive currentYear={2026} currentMonth={6} currentLevel="university" />);
      expect(screen.getByLabelText("Filter by year")).toBeDefined();
      expect(screen.getByLabelText("Filter by month")).toBeDefined();
      expect(screen.getByLabelText("Filter by competition level")).toBeDefined();
    });
  });

  describe("CategoryLeaderboardSection", () => {
    it("renders leaderboard table with authoritative rank, points, and podium counts", () => {
      const entries = [
        {
          rank: 1,
          profileId: "p-1",
          slug: "p-1",
          fullName: "Biswa Ranjan",
          avatarUrl: null,
          departmentOrInstitution: "Computer Science",
          profileType: "Student",
          totalPoints: 200,
          wins: 3,
          secondPlace: 1,
          thirdPlace: 0,
          podiumFinishes: 4,
          competitionsParticipated: 5
        }
      ];

      render(<CategoryLeaderboardSection entries={entries} categoryName="Debate" />);
      expect(screen.getByText("Debate Leaderboard")).toBeDefined();
      expect(screen.getByText("Biswa Ranjan")).toBeDefined();
      expect(screen.getByText("200")).toBeDefined();
    });
  });
});
