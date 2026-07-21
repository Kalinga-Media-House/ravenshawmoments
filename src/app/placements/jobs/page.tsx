import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PlacementDriveService } from '@/features/placement/services/PlacementDriveService';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Job Board - Placements',
  description: 'Browse active placement drives and job opportunities.',
};

export default async function JobsPage() {
  const supabase = await createClient();
  const service = new PlacementDriveService(supabase as any);
  
  let drives: any[] = [];
  try {
    const response = await service.getDrives({ status: 'published' });
    drives = response.drives;
    
    // Also fetch registration open
    const openResponse = await service.getDrives({ status: 'registration_open' });
    drives = [...openResponse.drives, ...drives];
  } catch (error) {
    console.error('Failed to load drives', error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Active Opportunities</h1>
          <p className="mt-2 text-gray-500">Apply for campus placements and internships.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives.map((drive: any) => (
          <Card key={drive.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={drive.status === 'registration_open' ? 'default' : 'secondary'}>
                  {drive.status.replace('_', ' ').toUpperCase()}
                </Badge>
                {drive.job_type && <Badge variant="outline">{drive.job_type.replace('_', ' ').toUpperCase()}</Badge>}
              </div>
              <CardTitle className="text-xl">{drive.title}</CardTitle>
              <div className="text-sm text-gray-500 font-medium">{drive.company?.name}</div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 line-clamp-3 mb-4">{drive.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Package:</span>
                  <span className="font-medium">{drive.salary_package || 'Not disclosed'}</span>
                </div>
                {drive.application_deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline:</span>
                    <span className="font-medium">{format(new Date(drive.application_deadline), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/placements/jobs/${drive.id}`} className={buttonVariants({ className: "w-full" })}>
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}

        {drives.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium text-gray-900">No active drives</h3>
            <p className="mt-2 text-gray-500">Check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
}
