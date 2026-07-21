'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createAlbum } from '@/actions/department/gallery.actions';
import { PlusCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { useDepartmentAdmin } from '../context';

const albumSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  cover_image: z.string().optional(), // In a real app, you'd use a file picker and upload
});

type AlbumFormValues = z.infer<typeof albumSchema>;

export function AlbumForm({
  slug,
}: {
  slug: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const adminCtx = useDepartmentAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: '',
      description: '',
      cover_image: '',
    },
  });

  const onSubmit = (data: AlbumFormValues) => {
    startTransition(async () => {
      // @ts-ignore
      const result = await createAlbum({ ...data, departmentId: adminCtx?.departmentId, slug });
        
      if (result.success) {
        toast.success('Album created successfully');
        setOpen(false);
        reset();
      } else {
        toast.error(result.error || 'Failed to create album');
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[#9B3A4D]"
      >
        <PlusCircle className="w-4 h-4" />
        Create Album
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2D1F23] flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#F5E6EA]">Create New Album</h2>
              <button 
                onClick={() => setOpen(false)}
                className="text-[#8B7078] hover:text-[#F5E6EA] transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8B7078] mb-1">Album Title</label>
                <input
                  {...register('title')}
                  className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors"
                  placeholder="e.g. Annual Fest 2026"
                />
                {errors.title && <p className="text-[#9B3A4D] text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B7078] mb-1">Description (Optional)</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors resize-none"
                  placeholder="A brief description about the album..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B7078] mb-1">Cover Image URL (Mock)</label>
                <div className="flex gap-2">
                  <div className="bg-[#0F0A0B] border border-[#2D1F23] rounded-lg p-2 flex items-center justify-center text-[#8B7078]">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <input
                    {...register('cover_image')}
                    className="flex-1 bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#F5E6EA] bg-[#2D1F23] hover:bg-[#2D1F23]/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#F5E6EA] bg-[#7C2D3E] hover:bg-[#9B3A4D] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
