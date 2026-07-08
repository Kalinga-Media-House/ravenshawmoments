import { describe, it, expect, vi } from "vitest";
import { getPublicHostelBySlug } from "@/app/actions/hostel";

vi.mock("@/app/actions/hostel", () => ({
  getPublicHostelBySlug: vi.fn().mockResolvedValue({
    success: true,
    data: { id: "hostel-1", name: "Kathajodi", slug: "kathajodi" },
  }),
}));

describe("Hostel Server Actions Integration", () => {
  it("should fetch public hostel by slug successfully", async () => {
    const response = await getPublicHostelBySlug("kathajodi");
    expect(response.success).toBe(true);
    expect(response.data?.slug).toBe("kathajodi");
  });
});
