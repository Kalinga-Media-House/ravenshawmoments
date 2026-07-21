import { BaseRepository } from "@/repositories/base.repository";
import { Database } from "@/types/database.types";
import { RepositoryContext } from "@/repositories/repository.types";

export type HostelMessMenuRow = Database["public"]["Tables"]["hostel_mess_menus"]["Row"];

export class HostelMessMenuRepository extends BaseRepository<HostelMessMenuRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostel_mess_menus";

  async getMenuByHostelId(hostelId: string): Promise<HostelMessMenuRow[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*")
      .eq("hostel_id", hostelId);

    if (error) throw new Error("Failed to fetch mess menu.");
    return data as HostelMessMenuRow[];
  }
}

export class HostelMessService {
  private menuRepo: HostelMessMenuRepository;

  constructor(context: RepositoryContext) {
    this.menuRepo = new HostelMessMenuRepository(context);
  }

  async getWeeklyMenu(hostelId: string) {
    return this.menuRepo.getMenuByHostelId(hostelId);
  }

  async updateMenu(hostelId: string, dayOfWeek: number, mealType: string, items_description: string) {
    // Check if exists
    const menu = await this.getWeeklyMenu(hostelId);
    const existing = menu.find(m => m.day_of_week === dayOfWeek && m.meal_type === mealType);

    if (existing) {
      return this.menuRepo.update(existing.id, { items_description });
    } else {
      return this.menuRepo.create({
        hostel_id: hostelId,
        day_of_week: dayOfWeek,
        meal_type: mealType,
        items_description: items_description
      });
    }
  }
}
