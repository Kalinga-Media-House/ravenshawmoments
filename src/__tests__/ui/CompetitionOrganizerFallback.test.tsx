import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CompetitionRegistrationSidebar } from "../../features/competition/components/CompetitionRegistrationSidebar";
import { CompetitionItem } from "../../features/competition/types/competition";
import React from "react";

describe("CompetitionOrganizer Fallback Logic", () => {
  const baseCompetition: CompetitionItem = {
    id: "comp-1",
    slug: "comp-1",
    title: "Test Competition",
    category: "Test Category",
    categoryId: "test-category",
    level: "university",
    createdAt: new Date().toISOString(),
    status: "Registration Open",
    registrationStatus: "Registration Open",
    registrationRequired: true,
    registrationFee: 0,
    allowTeam: false,
    externalParticipantsAllowed: false,
    prizes: [],
    mode: "offline",
    venue: "Main Hall",
    href: "/competitions/comp-1",
    participationMode: "Individual",
    eligibility: "Open to all",
    startDate: new Date().toISOString(),
  };

  it("should hide the organizer section when organizerName is undefined (missing organizer)", () => {
    const comp = { ...baseCompetition, organizerName: undefined };
    render(<CompetitionRegistrationSidebar competition={comp} />);
    
    // "Organized By" heading should not be present
    expect(screen.queryByText("Organized By")).not.toBeInTheDocument();
  });

  it("should display a valid department organizer", () => {
    const comp = { ...baseCompetition, organizerName: "Computer Science", organizerType: "Department" as const };
    render(<CompetitionRegistrationSidebar competition={comp} />);
    
    expect(screen.getByText("Organized By")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
  });

  it("should display a valid hostel organizer", () => {
    const comp = { ...baseCompetition, organizerName: "Mahanadi Hostel", organizerType: "Hostel" as const };
    render(<CompetitionRegistrationSidebar competition={comp} />);
    
    expect(screen.getByText("Organized By")).toBeInTheDocument();
    expect(screen.getByText("Mahanadi Hostel")).toBeInTheDocument();
    expect(screen.getByText("Hostel")).toBeInTheDocument();
  });

  it("should display a valid organization organizer", () => {
    const comp = { ...baseCompetition, organizerName: "Student Union", organizerType: "Organization" as const };
    render(<CompetitionRegistrationSidebar competition={comp} />);
    
    expect(screen.getByText("Organized By")).toBeInTheDocument();
    expect(screen.getByText("Student Union")).toBeInTheDocument();
    expect(screen.getByText("Organization")).toBeInTheDocument();
  });
});
