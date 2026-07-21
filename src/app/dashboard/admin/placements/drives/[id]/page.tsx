import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile, updateRegistrationStatusAction } from '@/features/placement/actions/placement.actions';
import { PlacementDriveForm } from '@/features/placement/components/PlacementDriveForm';
import { CompanyService } from '@/features/placement/services/CompanyService';
import { PlacementDriveService } from '@/features/placement/services/PlacementDriveService';
import { PlacementRegistrationService } from '@/features/placement/services/PlacementRegistrationService';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Manage Placement Drive',
};

export default async function ManageDrivePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const driveId = resolvedParams.id;
  const supabase = await createClient();
  const profile = await getSessionProfile();

  if (!profile) {
    redirect('/login');
  }

  const companyService = new CompanyService(supabase as any);
  const driveService = new PlacementDriveService(supabase as any);
  const registrationService = new PlacementRegistrationService(supabase as any);

  let companies: any[] = [];
  let drive: any = null;
  let registrations: any[] = [];

  try {
    const [companyRes, driveData, regData] = await Promise.all([
      companyService.getCompanies({ limit: 100 }),
      driveService.getDriveById(driveId),
      registrationService.getRegistrations({ driveId })
    ]);
    companies = companyRes.companies;
    drive = driveData;
    registrations = regData.registrations;
  } catch (error) {
    console.error('Failed to load drive data', error);
  }

  if (!drive) {
    return <div>Drive not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Drive: {drive.title}</h1>
          <p className="text-muted-foreground">{drive.company?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Drive Details</CardTitle>
          </CardHeader>
          <CardContent>
            <PlacementDriveForm companies={companies} initialData={drive} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Applications ({registrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg: any) => (
                    <tr key={reg.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{reg.profile?.full_name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{reg.status.toUpperCase()}</Badge>
                      </td>
                    </tr>
                  ))}
                  {registrations.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                        No applications yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
