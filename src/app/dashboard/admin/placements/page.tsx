import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PlacementAnalyticsRepository } from '@/features/placement/repositories/PlacementAnalyticsRepository';
import { PlacementDriveService } from '@/features/placement/services/PlacementDriveService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Placements Administration',
};

export default async function AdminPlacementsDashboard() {
  const supabase = await createClient();
  const repo = new PlacementAnalyticsRepository(supabase as any);
  const driveService = new PlacementDriveService(supabase as any);
  
  let stats = {
    totalDrives: 0,
    totalApplications: 0,
    totalOffers: 0,
    companiesCount: 0
  };

  let drives: any[] = [];

  try {
    stats = await repo.getOverallStatistics();
    const driveResponse = await driveService.getDrives({ limit: 10 });
    drives = driveResponse.drives;
  } catch (error) {
    console.error('Failed to load placement admin data', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Placement Cell Administration</h1>
          <p className="text-muted-foreground">Manage drives, view analytics, and coordinate with recruiters.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/placements/companies" className={buttonVariants({ variant: "outline" })}>
            Companies
          </Link>
          <Link href="/dashboard/admin/placements/drives/new" className={buttonVariants()}>
            New Drive
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrives}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOffers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companiesCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Placement Drives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((drive: any) => (
                  <tr key={drive.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{drive.company?.name}</td>
                    <td className="px-4 py-3">{drive.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{drive.status.replace('_', ' ').toUpperCase()}</Badge>
                    </td>
                    <td className="px-4 py-3">{drive.application_deadline ? format(new Date(drive.application_deadline), 'MMM dd, yyyy') : 'N/A'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/dashboard/admin/placements/drives/${drive.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
                {drives.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No placement drives found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
