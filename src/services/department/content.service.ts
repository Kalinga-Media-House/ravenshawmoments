import { revalidateTag } from "next/cache";
import { ContentRepository } from "../../repositories/department/content.repository";
import { requireDepartmentPermission } from "../../lib/permissions";
import { PERMISSIONS, CONTENT_STATUS } from "../../lib/constants";
import { CacheTags } from "../../lib/cache-tags";

export class ContentService {
  constructor(private readonly repository: ContentRepository) {}

  async getSectionsByDepartmentSlug(slug: string) {
    return this.repository.getSectionsByDepartmentSlug(slug);
  }

  async createSection(departmentId: string, slug: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);

    const section = await this.repository.create({
      ...payload,
      entity_type: "department",
      entity_id: departmentId,
      content_type: "page_section",
    });
    
    revalidateTag(CacheTags.DEPARTMENT(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return section;
  }

  async updateSection(departmentId: string, slug: string, sectionId: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);

    const section = await this.repository.update(sectionId, payload);
    
    revalidateTag(CacheTags.DEPARTMENT(slug), "default");
    
    return section;
  }

  async publishSection(departmentId: string, slug: string, sectionId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);

    const section = await this.repository.update(sectionId, { is_published: true });
    
    revalidateTag(CacheTags.DEPARTMENT(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return section;
  }

  async archiveSection(departmentId: string, slug: string, sectionId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);

    const section = await this.repository.update(sectionId, { is_published: false });
    
    revalidateTag(CacheTags.DEPARTMENT(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return section;
  }

  async reorderSections(departmentId: string, slug: string, items: { id: string, order: number }[]) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_CONTENT_MANAGE);

    await Promise.all(
      items.map((item) =>
        this.repository.update(item.id, { updated_at: new Date().toISOString() })
      )
    );
    
    revalidateTag(CacheTags.DEPARTMENT(slug), "default");
    
    return true;
  }
}
