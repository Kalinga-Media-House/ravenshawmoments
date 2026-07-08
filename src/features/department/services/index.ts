// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/services/index.ts
// Purpose   : Universal Department Service Layer (Enterprise Business Logic)
//             All Business Logic | Structured Logging | Repository Delegation
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  DepartmentRepository,
  DepartmentCRRepository,
  DepartmentTeacherRepository,
  DepartmentStudentRepository,
  DepartmentNoticeRepository,
  DepartmentEventRepository,
  DepartmentPublicationRepository,
} from "@/lib/repositories";
import {
  Department,
  DepartmentCR,
  DepartmentTeacher,
  DepartmentStudent,
  DepartmentNotice,
  DepartmentEvent,
  DepartmentPublication,
} from "@/types/department";
import {
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  CreateDepartmentCRPayload,
  UpdateDepartmentCRPayload,
  CreateDepartmentTeacherPayload,
  UpdateDepartmentTeacherPayload,
  CreateDepartmentNoticePayload,
  UpdateDepartmentNoticePayload,
  CreateDepartmentEventPayload,
  UpdateDepartmentEventPayload,
  CreateDepartmentPublicationPayload,
  UpdateDepartmentPublicationPayload,
} from "@/lib/validation/department-system";

// =============================================================================
// Typed Application Errors
// =============================================================================

export class DepartmentNotFoundError extends Error {
  constructor(message = "Department or resource not found.") {
    super(message);
    this.name = "DepartmentNotFoundError";
  }
}

export class DepartmentAccessDeniedError extends Error {
  constructor(message = "You do not have sufficient RBAC or Department permissions to perform this action.") {
    super(message);
    this.name = "DepartmentAccessDeniedError";
  }
}

export class DepartmentValidationError extends Error {
  constructor(message = "Department validation failed.") {
    super(message);
    this.name = "DepartmentValidationError";
  }
}

// =============================================================================
// Internal Dependency Injection Helper
// =============================================================================

async function getRepositories() {
  const supabase = await createClient();
  return {
    departmentRepo: new DepartmentRepository(supabase),
    crRepo: new DepartmentCRRepository(supabase),
    teacherRepo: new DepartmentTeacherRepository(supabase),
    studentRepo: new DepartmentStudentRepository(supabase),
    noticeRepo: new DepartmentNoticeRepository(supabase),
    eventRepo: new DepartmentEventRepository(supabase),
    publicationRepo: new DepartmentPublicationRepository(supabase),
  };
}

// =============================================================================
// 1. Core Department Service
// =============================================================================

export const departmentCoreService = {
  createDepartment: async (userId: string, payload: CreateDepartmentPayload): Promise<Department> => {
    logger.info(`DepartmentService: Creating department '${payload.name}' by user ${userId}`);
    const { departmentRepo } = await getRepositories();

    // Enforce business rule: prevent duplicate slug
    const existingBySlug = await departmentRepo.findBySlug(payload.slug);
    if (existingBySlug) {
      throw new DepartmentValidationError("A department with this URL slug already exists.");
    }

    // Enforce business rule: prevent duplicate department name
    const matches = await departmentRepo.searchDepartments(payload.name, 10, 0);
    const exactNameMatch = matches.some(
      (dept) => String(dept.name).toLowerCase() === payload.name.toLowerCase()
    );
    if (exactNameMatch) {
      throw new DepartmentValidationError("A department with this exact name already exists.");
    }

    const newRow = await departmentRepo.createDepartment({
      ...payload,
      is_active: payload.is_active ?? true,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return newRow as unknown as Department;
  },

  updateDepartment: async (
    userId: string,
    departmentId: string,
    payload: UpdateDepartmentPayload
  ): Promise<Department> => {
    logger.info(`DepartmentService: Updating department ${departmentId} by user ${userId}`);
    const { departmentRepo } = await getRepositories();

    const existing = await departmentRepo.findById(departmentId);
    if (!existing) {
      throw new DepartmentNotFoundError("Department not found.");
    }

    // Check slug uniqueness if changing
    if (payload.slug && payload.slug !== existing.slug) {
      const existingBySlug = await departmentRepo.findBySlug(payload.slug);
      if (existingBySlug && existingBySlug.id !== departmentId) {
        throw new DepartmentValidationError("A department with this URL slug already exists.");
      }
    }

    const updated = await departmentRepo.updateDepartment(departmentId, {
      ...payload,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as Department;
  },

  verifyDepartment: async (userId: string, departmentId: string, isVerified: boolean): Promise<Department> => {
    logger.info(`DepartmentService: Verifying department ${departmentId} (${isVerified}) by user ${userId}`);
    const { departmentRepo } = await getRepositories();

    const existing = await departmentRepo.findById(departmentId);
    if (!existing) {
      throw new DepartmentNotFoundError("Department not found.");
    }

    const updated = await departmentRepo.updateDepartment(departmentId, {
      is_verified: isVerified,
      verified_by: isVerified ? userId : null,
      verified_at: isVerified ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as Department;
  },

  getDepartmentBySlug: async (slug: string): Promise<Department> => {
    const { departmentRepo } = await getRepositories();
    const dept = await departmentRepo.findBySlug(slug);
    if (!dept) {
      throw new DepartmentNotFoundError(`Department with slug '${slug}' not found.`);
    }
    return dept as unknown as Department;
  },

  listActiveDepartments: async (limit = 50, offset = 0, sortBy = "name", sortOrder: "asc" | "desc" = "asc"): Promise<Department[]> => {
    const { departmentRepo } = await getRepositories();
    const list = await departmentRepo.findActive(limit, offset, sortBy, sortOrder);
    return list as unknown as Department[];
  },

  searchDepartments: async (query: string, limit = 20, offset = 0): Promise<Department[]> => {
    const { departmentRepo } = await getRepositories();
    const list = await departmentRepo.searchDepartments(query, limit, offset);
    return list as unknown as Department[];
  },
};

// =============================================================================
// 2. CR Management Service
// =============================================================================

export const departmentCRService = {
  assignDepartmentCR: async (userId: string, payload: CreateDepartmentCRPayload): Promise<DepartmentCR> => {
    logger.info(`DepartmentService: Assigning CR ${payload.profile_id} to department ${payload.department_id}`);
    const { crRepo } = await getRepositories();

    // Enforce business rule: Auto-deactivate expired CRs for this department first
    const activeCRs = await crRepo.findByDepartmentId(payload.department_id, true);
    const nowStr = new Date().toISOString().split("T")[0];
    for (const cr of activeCRs) {
      if (cr.term_end_date && String(cr.term_end_date) < nowStr) {
        logger.info(`DepartmentService: Auto-deactivating expired CR appointment ${cr.id}`);
        await crRepo.removeCR(String(cr.id));
      }
    }

    // Enforce business rule: One active CR per department/session unless explicitly allowed
    const remainingActive = await crRepo.findByDepartmentId(payload.department_id, true);
    const sameSessionActive = remainingActive.filter(
      (cr) => cr.academic_session_id === payload.academic_session_id
    );
    if (sameSessionActive.length > 0) {
      throw new DepartmentValidationError(
        "An active Department Representative already exists for this department and academic session."
      );
    }

    // Enforce business rule: Validate term overlap
    if (payload.term_end_date && new Date(payload.term_end_date) < new Date(payload.term_start_date)) {
      throw new DepartmentValidationError("Term end date must be strictly after the term start date.");
    }

    // Enforce business rule: Permission inheritance (apply safe default grant)
    const defaultGrants = {
      can_post_notices: true,
      can_manage_gallery: true,
      can_manage_events: true,
    };
    const permissionsGrant = payload.permissions_grant
      ? { ...defaultGrants, ...payload.permissions_grant }
      : defaultGrants;

    const newCR = await crRepo.createCR({
      ...payload,
      role_title: payload.role_title || "Department CR",
      is_active: payload.is_active ?? true,
      permissions_grant: permissionsGrant,
      assigned_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return newCR as unknown as DepartmentCR;
  },

  updateDepartmentCR: async (userId: string, crId: string, payload: UpdateDepartmentCRPayload): Promise<DepartmentCR> => {
    logger.info(`DepartmentService: Updating CR appointment ${crId} by user ${userId}`);
    const { crRepo } = await getRepositories();

    const existing = await crRepo.findById(crId);
    if (!existing) {
      throw new DepartmentNotFoundError("CR appointment not found.");
    }

    if (payload.term_end_date && payload.term_start_date) {
      if (new Date(payload.term_end_date) < new Date(payload.term_start_date)) {
        throw new DepartmentValidationError("Term end date must be strictly after the term start date.");
      }
    }

    const updated = await crRepo.updateCR(crId, {
      ...payload,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as DepartmentCR;
  },

  removeDepartmentCR: async (userId: string, crId: string): Promise<void> => {
    logger.info(`DepartmentService: Removing CR appointment ${crId} by user ${userId}`);
    const { crRepo } = await getRepositories();
    const existing = await crRepo.findById(crId);
    if (!existing) {
      throw new DepartmentNotFoundError("CR appointment not found.");
    }
    await crRepo.removeCR(crId);
  },

  listDepartmentCRs: async (departmentId: string, activeOnly = true): Promise<DepartmentCR[]> => {
    const { crRepo } = await getRepositories();
    const list = await crRepo.findByDepartmentId(departmentId, activeOnly);
    return list as unknown as DepartmentCR[];
  },
};

// =============================================================================
// 3. Teacher Roster Management Service
// =============================================================================

export const departmentTeacherService = {
  addTeacher: async (userId: string, payload: CreateDepartmentTeacherPayload): Promise<DepartmentTeacher> => {
    logger.info(`DepartmentService: Adding teacher ${payload.profile_id} to dept ${payload.department_id}`);
    const { teacherRepo } = await getRepositories();

    // Enforce business rule: Prevent duplicate active faculty
    const existingAffiliations = await teacherRepo.findByProfileId(payload.profile_id);
    const alreadyInDept = existingAffiliations.some((t) => t.department_id === payload.department_id);
    if (alreadyInDept) {
      throw new DepartmentValidationError("This faculty member is already assigned to this department roster.");
    }

    // Enforce business rule: Only one Head of Department (HOD)
    if (payload.is_hod === true) {
      const currentHod = await teacherRepo.findHodByDepartmentId(payload.department_id);
      if (currentHod && currentHod.profile_id !== payload.profile_id) {
        throw new DepartmentValidationError(
          "An active Head of Department (HOD) already exists for this department. Please demote the current HOD first."
        );
      }
    }

    // Enforce business rule: Maintain display order
    let displayOrder = payload.display_order;
    if (displayOrder === undefined || displayOrder === null) {
      const activeTeachers = await teacherRepo.findByDepartmentId(payload.department_id, true);
      displayOrder = activeTeachers.length + 1;
    }

    const newTeacher = await teacherRepo.addTeacher({
      ...payload,
      designation_title: payload.designation_title || "Faculty Member",
      is_hod: payload.is_hod ?? false,
      is_visiting: payload.is_visiting ?? false,
      is_active: payload.is_active ?? true,
      display_order: displayOrder,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return newTeacher as unknown as DepartmentTeacher;
  },

  updateTeacher: async (userId: string, teacherId: string, payload: UpdateDepartmentTeacherPayload): Promise<DepartmentTeacher> => {
    logger.info(`DepartmentService: Updating teacher ${teacherId} by user ${userId}`);
    const { teacherRepo } = await getRepositories();

    const existing = await teacherRepo.findById(teacherId);
    if (!existing) {
      throw new DepartmentNotFoundError("Faculty member record not found.");
    }

    const deptId = String(payload.department_id || existing.department_id);

    // Only one HOD rule enforcement on update
    if (payload.is_hod === true && existing.is_hod !== true) {
      const currentHod = await teacherRepo.findHodByDepartmentId(deptId);
      if (currentHod && currentHod.id !== teacherId) {
        throw new DepartmentValidationError(
          "An active Head of Department (HOD) already exists for this department. Demote the current HOD first."
        );
      }
    }

    const updated = await teacherRepo.updateTeacher(teacherId, {
      ...payload,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as DepartmentTeacher;
  },

  removeTeacher: async (userId: string, teacherId: string): Promise<void> => {
    logger.info(`DepartmentService: Removing teacher ${teacherId} from active roster by user ${userId}`);
    const { teacherRepo } = await getRepositories();
    const existing = await teacherRepo.findById(teacherId);
    if (!existing) {
      throw new DepartmentNotFoundError("Faculty member record not found.");
    }
    await teacherRepo.removeTeacher(teacherId);
  },

  listTeachers: async (departmentId: string, activeOnly = true): Promise<DepartmentTeacher[]> => {
    const { teacherRepo } = await getRepositories();
    const list = await teacherRepo.findByDepartmentId(departmentId, activeOnly);
    return list as unknown as DepartmentTeacher[];
  },
};

// =============================================================================
// 4. Student Directory Service
// =============================================================================

export const departmentStudentService = {
  verifyStudent: async (userId: string, studentId: string, isVerified: boolean): Promise<DepartmentStudent> => {
    logger.info(`DepartmentService: Verifying student ${studentId} (${isVerified}) by CR ${userId}`);
    const { studentRepo } = await getRepositories();

    const existing = await studentRepo.findById(studentId);
    if (!existing) {
      throw new DepartmentNotFoundError("Student record not found in directory.");
    }

    const updated = await studentRepo.verifyStudent(studentId, userId, isVerified);
    return updated as unknown as DepartmentStudent;
  },

  featureStudent: async (userId: string, studentId: string, isFeatured: boolean): Promise<DepartmentStudent> => {
    logger.info(`DepartmentService: Featuring student ${studentId} (${isFeatured}) by user ${userId}`);
    const { studentRepo } = await getRepositories();

    const existing = await studentRepo.findById(studentId);
    if (!existing) {
      throw new DepartmentNotFoundError("Student record not found in directory.");
    }

    const updated = await studentRepo.updateStudent(studentId, {
      is_featured: isFeatured,
      updated_at: new Date().toISOString(),
    });
    return updated as unknown as DepartmentStudent;
  },

  listStudents: async (
    departmentId: string,
    filter?: { batchId?: string; isVerified?: boolean; isFeatured?: boolean },
    limit = 50,
    offset = 0
  ): Promise<DepartmentStudent[]> => {
    const { studentRepo } = await getRepositories();
    const list = await studentRepo.findByDepartmentId(departmentId, filter, limit, offset);
    return list as unknown as DepartmentStudent[];
  },
};

// =============================================================================
// 5. Notice & Bulletin Service
// =============================================================================

export const departmentNoticeService = {
  createNotice: async (userId: string, payload: CreateDepartmentNoticePayload): Promise<DepartmentNotice> => {
    logger.info(`DepartmentService: Creating notice '${payload.title}' in dept ${payload.department_id}`);
    const { noticeRepo } = await getRepositories();

    // Enforce business rule: Expiration date validation
    if (payload.expires_at) {
      if (new Date(payload.expires_at) <= new Date()) {
        throw new DepartmentValidationError("Notice expiration date must be in the future.");
      }
    }

    const newNotice = await noticeRepo.createNotice({
      ...payload,
      public_id: `NOT-${Date.now()}`,
      priority: payload.priority || "normal",
      target_audience: payload.target_audience || "all",
      published_by: userId,
      published_at: payload.published_at || new Date().toISOString(),
      is_published: payload.is_published ?? true,
      is_pinned: payload.is_pinned ?? false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return newNotice as unknown as DepartmentNotice;
  },

  updateNotice: async (userId: string, noticeId: string, payload: UpdateDepartmentNoticePayload): Promise<DepartmentNotice> => {
    logger.info(`DepartmentService: Updating notice ${noticeId} by user ${userId}`);
    const { noticeRepo } = await getRepositories();

    const existing = await noticeRepo.findById(noticeId);
    if (!existing) {
      throw new DepartmentNotFoundError("Notice not found.");
    }

    if (payload.expires_at && new Date(payload.expires_at) <= new Date()) {
      throw new DepartmentValidationError("Notice expiration date must be in the future.");
    }

    const updated = await noticeRepo.updateNotice(noticeId, {
      ...payload,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as DepartmentNotice;
  },

  publishNotice: async (userId: string, noticeId: string, isPublished: boolean): Promise<DepartmentNotice> => {
    logger.info(`DepartmentService: Publishing notice ${noticeId} (${isPublished}) by user ${userId}`);
    const { noticeRepo } = await getRepositories();

    const existing = await noticeRepo.findById(noticeId);
    if (!existing) {
      throw new DepartmentNotFoundError("Notice not found.");
    }

    const updated = await noticeRepo.updateNotice(noticeId, {
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : existing.published_at,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as DepartmentNotice;
  },

  deleteNotice: async (userId: string, noticeId: string): Promise<void> => {
    logger.info(`DepartmentService: Deleting notice ${noticeId} by user ${userId}`);
    const { noticeRepo } = await getRepositories();
    const existing = await noticeRepo.findById(noticeId);
    if (!existing) {
      throw new DepartmentNotFoundError("Notice not found.");
    }
    await noticeRepo.deleteNotice(noticeId);
  },

  listNotices: async (
    departmentId: string,
    filter?: { isPublished?: boolean; isPinned?: boolean; targetAudience?: string },
    limit = 50,
    offset = 0
  ): Promise<DepartmentNotice[]> => {
    const { noticeRepo } = await getRepositories();
    const list = await noticeRepo.findByDepartmentId(departmentId, filter, limit, offset);
    return list as unknown as DepartmentNotice[];
  },
};

// =============================================================================
// 6. Event Management Service
// =============================================================================

export const departmentEventService = {
  createDepartmentEvent: async (userId: string, payload: CreateDepartmentEventPayload): Promise<DepartmentEvent> => {
    logger.info(`DepartmentService: Creating event '${payload.title}' in dept ${payload.department_id}`);
    const { eventRepo } = await getRepositories();

    // Enforce business rule: Prevent invalid dates
    const start = new Date(payload.event_start_time);
    const end = new Date(payload.event_end_time);
    if (end <= start) {
      throw new DepartmentValidationError("Event end time must be strictly after the start time.");
    }

    // Enforce business rule: Registration deadline validation
    if ("registration_deadline" in payload && (payload as Record<string, unknown>).registration_deadline) {
      const deadline = new Date(String((payload as Record<string, unknown>).registration_deadline));
      if (deadline > start) {
        throw new DepartmentValidationError("Registration deadline must be before or at event start time.");
      }
    }

    // Enforce business rule: Prevent venue conflicts
    if (payload.venue) {
      const upcomingEvents = await eventRepo.findByDepartmentId(payload.department_id, { upcomingOnly: true });
      const conflict = upcomingEvents.some((evt) => {
        if (!evt.venue || String(evt.venue).toLowerCase() !== payload.venue!.toLowerCase()) return false;
        const eStart = new Date(String(evt.event_start_time));
        const eEnd = new Date(String(evt.event_end_time));
        // Overlap condition: start < eEnd && end > eStart
        return start < eEnd && end > eStart;
      });

      if (conflict) {
        throw new DepartmentValidationError(
          "Venue conflict: Another event is already scheduled at this venue during this timeframe."
        );
      }
    }

    const newEvent = await eventRepo.createEvent({
      ...payload,
      public_id: `EVT-${Date.now()}`,
      event_type: payload.event_type || "seminar",
      is_registration_required: payload.is_registration_required ?? false,
      coordinator_profile_id: payload.coordinator_profile_id || userId,
      is_published: payload.is_published ?? true,
      is_featured: payload.is_featured ?? false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return newEvent as unknown as DepartmentEvent;
  },

  updateDepartmentEvent: async (
    userId: string,
    eventId: string,
    payload: UpdateDepartmentEventPayload
  ): Promise<DepartmentEvent> => {
    logger.info(`DepartmentService: Updating event ${eventId} by user ${userId}`);
    const { eventRepo } = await getRepositories();

    const existing = await eventRepo.findById(eventId);
    if (!existing) {
      throw new DepartmentNotFoundError("Event not found.");
    }

    const start = payload.event_start_time ? new Date(payload.event_start_time) : new Date(String(existing.event_start_time));
    const end = payload.event_end_time ? new Date(payload.event_end_time) : new Date(String(existing.event_end_time));
    if (end <= start) {
      throw new DepartmentValidationError("Event end time must be strictly after the start time.");
    }

    const updated = await eventRepo.updateEvent(eventId, {
      ...payload,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as DepartmentEvent;
  },

  publishDepartmentEvent: async (userId: string, eventId: string, isPublished: boolean): Promise<DepartmentEvent> => {
    logger.info(`DepartmentService: Publishing event ${eventId} (${isPublished}) by user ${userId}`);
    const { eventRepo } = await getRepositories();

    const existing = await eventRepo.findById(eventId);
    if (!existing) {
      throw new DepartmentNotFoundError("Event not found.");
    }

    const updated = await eventRepo.updateEvent(eventId, {
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as DepartmentEvent;
  },

  deleteDepartmentEvent: async (userId: string, eventId: string): Promise<void> => {
    logger.info(`DepartmentService: Deleting event ${eventId} by user ${userId}`);
    const { eventRepo } = await getRepositories();
    const existing = await eventRepo.findById(eventId);
    if (!existing) {
      throw new DepartmentNotFoundError("Event not found.");
    }
    await eventRepo.deleteEvent(eventId);
  },

  listEvents: async (
    departmentId: string,
    filter?: { eventType?: string; isPublished?: boolean; isFeatured?: boolean; upcomingOnly?: boolean },
    limit = 50,
    offset = 0
  ): Promise<DepartmentEvent[]> => {
    const { eventRepo } = await getRepositories();
    const list = await eventRepo.findByDepartmentId(departmentId, filter, limit, offset);
    return list as unknown as DepartmentEvent[];
  },
};

// =============================================================================
// 7. Publication Management Service
// =============================================================================

export const departmentPublicationService = {
  uploadPublication: async (userId: string, payload: CreateDepartmentPublicationPayload): Promise<DepartmentPublication> => {
    logger.info(`DepartmentService: Uploading publication '${payload.title}' in dept ${payload.department_id}`);
    const { publicationRepo } = await getRepositories();

    // Enforce business rule: Validate PDF document existence
    if (!payload.document_media_id) {
      throw new DepartmentValidationError("A valid document media ID (PDF) is required to publish.");
    }

    const newPub = await publicationRepo.createPublication({
      ...payload,
      public_id: `PUB-${Date.now()}`,
      publication_type: payload.publication_type || "annual_magazine",
      uploaded_by: userId,
      is_public: payload.is_public ?? true,
      download_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return newPub as unknown as DepartmentPublication;
  },

  updatePublication: async (
    userId: string,
    publicationId: string,
    payload: UpdateDepartmentPublicationPayload
  ): Promise<DepartmentPublication> => {
    logger.info(`DepartmentService: Updating publication ${publicationId} by user ${userId}`);
    const { publicationRepo } = await getRepositories();

    const existing = await publicationRepo.findById(publicationId);
    if (!existing) {
      throw new DepartmentNotFoundError("Publication record not found.");
    }

    const updated = await publicationRepo.updatePublication(publicationId, {
      ...payload,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as DepartmentPublication;
  },

  publishPublication: async (userId: string, publicationId: string, isPublic: boolean): Promise<DepartmentPublication> => {
    logger.info(`DepartmentService: Changing publication ${publicationId} visibility (${isPublic}) by user ${userId}`);
    const { publicationRepo } = await getRepositories();

    const existing = await publicationRepo.findById(publicationId);
    if (!existing) {
      throw new DepartmentNotFoundError("Publication record not found.");
    }

    const updated = await publicationRepo.updatePublication(publicationId, {
      is_public: isPublic,
      updated_at: new Date().toISOString(),
    });

    return updated as unknown as DepartmentPublication;
  },

  deletePublication: async (userId: string, publicationId: string): Promise<void> => {
    logger.info(`DepartmentService: Deleting publication ${publicationId} by user ${userId}`);
    const { publicationRepo } = await getRepositories();
    const existing = await publicationRepo.findById(publicationId);
    if (!existing) {
      throw new DepartmentNotFoundError("Publication record not found.");
    }
    await publicationRepo.deletePublication(publicationId);
  },

  listPublications: async (
    departmentId: string,
    filter?: { publicationType?: string; isPublic?: boolean; academicSessionId?: string },
    limit = 50,
    offset = 0
  ): Promise<DepartmentPublication[]> => {
    const { publicationRepo } = await getRepositories();
    const list = await publicationRepo.findByDepartmentId(departmentId, filter, limit, offset);
    return list as unknown as DepartmentPublication[];
  },
};
