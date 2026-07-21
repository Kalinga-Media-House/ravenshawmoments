import { revalidateTag } from "next/cache";
import { AchievementRepository } from "../../repositories/department/achievement.repository";
import { requireDepartmentPermission } from "../../lib/permissions";
import { PERMISSIONS, CONTENT_STATUS } from "../../lib/constants";
import { CacheTags } from "../../lib/cache-tags";

export class AchievementService {
  constructor(private readonly repository: AchievementRepository) {}

  async listAchievements(slug: string) {
    return await this.repository.getByDepartmentSlug(slug);
  }

  async createAchievement(departmentId: string, slug: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_ACHIEVEMENT_MANAGE);

    const achievement = await this.repository.create({
      ...payload,
      entity_type: "department",
      entity_id: departmentId,
    });
    
    revalidateTag(CacheTags.DEPARTMENT_ACHIEVEMENTS(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return achievement;
  }

  async updateAchievement(departmentId: string, slug: string, achievementId: string, payload: any) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_ACHIEVEMENT_MANAGE);

    const achievement = await this.repository.update(achievementId, payload);
    
    revalidateTag(CacheTags.DEPARTMENT_ACHIEVEMENTS(slug), "default");
    
    return achievement;
  }

  async deleteAchievement(departmentId: string, slug: string, achievementId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_ACHIEVEMENT_MANAGE);

    await this.repository.softDelete(achievementId);
    
    revalidateTag(CacheTags.DEPARTMENT_ACHIEVEMENTS(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return true;
  }

  async publishAchievement(departmentId: string, slug: string, achievementId: string) {
    await requireDepartmentPermission(departmentId, PERMISSIONS.DEPARTMENT_ACHIEVEMENT_MANAGE);

    // @ts-ignore
    const achievement = await this.repository.update(achievementId, { status: CONTENT_STATUS.PUBLISHED });
    
    revalidateTag(CacheTags.DEPARTMENT_ACHIEVEMENTS(slug), "default");
    revalidateTag(CacheTags.DEPARTMENT_STATS, "default");
    
    return achievement;
  }
}
