import { revalidateTag } from "next/cache";
import { ProgramRepository } from "../../repositories/department/program.repository";
import { requireDepartmentPermission } from "../../lib/permissions";
import { PERMISSIONS } from "../../lib/constants";
import { CacheTags } from "../../lib/cache-tags";

export class ProgramService {
  constructor(private readonly repository: ProgramRepository) {}

  async listPrograms(slug: string) {
    return await this.repository.getByDepartmentSlug(slug);
  }

  async createProgram(departmentId: string, slug: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_PROGRAM_MANAGE);

    const program = await this.repository.create({ ...payload, department_id: departmentId });
    
    revalidateTag(CacheTags.DEPARTMENT_PROGRAMS(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return program;
  }

  async updateProgram(departmentId: string, slug: string, programId: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_PROGRAM_MANAGE);

    const program = await this.repository.update(programId, payload);
    
    revalidateTag(CacheTags.DEPARTMENT_PROGRAMS(slug), "default");
    
    return program;
  }

  async archiveProgram(departmentId: string, slug: string, programId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_PROGRAM_MANAGE);

    // @ts-ignore
    const program = await this.repository.update(programId, { is_active: "archived" });
    
    revalidateTag(CacheTags.DEPARTMENT_PROGRAMS(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return program;
  }
}
