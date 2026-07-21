import { getVerifiedAlumni } from "@/app/actions/alumni/alumniActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";

export const metadata = {
  title: "Alumni Directory | Ravenshaw Moments",
  description: "Connect with Ravenshaw University Alumni worldwide.",
};

export default async function AlumniDirectoryPage({ searchParams }: { searchParams: { search?: string } }) {
  const query = searchParams.search || "";
  const alumni = await getVerifiedAlumni({ search: query });

  return (
    <div className="container py-12 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Alumni Directory</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Connect with {alumni?.length || 0} verified alumni worldwide.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/alumni/jobs">
            <Button variant="outline">Job Board</Button>
          </Link>
          <Link href="/dashboard/alumni/profile">
            <Button>Update My Profile</Button>
          </Link>
        </div>
      </div>

      <Card className="bg-muted/50 border-none">
        <CardContent className="p-4 flex gap-4 items-center">
          <form className="flex-1 flex gap-2 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              name="search" 
              placeholder="Search by name, company, or position..." 
              defaultValue={query}
              className="pl-9 flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni?.map((profile: any) => (
          <Card key={profile.profile_id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <UserAvatar 
                  user={{ full_name: profile.profiles?.full_name,
                    avatar_url: profile.profiles?.avatar_url
                  }}
                  className="h-16 w-16"
                />
                <div className="flex-1 space-y-1 overflow-hidden">
                  <CardTitle className="truncate text-xl">
                    {profile.profiles?.full_name}
                  </CardTitle>
                  <CardDescription className="truncate text-primary font-medium">
                    {profile.current_position} {profile.company ? `at ${profile.company}` : ''}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground truncate">
                    {profile.profiles?.departments?.name} • {profile.profiles?.batches?.name}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.industry && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {profile.industry}
                  </Badge>
                )}
                {profile.location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {profile.location}
                  </Badge>
                )}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-end">
                <Link href={`/dashboard/alumni/network?connect=${profile.profile_id}`}>
                  <Button variant="ghost" size="sm">Connect</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {alumni?.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No alumni found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
