import { RbacService } from "../rbac.service";
import { requireAuth } from "./require-auth";
import { PermissionError } from "../../lib/errors";

export async function requireAdmin() {
  const user = await requireAuth();
  const rbacService = new RbacService();
  
  // Reuse existing RPC 'is_admin_or_super' which checks for PLATFORM_ADMIN or SUPER_ADMIN
  const isAdmin = await rbacService.isSuperAdmin();

  if (!isAdmin) {
    throw new PermissionError("Administrative privileges required.");
  }

  return user;
}
