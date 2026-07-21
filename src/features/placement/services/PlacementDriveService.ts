import { PlacementDriveRepository, PlacementDriveInsert, PlacementDriveUpdate, GetPlacementDrivesOptions } from '../repositories/PlacementDriveRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class PlacementDriveService {
  private repository: PlacementDriveRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new PlacementDriveRepository(supabase);
  }

  async getDrives(options?: GetPlacementDrivesOptions) {
    return this.repository.getDrives(options);
  }

  async getDriveById(id: string) {
    return this.repository.getDriveById(id);
  }

  async getDriveBySlug(slug: string) {
    return this.repository.getDriveBySlug(slug);
  }

  async createDrive(drive: PlacementDriveInsert, departmentIds: string[] = []) {
    return this.repository.createDrive(drive, departmentIds);
  }

  async updateDrive(id: string, updates: PlacementDriveUpdate, departmentIds?: string[]) {
    return this.repository.updateDrive(id, updates, departmentIds);
  }

  async deleteDrive(id: string) {
    return this.repository.deleteDrive(id);
  }
}
