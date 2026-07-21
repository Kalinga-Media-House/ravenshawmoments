"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { CompetitionItem } from "../types/competition";

export interface CompetitionRecognitionProps {
  competition: CompetitionItem;
}

export const CompetitionRecognition: React.FC<CompetitionRecognitionProps> = ({
  competition,
}) => {
  const hasPrizes =
    Boolean(competition.prizeInformation) || Boolean(competition.prizes);
  const hasCertificates =
    competition.certificateAvailable || Boolean(competition.certificateDetails);
  const hasResults =
    competition.resultPublished &&
    competition.resultsData &&
    competition.resultsData.winners &&
    competition.resultsData.winners.length > 0;
  const hasAchievements =
    Array.isArray(competition.relatedAchievementSlugs) &&
    competition.relatedAchievementSlugs.length > 0;

  if (!hasPrizes && !hasCertificates && !hasResults && !hasAchievements) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Prizes and Recognition */}
      {hasPrizes && (
        <section aria-labelledby="prizes-recognition-heading">
          <div 
            className="rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6"
            style={{
              background: 'linear-gradient(135deg, #32000D 0%, #500619 50%, #690B27 100%)',
              border: '1px solid rgba(228, 181, 54, 0.28)',
              boxShadow: '0 10px 28px rgba(61, 0, 18, 0.16)'
            }}
          >
            <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.50)', color: '#E4B536' }}>
                <Trophy className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2
                id="prizes-recognition-heading"
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ color: '#FFFFFF' }}
              >
                Prizes and Recognition
              </h2>
            </div>

            {competition.prizeInformation && (
              <p className="text-sm sm:text-base font-bold" style={{ color: '#E4B536' }}>
                {competition.prizeInformation}
              </p>
            )}

            {competition.prizes && competition.prizes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {competition.prizes.map((prize) => (
                  <div 
                    key={prize.id}
                    className="p-5 rounded-2xl space-y-2"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(228, 181, 54, 0.50)' }}
                  >
                    <span className="text-xs font-black uppercase tracking-wider block" style={{ color: '#E4B536' }}>
                      {prize.positionName}
                    </span>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed" style={{ color: '#FFFFFF' }}>
                      {prize.prizeTitle}
                    </p>
                    {prize.monetaryAmount > 0 && (
                      <p className="text-xs font-bold" style={{ color: '#E4B536' }}>
                        {prize.currency} {prize.monetaryAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {competition.participationRecognition && (
              <div 
                className="p-4 rounded-2xl text-xs sm:text-sm"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)', color: 'rgba(255, 255, 255, 0.85)' }}
              >
                <strong style={{ color: '#FFFFFF' }}>Participation Recognition:</strong>{" "}
                {competition.participationRecognition}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certificates Block */}
      {hasCertificates && (
        <section aria-labelledby="certificates-heading">
          <div 
            className="rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6"
            style={{
              background: 'linear-gradient(145deg, #39000F 0%, #55071D 55%, #710D2B 100%)',
              border: '1px solid rgba(228, 181, 54, 0.28)',
              boxShadow: '0 10px 28px rgba(61, 0, 18, 0.16)'
            }}
          >
            <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.50)', color: '#E4B536' }}>
                <FileCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2
                id="certificates-heading"
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ color: '#FFFFFF' }}
              >
                Certificates
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              {competition.certificateDetails?.participationCertificate !==
                false && (
                <div 
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
                >
                  <CheckCircle2
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: '#E4B536' }}
                    aria-hidden="true"
                  />
                  <div>
                    <strong className="block font-bold" style={{ color: '#FFFFFF' }}>
                      Participation Certificate
                    </strong>
                    <span className="text-xs block mt-1" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                      Issued to verified participants upon completion of event rounds.
                    </span>
                  </div>
                </div>
              )}

              {competition.certificateDetails?.meritCertificate !== false && (
                <div 
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
                >
                  <CheckCircle2
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: '#E4B536' }}
                    aria-hidden="true"
                  />
                  <div>
                    <strong className="block font-bold" style={{ color: '#FFFFFF' }}>
                      Merit & Winner Certificate
                    </strong>
                    <span className="text-xs block mt-1" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                      Awarded to position holders and recognized finalists.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {competition.certificateDetails?.deliveryMethod && (
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
                <strong style={{ color: '#E4B536' }}>Delivery Method:</strong>{" "}
                {competition.certificateDetails.deliveryMethod}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Competition Results Block when published */}
      {hasResults && competition.resultsData && (
        <section aria-labelledby="competition-results-heading">
          <div 
            className="rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6"
            style={{
              background: 'linear-gradient(135deg, #32000D 0%, #500619 50%, #690B27 100%)',
              border: '1px solid rgba(228, 181, 54, 0.28)',
              boxShadow: '0 10px 28px rgba(61, 0, 18, 0.16)'
            }}
          >
            <div className="flex items-center justify-between gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.50)', color: '#E4B536' }}>
                  <Award className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2
                  id="competition-results-heading"
                  className="text-xl sm:text-2xl font-black tracking-tight"
                  style={{ color: '#FFFFFF' }}
                >
                  Competition Results
                </h2>
              </div>
              {competition.resultsData.publishedDate && (
                <span className="text-xs font-bold" style={{ color: '#E4B536' }}>
                  Published: {competition.resultsData.publishedDate}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {competition.resultsData.winners?.map((winner: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
                >
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider block" style={{ color: '#E4B536' }}>
                      {winner.position}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold block" style={{ color: '#FFFFFF' }}>
                      {winner.name}
                    </span>
                    {(winner.department || winner.institution) && (
                      <span className="text-xs block mt-0.5" style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
                        {[winner.department, winner.institution]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    )}
                  </div>
                  {winner.recognition && (
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.40)', color: '#FFFFFF' }}
                    >
                      {winner.recognition}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {competition.resultsData.resultUrl && (
              <div className="pt-2">
                <a
                  href={competition.resultsData.resultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow"
                  style={{ background: '#500619', border: '1px solid rgba(228, 181, 54, 0.60)', color: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#690B27';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#500619';
                  }}
                >
                  <span>View Complete Results</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Celebrating the Achievers block */}
      {hasAchievements && (
        <section aria-labelledby="celebrating-achievers-heading">
          <div 
            className="rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6"
            style={{
              background: 'linear-gradient(135deg, #32000D 0%, #500619 50%, #690B27 100%)',
              border: '1px solid rgba(228, 181, 54, 0.28)',
              boxShadow: '0 10px 28px rgba(61, 0, 18, 0.16)'
            }}
          >
            <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.50)', color: '#E4B536' }}>
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2
                id="celebrating-achievers-heading"
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ color: '#FFFFFF' }}
              >
                Celebrating the Achievers
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {competition.relatedAchievementSlugs?.map((slug, idx) => (
                <Link
                  key={idx}
                  href={`/achievements/${slug}`}
                  className="p-5 rounded-2xl transition-all duration-300 flex items-center justify-between group"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                    e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.50)';
                    const span = e.currentTarget.querySelector('span');
                    const icon = e.currentTarget.querySelector('svg');
                    if (span) span.style.color = '#E4B536';
                    if (icon) icon.style.color = '#E4B536';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                    const span = e.currentTarget.querySelector('span');
                    const icon = e.currentTarget.querySelector('svg');
                    if (span) span.style.color = '#FFFFFF';
                    if (icon) icon.style.color = 'rgba(255, 255, 255, 0.50)';
                  }}
                >
                  <span className="text-sm font-bold transition-colors" style={{ color: '#FFFFFF' }}>
                    View Achievement Record
                  </span>
                  <ExternalLink className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.50)' }} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
