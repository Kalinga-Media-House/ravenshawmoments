import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { profileService, ProfileAccessDeniedError } from "@/features/profile/services";
import {
  ProfileHeader,
  ProfileStats,
  ProfileBasicInfo,
  AcademicInfoCard,
  ProfileTabs,
  ProfileGallery,
  ProfileTimeline,
  CertificateList,
  AchievementList,
  EmptyState,
} from "@/features/profile/components";
import { Shield } from "lucide-react";
import { env } from "@/lib/env";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const profile = await profileService.getPublicProfileBySlug(slug);
    if (!profile) {
      return { title: "Profile Not Found | Ravenshaw Moments" };
    }
    const title = `${profile.full_name} (@${profile.username}) | Ravenshaw Moments`;
    const description =
      profile.bio ||
      `View ${profile.full_name}'s academic profile, verified certificates, and achievement timeline on Ravenshaw Moments.`;
    const url = `${env.NEXT_PUBLIC_APP_URL}/profile/${profile.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: "profile",
        images: profile.avatar_url
          ? [{ url: profile.avatar_url, width: 400, height: 400, alt: profile.full_name }]
          : [],
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: profile.avatar_url ? [profile.avatar_url] : [],
      },
    };
  } catch {
    return {
      title: "Private Profile | Ravenshaw Moments",
      description: "This profile is restricted by user privacy settings.",
    };
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params;

  let profile;
  try {
    profile = await profileService.getPublicProfileBySlug(slug);
  } catch (err) {
    if (err instanceof ProfileAccessDeniedError || (err instanceof Error && err.name === "ProfileAccessDeniedError")) {
      return (
        <main className="container max-w-5xl mx-auto px-4 py-12">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Restricted Profile</span>
          </nav>
          <div className="py-16 rounded-2xl border border-border bg-card shadow-sm">
            <EmptyState
              title="Private Profile"
              description="This student or member has restricted public access to their identity and academic records."
              icon={Shield}
            />
          </div>
        </main>
      );
    }
    throw err;
  }

  if (!profile) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    alternateName: profile.username,
    description: profile.bio || "Student at Ravenshaw University",
    image: profile.avatar_url || undefined,
    url: `${env.NEXT_PUBLIC_APP_URL}/profile/${profile.slug}`,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Ravenshaw University",
    },
  };

  const galleryCount = profile.gallery_items?.length || 0;
  const achievementsCount = profile.achievements?.length || 0;
  const certificatesCount = profile.winner_certificates?.length || 0;

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{profile.full_name}</span>
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
          isOwner={false}
        />

        <ProfileStats
          galleryCount={galleryCount}
          achievementsCount={achievementsCount}
          certificatesCount={certificatesCount}
        />

        <ProfileTabs
          isOwner={false}
          galleryCount={galleryCount}
          achievementsCount={achievementsCount}
          certificatesCount={certificatesCount}
          overviewContent={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-2 space-y-6">
                <ProfileBasicInfo
                  bio={profile.bio}
                  createdAt={profile.created_at}
                />
                {profile.achievements && profile.achievements.length > 0 && (
                  <AchievementList
                    achievements={profile.achievements.slice(0, 4)}
                    title="Featured Honors"
                  />
                )}
              </div>
              <div className="space-y-6">
                <AcademicInfoCard
                  departmentName={profile.department_name}
                  batchYear={profile.batch_year}
                  isVerified={profile.is_verified}
                />
              </div>
            </div>
          }
          galleryContent={
            <div className="pt-2">
              <ProfileGallery
                items={profile.gallery_items || []}
                isOwner={false}
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
                certificates={profile.winner_certificates || []}
              />
            </div>
          }
        />
      </div>
    </main>
  );
}
