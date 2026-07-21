'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Image as ImageIcon, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MediaBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  mediaType?: 'image' | 'video' | 'all';
}

// Dummy data for visual representation
const DUMMY_MEDIA = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  url: `https://picsum.photos/seed/${i + 100}/400/300`,
  type: i % 4 === 0 ? 'video' : 'image',
  name: `Media File ${i + 1}`,
}));

export function MediaBrowser({ open, onOpenChange, onSelect, mediaType = 'all' }: MediaBrowserProps) {
  const [search, setSearch] = useState('');
  
  const filtered = DUMMY_MEDIA.filter(m => 
    (mediaType === 'all' || m.type === mediaType) && 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-[#1A1214] border-[#2D1F23] text-[#F5E6EA] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-4 py-4 border-b border-[#2D1F23]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B7078]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media..."
              className="pl-9 bg-[#0F0A0B] border-[#2D1F23] text-[#F5E6EA]"
            />
          </div>
          <Button className="bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA]">
            Upload New
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((media) => (
              <div 
                key={media.id} 
                className="group relative aspect-square bg-[#0F0A0B] rounded-lg border border-[#2D1F23] overflow-hidden cursor-pointer hover:border-[#7C2D3E] transition-colors"
                onClick={() => handleSelect(media.url)}
              >
                <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" className="bg-[#7C2D3E] text-white hover:bg-[#9B3A4D] border-none">
                    Select
                  </Button>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-1">
                    {media.type === 'video' ? <Film className="h-3 w-3 text-white" /> : <ImageIcon className="h-3 w-3 text-white" />}
                    <span className="text-xs text-white truncate">{media.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-[#8B7078]">
              <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
              <p>No media found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
