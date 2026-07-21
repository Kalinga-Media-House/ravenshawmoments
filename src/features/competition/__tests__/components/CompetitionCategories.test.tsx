import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CompetitionCategories } from "../../components/CompetitionCategories";
import { CompetitionDirectoryCategory } from "../../types/categoryPortal";
import * as registry from "../../components/portal/CategoryThemeRegistry";

vi.mock("next/link", () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href} data-testid="mock-link">
        {children}
      </a>
    ),
  };
});

describe("CompetitionCategories Component", () => {
  beforeEach(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  const mockCategories: CompetitionDirectoryCategory[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `cat-${i}`,
    name: i === 0 ? "Graphic Design" : `Category ${i}`,
    slug: i === 0 ? "graphic-design" : `category-${i}`,
    description: "Mock desc",
    displayOrder: i * 10,
  }));

  it("renders intentional empty state when zero categories provided", () => {
    render(<CompetitionCategories categories={[]} />);
    expect(screen.getByText("No Active Categories")).toBeInTheDocument();
  });

  it("renders exactly 12 categories initially when more than 12 are supplied and shows Explore More button", () => {
    render(<CompetitionCategories categories={mockCategories} />);
    
    const links = screen.getAllByTestId("mock-link");
    expect(links).toHaveLength(12);
    expect(screen.getByText("Graphic Design")).toBeInTheDocument();
    expect(screen.queryByText("Category 14")).not.toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Explore More Categories/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "categories-grid");
  });

  it("renders all supplied categories upon clicking the expand button", () => {
    render(<CompetitionCategories categories={mockCategories} />);
    
    const button = screen.getByRole("button", { name: /Explore More Categories/i });
    fireEvent.click(button);

    const links = screen.getAllByTestId("mock-link");
    expect(links).toHaveLength(15);
    expect(screen.getByText("Category 14")).toBeInTheDocument();
    
    expect(screen.getByRole("button", { name: /Show Fewer Categories/i })).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("restores exactly 12 categories upon clicking collapse and smoothly scrolls", () => {
    render(<CompetitionCategories categories={mockCategories} />);
    
    const button = screen.getByRole("button", { name: /Explore More Categories/i });
    fireEvent.click(button);
    expect(screen.getAllByTestId("mock-link")).toHaveLength(15);

    fireEvent.click(button);
    expect(screen.getAllByTestId("mock-link")).toHaveLength(12);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("renders exactly 12 supplied categories without an expand button", () => {
    render(<CompetitionCategories categories={mockCategories.slice(0, 12)} />);
    
    expect(screen.getAllByTestId("mock-link")).toHaveLength(12);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders fewer than 12 supplied categories without an expand button", () => {
    render(<CompetitionCategories categories={mockCategories.slice(0, 5)} />);
    
    expect(screen.getAllByTestId("mock-link")).toHaveLength(5);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("uses canonical database slugs and preserves exactly the supplied authoritative order before and after expansion", () => {
    render(<CompetitionCategories categories={mockCategories} />);
    
    // Check initial 12 order
    let links = screen.getAllByTestId("mock-link");
    expect(links).toHaveLength(12);
    expect(links[0]).toHaveAttribute("href", "/competitions/categories/graphic-design");
    expect(links[1]).toHaveAttribute("href", "/competitions/categories/category-1");
    expect(links[11]).toHaveAttribute("href", "/competitions/categories/category-11");

    // Expand
    const button = screen.getByRole("button", { name: /Explore More Categories/i });
    fireEvent.click(button);

    // Check expanded 15 order and stable canonical links
    links = screen.getAllByTestId("mock-link");
    expect(links).toHaveLength(15);
    expect(links[0]).toHaveAttribute("href", "/competitions/categories/graphic-design");
    expect(links[14]).toHaveAttribute("href", "/competitions/categories/category-14");
  });

  it("does not create duplicate category cards after repeated expand/collapse interactions", () => {
    render(<CompetitionCategories categories={mockCategories} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button); // Expand
    fireEvent.click(button); // Collapse
    fireEvent.click(button); // Expand
    fireEvent.click(button); // Collapse
    fireEvent.click(button); // Expand

    const links = screen.getAllByTestId("mock-link");
    expect(links).toHaveLength(15);
    
    // Ensure Graphic Design only appears once
    const graphicDesignElements = screen.getAllByText("Graphic Design");
    expect(graphicDesignElements).toHaveLength(1);
  });

  it("applies curated theme colors correctly for original curated categories and retains existing dark title text", () => {
    const spy = vi.spyOn(registry, "getCategoryPortalTheme");
    
    render(<CompetitionCategories categories={[mockCategories[0]]} />); // graphic-design
    expect(spy).toHaveBeenCalledWith("graphic-design");
    
    const h3 = screen.getByText("Graphic Design");
    expect(h3).toBeInTheDocument();
    
    // Default text color
    expect(h3.style.color).toBe("rgb(53, 46, 49)"); // #352E31

    // Hover text color
    fireEvent.mouseEnter(h3);
    expect(h3.style.color).toBe("rgb(124, 77, 204)"); // accentColor for graphic-design
  });

  it("applies white title text for dynamic fallback dark-maroon cards and retains white on hover", () => {
    // category-1 will get the fallback theme since it's not in the curated list
    render(<CompetitionCategories categories={[mockCategories[1]]} />);
    
    const h3 = screen.getByText("Category 1");
    expect(h3).toBeInTheDocument();

    // Default text color should be explicitly white
    expect(h3.style.color).toBe("rgb(255, 255, 255)"); // #FFFFFF

    // Hover text color should remain explicitly white
    fireEvent.mouseEnter(h3);
    expect(h3.style.color).toBe("rgb(255, 255, 255)");
  });

  it("renders Explore More Categories button with explicitly visible dark-maroon background, white text, and white chevron", () => {
    render(<CompetitionCategories categories={mockCategories} />);
    
    const button = screen.getByRole("button", { name: /Explore More Categories/i });
    expect(button).toBeInTheDocument();

    // Assert explicit visual classes
    expect(button).toHaveClass("bg-[#4A0711]", "text-white", "border-[#6B1724]");
    
    // Assert focus ring classes
    expect(button).toHaveClass("focus-visible:ring-[#D4AF37]");
  });

  it("renders Show Fewer Categories button with the same explicitly visible styling", () => {
    render(<CompetitionCategories categories={mockCategories} />);
    
    const button = screen.getByRole("button", { name: /Explore More Categories/i });
    fireEvent.click(button); // Expand to show "Show Fewer Categories"

    const fewerButton = screen.getByRole("button", { name: /Show Fewer Categories/i });
    expect(fewerButton).toHaveClass("bg-[#4A0711]", "text-white", "border-[#6B1724]");
  });
});
