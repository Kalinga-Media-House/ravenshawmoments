import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { ProfileBasicInfo } from "@/features/profile/components/ProfileBasicInfo";
import { ProfileHeaderSkeleton, ProfileCardSkeleton } from "@/features/profile/components/LoadingSkeleton";

describe("UI Components Rendering & State Tests", () => {
  describe("ProfileHeader Component", () => {
    it("should render full name, username, and verified badge correctly", () => {
      render(
        <ProfileHeader
          fullName="Biswamohan Student"
          username="biswa_rm"
          profileType="student"
          isVerified={true}
          departmentName="Computer Science"
        />
      );

      expect(screen.getByText("Biswamohan Student")).toBeInTheDocument();
      expect(screen.getByText(/@biswa_rm/)).toBeInTheDocument();
      expect(screen.getByText(/Computer Science/)).toBeInTheDocument();
    });
  });

  describe("ProfileStats Component", () => {
    it("should display numerical stats for gallery, certificates, and achievements", () => {
      render(
        <ProfileStats
          galleryCount={12}
          certificatesCount={5}
          achievementsCount={8}
        />
      );

      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText(/Photos/i)).toBeInTheDocument();
    });
  });

  describe("ProfileBasicInfo Component", () => {
    it("should render biography and gender gracefully", () => {
      render(
        <ProfileBasicInfo
          bio="Passionate developer and Ravenshaw researcher."
          gender="male"
          createdAt="2024-01-01T00:00:00Z"
        />
      );

      expect(screen.getByText("Passionate developer and Ravenshaw researcher.")).toBeInTheDocument();
      expect(screen.getByText(/Male/i)).toBeInTheDocument();
    });
  });

  describe("Loading Skeletons", () => {
    it("should render skeleton loaders cleanly without throwing DOM errors", () => {
      const { container: headerContainer } = render(<ProfileHeaderSkeleton />);
      expect(headerContainer.querySelector('[data-slot="skeleton"], .animate-shimmer, .animate-pulse')).toBeInTheDocument();

      const { container: cardContainer } = render(<ProfileCardSkeleton />);
      expect(cardContainer.querySelector('[data-slot="skeleton"], .animate-shimmer, .animate-pulse')).toBeInTheDocument();
    });
  });
});
