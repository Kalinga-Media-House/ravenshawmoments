import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PlacementDriveService } from '@/features/placement/services/PlacementDriveService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { getSessionProfile } from '@/features/placement/actions/placement.actions';

export const metadata: Metadata = {
  title: 'Recruiter Dashboard',
};

export default async function RecruiterDashboard() {
  const supabase = await createClient();
  const profile = await getSessionProfile();

  if (!profile) {
    redirect('/login');
  }

  // Assuming the user is a recruiter, get their company ID
  // In a real scenario, this would come from the `company_contacts` table or RBAC claims.
  // For now, we'll fetch drives associated with their ID (if they created them) or just show a placeholder if we can't determine it easily without a company ID.
  
  const driveService = new PlacementDriveService(supabase as any);
  
  let drives: any[] = [];
  try {
    // Ideally filter by company_id mapped to this recruiter
    // const { data: contact } = await supabase.from('company_contacts').select('company_id').eq('profile_id', profile.id).single();
    // if (contact) {
    //   const response = await driveService.getDrives({ companyId: contact.company_id, limit: 10 });
    //   drives = response.drives;
    // }
    const response = await driveService.getDrives({ limit: 5 }); // Placeholder
    drives = response.drives;
  } catch (error) {
    console.error('Failed to load recruiter drives', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">Manage your company's placement drives and review applicants.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drives.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Placement Drives</CardTitle>
        </CardHeader>
        <CardContent>
          {drives.length > 0 ? (
            <ul className="space-y-4">
              {drives.map((drive: any) => (
                <li key={drive.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{drive.title}</p>
                    <p className="text-sm text-gray-500">
                      Status: <Badge variant="outline">{drive.status.replace('_', ' ').toUpperCase()}</Badge>
                    </p>
                  </div>
                  <Link href={`/dashboard/recruiter/drives/${drive.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    View Applicants
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You have no active placement drives.</p>
              <Button>Request New Drive</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
