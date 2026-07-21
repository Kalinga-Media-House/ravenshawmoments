import React from "react";
import { Metadata } from "next";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const metadata: Metadata = {
  title: "Terms of Service | Ravenshaw Moments",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <InnerPageHero
        title="Terms of Service"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Service" }
        ]}
        backgroundImage={innerPageHeroImages.legal}
        compact
      />
      <article className="container mx-auto py-16 px-4 max-w-3xl prose prose-lg dark:prose-invert">
        <p className="text-muted-foreground mt-0 mb-8">Last Updated: October 2023</p>
        <p>By accessing Ravenshaw Moments, you agree to be bound by these Terms of Service.</p>
        <h2>User Responsibilities</h2>
        <p>You must provide accurate information during registration. You are responsible for safeguarding the password that you use to access the Service.</p>
        <h2>Content Guidelines</h2>
        <p>Users may not post content that is illegal, offensive, or violates the intellectual property rights of others. We reserve the right to remove any content that violates these terms.</p>
      </article>
    </div>
  );
}
