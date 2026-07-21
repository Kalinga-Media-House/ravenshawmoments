import React from "react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isProfileVerified } from "@/lib/utils/permissions";
import { getProfileAdminPermissions } from "@/lib/authorization/profile-review";
import { type Database } from "@/lib/supabase/database.types";
import { ProfileReviewControls } from "../../components/ProfileReviewControls";
import { AdminHistoryCard } from "../../components/AdminHistoryCard";
import { 
  ArrowLeft, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  GraduationCap, 
  Building, 
  AlertCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Profile Details | Admin",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ profileId: string }>;
}

export default async function AdminProfileDetailsPage({ params }: PageProps) {
  const { profileId } = await params;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!profileId || !uuidRegex.test(profileId)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin/roles");

  // @ts-ignore // TS2589: Supabase generated types cause infinite recursion without this bypass.
  const { data: _actorProfile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  const actorProfile = _actorProfile as { id: string } | null;

  if (!actorProfile) {
    return (
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="p-8 rounded-2xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-500">You do not have a valid profile linked to your account.</p>
        </div>
      </main>
    );
  }

  // @ts-ignore // TS2589: Supabase generated types cause infinite recursion without this bypass.
  const { data: _profile, error } = await supabase.from("profiles").select("*, profile_claim_requests(*)").eq("id", profileId).single();
  const profile = _profile as any;

  if (error || !profile) {
    notFound();
  }

  const { success, permissions } = await getProfileAdminPermissions(actorProfile.id, profileId);

  if (!success || !permissions?.canView) {
    return (
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="p-8 rounded-2xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-500">You don't have permission to view this profile.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link href="/admin/roles" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{profile.first_name} {profile.last_name}</h1>
            <p className="text-gray-500 mt-1">{profile.email || "No email"}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4">Profile Details</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                <div className="flex items-center gap-2">
                  {isProfileVerified(profile) ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      Pending Verification
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Profile Type</div>
                <div className="text-gray-900 capitalize">{profile.profile_type?.replace("_", " ")}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Claim Status</div>
                <div className="flex items-center gap-2">
                  {profile.is_profile_claimed ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Claimed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Unclaimed
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Created At</div>
                <div className="text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          
          <AdminHistoryCard logs={[]} />
        </div>

        <div className="space-y-6">
          <ProfileReviewControls 
            targetProfileId={profileId}
            currentProfileStatus={profile.profile_status || 'active'}
            currentVerificationStatus={isProfileVerified(profile) ? 'verified' : 'pending'}
            permissions={permissions}
          />
        </div>
      </div>
    </main>
  );
}
