import { revalidateTag } from "next/cache";
import { requireDepartmentPermission } from "../../lib/permissions";
import { PERMISSIONS, VERIFICATION_STATUS } from "../../lib/constants";
import { CacheTags } from "../../lib/cache-tags";

export class VerificationService {
  constructor(private context: { supabase: any }) {}

  async submitVerification(departmentId: string, studentId: string, payload: any) {
    // Submit to global verification_requests table
    const { data, error } = await this.context.supabase
      .from("verification_requests")
      .insert({
        entity_id: studentId,
        entity_type: "department_student",
        submitted_data: payload,
        status: VERIFICATION_STATUS.PENDING
      })
      .select()
      .single();

    if (error) throw new Error("Failed to submit verification request");
    return data;
  }

  async approveVerification(departmentId: string, slug: string, requestId: string, studentId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);

    // 1. Update request status
    await this.context.supabase
      .from("verification_requests")
      .update({ status: VERIFICATION_STATUS.APPROVED, resolved_at: new Date().toISOString() })
      .eq("id", requestId);

    // 2. Mark student as active
    await this.context.supabase
      .from("department_students")
      .update({ status: "active" })
      .eq("id", studentId);

    revalidateTag(CacheTags.DEPARTMENT_STUDENTS(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return true;
  }

  async rejectVerification(departmentId: string, slug: string, requestId: string, reason: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);

    await this.context.supabase
      .from("verification_requests")
      .update({ 
        status: VERIFICATION_STATUS.REJECTED, 
        rejection_reason: reason,
        resolved_at: new Date().toISOString() 
      })
      .eq("id", requestId);

    return true;
  }
}
