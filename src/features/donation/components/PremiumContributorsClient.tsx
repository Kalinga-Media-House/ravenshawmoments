"use client";

import React, { useState, useEffect } from "react";
import { getPublicContributors } from "@/app/actions/donations";
import type { PublicContributor } from "@/features/donation/types/donation";
import { ContributorCard } from "./ContributorCard";

interface Props {
  initialPremium: PublicContributor[];
  availableYears: number[];
  initialMonth: number;
  initialYear: number;
}

export function PremiumContributorsClient({
  initialPremium,
  availableYears,
  initialMonth,
  initialYear,
}: Props) {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [contributors, setContributors] = useState(initialPremium);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (month === initialMonth && year === initialYear) {
      setContributors(initialPremium);
      return;
    }
    let isMounted = true;
    const fetchContributors = async () => {
      setLoading(true);
      const res = await getPublicContributors(month, year);
      if (isMounted) {
        setContributors(res.premium);
        setLoading(false);
      }
    };
    fetchContributors();
    return () => {
      isMounted = false;
    };
  }, [month, year, initialMonth, initialYear, initialPremium]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (year === currentYear && month === currentMonth) return;
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const isNextDisabled = year === currentYear && month === currentMonth;

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-heritage-gold)] mb-4">
          Premium Contributors
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Honouring the contributors whose generous support helps strengthen the preservation and continued growth of Ravenshaw Moments.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <button
          onClick={handlePrevMonth}
          className="p-2 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted rounded-md border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-heritage-gold)] shadow-sm"
          aria-label="Previous Month"
        >
          &larr;
        </button>
        
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-white text-foreground border border-input rounded-md px-4 py-2 focus:outline-none focus:border-[var(--color-heritage-gold)] shadow-sm"
            aria-label="Select Month"
          >
            {monthNames.map((name, i) => {
              const m = i + 1;
              const disabled = year === currentYear && m > currentMonth;
              return (
                <option key={m} value={m} disabled={disabled}>
                  {name}
                </option>
              );
            })}
          </select>

          <select
            value={year}
            onChange={(e) => {
              const newYear = Number(e.target.value);
              setYear(newYear);
              if (newYear === currentYear && month > currentMonth) {
                setMonth(currentMonth);
              }
            }}
            className="bg-white text-foreground border border-input rounded-md px-4 py-2 focus:outline-none focus:border-[var(--color-heritage-gold)] shadow-sm"
            aria-label="Select Year"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          disabled={isNextDisabled}
          className={`p-2 w-10 h-10 flex items-center justify-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-heritage-gold)] shadow-sm ${
            isNextDisabled 
              ? "text-muted-foreground border-border bg-transparent opacity-50 cursor-not-allowed" 
              : "text-muted-foreground hover:text-foreground bg-muted border-border"
          }`}
          aria-label="Next Month"
        >
          &rarr;
        </button>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl text-foreground font-medium">
          {monthNames[month - 1]} {year}
        </h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--color-heritage-gold)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : contributors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map((contributor, i) => (
            <div 
              key={contributor.id} 
              className="animate-fade-in-up" 
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <ContributorCard contributor={contributor} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 light-surface border border-border rounded-xl">
          <h4 className="text-lg text-foreground font-medium mb-2">No Premium Contributors for This Month Yet</h4>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Verified contributors who qualify for Premium recognition and choose public visibility will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
