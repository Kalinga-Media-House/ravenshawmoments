// =============================================================================
// Ravenshaw Moments
// File      : src/app/actions/department.ts
// Purpose   : Universal Department Ecosystem Production-Ready Server Actions
//             Delegates strictly to Service Layer (3-Tier Architecture)
// =============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/types";
import { USER_ROLES } from "@/constants";
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
  createDepartmentSchema,
  updateDepartmentSchema,
  createDepartmentCRSchema,
  updateDepartmentCRSchema,
  createDepartmentTeacherSchema,
  updateDepartmentTeacherSchema,
  createDepartmentNoticeSchema,
  updateDepartmentNoticeSchema,
  createDepartmentEventSchema,
  updateDepartmentEventSchema,
  createDepartmentPublicationSchema,
  updateDepartmentPublicationSchema,
  uuidSchema,
} from "@/lib/validation/department-system";
import {
  departmentCoreService,
  departmentCRService,
  departmentTeacherService,
  departmentStudentService,
  departmentNoticeService,
  departmentEventService,
  departmentPublicationService,
  DepartmentNotFoundError,
  DepartmentAccessDeniedError,
  DepartmentValidationError,
} from "@/features/department/services";

// ============================================================================
// Internal Authentication & RBAC Authorization Helper
// ============================================================================

type AuthResult =
  | { success: true; userId: string; email?: string }
  | { success: false; error: { code: string; message: string } };

/**
 * Verifies user authentication and evaluates granular RBAC / Department permissions.
 * Checks global roles (super_admin), department teacher/HOD status, and CR permission grants.
 */
async function verifyDepartmentAuth(
  requiredRoleOrPermission?:
    | "super_admin"
    | "department_admin"
    | "can_post_notices"
    | "can_manage_events"
    | "can_upload_publications"
    | "can_verify_students",
  departmentId?: string
): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    logger.warn("DepartmentAction: Unauthorized anonymous request rejected.");
    return {
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required to perform department actions." },
    };
  }

  if (!requiredRoleOrPermission) {
    return { success: true, userId: user.id, email: user.email };
  }

  // Fetch global user role from profiles table
  const { data: profile } = await supabase.from("profiles").select("id, role").eq("id", user.id).single();
  const role = profile?.role || "student";

  // Super Admin bypasses all departmental restrictions
  if (role === USER_ROLES.SUPER_ADMIN) {
    return { success: true, userId: user.id, email: user.email };
  }

  if (requiredRoleOrPermission === "super_admin") {
    logger.warn(`DepartmentAction: Forbidden attempt by user ${user.id} requiring super_admin.`);
    return {
      success: false,
      error: { code: "FORBIDDEN", message: "Only Super Administrators can perform this action." },
    };
  }

  // Granular departmental role and CR permission evaluation
  if (departmentId) {
    // 1. Check if user is HOD or active teacher in this department
    const { data: teacher } = await supabase
      .from("department_teachers")
      .select("id, is_hod, is_active")
      .eq("department_id", departmentId)
      .eq("profile_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (teacher && (teacher.is_hod || requiredRoleOrPermission === "department_admin")) {
      return { success: true, userId: user.id, email: user.email };
    }

    // 2. Check if user is active Department CR in this department with specific permission grant
    const { data: cr } = await supabase
      .from("department_crs")
      .select("id, is_active, permissions_grant")
      .eq("department_id", departmentId)
      .eq("profile_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (cr) {
      const grants = (cr.permissions_grant || {}) as Record<string, boolean>;
      if (requiredRoleOrPermission === "department_admin" || grants[requiredRoleOrPermission] === true) {
        return { success: true, userId: user.id, email: user.email };
      }
    }
  }

  logger.warn(`DepartmentAction: Access denied for user ${user.id} lacking permission: ${requiredRoleOrPermission}.`);
  return {
    success: false,
    error: { code: "FORBIDDEN", message: "You do not have sufficient departmental permissions for this action." },
  };
}

/**
 * Standardized error mapping for Service Layer exceptions.
 */
function handleServiceError(err: unknown, actionName: string): ApiResponse<never> {
  logger.error(`DepartmentAction: Error in ${actionName}`, err);
  if (err instanceof DepartmentNotFoundError) {
    return { success: false, error: { code: "NOT_FOUND", message: err.message } };
  }
  if (err instanceof DepartmentAccessDeniedError) {
    return { success: false, error: { code: "FORBIDDEN", message: err.message } };
  }
  if (err instanceof DepartmentValidationError) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: err.message } };
  }
  const message = err instanceof Error ? err.message : "An unexpected server error occurred.";
  return { success: false, error: { code: "SERVER_ERROR", message } };
}

// ============================================================================
// 1. Department Actions
// ============================================================================

export async function createDepartment(rawInput: unknown): Promise<ApiResponse<Department>> {
  const auth = await verifyDepartmentAuth("super_admin");
  if (!auth.success) return auth;

  const parseRes = createDepartmentSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid department input data." },
    };
  }

  try {
    const data = await departmentCoreService.createDepartment(auth.userId, parseRes.data);
    logger.info(`DepartmentAction: Created department ${data.id} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "createDepartment");
  }
}

export async function updateDepartment(departmentId: string, rawInput: unknown): Promise<ApiResponse<Department>> {
  const idRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success) return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid department UUID." } };

  const auth = await verifyDepartmentAuth("department_admin", departmentId);
  if (!auth.success) return auth;

  const parseRes = updateDepartmentSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid update input data." },
    };
  }

  try {
    const data = await departmentCoreService.updateDepartment(auth.userId, departmentId, parseRes.data);
    logger.info(`DepartmentAction: Updated department ${departmentId} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "updateDepartment");
  }
}

export async function verifyDepartment(departmentId: string, isVerified: boolean): Promise<ApiResponse<Department>> {
  const idRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success) return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid department UUID." } };

  const auth = await verifyDepartmentAuth("super_admin");
  if (!auth.success) return auth;

  try {
    const data = await departmentCoreService.verifyDepartment(auth.userId, departmentId, isVerified);
    logger.info(`DepartmentAction: Verified department ${departmentId} (${isVerified}) by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "verifyDepartment");
  }
}

// ============================================================================
// 2. Department CR Actions
// ============================================================================

export async function assignDepartmentCR(rawInput: unknown): Promise<ApiResponse<DepartmentCR>> {
  const parseRes = createDepartmentCRSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid CR assignment input." },
    };
  }

  const auth = await verifyDepartmentAuth("department_admin", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentCRService.assignDepartmentCR(auth.userId, parseRes.data);
    logger.info(`DepartmentAction: Assigned CR ${data.profile_id} to dept ${data.department_id} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "assignDepartmentCR");
  }
}

export async function updateDepartmentCR(crId: string, rawInput: unknown): Promise<ApiResponse<DepartmentCR>> {
  const idRes = uuidSchema.safeParse(crId);
  if (!idRes.success) return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid CR UUID." } };

  const parseRes = updateDepartmentCRSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid CR update input." },
    };
  }

  const auth = await verifyDepartmentAuth("department_admin", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentCRService.updateDepartmentCR(auth.userId, crId, parseRes.data);
    logger.info(`DepartmentAction: Updated CR ${crId} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "updateDepartmentCR");
  }
}

export async function removeDepartmentCR(crId: string, departmentId: string): Promise<ApiResponse<void>> {
  const idRes = uuidSchema.safeParse(crId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("department_admin", departmentId);
  if (!auth.success) return auth;

  try {
    await departmentCRService.removeDepartmentCR(auth.userId, crId);
    logger.info(`DepartmentAction: Removed CR ${crId} by user ${auth.userId}`);
    return { success: true };
  } catch (err) {
    return handleServiceError(err, "removeDepartmentCR");
  }
}

// ============================================================================
// 3. Department Teacher Roster Actions
// ============================================================================

export async function addTeacher(rawInput: unknown): Promise<ApiResponse<DepartmentTeacher>> {
  const parseRes = createDepartmentTeacherSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid teacher input data." },
    };
  }

  const auth = await verifyDepartmentAuth("department_admin", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentTeacherService.addTeacher(auth.userId, parseRes.data);
    logger.info(`DepartmentAction: Added teacher ${data.profile_id} to dept ${data.department_id} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "addTeacher");
  }
}

export async function updateTeacher(teacherId: string, rawInput: unknown): Promise<ApiResponse<DepartmentTeacher>> {
  const idRes = uuidSchema.safeParse(teacherId);
  if (!idRes.success) return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid teacher UUID." } };

  const parseRes = updateDepartmentTeacherSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid teacher update data." },
    };
  }

  const auth = await verifyDepartmentAuth("department_admin", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentTeacherService.updateTeacher(auth.userId, teacherId, parseRes.data);
    logger.info(`DepartmentAction: Updated teacher ${teacherId} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "updateTeacher");
  }
}

export async function removeTeacher(teacherId: string, departmentId: string): Promise<ApiResponse<void>> {
  const idRes = uuidSchema.safeParse(teacherId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("department_admin", departmentId);
  if (!auth.success) return auth;

  try {
    await departmentTeacherService.removeTeacher(auth.userId, teacherId);
    logger.info(`DepartmentAction: Removed teacher ${teacherId} by user ${auth.userId}`);
    return { success: true };
  } catch (err) {
    return handleServiceError(err, "removeTeacher");
  }
}

// ============================================================================
// 4. Department Student Directory Actions
// ============================================================================

export async function verifyStudent(
  studentId: string,
  departmentId: string,
  isVerified: boolean
): Promise<ApiResponse<DepartmentStudent>> {
  const idRes = uuidSchema.safeParse(studentId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("can_verify_students", departmentId);
  if (!auth.success) return auth;

  try {
    const data = await departmentStudentService.verifyStudent(auth.userId, studentId, isVerified);
    logger.info(`DepartmentAction: Verified student ${studentId} (${isVerified}) by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "verifyStudent");
  }
}

export async function featureStudent(
  studentId: string,
  departmentId: string,
  isFeatured: boolean
): Promise<ApiResponse<DepartmentStudent>> {
  const idRes = uuidSchema.safeParse(studentId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("department_admin", departmentId);
  if (!auth.success) return auth;

  try {
    const data = await departmentStudentService.featureStudent(auth.userId, studentId, isFeatured);
    logger.info(`DepartmentAction: Featured student ${studentId} (${isFeatured}) by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "featureStudent");
  }
}

// ============================================================================
// 5. Department Notice & Bulletin Actions
// ============================================================================

export async function createNotice(rawInput: unknown): Promise<ApiResponse<DepartmentNotice>> {
  const parseRes = createDepartmentNoticeSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid notice input data." },
    };
  }

  const auth = await verifyDepartmentAuth("can_post_notices", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentNoticeService.createNotice(auth.userId, parseRes.data);
    logger.info(`DepartmentAction: Created notice ${data.id} in dept ${data.department_id} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "createNotice");
  }
}

export async function updateNotice(noticeId: string, rawInput: unknown): Promise<ApiResponse<DepartmentNotice>> {
  const idRes = uuidSchema.safeParse(noticeId);
  if (!idRes.success) return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid notice UUID." } };

  const parseRes = updateDepartmentNoticeSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid notice update data." },
    };
  }

  const auth = await verifyDepartmentAuth("can_post_notices", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentNoticeService.updateNotice(auth.userId, noticeId, parseRes.data);
    logger.info(`DepartmentAction: Updated notice ${noticeId} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "updateNotice");
  }
}

export async function publishNotice(
  noticeId: string,
  departmentId: string,
  isPublished: boolean
): Promise<ApiResponse<DepartmentNotice>> {
  const idRes = uuidSchema.safeParse(noticeId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("can_post_notices", departmentId);
  if (!auth.success) return auth;

  try {
    const data = await departmentNoticeService.publishNotice(auth.userId, noticeId, isPublished);
    logger.info(`DepartmentAction: Published notice ${noticeId} (${isPublished}) by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "publishNotice");
  }
}

export async function deleteNotice(noticeId: string, departmentId: string): Promise<ApiResponse<void>> {
  const idRes = uuidSchema.safeParse(noticeId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("can_post_notices", departmentId);
  if (!auth.success) return auth;

  try {
    await departmentNoticeService.deleteNotice(auth.userId, noticeId);
    logger.info(`DepartmentAction: Deleted notice ${noticeId} by user ${auth.userId}`);
    return { success: true };
  } catch (err) {
    return handleServiceError(err, "deleteNotice");
  }
}

// ============================================================================
// 6. Department Event Actions
// ============================================================================

export async function createDepartmentEvent(rawInput: unknown): Promise<ApiResponse<DepartmentEvent>> {
  const parseRes = createDepartmentEventSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid event input data." },
    };
  }

  const auth = await verifyDepartmentAuth("can_manage_events", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentEventService.createDepartmentEvent(auth.userId, parseRes.data);
    logger.info(`DepartmentAction: Created event ${data.id} in dept ${data.department_id} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "createDepartmentEvent");
  }
}

export async function updateDepartmentEvent(eventId: string, rawInput: unknown): Promise<ApiResponse<DepartmentEvent>> {
  const idRes = uuidSchema.safeParse(eventId);
  if (!idRes.success) return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid event UUID." } };

  const parseRes = updateDepartmentEventSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid event update data." },
    };
  }

  const auth = await verifyDepartmentAuth("can_manage_events", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentEventService.updateDepartmentEvent(auth.userId, eventId, parseRes.data);
    logger.info(`DepartmentAction: Updated event ${eventId} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "updateDepartmentEvent");
  }
}

export async function publishDepartmentEvent(
  eventId: string,
  departmentId: string,
  isPublished: boolean
): Promise<ApiResponse<DepartmentEvent>> {
  const idRes = uuidSchema.safeParse(eventId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("can_manage_events", departmentId);
  if (!auth.success) return auth;

  try {
    const data = await departmentEventService.publishDepartmentEvent(auth.userId, eventId, isPublished);
    logger.info(`DepartmentAction: Published event ${eventId} (${isPublished}) by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "publishDepartmentEvent");
  }
}

export async function deleteDepartmentEvent(eventId: string, departmentId: string): Promise<ApiResponse<void>> {
  const idRes = uuidSchema.safeParse(eventId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("can_manage_events", departmentId);
  if (!auth.success) return auth;

  try {
    await departmentEventService.deleteDepartmentEvent(auth.userId, eventId);
    logger.info(`DepartmentAction: Deleted event ${eventId} by user ${auth.userId}`);
    return { success: true };
  } catch (err) {
    return handleServiceError(err, "deleteDepartmentEvent");
  }
}

// ============================================================================
// 7. Department Publication Actions
// ============================================================================

export async function uploadPublication(rawInput: unknown): Promise<ApiResponse<DepartmentPublication>> {
  const parseRes = createDepartmentPublicationSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid publication input data." },
    };
  }

  const auth = await verifyDepartmentAuth("can_upload_publications", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentPublicationService.uploadPublication(auth.userId, parseRes.data);
    logger.info(`DepartmentAction: Uploaded publication ${data.id} in dept ${data.department_id} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "uploadPublication");
  }
}

export async function updatePublication(
  publicationId: string,
  rawInput: unknown
): Promise<ApiResponse<DepartmentPublication>> {
  const idRes = uuidSchema.safeParse(publicationId);
  if (!idRes.success) return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid publication UUID." } };

  const parseRes = updateDepartmentPublicationSchema.safeParse(rawInput);
  if (!parseRes.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parseRes.error.issues[0]?.message || "Invalid publication update data." },
    };
  }

  const auth = await verifyDepartmentAuth("can_upload_publications", parseRes.data.department_id);
  if (!auth.success) return auth;

  try {
    const data = await departmentPublicationService.updatePublication(auth.userId, publicationId, parseRes.data);
    logger.info(`DepartmentAction: Updated publication ${publicationId} by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "updatePublication");
  }
}

export async function publishPublication(
  publicationId: string,
  departmentId: string,
  isPublic: boolean
): Promise<ApiResponse<DepartmentPublication>> {
  const idRes = uuidSchema.safeParse(publicationId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("can_upload_publications", departmentId);
  if (!auth.success) return auth;

  try {
    const data = await departmentPublicationService.publishPublication(auth.userId, publicationId, isPublic);
    logger.info(`DepartmentAction: Published publication ${publicationId} (${isPublic}) by user ${auth.userId}`);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "publishPublication");
  }
}

export async function deletePublication(publicationId: string, departmentId: string): Promise<ApiResponse<void>> {
  const idRes = uuidSchema.safeParse(publicationId);
  const deptRes = uuidSchema.safeParse(departmentId);
  if (!idRes.success || !deptRes.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid UUID provided." } };
  }

  const auth = await verifyDepartmentAuth("can_upload_publications", departmentId);
  if (!auth.success) return auth;

  try {
    await departmentPublicationService.deletePublication(auth.userId, publicationId);
    logger.info(`DepartmentAction: Deleted publication ${publicationId} by user ${auth.userId}`);
    return { success: true };
  } catch (err) {
    return handleServiceError(err, "deletePublication");
  }
}

// ============================================================================
// 8. Public Read & Fetch Server Actions for Pages
// ============================================================================

export async function listPublicDepartments(
  limit = 50,
  offset = 0
): Promise<ApiResponse<Department[]>> {
  try {
    const data = await departmentCoreService.listActiveDepartments(limit, offset);
    return { success: true, data };
  } catch (err) {
    return handleServiceError(err, "listPublicDepartments");
  }
}

export async function getPublicDepartmentBySlug(
  slug: string
): Promise<ApiResponse<{
  department: Department;
  teachers: DepartmentTeacher[];
  students: DepartmentStudent[];
  activeCRs: DepartmentCR[];
  notices: DepartmentNotice[];
  events: DepartmentEvent[];
  publications: DepartmentPublication[];
}>> {
  try {
    const department = await departmentCoreService.getDepartmentBySlug(slug);
    const [teachers, students, activeCRs, notices, events, publications] = await Promise.all([
      departmentTeacherService.listTeachers(department.id, true),
      departmentStudentService.listStudents(department.id, { isVerified: true }),
      departmentCRService.listDepartmentCRs(department.id, true),
      departmentNoticeService.listNotices(department.id, { isPublished: true }),
      departmentEventService.listEvents(department.id, { isPublished: true, upcomingOnly: true }),
      departmentPublicationService.listPublications(department.id, { isPublic: true }),
    ]);

    return {
      success: true,
      data: {
        department,
        teachers,
        students,
        activeCRs,
        notices,
        events,
        publications,
      },
    };
  } catch (err) {
    return handleServiceError(err, "getPublicDepartmentBySlug");
  }
}

export async function getDepartmentDashboardData(
  departmentId: string
): Promise<ApiResponse<{
  teachers: DepartmentTeacher[];
  students: DepartmentStudent[];
  crs: DepartmentCR[];
  notices: DepartmentNotice[];
  events: DepartmentEvent[];
  publications: DepartmentPublication[];
}>> {
  try {
    const [teachers, students, crs, notices, events, publications] = await Promise.all([
      departmentTeacherService.listTeachers(departmentId, false),
      departmentStudentService.listStudents(departmentId),
      departmentCRService.listDepartmentCRs(departmentId, false),
      departmentNoticeService.listNotices(departmentId),
      departmentEventService.listEvents(departmentId),
      departmentPublicationService.listPublications(departmentId),
    ]);

    return {
      success: true,
      data: {
        teachers,
        students,
        crs,
        notices,
        events,
        publications,
      },
    };
  } catch (err) {
    return handleServiceError(err, "getDepartmentDashboardData");
  }
}
