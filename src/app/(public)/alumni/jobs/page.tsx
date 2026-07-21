import { getActiveJobs } from "@/app/actions/alumni/jobActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";

export const metadata = {
  title: "Alumni Job Board | Ravenshaw Moments",
  description: "Career opportunities posted by Ravenshaw Alumni.",
};

export default async function AlumniJobsPage({ searchParams }: { searchParams: { search?: string } }) {
  const query = searchParams.search || "";
  const jobs = await getActiveJobs({ search: query });

  return (
    <div className="container py-12 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Alumni Job Board</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Career opportunities shared by our alumni network.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/alumni">
            <Button variant="outline">Alumni Directory</Button>
          </Link>
          <Link href="/dashboard/alumni/jobs">
            <Button>Post a Job</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs?.map((job: any) => (
          <Card key={job.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 font-medium text-primary mt-1">
                <Building className="h-4 w-4" /> {job.company}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {job.employment_type}
                  </Badge>
                  {job.location && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </Badge>
                  )}
                  {job.is_referral_available && (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      Referral Available
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {job.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserAvatar 
                    user={{ full_name: job.profiles?.full_name,
                      avatar_url: job.profiles?.avatar_url
                    }}
                    className="h-8 w-8"
                  />
                  <span className="text-xs text-muted-foreground">Posted by {job.profiles?.full_name}</span>
                </div>
                {job.application_link && (
                  <a href={job.application_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm">
                      Apply <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {jobs?.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No active job postings found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
