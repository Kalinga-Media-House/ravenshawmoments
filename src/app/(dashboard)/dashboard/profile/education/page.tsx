import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEducationHistory } from "@/actions/student/education.actions";
import { EducationPageClient } from "./education-client";

export const metadata: Metadata = {
  title: "Education History | Ravenshaw Moments",
  description:
    "Manage your education history, add qualifications, and track your academic journey.",
};

export default async function EducationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getEducationHistory();
  // @ts-ignore
  const education = result.success ? result.data || [] : [];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground"
      >
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        <Link
          href="/dashboard/profile"
          className="hover:text-foreground transition-colors"
        >
          My Profile
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Education</span>
      </nav>

      <EducationPageClient
        profileId={user.id}
        initialEducation={education}
      />
    </main>
  );
}
