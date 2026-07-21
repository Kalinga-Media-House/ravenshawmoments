import { PlacementRegistrationRepository, PlacementRegistrationInsert, PlacementRegistrationUpdate, GetPlacementRegistrationsOptions } from '../repositories/PlacementRegistrationRepository';
import { PlacementDriveRepository } from '../repositories/PlacementDriveRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class PlacementRegistrationService {
  private repository: PlacementRegistrationRepository;
  private driveRepository: PlacementDriveRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.repository = new PlacementRegistrationRepository(supabase);
    this.driveRepository = new PlacementDriveRepository(supabase);
  }

  async getRegistrations(options?: GetPlacementRegistrationsOptions) {
    return this.repository.getRegistrations(options);
  }

  async getRegistrationById(id: string) {
    return this.repository.getRegistrationById(id);
  }

  async getRegistrationByUserAndDrive(profileId: string, driveId: string) {
    return this.repository.getRegistrationByUserAndDrive(profileId, driveId);
  }

  async applyForDrive(registration: PlacementRegistrationInsert) {
    // 1. Check if drive is open
    const drive = await this.driveRepository.getDriveById(registration.drive_id);
    if (!drive) throw new Error('Drive not found');
    
    if (drive.status !== 'registration_open') {
      throw new Error('Drive is not open for registrations');
    }

    // 2. Check if already applied
    const existing = await this.getRegistrationByUserAndDrive(registration.profile_id, registration.drive_id);
    if (existing) {
      throw new Error('Already applied for this drive');
    }

    // 3. Eligibility Check Placeholder
    // The actual CGPA and backlog check would query education_records. 
    // This is typically done either here or via database constraints.
    // For now, if the student clicks apply, we assume the UI gated them, 
    // or we can implement explicit checks if we fetch education records.

    return this.repository.createRegistration(registration);
  }

  async updateRegistrationStatus(id: string, status: Database['public']['Tables']['placement_registrations']['Row']['status']) {
    return this.repository.updateRegistration(id, { status });
  }
}
