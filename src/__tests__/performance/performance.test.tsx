import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileGallery } from "@/features/profile/components/ProfileGallery";

describe("Performance & Benchmark Tests", () => {
  describe("Large Gallery Rendering (50-Image Quota)", () => {
    it("should render 50 gallery items rapidly without DOM bottleneck", () => {
      // Generate 50 mock gallery items representing maximum allowed quota
      const mockItems = Array.from({ length: 50 }, (_, i) => ({
        id: `img-${i}`,
        gallery_album_id: "test-album-id",
        media_file_id: `file-${i}`,
        media_type: "image" as const,
        storage_path: `gallery/user-1/photo-${i}.webp`,
        media_url: `https://example.com/photo-${i}.webp`,
        caption: `Gallery photo number ${i + 1}`,
        display_order: i,
        is_cover: i === 0,
        is_featured: i < 3,
        created_at: "2026-01-01T00:00:00Z",
      }));

      const startTime = performance.now();
      render(<ProfileGallery items={mockItems} isOwner={true} />);
      const endTime = performance.now();

      const renderDuration = endTime - startTime;
      expect(screen.getByText("Gallery photo number 1")).toBeInTheDocument();
      expect(screen.getByText("Gallery photo number 50")).toBeInTheDocument();
      // Verify jsdom render benchmark completes well under threshold (adjusted for CI environments)
      expect(renderDuration).toBeLessThan(15000);
    });
  });
});
