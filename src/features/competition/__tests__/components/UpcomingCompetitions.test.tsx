import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UpcomingCompetitions } from "../../components/UpcomingCompetitions";

describe("UpcomingCompetitions", () => {
  it("renders the upcoming events empty-state message with an explicit dark text class on the light background", () => {
    // Pass empty competitions list to trigger empty state
    render(<UpcomingCompetitions competitions={[]} />);
    
    const emptyStateText = screen.getByText("No upcoming events scheduled currently.");
    expect(emptyStateText).toBeInTheDocument();
    
    // Must use explicit dark text color class
    expect(emptyStateText).toHaveClass("text-[#4A3036]");
    expect(emptyStateText.parentElement).toHaveStyle({ background: "#FFFDF9" });
  }, 15000);
});
