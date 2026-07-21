import { revalidateTag } from "next/cache";
import { StudentRepository } from "../../repositories/department/student.repository";
import { requireDepartmentPermission } from "../../lib/permissions";
import { PERMISSIONS } from "../../lib/constants";
import { CacheTags } from "../../lib/cache-tags";

export class StudentService {
  constructor(private readonly repository: StudentRepository) {}

  async listStudents(slug: string) {
    return await this.repository.getByDepartmentSlug(slug);
  }

  async listStudentsByLevel(level: string, filters?: { stream?: string, batch_year?: string, search?: string }) {
    return await this.repository.getByLevelAndStream(level, filters);
  }

  async getStudent(studentId: string) {
    return await this.repository.findById(studentId);
  }

  async approveStudent(departmentId: string, slug: string, studentId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);

    const student = await this.repository.update(studentId, { is_active: true });
    
    revalidateTag(CacheTags.DEPARTMENT_STUDENTS(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return student;
  }

  async rejectStudent(departmentId: string, slug: string, studentId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);

    const student = await this.repository.update(studentId, { is_active: false });
    
    revalidateTag(CacheTags.DEPARTMENT_STUDENTS(slug), "default");
    
    return student;
  }

  async verifyStudent(departmentId: string, slug: string, studentId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);

    // Marking explicitly as verified (can also integrate with verification_requests)
    const student = await this.repository.update(studentId, { is_active: true });
    
    revalidateTag(CacheTags.DEPARTMENT_STUDENTS(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return student;
  }

  async removeStudent(departmentId: string, slug: string, studentId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_STUDENT_MANAGE);

    await this.repository.softDelete(studentId);
    
    revalidateTag(CacheTags.DEPARTMENT_STUDENTS(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return true;
  }
}
