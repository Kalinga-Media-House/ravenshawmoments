import { StudentCareerRepository, StudentResumeInsert, StudentSkillInsert, StudentProjectInsert, StudentExperienceInsert } from '../repositories/StudentCareerRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class StudentCareerService {
  private repository: StudentCareerRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new StudentCareerRepository(supabase);
  }

  // Resumes
  async getResumes(profileId: string) {
    return this.repository.getResumes(profileId);
  }

  async addResume(resume: StudentResumeInsert) {
    return this.repository.addResume(resume);
  }

  async deleteResume(id: string) {
    return this.repository.deleteResume(id);
  }

  // Skills
  async getSkills(profileId: string) {
    return this.repository.getSkills(profileId);
  }

  async addSkill(skill: StudentSkillInsert) {
    return this.repository.addSkill(skill);
  }

  async deleteSkill(id: string) {
    return this.repository.deleteSkill(id);
  }

  // Projects
  async getProjects(profileId: string) {
    return this.repository.getProjects(profileId);
  }

  async addProject(project: StudentProjectInsert) {
    return this.repository.addProject(project);
  }

  async deleteProject(id: string) {
    return this.repository.deleteProject(id);
  }

  // Experiences
  async getExperiences(profileId: string) {
    return this.repository.getExperiences(profileId);
  }

  async addExperience(experience: StudentExperienceInsert) {
    return this.repository.addExperience(experience);
  }

  async deleteExperience(id: string) {
    return this.repository.deleteExperience(id);
  }
}
