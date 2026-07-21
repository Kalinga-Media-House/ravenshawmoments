import { createClient } from "./supabase/server";
import { requireAuth } from "./auth";
import { PermissionError } from "./errors";

export async function hasDepartmentPermission(
  departmentId: string,
  permissionCode: string
): Promise<boolean> {
  const supabase = await createClient();
  
  // Reuse the exact DB RPC for permission checking
  const { data: hasPermission, error } = await supabase.rpc(
    "has_department_permission",
    // @ts-ignore
    {
      p_dept_id: departmentId,
      p_permission_code: permissionCode,
    }
  );

  if (error) {
    console.error("Error checking department permission:", error);
    return false;
  }

  return !!hasPermission;
}

export async function requireDepartmentPermission(
  departmentId: string,
  permissionCode: string
) {
  // First ensure they are authenticated
  await requireAuth();

  const isAllowed = await hasDepartmentPermission(departmentId, permissionCode);
  if (!isAllowed) {
    throw new PermissionError(
      `Required permission ${permissionCode} for department ${departmentId}`
    );
  }

  return true;
}
