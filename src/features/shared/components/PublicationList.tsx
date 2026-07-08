import React from "react";
import { SharedPublicationItem } from "../publications";

export const PublicationList = ({ publications }: { publications: SharedPublicationItem[] }) => {
  if (!publications || publications.length === 0) return <p className="text-gray-500">No publications found.</p>;
  return (
    <div className="space-y-4">
      {publications.map(pub => (
        <div key={pub.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold text-lg">{pub.title}</h3>
          {pub.publication_type && <p className="text-sm text-gray-500 italic">Type: {pub.publication_type.replace('_', ' ')}</p>}
          {pub.description && <p className="text-sm text-gray-500 italic">{pub.description}</p>}
          {pub.document_url && <a href={pub.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-2 block">Read Publication</a>}
        </div>
      ))}
    </div>
  );
};
