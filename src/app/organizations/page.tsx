
export const revalidate = 3600;
import React from "react";
import Link from "next/link";
export default async function OrganizationsDirectoryPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Organizations Directory</h1>
      <p>Browse our university clubs and societies.</p>
    </div>
  );
}
