import { Database } from '@/types/database.types';

export class IntelligenceRepository {
  constructor(private supabase: any) {}

  async getPlatformOverview() {
    // Note: In a real enterprise app with massive scales, we'd use materialized views (as seen in dept module).
    // Here we will do simple counts or RPC calls if available. We will run concurrent count queries.

    const [
      users, verifiedUsers, departments, hostels, organizations, events,
      competitions, placements, businesses, sponsors, donations, news, media
    ] = await Promise.all([
      this.supabase.from('profiles').select('*', { count: 'exact', head: true }),
      this.supabase.from('profiles').select('*', { count: 'exact', head: true }).not('verified_at', 'is', null),
      this.supabase.from('departments').select('*', { count: 'exact', head: true }),
      this.supabase.from('hostels').select('*', { count: 'exact', head: true }),
      this.supabase.from('organizations').select('*', { count: 'exact', head: true }),
      this.supabase.from('events').select('*', { count: 'exact', head: true }),
      this.supabase.from('competitions').select('*', { count: 'exact', head: true }),
      this.supabase.from('placement_companies').select('*', { count: 'exact', head: true }),
      this.supabase.from('business_listings').select('*', { count: 'exact', head: true }),
      this.supabase.from('sponsors').select('*', { count: 'exact', head: true }),
      this.supabase.from('donations').select('*', { count: 'exact', head: true }),
      this.supabase.from('content_items').select('*', { count: 'exact', head: true }),
      this.supabase.from('media_files').select('*', { count: 'exact', head: true }),
    ]);

    return {
      totalUsers: users.count || 0,
      verifiedUsers: verifiedUsers.count || 0,
      totalDepartments: departments.count || 0,
      totalHostels: hostels.count || 0,
      totalOrganizations: organizations.count || 0,
      totalEvents: events.count || 0,
      totalCompetitions: competitions.count || 0,
      totalPlacements: placements.count || 0,
      totalBusinesses: businesses.count || 0,
      totalSponsors: sponsors.count || 0,
      totalDonations: donations.count || 0,
      totalNews: news.count || 0,
      totalMedia: media.count || 0,
    };
  }
  
  async getUserGrowthTrend(days: number = 30) {
    // In PostgreSQL, you would typically use `date_trunc('day', created_at)`.
    // Since we don't have a specific RPC defined for this across the whole DB, we fetch recent and bucket in JS or use generic approach.
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);
    
    const { data } = await this.supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });
      
    return data || [];
  }
  
  async getDonationTrends() {
    const { data } = await this.supabase
      .from('donations')
      .select('base_amount, created_at, status')
      .eq('status', 'successful')
      .order('created_at', { ascending: true })
      .limit(100);
      
    return data || [];
  }

  async getDashboards() {
    return this.supabase.from('analytics_dashboards').select('*').order('created_at', { ascending: true });
  }

  async getDashboardWidgets(dashboardId: string) {
    return this.supabase
      .from('analytics_widgets')
      .select('*')
      .eq('dashboard_id', dashboardId)
      .order('display_order', { ascending: true });
  }
}
