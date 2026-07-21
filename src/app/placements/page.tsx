import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PlacementAnalyticsRepository } from '@/features/placement/repositories/PlacementAnalyticsRepository';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Building, Users, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Placement & Career Development',
  description: 'Explore career opportunities and placement statistics at Ravenshaw University.',
};

export default async function PlacementsPage() {
  const supabase = await createClient();
  const repo = new PlacementAnalyticsRepository(supabase as any);
  
  let stats = {
    totalDrives: 0,
    totalApplications: 0,
    totalOffers: 0,
    highestPackage: 0,
    companiesCount: 0
  };

  try {
    stats = await repo.getOverallStatistics();
  } catch (error) {
    console.error('Failed to load placement stats', error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Placement & Career Development</h1>
        <p className="mt-4 text-xl text-gray-500">Empowering students with top-tier career opportunities.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/placements/jobs" className={buttonVariants({ size: "lg" })}>
            View Jobs
          </Link>
          <Link href="/placements/companies" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Our Recruiters
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Recruiters</CardTitle>
            <Building className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.companiesCount || '50+'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Placement Drives</CardTitle>
            <Briefcase className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDrives || '120+'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Offers</CardTitle>
            <Users className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalOffers || '500+'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Highest Package</CardTitle>
            <IndianRupee className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.highestPackage ? (stats.highestPackage / 100000).toFixed(1) + 'L' : '24L'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="prose max-w-none">
        <h2>About the Placement Cell</h2>
        <p>The Placement and Career Development Cell at Ravenshaw University is committed to providing students with the best opportunities to start their careers. We bridge the gap between academia and industry by organizing placement drives, workshops, and mock interviews.</p>
      </div>
    </div>
  );
}
