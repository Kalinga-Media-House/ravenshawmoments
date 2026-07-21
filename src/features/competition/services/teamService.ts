import { createClient } from "@/lib/supabase/server";
import { CompetitionTeam, CompetitionTeamMember } from "../types/extended-database.types";

export const teamService = {
  async getTeamsByCompetition(competitionId: string) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_teams")
      .select("*, leader:profiles(*), members:competition_team_members(profile:profiles(*), role, joined_at)")
      .eq("competition_id", competitionId);
    
    if (error) throw error;
    return data;
  },

  async createTeam(competitionId: string, teamName: string, leaderProfileId: string) {
    const supabase = await createClient() as any;
    // 1. Create team
    const { data: team, error: teamError } = await supabase
      .from("competition_teams")
      .insert({
        competition_id: competitionId,
        team_name: teamName,
        leader_profile_id: leaderProfileId,
        team_status: "pending"
      })
      .select()
      .single();
      
    if (teamError) throw teamError;

    // 2. Add leader as member
    const { error: memberError } = await supabase
      .from("competition_team_members")
      .insert({
        team_id: team.id,
        profile_id: leaderProfileId,
        role: "leader"
      });

    if (memberError) throw memberError;

    return team as CompetitionTeam;
  },

  async addTeamMember(teamId: string, profileId: string) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_team_members")
      .insert({
        team_id: teamId,
        profile_id: profileId,
        role: "member"
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as CompetitionTeamMember;
  },

  async removeTeamMember(teamId: string, profileId: string) {
    const supabase = await createClient() as any;
    const { error } = await supabase
      .from("competition_team_members")
      .delete()
      .match({ team_id: teamId, profile_id: profileId });
      
    if (error) throw error;
    return true;
  },

  async updateTeamStatus(teamId: string, status: "pending" | "approved" | "rejected") {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_teams")
      .update({ team_status: status })
      .eq("id", teamId)
      .select()
      .single();
      
    if (error) throw error;
    return data as CompetitionTeam;
  }
};
