import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

type EducationRow = Database["public"]["Tables"]["education_records"]["Row"];
export type Education = EducationRow;

export class EducationRepository extends BaseRepository<EducationRow> {
  protected tableName: keyof Database["public"]["Tables"] = "education_records";

  async findByProfileId(profileId: string): Promise<EducationRow[]> {
    const { data, error } = await this.supabase
      .from("education_records")
      .select("*")
      .eq("profile_id", profileId)
      .order("start_date", { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to fetch education history: ${error.message}`, error);
    }

    return (data as any) || [];
  }

  async addEducation(profileId: string, payload: Omit<EducationRow, "id" | "profile_id" | "created_at" | "updated_at">): Promise<EducationRow> {
    return this.create({
      ...payload,
      profile_id: profileId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any);
  }

  async updateEducation(id: string, payload: Partial<EducationRow>): Promise<EducationRow> {
    return this.update(id, { ...payload, updated_at: new Date().toISOString() });
  }

  async deleteEducation(id: string): Promise<boolean> {
    return this.delete(id);
  }
}
