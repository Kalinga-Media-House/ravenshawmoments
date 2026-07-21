import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { StudentCareerService } from '@/features/placement/services/StudentCareerService';
import { PlacementRegistrationService } from '@/features/placement/services/PlacementRegistrationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { redirect } from 'next/navigation';
import { getSessionProfile } from '@/features/placement/actions/placement.actions';

export const metadata: Metadata = {
  title: 'My Career - Dashboard',
};

export default async function StudentCareerDashboard() {
  const supabase = await createClient();
  const profile = await getSessionProfile();

  if (!profile) {
    redirect('/login');
  }

  const careerService = new StudentCareerService(supabase as any);
  const registrationService = new PlacementRegistrationService(supabase as any);

  const [skills, experiences, projects, resumes, applicationsResponse] = await Promise.all([
    careerService.getSkills(profile.id),
    careerService.getExperiences(profile.id),
    careerService.getProjects(profile.id),
    careerService.getResumes(profile.id),
    registrationService.getRegistrations({ profileId: profile.id, limit: 10 })
  ]);

  const applications = applicationsResponse.registrations;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career & Placement</h1>
        <p className="text-muted-foreground">Manage your resumes, skills, and track your job applications.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {applications && applications.length > 0 ? (
              <ul className="space-y-4">
                {applications.map((app: any) => (
                  <li key={app.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{app.drive?.title}</p>
                      <p className="text-sm text-gray-500">{app.drive?.company?.name}</p>
                    </div>
                    <Badge variant={
                      app.status === 'selected' || app.status === 'offer_accepted' ? 'default' :
                      app.status === 'rejected' ? 'destructive' : 'secondary'
                    }>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You haven't applied to any drives yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            {resumes && resumes.length > 0 ? (
              <ul className="space-y-4">
                {resumes.map((resume: any) => (
                  <li key={resume.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{resume.title}</p>
                      {resume.is_default && <Badge variant="outline">Default</Badge>}
                    </div>
                    <a href={resume.media_file?.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                      View
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No resumes uploaded.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Proficiencies</CardTitle>
          </CardHeader>
          <CardContent>
            {skills && skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: any) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.skill_name} ({skill.proficiency})
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Add skills to stand out to recruiters.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
             {projects && projects.length > 0 ? (
              <ul className="space-y-4">
                {projects.map((project: any) => (
                  <li key={project.id} className="p-4 border rounded-lg">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Add projects to showcase your practical experience.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
