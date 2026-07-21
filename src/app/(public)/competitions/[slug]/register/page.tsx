import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Award, ShieldCheck } from "lucide-react";
import {
  getCompetitionBySlug,
  getCompetitions,
  computeRegistrationStatus,
  CompetitionRegistrationSummary,
  CompetitionRegistrationForm,
  RegistrationClosedState,
  RegistrationNotOpenState,
  RegistrationFullState,
} from "@/features/competition";

interface CompetitionRegistrationPageProps {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({
  params,
}: CompetitionRegistrationPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const competition = await getCompetitionBySlug(resolvedParams.slug);

  if (!competition) {
    return {
      title: "Competition Registration | Ravenshaw Moments",
      description: "Complete your competition registration on Ravenshaw Moments.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return {
    title: `Register for ${competition.title} | Ravenshaw Moments`,
    description: `Complete your registration for ${competition.title} and review eligibility, participation requirements, important dates, and registration information.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function CompetitionRegistrationPage({
  params,
}: CompetitionRegistrationPageProps) {
  const resolvedParams = await params;
  const competition = await getCompetitionBySlug(resolvedParams.slug);

  if (!competition) {
    notFound();
  }

  const regStatus = computeRegistrationStatus(competition);
  const isFull =
    typeof competition.availableSeats === "number" && competition.availableSeats <= 0;

  return (
    <main className="min-h-screen bg-black text-white pb-24 pt-28">
      {/* Ambient background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px]" style={{ background: 'rgba(80, 6, 25, 0.15)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[140px]" style={{ background: 'rgba(228, 181, 54, 0.10)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-white/70">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href="/"
                className="hover:text-[var(--color-rm-gold)] transition-colors font-medium"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            </li>
            <li>
              <Link
                href="/competitions"
                className="hover:text-[var(--color-rm-gold)] transition-colors font-medium"
              >
                Competitions
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            </li>
            <li>
              <Link
                href={`/competitions/${competition.slug}`}
                className="transition-colors font-medium truncate max-w-[180px] sm:max-w-none inline-block text-white/70 hover:text-[#E4B536]"
              >
                {competition.title}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            </li>
            <li className="font-bold truncate" style={{ color: '#E4B536' }}>
              Register
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="space-y-3 pb-6 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
              style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.40)', color: '#E4B536' }}
            >
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Official Registration</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white">
              {competition.level} Level
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white">
              {competition.participationMode}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Register for {competition.title}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-3xl leading-relaxed">
            Complete the form below to register for {competition.title} organized by{" "}
            <strong className="text-white">{competition.organizerName}</strong>. Please review
            eligibility rules and team requirements carefully before submitting.
          </p>
        </header>

        {/* Dynamic Registration Status Gates */}
        {regStatus === "Registration Closed" ? (
          <RegistrationClosedState competition={competition} />
        ) : regStatus === "Registration Opens Soon" ? (
          <RegistrationNotOpenState competition={competition} />
        ) : isFull ? (
          <RegistrationFullState competition={competition} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 cols: Interactive Multi-step Registration Form */}
            <div className="lg:col-span-8">
              <CompetitionRegistrationForm competition={competition} />
            </div>

            {/* Right 4 cols: Sticky Competition Registration Summary Sidebar */}
            <div className="lg:col-span-4 sticky top-28">
              <CompetitionRegistrationSummary competition={competition} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
