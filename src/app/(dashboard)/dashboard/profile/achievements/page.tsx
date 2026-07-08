import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { profileService } from "@/features/profile/services";
import {
  ProfileHeader,
  ProfileStats,
  ProfileBasicInfo,
  AcademicInfoCard,
  ProfileTabs,
  ProfileGallery,
  ProfileTimeline,
  CertificateList,
  PrivacySettingsCard,
  ClaimProfileCard,
} from "@/features/profile/components";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "My Journey & Honors | Ravenshaw Moments Dashboard",
  description: "Explore your chronological achievement timeline, academic milestones, and competition awards.",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_APP_URL}/dashboard/profile/achievements`,
  },
};

const tabUrls = {
  overview: "/dashboard/profile",
  gallery: "/dashboard/profile/gallery",
  timeline: "/dashboard/profile/achievements",
  certificates: "/dashboard/profile/certificates",
  settings: "/dashboard/profile/settings",
};

export default async function DashboardProfileAchievementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await profileService.getPrivateProfileByUserId(user.id);
  if (!profile) {
    notFound();
  }

  const galleryCount = profile.gallery_items?.length || 0;
  const achievementsCount = profile.achievements?.length || 0;
  const certificatesCount = (profile.winner_certificates?.length || 0) + (profile.participation_certificates?.length || 0);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/profile" className="hover:text-foreground transition-colors">My Profile</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Journey & Honors</span>
      </nav>

      <div className="space-y-6">
        <ProfileHeader
          fullName={profile.full_name}
          username={profile.username}
          avatarUrl={profile.avatar_url}
          coverUrl={profile.cover_url}
          profileType={profile.profile_type}
          departmentName={profile.department_name}
          batchYear={profile.batch_year}
          isVerified={profile.is_verified}
          isOwner={true}
          isClaimed={profile.is_profile_claimed}
          canClaim={profile.profile_type === "student" && !profile.is_profile_claimed}
          editUrl="/dashboard/profile/edit"
          privacyUrl="/dashboard/profile/privacy"
          claimUrl="/dashboard/profile/settings"
        />

        <ProfileStats
          galleryCount={galleryCount}
          achievementsCount={achievementsCount}
          certificatesCount={certificatesCount}
        />

        <ProfileTabs
          activeTab="timeline"
          tabUrls={tabUrls}
          isOwner={true}
          galleryCount={galleryCount}
          achievementsCount={achievementsCount}
          certificatesCount={certificatesCount}
          overviewContent={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-2 space-y-6">
                <ProfileBasicInfo
                  bio={profile.bio}
                  gender={profile.gender}
                  dateOfBirth={profile.date_of_birth}
                  email={profile.email}
                  phone={profile.phone}
                  createdAt={profile.created_at}
                />
              </div>
              <div className="space-y-6">
                <AcademicInfoCard
                  departmentName={profile.department_name}
                  batchYear={profile.batch_year}
                  rollNumber={profile.roll_number}
                  registrationNumber={profile.registration_number}
                  isVerified={profile.is_verified}
                  isProfileClaimed={profile.is_profile_claimed}
                />
              </div>
            </div>
          }
          galleryContent={
            <div className="pt-2">
              <ProfileGallery
                items={profile.gallery_items || []}
                isOwner={true}
              />
            </div>
          }
          timelineContent={
            <div className="pt-2">
              <ProfileTimeline
                achievements={profile.achievements || []}
                winnerCertificates={profile.winner_certificates || []}
              />
            </div>
          }
          certificatesContent={
            <div className="pt-2">
              <CertificateList
                certificates={[...(profile.winner_certificates || []), ...(profile.participation_certificates || [])]}
              />
            </div>
          }
          settingsContent={
            <div className="space-y-6 pt-2">
              <PrivacySettingsCard initialSettings={profile.privacy_settings} />
              <div className="pt-4 border-t border-border/40">
                <ClaimProfileCard
                  isProfileClaimed={profile.is_profile_claimed}
                  rollNumber={profile.roll_number}
                  registrationNumber={profile.registration_number}
                />
              </div>
            </div>
          }
        />
      </div>
    </main>
  );
}
