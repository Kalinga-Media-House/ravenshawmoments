'use client';

import { useState, useTransition } from 'react';
import { MoreVertical, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { updateAlbumStatus, deleteAlbum } from '@/actions/department/gallery.actions';
import { toast } from 'sonner';

export function AlbumCard({ album, slug }: { album: any; slug: string }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    startTransition(async () => {
      const newStatus = album.status === 'Published' ? 'Draft' : 'Published';
      // @ts-ignore
      const result = await updateAlbumStatus(album.id, newStatus);
      if (result.success) {
        toast.success(`Album ${newStatus.toLowerCase()}`);
      } else {
        // @ts-ignore
        toast.error(result.error || 'Failed to update status');
      }
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this album?')) {
      startTransition(async () => {
        // @ts-ignore
        const result = await deleteAlbum(album.id);
        if (result.success) {
          toast.success('Album deleted');
        } else {
          // @ts-ignore
          toast.error(result.error || 'Failed to delete album');
        }
      });
    }
  };

  return (
    <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl overflow-hidden hover:border-[#7C2D3E]/50 transition-colors group flex flex-col">
      <div className="aspect-video bg-[#0F0A0B] border-b border-[#2D1F23] relative overflow-hidden flex items-center justify-center">
        {album.cover_image ? (
          <img 
            src={album.cover_image} 
            alt={album.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <ImageIcon className="w-10 h-10 text-[#2D1F23]" />
        )}
        
        <div className="absolute top-3 right-3 z-10">
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 text-[#F5E6EA] bg-black/50 backdrop-blur rounded-md border border-white/10 hover:bg-black/70 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-1 w-40 bg-[#1A1214] border border-[#2D1F23] rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      handleToggleStatus();
                    }}
                    disabled={isPending}
                    className="w-full text-left px-4 py-2 text-sm text-[#F5E6EA] hover:bg-[#2D1F23] flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {album.status === 'Published' ? (
                      <><EyeOff className="w-4 h-4" /> Unpublish</>
                    ) : (
                      <><Eye className="w-4 h-4" /> Publish</>
                    )}
                  </button>
                  
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-[#F5E6EA] hover:bg-[#2D1F23] flex items-center gap-2 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Details
                  </button>
                  
                  <div className="h-px bg-[#2D1F23] my-1" />
                  
                  <button 
                    onClick={handleDelete}
                    disabled={isPending}
                    className="w-full text-left px-4 py-2 text-sm text-[#9B3A4D] hover:bg-[#9B3A4D]/10 flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded text-xs font-medium text-white flex items-center gap-1.5">
          <ImageIcon className="w-3 h-3" />
          {album.photo_count || 0}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[#F5E6EA] font-semibold line-clamp-1 flex-1 pr-2" title={album.title}>
            {album.title}
          </h3>
          <span className={`shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
            album.status === 'Published' 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : 'bg-amber-500/10 text-amber-400'
          }`}>
            {album.status || 'Draft'}
          </span>
        </div>
        
        {album.description && (
          <p className="text-[#8B7078] text-sm line-clamp-2 mt-1 flex-1">
            {album.description}
          </p>
        )}
        
        <div className="mt-4 pt-3 border-t border-[#2D1F23] flex justify-between items-center">
          <span className="text-xs text-[#8B7078]">
            {new Date(album.created_at || Date.now()).toLocaleDateString()}
          </span>
          <button className="text-xs font-medium text-[#7C2D3E] hover:text-[#9B3A4D] transition-colors">
            Manage Photos &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
