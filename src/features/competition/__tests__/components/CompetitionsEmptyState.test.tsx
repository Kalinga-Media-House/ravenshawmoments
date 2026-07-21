import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CompetitionsEmptyState } from "../../components/CompetitionsEmptyState";

describe("CompetitionsEmptyState", () => {
  it("renders the empty state title and description with exact text colors", () => {
    render(<CompetitionsEmptyState onReset={vi.fn()} />);
    
    const title = screen.getByText("No Competitions Found");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-[#4B1724]"); // Must use explicit dark maroon
    
    const description = screen.getByText(/We could not find a competition matching your search/i);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-[#62575A]"); // Must use explicit dark gray
  });

  it("renders the Clear Search and Filters button with dark maroon background and white text", () => {
    render(<CompetitionsEmptyState onReset={vi.fn()} />);
    
    const button = screen.getByRole("button", { name: /Clear Search and Filters/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[#4B1724]");
    expect(button).toHaveClass("text-white");
    
    // Should not rely on hover styling for text visibility (no white text on light backgrounds)
    expect(button.className).not.toMatch(/bg-transparent.*text-white/);
  });
});
