import { RbacService } from "../rbac.service";
import { requireAuth } from "./require-auth";
import { PermissionError } from "../../lib/errors";
import { PERMISSIONS } from "../../lib/constants";

export async function requireDepartmentAdmin(departmentId: string) {
  const user = await requireAuth();
  const rbacService = new RbacService();
  
  // Department Admin is effectively verified via the highest permission level
  // or explicitly checking the department_hod or profile_roles.
  // Using the DB RPC ensures we don't duplicate logic.
  const isDeptAdmin = await rbacService.checkDepartmentPermission(
    departmentId, 
    PERMISSIONS.DEPARTMENT_SETTINGS_MANAGE
  );

  if (!isDeptAdmin) {
    throw new PermissionError(`Department Administrator privileges required for department ${departmentId}.`);
  }

  return user;
}
