import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Ravenshaw Moments",
};

export default function CookiePolicyPage() {
  return (
    <article className="container mx-auto py-16 px-4 max-w-3xl prose prose-lg dark:prose-invert">
      <h1 className="mb-2">Cookie Policy</h1>
      <p className="text-muted-foreground mt-0 mb-8">Last Updated: October 2023</p>
      <p>This Cookie Policy explains how Ravenshaw Moments uses cookies and similar technologies to recognize you when you visit our website.</p>
      <h2>What are cookies?</h2>
      <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
      <h2>Why do we use cookies?</h2>
      <p>We use essential cookies strictly for authentication and maintaining your secure session state via Supabase Auth.</p>
    </article>
  );
}
