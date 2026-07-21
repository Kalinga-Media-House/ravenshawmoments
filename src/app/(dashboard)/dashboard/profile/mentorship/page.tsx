import { createClient } from "@/lib/supabase/server";
import { MentorshipRepository } from "@/repositories/alumni/mentorship.repository";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Video, Calendar } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Mentorship Portal | Dashboard",
};

export default async function MentorshipDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single() as any;
  if (!profile) return <div>Profile not found.</div>;
  
  const repo = new MentorshipRepository(supabase as any);
  const outgoingRequests = await repo.getOutgoingRequests(profile.id);
  const availableMentors = await repo.getMentors();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mentorship Portal</h1>
        <p className="text-muted-foreground">Find a mentor or manage your mentorship requests.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Your Mentorship Requests</h2>
        {outgoingRequests?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              You haven't requested any mentors yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {outgoingRequests?.map((req: any) => (
              <Card key={req.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <UserAvatar 
                        user={{ full_name: req.mentor?.full_name,
                          avatar_url: req.mentor?.avatar_url
                        }}
                      />
                      <div>
                        <CardTitle className="text-lg">{req.mentor?.full_name}</CardTitle>
                        <CardDescription>
                          {req.mentor?.alumni_profiles?.[0]?.current_position} at {req.mentor?.alumni_profiles?.[0]?.company}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={
                      req.status === 'accepted' ? 'default' : 
                      req.status === 'rejected' ? 'destructive' : 'secondary'
                    } className={req.status === 'accepted' ? 'bg-green-600' : ''}>
                      {req.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 italic mb-3">"{req.goals}"</p>
                  {req.status === "accepted" && (
                     <Button size="sm" className="w-full" variant="outline">
                       <Calendar className="mr-2 h-4 w-4" /> Schedule Session
                     </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Available Mentors</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableMentors?.map((mentor: any) => (
            <Card key={mentor.profile_id} className="flex flex-col">
              <CardHeader>
                <div className="flex flex-col items-center text-center space-y-3">
                  <UserAvatar 
                    user={{ full_name: mentor.profiles?.full_name,
                      avatar_url: mentor.profiles?.avatar_url
                    }}
                    className="h-20 w-20"
                  />
                  <div>
                    <CardTitle>{mentor.profiles?.full_name}</CardTitle>
                    <CardDescription className="text-primary mt-1 font-medium">
                      {mentor.profiles?.alumni_profiles?.[0]?.current_position} @ {mentor.profiles?.alumni_profiles?.[0]?.company}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div className="flex flex-wrap gap-1 justify-center">
                  {mentor.areas_of_expertise?.map((area: string) => (
                    <Badge key={area} variant="secondary" className="text-xs">{area}</Badge>
                  ))}
                </div>
                <div className="pt-4 border-t w-full">
                  <Button className="w-full">Request Mentorship</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {availableMentors?.length === 0 && (
             <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
               No mentors available right now.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
