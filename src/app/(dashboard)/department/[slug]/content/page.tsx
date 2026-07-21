import { requireAuth } from '@/auth/guards/require-auth';
import { getContent } from '@/actions/department/content.actions';
import { ArrowUp, ArrowDown, Edit2, Trash2, Eye, Plus, Layout } from 'lucide-react';
import Link from 'next/link';

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAuth();
  const { slug } = await params;
  
  // @ts-ignore
  const contentResult = await getContent(slug);

  if (!contentResult.success) {
    return (
      <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen">
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6">
          <p className="text-[#9B3A4D]">Error loading content: {contentResult.error}</p>
        </div>
      </div>
    );
  }

  const contentSections = contentResult.data || [];

  return (
    <div className="p-6 bg-[#0F0A0B] min-h-screen text-[#F5E6EA]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Content Sections</h1>
          <p className="text-[#8B7078] text-sm mt-1">Manage public page sections for your department.</p>
        </div>
        <Link 
          href={`/department/${slug}/content/new`}
          className="bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Section</span>
        </Link>
      </div>

      {contentSections.length === 0 ? (
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#0F0A0B] rounded-full border border-[#2D1F23] flex items-center justify-center mb-4 text-[#8B7078]">
            <Layout className="w-8 h-8" />
          </div>
          <h3 className="text-[#F5E6EA] font-medium text-lg mb-2">No content sections</h3>
          <p className="text-[#8B7078] max-w-md text-sm">
            Create sections like "About Us", "Message from HOD", or "Facilities" to build your department's public page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contentSections.map((section: any, index: number) => (
            <div 
              key={section.id} 
              className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-4 flex items-center justify-between group hover:border-[#7C2D3E]/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    section.status === 'published' ? 'bg-[#9B3A4D]/30 text-[#F5E6EA]' : 'bg-[#2D1F23] text-[#8B7078]'
                  }`}>
                    {section.status}
                  </span>
                </div>
                <p className="text-[#8B7078] text-sm truncate max-w-2xl">{section.summary || 'No summary available.'}</p>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-[#2D1F23] rounded text-[#8B7078] hover:text-[#F5E6EA]" title="Move Up" disabled={index === 0}>
                  <ArrowUp size={18} className={index === 0 ? 'opacity-30' : ''} />
                </button>
                <button className="p-2 hover:bg-[#2D1F23] rounded text-[#8B7078] hover:text-[#F5E6EA]" title="Move Down" disabled={index === contentSections.length - 1}>
                  <ArrowDown size={18} className={index === contentSections.length - 1 ? 'opacity-30' : ''} />
                </button>
                <button className="p-2 hover:bg-[#2D1F23] rounded text-[#8B7078] hover:text-[#F5E6EA]" title="Preview">
                  <Eye size={18} />
                </button>
                <button className="p-2 hover:bg-[#2D1F23] rounded text-[#8B7078] hover:text-[#F5E6EA]" title="Edit">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 hover:bg-[#7C2D3E] rounded text-[#8B7078] hover:text-[#F5E6EA]" title="Archive">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
