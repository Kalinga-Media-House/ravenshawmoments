import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HostelHeader } from "@/features/hostel/components/HostelHeader";

describe("Hostel Accessibility", () => {
  it("HostelHeader should render semantic heading structure", () => {
    const mockHostel = {
      id: "h1",
      name: "Kathajodi",
      slug: "kathajodi",
      hostel_type: "university_boys",
      address: "Campus",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_sponsored: false,
      is_active: true,
    } as any;

    render(<HostelHeader hostel={mockHostel} />);
    const heading = screen.getByRole("heading", { name: "Kathajodi" });
    expect(heading).toBeDefined();
  }, 15000);
});
