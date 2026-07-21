import { requireAuth } from '@/auth/guards/require-auth';
import { getAchievements } from '@/actions/department/achievement.actions';
import { Plus, Edit2, Trash2, Calendar, Award } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AchievementsPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAuth();
  const { slug } = await params;

  // @ts-ignore
  const achievementsResult = await getAchievements(slug);

  if (!achievementsResult.success) {
    return (
      <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen">
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6">
          <p className="text-[#9B3A4D]">Error loading achievements: {achievementsResult.error}</p>
        </div>
      </div>
    );
  }

  const achievements = achievementsResult.data || [];

  return (
    <div className="p-6 bg-[#0F0A0B] min-h-screen text-[#F5E6EA]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="text-[#8B7078] text-sm mt-1">Manage departmental awards and recognitions.</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-[#1A1214] border border-[#2D1F23] rounded-md px-4 py-2 text-[#8B7078] focus:outline-none focus:border-[#7C2D3E]">
            <option>All Categories</option>
            <option>Awards</option>
            <option>Publications</option>
            <option>Recognition</option>
          </select>
          <Link 
            href={`/department/${slug}/achievements/new`}
            className="bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add Achievement</span>
          </Link>
        </div>
      </div>

      {achievements.length === 0 ? (
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#0F0A0B] rounded-full border border-[#2D1F23] flex items-center justify-center mb-4 text-[#8B7078]">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-[#F5E6EA] font-medium text-lg mb-2">No achievements yet</h3>
          <p className="text-[#8B7078] max-w-md text-sm">
            Record departmental awards, research milestones, and other recognitions here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item: any) => (
            <div key={item.id} className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-5 flex flex-col h-full hover:border-[#7C2D3E]/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#2D1F23] text-[#8B7078] text-xs px-2 py-1 rounded">
                  {item.achievement_categories?.name || 'Uncategorized'}
                </span>
                <div className="flex gap-2">
                  <button className="text-[#8B7078] hover:text-[#F5E6EA] transition-colors"><Edit2 size={16} /></button>
                  <button className="text-[#8B7078] hover:text-[#9B3A4D] transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-[#8B7078] text-sm mb-4 flex-1 line-clamp-3">
                {item.description || 'No description provided.'}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2D1F23]">
                <div className="flex items-center gap-2 text-xs text-[#8B7078]">
                  <Calendar size={14} />
                  <span>{new Date(item.achievement_date || item.created_at).toLocaleDateString()}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
