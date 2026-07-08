import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HostelHeader } from "@/features/hostel/components/HostelHeader";

describe("Hostel UI Components", () => {
  it("should render HostelHeader correctly", () => {
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
      room_types: [],
      facilities: []
    } as any;

    const { getByText } = render(<HostelHeader hostel={mockHostel} />);
    expect(getByText("Kathajodi")).toBeInTheDocument();
  });
});
