import { createClient } from "@/lib/supabase/server";
import { AlumniProfileRepository } from "@/repositories/alumni/alumniProfile.repository";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, MapPin, Building, Plus } from "lucide-react";

export const metadata = {
  title: "Alumni Profile | Dashboard",
};

export default async function AlumniProfileDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // We need the profile_id which is the auth_user_id joined to profiles table.
  const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single() as any;
  if (!profile) return <div>Profile not found. Please complete basic registration first.</div>;
  
  const repo = new AlumniProfileRepository(supabase as any);
  const alumniProfile = await repo.getProfile(profile.id);
  const employment = await repo.getEmployment(profile.id);
  const education = await repo.getEducation(profile.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumni Profile</h1>
          <p className="text-muted-foreground">Manage your alumni presence and history.</p>
        </div>
        {!alumniProfile && (
          <form action={async () => {
            "use server";
            const repo = new AlumniProfileRepository(await createClient() as any);
            await repo.upsertProfile({ profile_id: profile.id, verification_status: "pending" });
          }}>
            <Button type="submit">Join Alumni Network</Button>
          </form>
        )}
      </div>

      {alumniProfile && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Verification Status
                <Badge variant={
                  alumniProfile.verification_status === "verified" ? "default" : 
                  alumniProfile.verification_status === "rejected" ? "destructive" : "secondary"
                } className={alumniProfile.verification_status === "verified" ? "bg-green-600" : ""}>
                  {alumniProfile.verification_status.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>
                {alumniProfile.verification_status === "pending" 
                  ? "Your profile is currently under review by the administration."
                  : "Your profile is verified and visible in the public directory."}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" /> Employment History
                </CardTitle>
                <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-4">
                  {employment?.map((emp: any) => (
                    <div key={emp.id} className="border-l-2 border-primary pl-4 pb-4">
                      <h4 className="font-semibold text-lg">{emp.position}</h4>
                      <p className="text-muted-foreground font-medium flex items-center gap-1">
                        <Building className="h-4 w-4" /> {emp.company}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {emp.location || "Remote"} • {new Date(emp.start_date).getFullYear()} - {emp.is_current ? "Present" : new Date(emp.end_date!).getFullYear()}
                      </p>
                    </div>
                  ))}
                  {(!employment || employment.length === 0) && (
                    <p className="text-muted-foreground text-sm">No employment history added.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" /> Higher Education
                </CardTitle>
                <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-4">
                  {education?.map((edu: any) => (
                    <div key={edu.id} className="border-l-2 border-primary pl-4 pb-4">
                      <h4 className="font-semibold text-lg">{edu.degree} in {edu.field_of_study}</h4>
                      <p className="text-muted-foreground font-medium flex items-center gap-1">
                        <Building className="h-4 w-4" /> {edu.institution}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                         {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"}
                      </p>
                    </div>
                  ))}
                  {(!education || education.length === 0) && (
                    <p className="text-muted-foreground text-sm">No higher education history added.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
