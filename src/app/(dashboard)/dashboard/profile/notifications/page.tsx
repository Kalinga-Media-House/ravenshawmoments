import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NotificationsPageClient } from "./notifications-client";

export const metadata: Metadata = {
  title: "Notifications | Ravenshaw Moments",
  description: "View and manage your notifications.",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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
        <span className="text-foreground font-medium">Notifications</span>
      </nav>

      <NotificationsPageClient userId={user.id} />
    </main>
  );
}
