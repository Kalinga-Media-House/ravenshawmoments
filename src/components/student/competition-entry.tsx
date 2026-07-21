import React from 'react';
import { Trophy, Calendar, Users } from 'lucide-react';

export interface CompetitionEntryProps {
  competitionName: string;
  event: string;
  position: 'Winner' | 'Runner-up' | 'Participant' | string;
  year: string;
  participants?: string | number;
}

export function CompetitionEntry({
  competitionName,
  event,
  position,
  year,
  participants,
}: CompetitionEntryProps) {
  const getPositionColor = (pos: string) => {
    const lPos = pos.toLowerCase();
    if (lPos.includes('winner') || lPos.includes('first') || lPos === '1st') {
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
    if (lPos.includes('runner') || lPos.includes('second') || lPos === '2nd') {
      return 'text-gray-300 bg-gray-300/10 border-gray-300/20';
    }
    if (lPos.includes('third') || lPos === '3rd') {
      return 'text-amber-600 bg-amber-600/10 border-amber-600/20';
    }
    return 'text-[#8B7078] bg-[#2D1F23] border-[#2D1F23]';
  };

  const badgeStyles = getPositionColor(position);

  return (
    <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-5 hover:border-[#7C2D3E]/50 transition-colors">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-[#F5E6EA] mb-1">{competitionName}</h3>
          <p className="text-sm font-medium text-[#9B3A4D]">{event}</p>
        </div>
        <div className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 whitespace-nowrap ${badgeStyles}`}>
          <Trophy size={12} />
          {position}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-[#8B7078] pt-3 border-t border-[#2D1F23]">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{year}</span>
        </div>
        
        {participants && (
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span>{participants} {typeof participants === 'number' ? 'participants' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
