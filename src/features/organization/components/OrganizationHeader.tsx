import React from "react";
import { Organization } from "@/types/organization";

export const OrganizationHeader = ({ organization }: { organization: Organization }) => {
  return (
    <header className="p-6 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-2xl mb-6">
      <h1 className="text-2xl font-bold rm-heading-primary">{organization.name}</h1>
      <p className="rm-text-muted mt-2">{organization.description || "No description provided."}</p>
    </header>
  );
};
