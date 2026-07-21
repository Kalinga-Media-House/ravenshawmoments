import { createClient } from "@/lib/supabase/server";
import { 
  CompetitionJudge, 
  CompetitionEvaluationCriteria, 
  CompetitionEvaluation 
} from "../types/extended-database.types";

export const judgingService = {
  // 1. Judges Management
  async getJudges(competitionId: string) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_judges")
      .select("*, profile:profiles(*)")
      .eq("competition_id", competitionId);
    
    if (error) throw error;
    return data;
  },

  async assignJudge(competitionId: string, profileId: string, assignedBy: string) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_judges")
      .insert({
        competition_id: competitionId,
        profile_id: profileId,
        assigned_by: assignedBy,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as CompetitionJudge;
  },

  async removeJudge(judgeId: string) {
    const supabase = await createClient() as any;
    const { error } = await supabase
      .from("competition_judges")
      .delete()
      .eq("id", judgeId);
    
    if (error) throw error;
    return true;
  },

  // 2. Evaluation Criteria Management
  async getCriteria(competitionId: string) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_evaluation_criteria")
      .select("*")
      .eq("competition_id", competitionId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data as CompetitionEvaluationCriteria[];
  },

  async addCriteria(criteria: Partial<CompetitionEvaluationCriteria>) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_evaluation_criteria")
      .insert(criteria)
      .select()
      .single();
    
    if (error) throw error;
    return data as CompetitionEvaluationCriteria;
  },

  async updateCriteria(id: string, updates: Partial<CompetitionEvaluationCriteria>) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_evaluation_criteria")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data as CompetitionEvaluationCriteria;
  },

  async removeCriteria(id: string) {
    const supabase = await createClient() as any;
    const { error } = await supabase
      .from("competition_evaluation_criteria")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return true;
  },

  // 3. Evaluations Submission
  async submitEvaluation(evaluation: Partial<CompetitionEvaluation>) {
    const supabase = await createClient() as any;
    // Using upsert to allow judges to update their scores
    const { data, error } = await supabase
      .from("competition_evaluations")
      .upsert(evaluation, { 
        onConflict: evaluation.registration_id 
          ? 'judge_id, registration_id, criteria_id' 
          : 'judge_id, team_id, criteria_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as CompetitionEvaluation;
  },

  async getEvaluationsByJudge(judgeId: string) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_evaluations")
      .select("*")
      .eq("judge_id", judgeId);
    
    if (error) throw error;
    return data as CompetitionEvaluation[];
  },

  async getLeaderboardData(competitionId: string) {
    const supabase = await createClient() as any;
    // Aggregate scores from evaluations
    // This is a simplified fetch; in reality, we might want to sum scores via a View or RPC.
    const { data, error } = await supabase
      .from("competition_evaluations")
      .select("*, criteria:competition_evaluation_criteria(weightage), judge:competition_judges(competition_id)")
      .eq("judge.competition_id", competitionId);
    
    if (error) throw error;
    return data;
  }
};
