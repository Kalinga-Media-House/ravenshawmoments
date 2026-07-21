import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMyHostel, getHostelHistory } from "@/actions/student/hostel.actions";
import { Building, Calendar, DoorOpen, Hash } from "lucide-react";

export const metadata: Metadata = {
  title: "Hostel | Ravenshaw Moments",
  description: "View your current hostel assignment and hostel history.",
};

export default async function HostelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [currentResult, historyResult] = await Promise.all([
    getMyHostel(),
    getHostelHistory(),
  ]);

  const currentAssignment = currentResult.success ? currentResult.data : null;
    const pastAssignments = historyResult.success ? historyResult.data || [] : [];

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
        <span className="text-foreground font-medium">Hostel</span>
      </nav>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hostel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your current hostel assignment and residential history
          </p>
        </div>

        {/* Current Assignment */}
        {currentAssignment ? (
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <Building size={16} className="text-primary" />
              </div>
              <h2 className="text-sm font-medium text-primary uppercase tracking-wider">
                Current Assignment
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Hostel</p>
                <p className="text-lg font-semibold text-foreground">
                                    {currentAssignment.hostel_name}
                </p>
              </div>
                            {currentAssignment.room_number && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Room Number</p>
                  <div className="flex items-center gap-2">
                    <DoorOpen size={16} className="text-muted-foreground" />
                    <p className="text-lg font-semibold text-foreground">
                                            {currentAssignment.room_number}
                    </p>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Since</p>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <p className="text-lg font-semibold text-foreground">
                                        {currentAssignment.start_date
                                            ? new Date(currentAssignment.start_date).toLocaleDateString("en-IN", {
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-border bg-card">
            <Building size={32} className="text-muted-foreground" />
            <h3 className="mt-3 text-lg font-semibold text-foreground">
              No current hostel assignment
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Your hostel assignment will appear here once assigned by the administration.
            </p>
          </div>
        )}

        {/* History */}
        {pastAssignments.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Hostel History ({pastAssignments.length})
            </h2>
            <div className="space-y-3">
              {pastAssignments.map((h: any) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted/20">
                      <Building size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{h.hostel_name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        {h.room_number && (
                          <span className="flex items-center gap-1">
                            <Hash size={10} />
                            Room {h.room_number}
                          </span>
                        )}
                        <span>
                          {h.start_date && new Date(h.start_date).getFullYear()} –{" "}
                          {h.end_date && new Date(h.end_date).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-border bg-muted/10 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Past
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
