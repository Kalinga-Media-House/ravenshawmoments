'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function AchievementForm({ slug, initialData }: { slug: string, initialData?: any }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    achievement_date: initialData?.achievement_date || '',
    type_id: initialData?.type_id || '',
    category_id: initialData?.category_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(initialData ? 'Achievement updated' : 'Achievement added successfully');
    });
  };

  return (
    <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-[#F5E6EA] mb-6">
        {initialData ? 'Edit Achievement' : 'New Achievement'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#8B7078] mb-1">Title</label>
          <input 
            type="text" 
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#8B7078] mb-1">Date</label>
          <input 
            type="date" 
            required
            value={formData.achievement_date}
            onChange={(e) => setFormData({...formData, achievement_date: e.target.value})}
            className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] [color-scheme:dark]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8B7078] mb-1">Type</label>
            <select 
              value={formData.type_id}
              onChange={(e) => setFormData({...formData, type_id: e.target.value})}
              className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E]"
            >
              <option value="">Select Type</option>
              <option value="1">Individual</option>
              <option value="2">Department</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8B7078] mb-1">Category</label>
            <select 
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E]"
            >
              <option value="">Select Category</option>
              <option value="1">Award</option>
              <option value="2">Publication</option>
              <option value="3">Grant</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8B7078] mb-1">Description</label>
          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E]"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            disabled={isPending}
            className="bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] px-6 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save Achievement'}
          </button>
        </div>
      </form>
    </div>
  );
}
