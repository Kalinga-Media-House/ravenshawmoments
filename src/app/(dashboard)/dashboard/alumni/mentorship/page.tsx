import { createClient } from "@/lib/supabase/server";
import { MentorshipRepository } from "@/repositories/alumni/mentorship.repository";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateMentorshipRequestStatus } from "@/app/actions/alumni/mentorshipActions";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Check, X } from "lucide-react";

export const metadata = {
  title: "Mentor Dashboard",
};

export default async function MentorDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single() as any;
  if (!profile) return <div>Profile not found.</div>;
  
  const repo = new MentorshipRepository(supabase as any);
  const incomingRequests = await repo.getIncomingRequests(profile.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mentor Dashboard</h1>
        <p className="text-muted-foreground">Manage your incoming mentorship requests and sessions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Requests</CardTitle>
          <CardDescription>Students who want you as their mentor.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incomingRequests?.map((req: any) => (
              <div key={req.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex gap-4">
                  <UserAvatar 
                    user={{ full_name: req.mentee?.full_name,
                      avatar_url: req.mentee?.avatar_url
                    }}
                  />
                  <div>
                    <h4 className="font-semibold">{req.mentee?.full_name}</h4>
                    <p className="text-sm text-muted-foreground">{req.mentee?.departments?.name} • {req.mentee?.batches?.name}</p>
                    <p className="text-sm mt-2 font-medium italic">"{req.goals}"</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge variant={
                    req.status === 'accepted' ? 'default' : 
                    req.status === 'rejected' ? 'destructive' : 'secondary'
                  } className={req.status === 'accepted' ? 'bg-green-600' : ''}>
                    {req.status.toUpperCase()}
                  </Badge>
                  {req.status === "pending" && (
                    <div className="flex gap-2 mt-2">
                      <form action={async () => {
                        "use server";
                        await updateMentorshipRequestStatus(req.id, profile.id, "accepted");
                      }}>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                      </form>
                      <form action={async () => {
                        "use server";
                        await updateMentorshipRequestStatus(req.id, profile.id, "rejected");
                      }}>
                        <Button size="sm" variant="destructive">
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {incomingRequests?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No incoming requests at the moment.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
