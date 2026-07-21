import { revalidateTag } from "next/cache";
import { FacultyRepository } from "../../repositories/department/faculty.repository";
import { requireDepartmentPermission } from "../../lib/permissions";
import { PERMISSIONS } from "../../lib/constants";
import { CacheTags } from "../../lib/cache-tags";

export class FacultyService {
  constructor(private readonly repository: FacultyRepository) {}

  async listFaculty(slug: string) {
    return await this.repository.getByDepartmentSlug(slug);
  }



  async getFaculty(departmentId: string, facultyId: string) {
    // Rely on base repository for direct fetch if needed, 
    // though the RPC mostly handles public aggregation.
    return await this.repository.findById(facultyId);
  }

  async createFaculty(departmentId: string, slug: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_FACULTY_MANAGE);

    const faculty = await this.repository.create({ ...payload, department_id: departmentId });
    
    revalidateTag(CacheTags.DEPARTMENT_FACULTY(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return faculty;
  }

  async updateFaculty(departmentId: string, slug: string, facultyId: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_FACULTY_MANAGE);

    const faculty = await this.repository.update(facultyId, payload);
    
    revalidateTag(CacheTags.DEPARTMENT_FACULTY(slug), "default");
    
    return faculty;
  }

  async deleteFaculty(departmentId: string, slug: string, facultyId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_FACULTY_MANAGE);

    await this.repository.softDelete(facultyId);
    
    revalidateTag(CacheTags.DEPARTMENT_FACULTY(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return true;
  }

  async assignDesignation(departmentId: string, slug: string, facultyId: string, designation: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_FACULTY_MANAGE);

    const faculty = await this.repository.update(facultyId, { designation_title: designation });
    
    revalidateTag(CacheTags.DEPARTMENT_FACULTY(slug), "default");
    
    return faculty;
  }
}
