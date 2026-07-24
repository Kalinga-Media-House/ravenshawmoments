import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type PlacementDriveRow = Database['public']['Tables']['placement_drives']['Row'];
export type PlacementDriveInsert = Database['public']['Tables']['placement_drives']['Insert'];
export type PlacementDriveUpdate = Database['public']['Tables']['placement_drives']['Update'];

export interface GetPlacementDrivesOptions {
  companyId?: string;
  status?: PlacementDriveRow['status'];
  jobType?: PlacementDriveRow['job_type'];
  departmentId?: string;
  limit?: number;
  offset?: number;
}

export class PlacementDriveRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getDrives(options: GetPlacementDrivesOptions = {}) {
    let query = this.supabase
      .from('placement_drives')
      .select('*, company:companies!placement_drives_company_id_fkey(*, logo:media_files!companies_logo_media_id_fkey(storage_bucket, storage_path, public_id))', { count: 'exact' });

    if (options.companyId) {
      query = query.eq('company_id', options.companyId);
    }
    if (options.status) {
      query = query.eq('status', options.status);
    }
    if (options.jobType) {
      query = query.eq('job_type', options.jobType);
    }
    
    // Filtering by eligible department would require an inner join or subquery. 
    // In Supabase, if we want drives for a specific department:
    if (options.departmentId) {
      // We can use a linked table filter
      const depQuery = this.supabase
        .from('placement_drives')
        .select(`
          *,
          company:companies!placement_drives_company_id_fkey(*, logo:media_files!companies_logo_media_id_fkey(storage_bucket, storage_path, public_id)),
          placement_drive_departments!inner(department_id)
        `, { count: 'exact' })
        .eq('placement_drive_departments.department_id', options.departmentId);
        
      if (options.companyId) depQuery.eq('company_id', options.companyId);
      if (options.status) depQuery.eq('status', options.status);
      if (options.jobType) depQuery.eq('job_type', options.jobType);
      
      depQuery.order('created_at', { ascending: false });
      if (options.limit) depQuery.limit(options.limit);
      if (options.offset) depQuery.range(options.offset, options.offset + (options.limit || 10) - 1);
      
      const { data, error, count } = await depQuery;
      if (error) throw error;
      return { drives: data as unknown as PlacementDriveRow[], count };
    }

    query = query.order('created_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    
    // clean up the inner join artifact from output if needed
    return { drives: data, count };
  }

  async getDriveById(id: string) {
    const { data, error } = await this.supabase
      .from('placement_drives')
      .select(`
        *,
        company:companies!placement_drives_company_id_fkey(*, logo:media_files!companies_logo_media_id_fkey(storage_bucket, storage_path, public_id)),
        departments:placement_drive_departments(department:departments(*))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
  
  async getDriveBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('placement_drives')
      .select(`
        *,
        company:companies!placement_drives_company_id_fkey(*, logo:media_files!companies_logo_media_id_fkey(storage_bucket, storage_path, public_id)),
        departments:placement_drive_departments(department:departments(*))
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async createDrive(drive: PlacementDriveInsert, departmentIds: string[]) {
    // Transaction-like behaviour using RPC is ideal, but we can do consecutive queries here
    const { data, error } = await this.supabase
      .from('placement_drives')
      .insert(drive)
      .select()
      .single();

    if (error) throw error;

    if (departmentIds && departmentIds.length > 0) {
      const depLinks = departmentIds.map(depId => ({ drive_id: data.id, department_id: depId }));
      const { error: depError } = await this.supabase
        .from('placement_drive_departments')
        .insert(depLinks);
      
      if (depError) console.error("Failed to link departments", depError);
    }

    return data;
  }

  async updateDrive(id: string, updates: PlacementDriveUpdate, departmentIds?: string[]) {
    const { data, error } = await this.supabase
      .from('placement_drives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (departmentIds !== undefined) {
      // delete existing
      await this.supabase.from('placement_drive_departments').delete().eq('drive_id', id);
      
      if (departmentIds.length > 0) {
        const depLinks = departmentIds.map(depId => ({ drive_id: id, department_id: depId }));
        await this.supabase.from('placement_drive_departments').insert(depLinks);
      }
    }

    return data;
  }

  async deleteDrive(id: string) {
    const { error } = await this.supabase
      .from('placement_drives')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
