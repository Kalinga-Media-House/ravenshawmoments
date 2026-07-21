'use client';

import { useState } from 'react';
import { Upload, Search, Grid, List, Trash2, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaPage({ params }: { params: { slug: string } }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);

  const mediaFiles = [
    { id: '1', name: 'campus-event.jpg', size: '2.4 MB', type: 'image', date: '2024-06-15' },
    { id: '2', name: 'lecture-series.mp4', size: '45.1 MB', type: 'video', date: '2024-06-12' },
    { id: '3', name: 'department-logo.png', size: '0.8 MB', type: 'image', date: '2024-06-10' },
  ];

  return (
    <div className="p-6 bg-[#0F0A0B] min-h-screen text-[#F5E6EA]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <button 
          onClick={() => setIsUploading(!isUploading)}
          className="bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Upload size={20} />
          <span>Upload</span>
        </button>
      </div>

      {isUploading && (
        <div className="bg-[#1A1214] border-2 border-dashed border-[#2D1F23] rounded-lg p-12 text-center mb-8 flex flex-col items-center justify-center transition-all hover:border-[#7C2D3E]">
          <Upload size={48} className="text-[#8B7078] mb-4" />
          <h3 className="text-lg font-medium text-[#F5E6EA] mb-2">Drag and drop files here</h3>
          <p className="text-[#8B7078] mb-4">or click to browse from your computer</p>
          <button className="bg-[#2D1F23] text-[#F5E6EA] px-6 py-2 rounded-md hover:bg-[#7C2D3E] transition-colors">
            Select Files
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center bg-[#1A1214] border border-[#2D1F23] rounded-md px-3 py-2 flex-1 max-w-md">
          <Search size={18} className="text-[#8B7078] mr-2" />
          <input 
            type="text" 
            placeholder="Search media..."
            className="bg-transparent border-none text-[#F5E6EA] focus:outline-none w-full"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <select className="bg-[#1A1214] border border-[#2D1F23] rounded-md px-4 py-2 text-[#8B7078] focus:outline-none focus:border-[#7C2D3E]">
            <option>All Types</option>
            <option>Images</option>
            <option>Videos</option>
            <option>Documents</option>
          </select>
          
          <div className="flex items-center bg-[#1A1214] border border-[#2D1F23] rounded-md">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#2D1F23] text-[#F5E6EA]' : 'text-[#8B7078] hover:text-[#F5E6EA]'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#2D1F23] text-[#F5E6EA]' : 'text-[#8B7078] hover:text-[#F5E6EA]'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaFiles.map((file) => (
            <div key={file.id} className="bg-[#1A1214] border border-[#2D1F23] rounded-lg overflow-hidden group">
              <div className="h-32 bg-[#2D1F23] flex items-center justify-center relative">
                {file.type === 'image' ? <ImageIcon size={32} className="text-[#8B7078]" /> : 
                 file.type === 'video' ? <Video size={32} className="text-[#8B7078]" /> : 
                 <FileText size={32} className="text-[#8B7078]" />}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <button className="p-2 bg-[#7C2D3E] text-white rounded hover:bg-[#9B3A4D]"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-[#F5E6EA] truncate" title={file.name}>{file.name}</p>
                <div className="flex justify-between items-center mt-1 text-xs text-[#8B7078]">
                  <span>{file.size}</span>
                  <span>{file.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#2D1F23] text-[#8B7078] text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D1F23]">
              {mediaFiles.map((file) => (
                <tr key={file.id} className="hover:bg-[#2D1F23]/50 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-3">
                    {file.type === 'image' ? <ImageIcon size={18} className="text-[#8B7078]" /> : 
                     file.type === 'video' ? <Video size={18} className="text-[#8B7078]" /> : 
                     <FileText size={18} className="text-[#8B7078]" />}
                    <span className="text-[#F5E6EA]">{file.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8B7078]">{file.size}</td>
                  <td className="px-4 py-3 text-sm text-[#8B7078] capitalize">{file.type}</td>
                  <td className="px-4 py-3 text-sm text-[#8B7078]">{file.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[#8B7078] hover:text-[#7C2D3E] transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
