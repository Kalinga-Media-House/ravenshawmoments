// =============================================================================
// Ravenshaw Moments
// File      : src/__tests__/unit/department-service.test.ts
// Purpose   : Unit Tests for Department Core & Roster Service Layer
// =============================================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  departmentCoreService,
  departmentTeacherService,
  departmentStudentService,
  departmentNoticeService,
  departmentEventService,
  departmentPublicationService,
} from "@/features/department/services";

const {
  mockFindActive,
  mockFindBySlug,
  mockFindTeachersByDepartmentId,
  mockFindStudentsByDepartmentId,
  mockFindNoticesByDepartmentId,
  mockFindEventsByDepartmentId,
  mockFindPublicationsByDepartmentId,
} = vi.hoisted(() => ({
  mockFindActive: vi.fn(),
  mockFindBySlug: vi.fn(),
  mockFindTeachersByDepartmentId: vi.fn(),
  mockFindStudentsByDepartmentId: vi.fn(),
  mockFindNoticesByDepartmentId: vi.fn(),
  mockFindEventsByDepartmentId: vi.fn(),
  mockFindPublicationsByDepartmentId: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => {
  const mockChain: Record<string, unknown> = {};
  mockChain.select = vi.fn().mockReturnValue(mockChain);
  mockChain.eq = vi.fn().mockReturnValue(mockChain);
  mockChain.order = vi.fn().mockReturnValue(mockChain);
  mockChain.range = vi.fn().mockResolvedValue({ data: [], error: null });
  mockChain.maybeSingle = vi.fn().mockResolvedValue({
    data: { id: "dept-1", name: "Computer Science", slug: "computer-science", is_verified: true },
    error: null,
  });
  mockChain.single = vi.fn().mockResolvedValue({
    data: { id: "dept-1", name: "Computer Science" },
    error: null,
  });

  return {
    createClient: vi.fn().mockResolvedValue({
      from: vi.fn().mockReturnValue(mockChain),
    }),
  };
});

vi.mock("@/lib/repositories", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    DepartmentRepository: class {
      findActive = mockFindActive;
      findBySlug = mockFindBySlug;
    },
    DepartmentCRRepository: class {},
    DepartmentTeacherRepository: class {
      findByDepartmentId = mockFindTeachersByDepartmentId;
    },
    DepartmentStudentRepository: class {
      findByDepartmentId = mockFindStudentsByDepartmentId;
    },
    DepartmentNoticeRepository: class {
      findByDepartmentId = mockFindNoticesByDepartmentId;
    },
    DepartmentEventRepository: class {
      findByDepartmentId = mockFindEventsByDepartmentId;
    },
    DepartmentPublicationRepository: class {
      findByDepartmentId = mockFindPublicationsByDepartmentId;
    },
  };
});

describe("Department Service Layer Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DepartmentCoreService", () => {
    it("listActiveDepartments should fetch active departments", async () => {
      mockFindActive.mockResolvedValue([
        { id: "dept-1", name: "Computer Science", slug: "computer-science", is_verified: true },
      ]);

      const res = await departmentCoreService.listActiveDepartments();
      expect(res).toHaveLength(1);
      expect(mockFindActive).toHaveBeenCalled();
    });

    it("getDepartmentBySlug should return department profile when found", async () => {
      mockFindBySlug.mockResolvedValue({
        id: "dept-1",
        name: "Computer Science",
        slug: "computer-science",
        is_verified: true,
      });

      const res = await departmentCoreService.getDepartmentBySlug("computer-science");
      expect(res.name).toBe("Computer Science");
    });
  });

  describe("DepartmentTeacherService", () => {
    it("listTeachers should return faculty roster ordered by display order", async () => {
      mockFindTeachersByDepartmentId.mockResolvedValue([
        { id: "t-1", designation_title: "Professor & HOD", is_hod: true },
      ]);

      const res = await departmentTeacherService.listTeachers("dept-1");
      expect(res?.[0].is_hod).toBe(true);
    });
  });

  describe("DepartmentStudentService", () => {
    it("listStudents should retrieve enrolled students", async () => {
      mockFindStudentsByDepartmentId.mockResolvedValue([
        { id: "s-1", leadership_role: "Tech Club Lead", is_verified_by_cr: true },
      ]);

      const res = await departmentStudentService.listStudents("dept-1");
      expect(res?.[0].leadership_role).toBe("Tech Club Lead");
    });
  });

  describe("DepartmentNoticeService", () => {
    it("listNotices should return circulars and pinned announcements", async () => {
      mockFindNoticesByDepartmentId.mockResolvedValue([
        { id: "n-1", title: "Examination Circular", is_pinned: true },
      ]);

      const res = await departmentNoticeService.listNotices("dept-1");
      expect(res?.[0].title).toBe("Examination Circular");
    });
  });

  describe("DepartmentEventService", () => {
    it("listEvents should return upcoming symposiums and seminars", async () => {
      mockFindEventsByDepartmentId.mockResolvedValue([
        { id: "e-1", title: "National Seminar on Computing", event_type: "seminar" },
      ]);

      const res = await departmentEventService.listEvents("dept-1");
      expect(res?.[0].event_type).toBe("seminar");
    });
  });

  describe("DepartmentPublicationService", () => {
    it("listPublications should retrieve syllabus and research magazines", async () => {
      mockFindPublicationsByDepartmentId.mockResolvedValue([
        { id: "p-1", title: "Annual Research Digest", publication_type: "research_journal" },
      ]);

      const res = await departmentPublicationService.listPublications("dept-1");
      expect(res?.[0].publication_type).toBe("research_journal");
    });
  });
});
