import { RbacService } from "../rbac.service";
import { requireAuth } from "./require-auth";
import { PermissionError } from "../../lib/errors";

export async function requireDepartmentPermission(departmentId: string, permissionCode: string) {
  const user = await requireAuth();
  const rbacService = new RbacService();
  
  const hasPermission = await rbacService.checkDepartmentPermission(departmentId, permissionCode);

  if (!hasPermission) {
    throw new PermissionError(`Required permission '${permissionCode}' missing for department ${departmentId}.`);
  }

  return user;
}
