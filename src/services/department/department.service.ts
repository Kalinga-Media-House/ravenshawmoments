import { revalidateTag } from "next/cache";
import { DepartmentRepository } from "../../repositories/department/department.repository";
import { requireDepartmentPermission } from "../../lib/permissions";
import { PERMISSIONS } from "../../lib/constants";
import { CacheTags } from "../../lib/cache-tags";
import { ConflictError, NotFoundError } from "../../lib/errors";

export class DepartmentService {
  constructor(private readonly repository: DepartmentRepository) {}

  async getDepartmentPage(slug: string) {
    // Pure read operation, relies on RLS and RPC for public data extraction
    return await this.repository.getPublicPage(slug);
  }

  async getDepartmentOverview() {
    return await this.repository.getPublicDirectory();
  }

  async updateDepartment(departmentId: string, slug: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_SETTINGS_MANAGE);

    const updated = await this.repository.update(departmentId, payload);
    
    // Invalidate caches
    revalidateTag(CacheTags.DEPARTMENTS, "default");
    revalidateTag(CacheTags.DEPARTMENT(slug), "default");

    return updated;
  }

  async publishDepartment(departmentId: string, slug: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_SETTINGS_MANAGE);

    const updated = await this.repository.update(departmentId, { is_active: true });
    
    revalidateTag(CacheTags.DEPARTMENTS, "default");
    revalidateTag(CacheTags.DEPARTMENT(slug), "default");

    return updated;
  }

  async archiveDepartment(departmentId: string, slug: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_SETTINGS_MANAGE);

    // Soft delete to archive
    await this.repository.softDelete(departmentId);
    
    revalidateTag(CacheTags.DEPARTMENTS, "default");
    revalidateTag(CacheTags.DEPARTMENT(slug), "default");

    return true;
  }
}
