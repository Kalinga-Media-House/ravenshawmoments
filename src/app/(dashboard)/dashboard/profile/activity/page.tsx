import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Trophy,
  Image as ImageIcon,
  ShieldCheck,
  GraduationCap,
  Users,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Activity Timeline | Ravenshaw Moments",
  description: "View your complete activity timeline across the platform.",
};

const typeConfig: Record<
  string,
  { icon: typeof Trophy; color: string; bgColor: string }
> = {
  achievement: {
    icon: Trophy,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  gallery: {
    icon: ImageIcon,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  verification: {
    icon: ShieldCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
  },
  education: {
    icon: GraduationCap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  organization: {
    icon: Users,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10 border-indigo-500/20",
  },
  profile: {
    icon: FileText,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10 border-sky-500/20",
  },
  social: {
    icon: MessageSquare,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10 border-pink-500/20",
  },
};

const defaultConfig = {
  icon: Calendar,
  color: "text-muted-foreground",
  bgColor: "bg-muted/20 border-border",
};

export default async function ActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch activity log from the activity_log table directly
  const { data: activities, error } = await supabase
    .from("activity_log")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const activityList = activities || [];

  // Group by date
  const grouped = activityList.reduce<Record<string, any[]>>((acc: Record<string, any[]>, activity: any) => {
    const dateKey = new Date(activity.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(activity);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped);

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
        <span className="text-foreground font-medium">Activity</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity Timeline</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your complete activity history on the platform
        </p>
      </div>

      {activityList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card">
          <Calendar size={32} className="text-muted-foreground" />
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            No activity recorded yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Your profile activities will be tracked here as you use the platform.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((dateKey) => (
            <div key={dateKey}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-semibold text-foreground">{dateKey}</h2>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="relative space-y-0">
                <div className="absolute left-5 top-3 bottom-3 w-px bg-border" />

                {grouped[dateKey].map((activity: any) => {
                  const config = typeConfig[activity.type] || defaultConfig;
                  const IconComp = config.icon;

                  return (
                    <div
                      key={activity.id}
                      className="relative flex items-start gap-4 pb-6 last:pb-0"
                    >
                      <div
                        className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${config.bgColor}`}
                      >
                        <IconComp size={18} className={config.color} />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">
                            {activity.title}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
