import { getPendingAlumni, verifyAlumni } from "@/app/actions/alumni/alumniActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";

export const metadata = {
  title: "Alumni Verification | Admin Dashboard",
};

export default async function AdminAlumniPage() {
  const pending = await getPendingAlumni();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alumni Verification</h1>
        <p className="text-muted-foreground">Review and verify alumni profile registrations.</p>
      </div>

      <div className="grid gap-6">
        {pending?.map((profile: any) => (
          <Card key={profile.profile_id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex gap-4">
                <UserAvatar 
                  user={{ full_name: profile.profiles?.full_name,
                    avatar_url: profile.profiles?.avatar_url
                  }}
                  className="h-12 w-12"
                />
                <div>
                  <CardTitle>{profile.profiles?.full_name}</CardTitle>
                  <CardDescription>{profile.profiles?.email}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{profile.profiles?.department_name}</Badge>
                    <Badge variant="outline">{profile.profiles?.batch_year}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <form action={async () => {
                  "use server";
                  await verifyAlumni(profile.profile_id, "verified");
                }}>
                  <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" /> Verify
                  </Button>
                </form>
                <form action={async () => {
                  "use server";
                  await verifyAlumni(profile.profile_id, "rejected");
                }}>
                  <Button type="submit" size="sm" variant="destructive">
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <span className="text-muted-foreground">Current Position:</span>
                  <p className="font-medium">{profile.current_position || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Company:</span>
                  <p className="font-medium">{profile.company || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Industry:</span>
                  <p className="font-medium">{profile.industry || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">{profile.location || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {pending?.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border rounded-lg">
            No pending alumni verifications.
          </div>
        )}
      </div>
    </div>
  );
}
