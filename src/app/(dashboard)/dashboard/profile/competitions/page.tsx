import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMyAchievements } from "@/actions/student/achievement.actions";
import { Trophy, Medal, Award, Calendar, MapPin, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Competition History | Ravenshaw Moments",
  description: "View your competition results, achievements, and participation history.",
};

const positionBadge = (position: number | string | undefined) => {
  if (!position) return null;
  const pos = typeof position === "string" ? parseInt(position) : position;
  if (pos === 1)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
        <Trophy size={12} /> 1st Place
      </span>
    );
  if (pos === 2)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-400/10 border border-gray-400/20 px-2.5 py-0.5 text-xs font-semibold text-gray-400">
        <Medal size={12} /> 2nd Place
      </span>
    );
  if (pos === 3)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-600/10 border border-orange-600/20 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
        <Award size={12} /> 3rd Place
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted/20 border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      <Star size={12} /> Position {position}
    </span>
  );
};

export default async function CompetitionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const result = await getMyAchievements();
  // @ts-ignore
  const allAchievements = result.success ? result.data || [] : [];

  // Filter achievements that are competition-type
  const competitions = allAchievements.filter(
    (a: any) =>
      a.category === "competition" ||
      a.category === "sports" ||
      a.category === "academic_competition"
  );

  // Group by year
  const grouped = competitions.reduce<Record<string, any[]>>((acc: Record<string, any[]>, comp: any) => {
    const year = comp.date_earned
      ? new Date(comp.date_earned).getFullYear().toString()
      : comp.dateEarned
      ? new Date(comp.dateEarned).getFullYear().toString()
      : "Unknown";
    if (!acc[year]) acc[year] = [];
    acc[year].push(comp);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

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
        <span className="text-foreground font-medium">Competitions</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Competition History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {competitions.length} competition{competitions.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      {competitions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card">
          <Trophy size={32} className="text-muted-foreground" />
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            No competitions yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Your competition results will appear here as you participate in events.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-foreground">{year}</h2>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">
                  {grouped[year].length} event{grouped[year].length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[year].map((comp: any) => (
                  <div
                    key={comp.id}
                    className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{comp.title}</h3>
                        {comp.issuer && (
                          <p className="text-sm text-muted-foreground">{comp.issuer}</p>
                        )}
                      </div>
                      {positionBadge(comp.position)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {comp.date_earned
                          ? new Date(comp.date_earned).toLocaleDateString("en-IN", {
                              month: "short",
                              year: "numeric",
                            })
                          : year}
                      </span>
                      {comp.description && (
                        <span className="line-clamp-1">{comp.description}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
