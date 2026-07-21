import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

type OrgMembershipRow = Database["public"]["Tables"]["organization_members"]["Row"];
export type OrganizationMembership = OrgMembershipRow;

export class OrganizationRepository extends BaseRepository<OrgMembershipRow> {
  protected tableName: keyof Database["public"]["Tables"] = "organization_members";

  async findByProfileId(profileId: string): Promise<OrgMembershipRow[]> {
    const { data, error } = await this.supabase
      .from("organization_members")
      .select("*")
      .eq("profile_id", profileId)
      .order("start_date", { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to fetch memberships: ${error.message}`, error);
    }

    return (data as any) || [];
  }

  async addMembership(payload: Partial<OrgMembershipRow>): Promise<OrgMembershipRow> {
    return this.create({
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any);
  }

  async removeMembership(id: string): Promise<boolean> {
    return this.delete(id);
  }
}
