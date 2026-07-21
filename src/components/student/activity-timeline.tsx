import React from 'react';
import { Award, Image as ImageIcon, CheckCircle, GraduationCap, Clock } from 'lucide-react';

export type ActivityType = 'achievement' | 'gallery' | 'verification' | 'education';

export interface ActivityTimelineProps {
  activities: {
    id: string;
    type: ActivityType;
    title: string;
    description?: string;
    timestamp: string;
  }[];
}

const TYPE_ICONS = {
  achievement: { icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
  gallery: { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/20' },
  verification: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/20' },
  education: { icon: GraduationCap, color: 'text-[#9B3A4D]', bg: 'bg-[#7C2D3E]/20' },
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-[#8B7078]">
        <Clock size={32} className="mx-auto mb-3 opacity-50" />
        <p>No recent activity found.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l border-[#2D1F23] ml-4 md:ml-6 space-y-8 py-4">
      {activities.map((activity) => {
        const typeConfig = TYPE_ICONS[activity.type] || { icon: Clock, color: 'text-[#8B7078]', bg: 'bg-[#2D1F23]' };
        const Icon = typeConfig.icon;

        return (
          <div key={activity.id} className="relative pl-8 md:pl-10">
            {/* Timeline Dot/Icon */}
            <div className={`absolute -left-[20px] top-1 w-10 h-10 rounded-full border-4 border-[#0F0A0B] ${typeConfig.bg} flex items-center justify-center`}>
              <Icon size={16} className={typeConfig.color} />
            </div>
            
            {/* Content */}
            <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                <h4 className="text-base font-medium text-[#F5E6EA]">{activity.title}</h4>
                <span className="text-xs text-[#8B7078] whitespace-nowrap">{activity.timestamp}</span>
              </div>
              
              {activity.description && (
                <p className="text-sm text-[#8B7078] mt-1">{activity.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
