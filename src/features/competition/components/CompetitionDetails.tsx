"use client";

import React from "react";
import {
  Trophy,
  Sparkles,
  Info,
  AlertCircle,
  AlertTriangle,
  Award,
} from "lucide-react";
import { CompetitionItem } from "../types/competition";
import { CompetitionRegistrationSidebar } from "./CompetitionRegistrationSidebar";
import { CompetitionShare } from "./CompetitionShare";
import { CompetitionSupport } from "./CompetitionSupport";

export interface CompetitionDetailsProps {
  competition: CompetitionItem;
}

export const CompetitionDetails: React.FC<CompetitionDetailsProps> = ({
  competition,
}) => {
  return (
    <article className="pb-16 pt-6 text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Main Content Area (Left on Desktop, 8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* About Section */}
          {competition.fullDescription && (
            <section aria-labelledby="about-heading" className="space-y-4">
              <h2 id="about-heading" className="text-2xl font-black text-primary tracking-tight">
                About the Competition
              </h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                <p>{competition.fullDescription}</p>
              </div>
            </section>
          )}

          {/* Highlights */}
          {competition.highlights && competition.highlights.length > 0 && (
            <section aria-labelledby="highlights-heading" className="space-y-4">
              <h2 id="highlights-heading" className="text-xl font-bold text-primary flex items-center gap-2">
                <Sparkles className="size-5 text-[#D4AF37]" />
                <span>Highlights</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {competition.highlights.map((highlight, idx) => {
                  const content = typeof highlight === "string" ? highlight : highlight.description;
                  return (
                    <li
                      key={idx}
                      className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs flex items-start gap-3 transition-all duration-200 hover:border-primary/40"
                    >
                      <span className="size-2 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                      <span className="text-sm font-medium text-foreground">{content}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Important Information / Alerts */}
          {competition.importantInformation && competition.importantInformation.length > 0 && (
            <section aria-label="Important Information" className="space-y-3">
              {competition.importantInformation.map((info, idx) => {
                const content = typeof info === "string" ? info : info.content;
                const severity = typeof info === "string" ? "info" : info.severity || "info";

                let Icon = Info;
                let alertClass = "bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200";
                let iconColor = "text-blue-600 dark:text-blue-400";

                if (severity === "warning") {
                  Icon = AlertTriangle;
                  alertClass = "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200";
                  iconColor = "text-amber-600 dark:text-amber-400";
                } else if (severity === "alert") {
                  Icon = AlertCircle;
                  alertClass = "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200";
                  iconColor = "text-rose-600 dark:text-rose-400";
                }

                return (
                  <div key={idx} className={`p-4 rounded-2xl border flex items-start gap-3.5 ${alertClass}`}>
                    <Icon className={`size-5 shrink-0 mt-0.5 ${iconColor}`} />
                    <p className="text-sm font-medium leading-relaxed">{content}</p>
                  </div>
                );
              })}
            </section>
          )}

          {/* Rules & Guidelines details */}
          {competition.rules && competition.rules.length > 0 && (
            <section aria-labelledby="rules-heading" className="space-y-4">
              <h2 id="rules-heading" className="text-xl font-bold text-primary border-b border-border/80 pb-3">
                Rules & Guidelines
              </h2>
              <ul className="space-y-3">
                {competition.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-foreground/90">
                    <span className="font-bold text-[#D4AF37] mt-0.5">{idx + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Submission Requirements */}
          {competition.submissionRequirements && Object.keys(competition.submissionRequirements).length > 0 && (
            <section aria-labelledby="submission-heading" className="space-y-4">
              <h2 id="submission-heading" className="text-xl font-bold text-primary border-b border-border/80 pb-3">
                Submission Requirements
              </h2>
              <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs">
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed overflow-x-auto">
                  {JSON.stringify(competition.submissionRequirements, null, 2)}
                </pre>
              </div>
            </section>
          )}

          {/* Prizes & Recognition */}
          {competition.prizes && competition.prizes.length > 0 && (
            <section aria-labelledby="prizes-heading" className="space-y-4">
              <h2 id="prizes-heading" className="text-xl font-bold text-primary flex items-center gap-2 border-b border-border/80 pb-3">
                <Trophy className="size-5 text-[#D4AF37]" />
                <span>Prizes & Recognition</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {competition.prizes
                  .slice()
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((prize) => (
                    <div
                      key={prize.id}
                      className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs text-center space-y-2.5 flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37]/50"
                    >
                      <div className="size-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-1">
                        <Trophy className="size-6 text-[#D4AF37]" />
                      </div>
                      <h3 className="font-bold text-foreground text-base">{prize.positionName}</h3>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">{prize.prizeTitle}</p>
                      {prize.monetaryAmount > 0 && (
                        <p className="text-lg font-black text-primary mt-1">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: prize.currency || "INR",
                            maximumFractionDigits: 0,
                          }).format(prize.monetaryAmount)}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-border/40 w-full text-xs text-muted-foreground">
                        {prize.includesTrophy && (
                          <span className="flex items-center gap-1 font-medium">
                            <Award className="size-3.5 text-[#D4AF37]" /> Trophy
                          </span>
                        )}
                        {prize.includesCertificate && (
                          <span className="flex items-center gap-1 font-medium">
                            <Award className="size-3.5 text-[#D4AF37]" /> Certificate
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Area (Right on Desktop, 4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <CompetitionRegistrationSidebar competition={competition} />
          <CompetitionShare competition={competition} />
          <CompetitionSupport />
        </div>
      </div>
    </article>
  );
};
