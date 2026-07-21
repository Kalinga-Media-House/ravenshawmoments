import { RbacService } from "../rbac.service";
import { requireAuth } from "./require-auth";
import { PermissionError } from "../../lib/errors";

export async function requireSuperAdmin() {
  const user = await requireAuth();
  const rbacService = new RbacService();
  
  const isSuper = await rbacService.isSuperAdmin();

  if (!isSuper) {
    throw new PermissionError("Super Administrator privileges required.");
  }

  return user;
}
