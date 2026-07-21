import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/actions/student/profile.actions";
import { SocialLinksPageClient } from "./social-client";

export const metadata: Metadata = {
  title: "Social Links | Ravenshaw Moments",
  description: "Manage your social media profiles and links.",
};

export default async function SocialLinksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const result = await getMyProfile();
  const profile = result.success ? result.data : null;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground"
      >
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/profile" className="hover:text-foreground transition-colors">
          My Profile
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Social Links</span>
      </nav>

      <SocialLinksPageClient
        profileId={user.id}
        // @ts-ignore
        initialLinks={profile?.socialLinks || profile?.social_links || {}}
        // @ts-ignore
        website={profile?.website || ""}
      />
    </main>
  );
}
