'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function ContentForm({ slug, initialData }: { slug: string, initialData?: any }) {
  const [isPending, startTransition] = useTransition();
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    display_order: initialData?.display_order || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      // Mocking the action call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(initialData ? 'Content updated successfully' : 'Content created successfully');
    });
  };

  return (
    <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#F5E6EA]">
          {initialData ? 'Edit Section' : 'New Section'}
        </h2>
        <button 
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="text-[#8B7078] hover:text-[#F5E6EA] text-sm underline"
        >
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#8B7078] mb-2">Title</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8B7078] mb-2">Content (Markdown)</label>
          {previewMode ? (
            <div className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 min-h-[300px] text-[#F5E6EA] whitespace-pre-wrap">
              {formData.content || 'Nothing to preview'}
            </div>
          ) : (
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-md px-4 py-2 text-[#F5E6EA] min-h-[300px] focus:outline-none focus:border-[#7C2D3E]"
              required
            />
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#2D1F23]">
          <span className="text-xs text-[#8B7078]">
            {isPending ? 'Saving...' : 'Auto-saving enabled'}
          </span>
          <button 
            type="submit"
            disabled={isPending}
            className="bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] px-6 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
