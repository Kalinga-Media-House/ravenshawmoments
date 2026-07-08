import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { PrivacySettingsCard } from "@/features/profile/components/PrivacySettingsCard";

describe("Accessibility & ARIA Compliance Tests", () => {
  describe("ProfileHeader ARIA attributes", () => {
    it("should render heading hierarchy cleanly without missing labels", () => {
      render(
        <ProfileHeader
          fullName="Accessible Student"
          username="a11y_user"
          profileType="student"
        />
      );

      const heading = screen.getByRole("heading", { level: 1, name: "Accessible Student" });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("PrivacySettingsCard Form Controls", () => {
    it("should provide accessible select elements and descriptive labels", () => {
      render(
        <PrivacySettingsCard
          initialSettings={{
            profile_id: "test-profile-123",
            profile_visibility: "public",
            email_visibility: "private",
            phone_visibility: "private",
            dob_visibility: "ravenshaw_only",
            gallery_visibility: "public",
            achievements_visibility: "public",
          }}
        />
      );

      expect(screen.getByText("Overall Profile")).toBeInTheDocument();
      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("Phone Number")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Save Privacy Settings/i })).toBeInTheDocument();
    });
  });
});
