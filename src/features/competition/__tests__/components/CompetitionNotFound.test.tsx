import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CompetitionNotFound from "../../../../app/(public)/competitions/[slug]/not-found";

describe("CompetitionNotFound", () => {
  it("renders the not found title and description with explicit contrast classes", () => {
    render(<CompetitionNotFound />);
    
    // Check heading
    const title = screen.getByRole("heading", { name: "Competition Not Found" });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-[#4A0012]"); // explicit dark maroon

    // Check description
    const description = screen.getByText(/The competition you are looking for may have been moved or is no longer available/i);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-[#62575A]"); // explicit dark gray
  });

  it("renders the Back to Competitions CTA with high contrast default styling", () => {
    render(<CompetitionNotFound />);
    
    const button = screen.getByRole("link", { name: /Back to Competitions/i });
    expect(button).toBeInTheDocument();
    
    // Check default non-hover visibility
    expect(button).toHaveClass("bg-[#650018]");
    expect(button).toHaveClass("text-white");
    
    // Check hover explicit styling
    expect(button.className).toMatch(/hover:bg-\[#E5B832\]/);
    expect(button.className).toMatch(/hover:text-\[#4A0012\]/);
  });
});
