import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Heart, Users, BookOpen } from "lucide-react";
import { MemorySubmissionForm } from "@/features/memory/components";

export const metadata: Metadata = {
  title: "Share a Memory | Ravenshaw Moments",
  description:
    "Share photographs and stories from Ravenshaw campus life and help preserve meaningful memories for future generations.",
  openGraph: {
    title: "Share a Memory | Ravenshaw Moments",
    description:
      "Share photographs and stories from Ravenshaw campus life and help preserve meaningful memories for future generations.",
    type: "website",
  },
};

import { createClient } from "@/lib/supabase/server";

export default async function ShareMemorySubmissionPage() {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();

  let currentUser = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, profile_status, is_verified")
      .eq("id", user.id)
      .single();
    currentUser = data;
  }

  return (
    <main className="min-h-screen bg-[var(--color-rm-bg-deep)] text-white pb-24">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full bg-[var(--color-rm-maroon)]/15 blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[360px] h-[360px] rounded-full bg-[var(--color-rm-gold)]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        {/* Compact Hero Section */}
        <section aria-label="Page Header" className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-white/60">
            <ol className="flex items-center flex-wrap gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--color-rm-gold)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/memories"
                  className="hover:text-[var(--color-rm-gold)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
                >
                  Memories
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--color-rm-gold)]" aria-current="page">
                Share a Memory
              </li>
            </ol>
          </nav>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-rm-maroon)]/40 border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-extrabold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>ADD YOUR CHAPTER</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Share a Memory
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-3xl leading-relaxed">
              Every photograph and story carries a piece of Ravenshaw. Share the moments that deserve to be remembered and help preserve them for generations to come.
            </p>

            <p className="text-xs sm:text-sm text-[var(--color-rm-gold)]/90 font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Your submission will be reviewed before it becomes publicly visible.</span>
            </p>
          </div>
        </section>

        {/* Contribution Introduction Glass Panel */}
        <section
          aria-labelledby="contribution-intro-heading"
          className="rm-glass-card rounded-3xl p-6 sm:p-8 border border-white/15 bg-black/40 space-y-6"
        >
          <div className="space-y-2">
            <h2
              id="contribution-intro-heading"
              className="text-xl sm:text-2xl font-black text-white"
            >
              Your Story Matters
            </h2>
            <p className="text-sm sm:text-base text-white/75 leading-relaxed">
              A classroom photograph, hostel celebration, friendship, achievement, farewell, festival, campus moment, or simple memory can become part of Ravenshaw&apos;s shared digital legacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-bold text-sm">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>Preserve</span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Keep meaningful moments accessible for future generations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-bold text-sm">
                <Users className="w-4 h-4" aria-hidden="true" />
                <span>Respect & Consent</span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Ensure all people clearly identifiable in submitted photographs are comfortable with public inclusion.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-bold text-sm">
                <Heart className="w-4 h-4" aria-hidden="true" />
                <span>Inspire</span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Allow future Ravenshawvians to discover the stories that shaped the community before them.
              </p>
            </div>
          </div>
        </section>

        {/* Multi-Step Memory Submission Form */}
        <section aria-label="Memory Submission Form">
          <MemorySubmissionForm currentUser={currentUser} />
        </section>
      </div>
    </main>
  );
}
