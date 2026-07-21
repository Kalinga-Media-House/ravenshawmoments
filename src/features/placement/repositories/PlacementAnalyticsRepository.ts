import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class PlacementAnalyticsRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getOverallStatistics() {
    // In a real app we might sum up the view, but here we can query the view
    const { data, error } = await this.supabase
      .from('placement_statistics')
      .select('*');

    if (error) throw error;
    
    let totalDrives = 0;
    let totalApplications = 0;
    let totalOffers = 0;
    let highestPackage = 0;

    data.forEach(stat => {
      totalDrives += Number(stat.total_drives || 0);
      totalApplications += Number(stat.total_applications || 0);
      totalOffers += Number(stat.total_offers || 0);
      if (stat.highest_package && stat.highest_package > highestPackage) {
        highestPackage = stat.highest_package;
      }
    });

    return {
      totalDrives,
      totalApplications,
      totalOffers,
      highestPackage,
      companiesCount: data.length
    };
  }

  async getCompanyStatistics() {
    const { data, error } = await this.supabase
      .from('placement_statistics')
      .select('*')
      .order('total_offers', { ascending: false });

    if (error) throw error;
    return data;
  }
}
