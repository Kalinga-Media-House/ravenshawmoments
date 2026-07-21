'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function SeoSettingsPage({ params }: { params: { slug: string } }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: 'Computer Science Department | Ravenshaw Moments',
    description: 'Explore the Computer Science department at Ravenshaw University.',
    keywords: 'computer science, ravenshaw, university, programming, education',
    canonical: 'https://ravenshawmoments.com/department/cs',
    og_title: 'CS Dept @ Ravenshaw',
    og_description: '',
    structured_data: '{\n  "@context": "https://schema.org",\n  "@type": "EducationalOrganization"\n}'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('SEO Settings saved successfully');
    });
  };

  return (
    <div className="p-6 bg-[#0F0A0B] min-h-screen text-[#F5E6EA]">
      <h1 className="text-2xl font-bold mb-8">SEO Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-[#8B7078]">Meta Title</label>
                <span className={`text-xs ${formData.title.length > 60 ? 'text-red-400' : 'text-[#8B7078]'}`}>
                  {formData.title.length}/60
                </span>
              </div>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-[#8B7078]">Meta Description</label>
                <span className={`text-xs ${formData.description.length > 160 ? 'text-red-400' : 'text-[#8B7078]'}`}>
                  {formData.description.length}/160
                </span>
              </div>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B7078] mb-2">Keywords (Comma separated)</label>
              <input 
                type="text" 
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E]"
              />
            </div>

            <div className="pt-6 border-t border-[#2D1F23]">
              <h3 className="text-lg font-semibold mb-4">Open Graph / Social</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#8B7078] mb-2">OG Title</label>
                  <input 
                    type="text" 
                    value={formData.og_title}
                    onChange={(e) => setFormData({...formData, og_title: e.target.value})}
                    placeholder="Defaults to Meta Title"
                    className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#2D1F23]">
              <label className="block text-sm font-medium text-[#8B7078] mb-2">Structured Data (JSON-LD)</label>
              <textarea 
                rows={5}
                value={formData.structured_data}
                onChange={(e) => setFormData({...formData, structured_data: e.target.value})}
                className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] font-mono text-xs focus:outline-none focus:border-[#7C2D3E]"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={isPending}
                className="bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] px-6 py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Search Preview</h3>
          <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-5">
            <div className="text-sm text-[#8B7078] mb-1 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2D1F23] flex items-center justify-center text-xs">RM</div>
              <div>
                <span className="block text-[#F5E6EA] leading-tight">Ravenshaw Moments</span>
                <span className="block text-xs leading-tight truncate">{formData.canonical}</span>
              </div>
            </div>
            <h4 className="text-[#99c3ff] text-xl hover:underline cursor-pointer mb-1">
              {formData.title || 'Your Page Title Here'}
            </h4>
            <p className="text-[#8B7078] text-sm line-clamp-2">
              {formData.description || 'Your page meta description will appear here in search results. Make it descriptive and engaging.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
