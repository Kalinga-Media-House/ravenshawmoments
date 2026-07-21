import { BaseRepository } from "@/repositories/base.repository";
import { Database } from "@/types/database.types";
import { RepositoryContext } from "@/repositories/repository.types";

export type HostelInventoryRow = Database["public"]["Tables"]["hostel_inventory"]["Row"];

export class HostelInventoryRepository extends BaseRepository<HostelInventoryRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostel_inventory";

  async getInventoryByHostelId(hostelId: string): Promise<any[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*")
      .eq("hostel_id", hostelId)
      .order("item_name", { ascending: true });

    if (error) throw new Error("Failed to fetch inventory.");
    return data;
  }
}
