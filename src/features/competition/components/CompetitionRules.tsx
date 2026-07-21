"use client";

import React from "react";
import { FileText, UploadCloud, CheckCircle } from "lucide-react";
import { CompetitionItem } from "../types/competition";

export interface CompetitionRulesProps {
  competition: CompetitionItem;
}

export const CompetitionRules: React.FC<CompetitionRulesProps> = ({
  competition,
}) => {
  const hasRules =
    Array.isArray(competition.rules) && competition.rules.length > 0;
  const hasSubmission =
    competition.submissionRequired || competition.submissionDetails;

  if (!hasRules && !hasSubmission) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Competition Rules block */}
      {hasRules && (
        <section aria-labelledby="competition-rules-heading">
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
                <FileText className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2
                id="competition-rules-heading"
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ color: '#FFFFFF' }}
              >
                Competition Rules
              </h2>
            </div>

            <ol className="space-y-4">
              {competition.rules?.map((rule, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    color: '#FFFFFF'
                  }}
                >
                  <span 
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 mt-0.5"
                    style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.40)', color: '#E4B536' }}
                  >
                    {idx + 1}
                  </span>
                  <span className="pt-1">{rule}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Submission Requirements block */}
      {hasSubmission && (
        <section aria-labelledby="submission-requirements-heading">
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
                <UploadCloud className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2
                id="submission-requirements-heading"
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ color: '#FFFFFF' }}
              >
                Submission Requirements
              </h2>
            </div>

            {competition.submissionDetails ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                {competition.submissionDetails.type && (
                  <div 
                    className="p-4 rounded-2xl"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
                  >
                    <dt className="font-semibold mb-1" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                      Submission Type
                    </dt>
                    <dd className="font-bold" style={{ color: '#FFFFFF' }}>
                      {competition.submissionDetails.type}
                    </dd>
                  </div>
                )}

                {competition.submissionDetails.format && (
                  <div 
                    className="p-4 rounded-2xl"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
                  >
                    <dt className="font-semibold mb-1" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                      File Format
                    </dt>
                    <dd className="font-bold" style={{ color: '#FFFFFF' }}>
                      {competition.submissionDetails.format}
                    </dd>
                  </div>
                )}

                {competition.submissionDetails.maxSize && (
                  <div 
                    className="p-4 rounded-2xl"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
                  >
                    <dt className="font-semibold mb-1" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                      Maximum File Size
                    </dt>
                    <dd className="font-bold" style={{ color: '#E4B536' }}>
                      {competition.submissionDetails.maxSize}
                    </dd>
                  </div>
                )}

                {competition.submissionDetails.deadline && (
                  <div 
                    className="p-4 rounded-2xl"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
                  >
                    <dt className="font-semibold mb-1" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                      Submission Deadline
                    </dt>
                    <dd className="font-bold" style={{ color: '#FFFFFF' }}>
                      {competition.submissionDetails.deadline}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
                Registered participants will receive detailed digital submission instructions
                and verification guidelines upon enrollment.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
