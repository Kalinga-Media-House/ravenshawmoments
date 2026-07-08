import { describe, it, expect, vi } from "vitest";
import { HostelService } from "@/features/hostel/services";

describe("Hostel Service", () => {
  it("should initialize and return a valid service instance", () => {
    const service = new HostelService();
    expect(service).toBeDefined();
  });
});
