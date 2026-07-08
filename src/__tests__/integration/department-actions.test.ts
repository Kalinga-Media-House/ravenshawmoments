// =============================================================================
// Ravenshaw Moments
// File      : src/__tests__/integration/department-actions.test.ts
// Purpose   : Integration Tests for Department Server Actions
// =============================================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  listPublicDepartments,
  getPublicDepartmentBySlug,
  getDepartmentDashboardData,
} from "@/app/actions/department";

// Mock Department Core & Roster Services
vi.mock("@/features/department/services", () => {
  class MockDepartmentNotFoundError extends Error {
    constructor(msg = "Not found") {
      super(msg);
      this.name = "DepartmentNotFoundError";
    }
  }

  class MockDepartmentAccessDeniedError extends Error {
    constructor(msg = "Access denied") {
      super(msg);
      this.name = "DepartmentAccessDeniedError";
    }
  }

  class MockDepartmentValidationError extends Error {
    constructor(msg = "Validation failed") {
      super(msg);
      this.name = "DepartmentValidationError";
    }
  }

  return {
    DepartmentNotFoundError: MockDepartmentNotFoundError,
    DepartmentAccessDeniedError: MockDepartmentAccessDeniedError,
    DepartmentValidationError: MockDepartmentValidationError,
    departmentCoreService: {
      listPublicDepartments: vi.fn().mockResolvedValue([
        { id: "d-1", name: "Computer Science", slug: "computer-science", is_verified: true },
      ]),
      listActiveDepartments: vi.fn().mockResolvedValue([
        { id: "d-1", name: "Computer Science", slug: "computer-science", is_verified: true },
      ]),
      getDepartmentBySlug: vi.fn().mockImplementation(async (slug: string) => {
        if (slug === "nonexistent") {
          throw new MockDepartmentNotFoundError("Department not found");
        }
        return {
          id: "d-1",
          name: "Computer Science",
          slug,
        };
      }),
      getPublicDepartmentBySlug: vi.fn().mockImplementation(async (slug: string) => {
        if (slug === "nonexistent") {
          throw new MockDepartmentNotFoundError("Department not found");
        }
        return {
          id: "d-1",
          name: "Computer Science",
          slug,
        };
      }),
      getDepartmentById: vi.fn().mockResolvedValue({
        id: "d-1",
        name: "Computer Science",
      }),
    },
    departmentCRService: {
      listCRs: vi.fn().mockResolvedValue([]),
      listDepartmentCRs: vi.fn().mockResolvedValue([]),
      getActiveCR: vi.fn().mockResolvedValue(null),
    },
    departmentTeacherService: {
      listTeachers: vi.fn().mockResolvedValue([]),
    },
    departmentStudentService: {
      listStudents: vi.fn().mockResolvedValue([]),
    },
    departmentNoticeService: {
      listNotices: vi.fn().mockResolvedValue([]),
    },
    departmentEventService: {
      listEvents: vi.fn().mockResolvedValue([]),
    },
    departmentPublicationService: {
      listPublications: vi.fn().mockResolvedValue([]),
    },
  };
});

describe("Department Server Actions Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listPublicDepartments", () => {
    it("should successfully return public verified departments list", async () => {
      const res = await listPublicDepartments(20, 0);
      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(1);
      expect(res.data?.[0].slug).toBe("computer-science");
    });
  });

  describe("getPublicDepartmentBySlug", () => {
    it("should aggregate public department profile and rosters by slug", async () => {
      const res = await getPublicDepartmentBySlug("computer-science");
      expect(res.success).toBe(true);
      expect(res.data?.department.name).toBe("Computer Science");
    });

    it("should return failure when department slug does not exist", async () => {
      const res = await getPublicDepartmentBySlug("nonexistent");
      expect(res.success).toBe(false);
      expect(res.error?.code).toBe("NOT_FOUND");
    });
  });

  describe("getDepartmentDashboardData", () => {
    it("should aggregate all management lists for authorized dashboard request", async () => {
      const res = await getDepartmentDashboardData("d-1");
      expect(res.success).toBe(true);
      expect(res.data?.teachers).toBeDefined();
      expect(res.data?.students).toBeDefined();
      expect(res.data?.notices).toBeDefined();
    });
  });
});
