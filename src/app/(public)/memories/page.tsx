import React from "react";
import { Metadata } from "next";
import { CANONICAL_MEMORIES } from "@/features/memory/data/memories";
import { MemoriesDirectory } from "@/features/memory/components/MemoriesDirectory";

export const metadata: Metadata = {
  title: "Memories | Ravenshaw Moments",
  description:
    "Explore and preserve Ravenshaw memories, friendships, celebrations, departments, hostels, organizations, events, achievements, campus life, and stories across generations.",
  openGraph: {
    title: "Memories | Ravenshaw Moments",
    description:
      "Explore and preserve Ravenshaw memories, friendships, celebrations, departments, hostels, organizations, events, achievements, campus life, and stories across generations.",
    url: "/memories",
    type: "website",
  },
};

export default function MemoriesPage() {
  return <MemoriesDirectory initialMemories={CANONICAL_MEMORIES} />;
}
