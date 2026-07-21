import { BaseRepository } from "../base.repository";
import type { Database } from "../../types/database.types";
import { DatabaseError, NotFoundError } from "../../lib/errors";

type DepartmentRow = Database["public"]["Tables"]["departments"]["Row"];
type DepartmentPublicDirectory = Database["public"]["Views"]["v_department_public_directory"]["Row"];

export class DepartmentRepository extends BaseRepository<DepartmentRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "departments";

  async getPublicPage(slug: string) {
    const { data, error } = await this.supabase
      // @ts-ignore
      .rpc("get_department_public_page", { p_slug: slug });

    if (error) {
      throw new DatabaseError(`Failed to fetch public page for department ${slug}`, error);
    }
    
    if (!data) {
      throw new NotFoundError(`Department public page not found for slug: ${slug}`);
    }

    return data;
  }

  async getPublicDirectory() {
    const { data, error } = await this.supabase
      .from("v_department_public_directory" as any)
      .select("*")
      .eq("id", true)
      .order("name", { ascending: true });

    if (error) {
      throw new DatabaseError("Failed to fetch public department directory", error);
    }

    // @ts-ignore
    return data as DepartmentPublicDirectory[];
  }

  async getSettings(departmentId: string) {
    const { data, error } = await this.supabase
      .from("department_settings" as any)
      .select("*")
      .eq("department_id", departmentId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError(`Settings for department ${departmentId} not found`);
      }
      throw new DatabaseError("Failed to fetch department settings", error);
    }

    return data;
  }
}
