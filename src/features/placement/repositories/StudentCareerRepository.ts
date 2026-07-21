import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type StudentResumeRow = Database['public']['Tables']['student_resumes']['Row'];
export type StudentResumeInsert = Database['public']['Tables']['student_resumes']['Insert'];

export type StudentSkillRow = Database['public']['Tables']['student_skills']['Row'];
export type StudentSkillInsert = Database['public']['Tables']['student_skills']['Insert'];

export type StudentProjectRow = Database['public']['Tables']['student_projects']['Row'];
export type StudentProjectInsert = Database['public']['Tables']['student_projects']['Insert'];

export type StudentExperienceRow = Database['public']['Tables']['student_experiences']['Row'];
export type StudentExperienceInsert = Database['public']['Tables']['student_experiences']['Insert'];

export class StudentCareerRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // Resumes
  async getResumes(profileId: string) {
    const { data, error } = await this.supabase
      .from('student_resumes')
      .select('*, media_file:media_files(*)')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async addResume(resume: StudentResumeInsert) {
    if (resume.is_default) {
      await this.supabase
        .from('student_resumes')
        .update({ is_default: false })
        .eq('profile_id', resume.profile_id)
        .eq('is_default', true);
    }
    const { data, error } = await this.supabase
      .from('student_resumes')
      .insert(resume)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteResume(id: string) {
    const { error } = await this.supabase.from('student_resumes').delete().eq('id', id);
    if (error) throw error;
  }

  // Skills
  async getSkills(profileId: string) {
    const { data, error } = await this.supabase
      .from('student_skills')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async addSkill(skill: StudentSkillInsert) {
    const { data, error } = await this.supabase.from('student_skills').insert(skill).select().single();
    if (error) throw error;
    return data;
  }

  async deleteSkill(id: string) {
    const { error } = await this.supabase.from('student_skills').delete().eq('id', id);
    if (error) throw error;
  }

  // Projects
  async getProjects(profileId: string) {
    const { data, error } = await this.supabase
      .from('student_projects')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async addProject(project: StudentProjectInsert) {
    const { data, error } = await this.supabase.from('student_projects').insert(project).select().single();
    if (error) throw error;
    return data;
  }

  async deleteProject(id: string) {
    const { error } = await this.supabase.from('student_projects').delete().eq('id', id);
    if (error) throw error;
  }

  // Experiences
  async getExperiences(profileId: string) {
    const { data, error } = await this.supabase
      .from('student_experiences')
      .select('*')
      .eq('profile_id', profileId)
      .order('start_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async addExperience(experience: StudentExperienceInsert) {
    const { data, error } = await this.supabase.from('student_experiences').insert(experience).select().single();
    if (error) throw error;
    return data;
  }

  async deleteExperience(id: string) {
    const { error } = await this.supabase.from('student_experiences').delete().eq('id', id);
    if (error) throw error;
  }
}
