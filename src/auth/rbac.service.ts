import { createClient } from "../lib/supabase/server";

export class RbacService {
  async checkDepartmentPermission(departmentId: string, permissionCode: string): Promise<boolean> {
    const supabase = await createClient();
    
    const { data: hasPermission, error } = await supabase.rpc(
      "has_department_permission",
      // @ts-ignore
      {
        p_dept_id: departmentId,
        p_permission_code: permissionCode,
      }
    );

    if (error) {
      console.error("RBAC Resolution Error:", error);
      return false;
    }

    return !!hasPermission;
  }

  async isSuperAdmin(): Promise<boolean> {
    const supabase = await createClient();
    const { data: isSuper, error } = await supabase.rpc("is_admin_or_super");

    if (error) {
      return false;
    }

    return !!isSuper;
  }
}
