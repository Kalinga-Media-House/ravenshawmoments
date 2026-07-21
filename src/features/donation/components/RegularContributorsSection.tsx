import React from "react";
import type { PublicContributor } from "@/features/donation/types/donation";
import { ContributorCard } from "./ContributorCard";

interface Props {
  contributors: PublicContributor[];
}

export function RegularContributorsSection({ contributors }: Props) {
  const currentDate = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthName = monthNames[currentDate.getMonth()];

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          Contributors
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          With gratitude to everyone supporting the journey of Ravenshaw Moments through meaningful contributions.
        </p>
        <div className="mt-6 inline-flex items-center px-4 py-1.5 rounded-full bg-muted border border-border text-[var(--color-heritage-gold)] text-sm font-medium">
          {currentMonthName} (Current Month)
        </div>
      </div>

      {contributors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {contributors.map((contributor, i) => (
            <div 
              key={contributor.id} 
              className="animate-fade-in-up" 
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <ContributorCard contributor={contributor} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 light-surface border border-border rounded-xl">
          <h4 className="text-lg text-foreground font-medium mb-2">No Public Contributors for This Month Yet</h4>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Verified contributors who qualify for public recognition and choose to be listed will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
