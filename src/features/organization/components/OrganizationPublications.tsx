import React from "react";
import { OrganizationPublication } from "@/types/organization";

export const OrganizationPublications = ({ publications }: { publications: OrganizationPublication[] }) => {
  if (!publications || publications.length === 0) return <p className="text-gray-500">No publications found.</p>;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Publications</h2>
      <div className="space-y-4">
        {publications.map(pub => (
          <div key={pub.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">{pub.title}</h3>
            <p className="text-sm text-gray-500 italic">Type: {pub.type.replace('_', ' ')}</p>
            {pub.file_url && <a href={pub.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-2 block">Read Publication</a>}
          </div>
        ))}
      </div>
    </div>
  );
};
