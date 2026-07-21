import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile } from '@/features/placement/actions/placement.actions';
import { PlacementDriveService } from '@/features/placement/services/PlacementDriveService';
import { PlacementRegistrationService } from '@/features/placement/services/PlacementRegistrationService';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Recruiter Drive Details',
};

export default async function RecruiterDriveDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const driveId = resolvedParams.id;
  const supabase = await createClient();
  const profile = await getSessionProfile();

  if (!profile) {
    redirect('/login');
  }

  const driveService = new PlacementDriveService(supabase as any);
  const registrationService = new PlacementRegistrationService(supabase as any);

  let drive: any = null;
  let registrations: any[] = [];

  try {
    const [driveData, regData] = await Promise.all([
      driveService.getDriveById(driveId),
      registrationService.getRegistrations({ driveId })
    ]);
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
          <h1 className="text-2xl font-bold tracking-tight">Review Applicants: {drive.title}</h1>
          <p className="text-muted-foreground">{drive.company?.name}</p>
        </div>
      </div>

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
                  <th className="px-4 py-3">Resume</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg: any) => (
                  <tr key={reg.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{reg.profile?.full_name}</td>
                    <td className="px-4 py-3">
                      {reg.resume?.url ? (
                        <a href={reg.resume.url} target="_blank" className="text-blue-600 hover:underline">View Resume</a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{reg.status.toUpperCase()}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* Interactive components for status updates would go here in a Client Component wrapper */}
                      <span className="text-xs text-gray-400 italic">Actions available soon</span>
                    </td>
                  </tr>
                ))}
                {registrations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
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
  );
}
