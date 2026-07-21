import type { Database } from "../../types/database.types";
import { DatabaseError, NotFoundError } from "../../lib/errors";

type DepartmentStatistics = Database["public"]["Views"]["mv_department_statistics"]["Row"];

export class AnalyticsRepository {
  constructor(private context: { supabase: any }) {}

  async getDepartmentStatistics(slug: string): Promise<DepartmentStatistics> {
    const { data, error } = await this.context.supabase
      .from("mv_department_statistics")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError(`Statistics for department ${slug} not found`);
      }
      throw new DatabaseError(`Failed to fetch statistics for department ${slug}`, error);
    }

    return data as DepartmentStatistics;
  }

  async getAllStatistics(): Promise<DepartmentStatistics[]> {
    const { data, error } = await this.context.supabase
      .from("mv_department_statistics")
      .select("*");

    if (error) {
      throw new DatabaseError("Failed to fetch all department statistics", error);
    }

    return data as DepartmentStatistics[];
  }

  async getStatisticsByLevel(level: string): Promise<DepartmentStatistics> {
    // Count students and teachers directly from profiles since there's no MV for this
    const { count: studentsCount, error: studentsError } = await this.context.supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("level", level)
      .eq("profile_type", "student");

    if (studentsError) {
      throw new DatabaseError(`Failed to count students for level ${level}`, studentsError);
    }

    const { count: facultyCount, error: facultyError } = await this.context.supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("level", level)
      .eq("profile_type", "teacher");

    if (facultyError) {
      throw new DatabaseError(`Failed to count teachers for level ${level}`, facultyError);
    }

    // Mock other stats for RHSS until supported natively
    return {
      achievements_count: 5,
      content_sections_count: 0,
      department_id: `level-${level}`,
      faculty_count: facultyCount || 0,
      gallery_albums_count: 3,
      name: level === "+2" ? "Higher Secondary" : "Academic Level",
      programs_count: 4,
      slug: level === "+2" ? "rhss" : level,
      students_count: studentsCount || 0
    };
  }
}
