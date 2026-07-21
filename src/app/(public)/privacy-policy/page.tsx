import React from "react";
import { Metadata } from "next";
import { InnerPageHero } from "@/features/shared/components";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export const metadata: Metadata = {
  title: "Privacy Policy | Ravenshaw Moments",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <InnerPageHero
        title="Privacy Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" }
        ]}
        backgroundImage={innerPageHeroImages.legal}
        compact
      />
      <article className="container mx-auto py-16 px-4 max-w-3xl prose prose-lg dark:prose-invert">
        <p className="text-muted-foreground mt-0 mb-8">Last Updated: October 2023</p>
        <p>At Ravenshaw Moments, we take your privacy seriously. This policy describes what personal information we collect and how we use it.</p>
        <h2>Information Collection</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, request services, or communicate with us. This includes your name, email, and university enrollment details.</p>
        <h2>Data Usage</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, and to protect Ravenshaw Moments and our users.</p>
        <h2>Data Security</h2>
        <p>We implement Row Level Security (RLS) on our databases and use industry-standard encryption to protect your data.</p>
      </article>
    </div>
  );
}
