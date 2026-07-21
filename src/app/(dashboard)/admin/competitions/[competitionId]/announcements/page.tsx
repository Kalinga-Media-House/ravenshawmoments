import React from "react";
import { getAdminCompetitionById } from "@/features/competition/services/competitionAdminService";
import { announcementService } from "@/features/competition/services/extendedServices";

export const metadata = {
  title: "Announcements | Competition Admin",
};

export default async function CompetitionAnnouncementsPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const comp = await getAdminCompetitionById(competitionId);
  if (!comp) return null;

  const announcements = await announcementService.getAnnouncements(comp.id);
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Announcements</h2>
          <p className="text-sm text-stone-500 mt-1">Publish updates and notices to competition participants.</p>
        </div>
        <button className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors">
          New Announcement
        </button>
      </div>

      <div className="space-y-6">
        {announcements && announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((ann: any) => (
              <div key={ann.id} className="p-4 border border-stone-200 rounded-xl hover:border-stone-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-stone-900">{ann.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">{new Date(ann.published_at).toLocaleString()}</span>
                    <button className="text-red-600 hover:text-red-800 font-medium text-xs ml-2">Delete</button>
                  </div>
                </div>
                <p className="text-sm text-stone-700 whitespace-pre-wrap">{ann.content}</p>
                <div className="mt-3 text-xs text-stone-400">
                  Published by: {ann.publisher?.full_name || "Admin"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-xl border border-stone-100 border-dashed">
            <h3 className="text-stone-900 font-medium mb-1">No announcements</h3>
            <p className="text-stone-500 text-sm">Create an announcement to notify participants of updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
