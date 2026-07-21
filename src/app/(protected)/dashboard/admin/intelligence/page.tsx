import React from 'react';
import { getPlatformOverviewAction, getUserGrowthAction, getDonationTrendsAction } from '@/features/admin-intelligence/actions/intelligence.actions';
import { KPICard } from '@/features/admin-intelligence/components/KPICard';
import { TrendChart } from '@/features/admin-intelligence/components/TrendChart';
import { DistributionPie } from '@/features/admin-intelligence/components/DistributionPie';
import { Users, Building2, Calendar, Trophy, Briefcase, Store, Heart, BookOpen, GraduationCap } from 'lucide-react';

export default async function IntelligenceDashboardPage() {
  const [overviewRes, growthRes, donationRes] = await Promise.all([
    getPlatformOverviewAction(),
    getUserGrowthAction(30),
    getDonationTrendsAction()
  ]);

  const overview = overviewRes.success ? overviewRes.data : null;
  const growth = growthRes.success && growthRes.data ? growthRes.data : [];
  const donations = donationRes.success && donationRes.data ? donationRes.data : [];

  // Mock department data for pie chart since we don't have a direct endpoint built for this yet. 
  // In reality, this would come from a dedicated action pulling from the `profiles` table.
  const deptData = [
    { name: 'Computer Science', value: 400 },
    { name: 'Commerce', value: 300 },
    { name: 'Physics', value: 200 },
    { name: 'Chemistry', value: 200 },
    { name: 'English', value: 150 },
  ];

  if (!overview) {
    return <div className="p-8 text-center text-red-600">Failed to load intelligence dashboard.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#800000]">Executive Intelligence Center</h1>
        <p className="text-gray-500 mt-2">Centralized command center for platform metrics and insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users" value={overview.totalUsers} icon={Users} trend={{ value: 12, isPositive: true }} description="vs last month" />
        <KPICard title="Verified Profiles" value={overview.verifiedUsers} icon={GraduationCap} />
        <KPICard title="Departments" value={overview.totalDepartments} icon={Building2} />
        <KPICard title="Active Events" value={overview.totalEvents} icon={Calendar} trend={{ value: 5, isPositive: true }} />
        
        <KPICard title="Placements" value={overview.totalPlacements} icon={Briefcase} />
        <KPICard title="Competitions" value={overview.totalCompetitions} icon={Trophy} />
        <KPICard title="Campus Businesses" value={overview.totalBusinesses} icon={Store} />
        <KPICard title="Donations Received" value={overview.totalDonations} icon={Heart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart 
          title="User Growth (30 Days)" 
          data={growth} 
          xKey="date" 
          yKey="users" 
          type="area" 
        />
        <DistributionPie 
          title="Users by Department (Top 5)" 
          data={deptData} 
          nameKey="name" 
          dataKey="value" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart 
          title="Donation Trends" 
          data={donations} 
          xKey="date" 
          yKey="amount" 
          type="line" 
        />
        
        {/* Placeholder for future cross-module insights widget */}
        <div className="bg-[#F5F5DC]/30 border border-[#F5F5DC] rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <BookOpen className="h-12 w-12 text-[#800000] mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-[#800000]">Cross-Module Insights</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            AI-ready intelligence predicting enrollment and engagement trends will be populated here as data volume increases.
          </p>
        </div>
      </div>
    </div>
  );
}
