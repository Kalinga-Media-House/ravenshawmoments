
import React from "react";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { EmptyStateCard } from "@/features/shared";

export default function NewsFeedNotFound() {
  return (
    <div className="container mx-auto py-24 px-4">
      <EmptyStateCard 
        icon={<FileQuestion className="w-8 h-8" />}
        title="Item Not Found"
        description="We couldn't find the requested item."
        action={<Link href="/" className="px-4 py-2 bg-primary text-white rounded-md">Return Home</Link>}
      />
    </div>
  );
}
