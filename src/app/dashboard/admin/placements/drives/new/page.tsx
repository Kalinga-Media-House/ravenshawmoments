import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile } from '@/features/placement/actions/placement.actions';
import { PlacementDriveForm } from '@/features/placement/components/PlacementDriveForm';
import { CompanyService } from '@/features/placement/services/CompanyService';

export const metadata: Metadata = {
  title: 'Create Placement Drive',
};

export default async function CreateDrivePage() {
  const supabase = await createClient();
  const profile = await getSessionProfile();

  if (!profile) {
    redirect('/login');
  }

  // Need to fetch companies for dropdown
  const companyService = new CompanyService(supabase as any);
  let companies: any[] = [];
  try {
    const response = await companyService.getCompanies({ limit: 100 });
    companies = response.companies;
  } catch (error) {
    console.error('Failed to load companies', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Placement Drive</h1>
          <p className="text-muted-foreground">Set up a new placement opportunity for students.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Drive Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PlacementDriveForm companies={companies} />
        </CardContent>
      </Card>
    </div>
  );
}
