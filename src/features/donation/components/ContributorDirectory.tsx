import React from "react";
import { UserPlus } from "lucide-react";
import { PublicContributor } from "../types/donation";
import { ContributorCard } from "./ContributorCard";

interface ContributorDirectoryProps {
  contributors: PublicContributor[];
}

export const ContributorDirectory: React.FC<ContributorDirectoryProps> = ({
  contributors,
}) => {
  return (
    <section
      id="contributors"
      aria-labelledby="contributors-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2
            id="contributors-heading"
            className="text-2xl sm:text-3xl font-black text-foreground tracking-tight"
          >
            Our Contributors
          </h2>
          <p className="text-sm text-muted-foreground">
            Approved public contributors who have chosen to be recognized for
            supporting Ravenshaw Moments.
          </p>
        </div>

        {contributors.length === 0 ? (
          <div className="light-surface rounded-3xl p-10 sm:p-14 border border-border text-center space-y-5 shadow-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted border border-border text-muted-foreground">
              <UserPlus className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-black text-foreground">
              The Contributors Community Is Growing
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Approved public contributors will appear here when verified
              contribution records and public-recognition permissions become
              available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {contributors.map((contributor) => (
              <ContributorCard key={contributor.id} contributor={contributor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
