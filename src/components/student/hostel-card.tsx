import React from 'react';
import { Home, Calendar } from 'lucide-react';

export interface HostelCardProps {
  hostelName: string;
  roomNumber?: string;
  session: string;
  status: 'current' | 'past';
}

export function HostelCard({
  hostelName,
  roomNumber,
  session,
  status,
}: HostelCardProps) {
  return (
    <div className={`bg-[#1A1214] border rounded-xl p-5 flex items-start gap-4 transition-colors ${
      status === 'current' ? 'border-[#7C2D3E] shadow-[0_0_15px_rgba(124,45,62,0.1)]' : 'border-[#2D1F23]'
    }`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
        status === 'current' ? 'bg-[#7C2D3E]/20 text-[#9B3A4D]' : 'bg-[#2D1F23] text-[#8B7078]'
      }`}>
        <Home size={24} />
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-[#F5E6EA]">{hostelName}</h3>
          {status === 'current' && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              Current
            </span>
          )}
        </div>
        
        {roomNumber && (
          <p className="text-sm font-medium text-[#F5E6EA] mb-2">Room: {roomNumber}</p>
        )}
        
        <div className="flex items-center gap-1.5 text-sm text-[#8B7078]">
          <Calendar size={14} />
          <span>Session: {session}</span>
        </div>
      </div>
    </div>
  );
}
