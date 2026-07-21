import React from "react";

export const OrganizationStats = ({ totalMembers, activeEvents }: { totalMembers: number, activeEvents: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="p-5 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-2xl shadow-sm">
        <p className="text-sm rm-text-muted mb-1">Total Members</p>
        <p className="text-3xl font-bold rm-heading-primary">{totalMembers}</p>
      </div>
      <div className="p-5 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-2xl shadow-sm">
        <p className="text-sm rm-text-muted mb-1">Active Events</p>
        <p className="text-3xl font-bold rm-heading-primary">{activeEvents}</p>
      </div>
    </div>
  );
};
