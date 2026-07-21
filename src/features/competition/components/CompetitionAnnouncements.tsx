import React from "react";
import { announcementService } from "../services/extendedServices";
import { Megaphone } from "lucide-react";

export async function CompetitionAnnouncements({ competitionId }: { competitionId: string }) {
  const announcements = await announcementService.getAnnouncements(competitionId);
  
  if (!announcements || announcements.length === 0) return null;

  return (
    <section aria-labelledby="announcements-heading" className="mb-10">
      <h2 id="announcements-heading" className="text-xl font-bold text-rm-maroon-dark flex items-center gap-2 mb-4 border-b border-stone-200 pb-2">
        <Megaphone className="w-5 h-5 text-rm-gold" />
        Announcements
      </h2>
      <div className="space-y-4">
        {announcements.map((ann: any) => (
          <div key={ann.id} className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-amber-900">{ann.title}</h3>
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {new Date(ann.published_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-amber-800 whitespace-pre-wrap">{ann.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
