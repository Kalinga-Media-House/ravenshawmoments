import React from 'react';
import { Bell, ShieldCheck, Award, MessageSquare, Info } from 'lucide-react';

export type NotificationType = 'system' | 'verification' | 'achievement' | 'message';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
}

export interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const TYPE_CONFIG = {
  system: { icon: Info, color: 'text-gray-400', bg: 'bg-[#2D1F23]' },
  verification: { icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  achievement: { icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  message: { icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10' },
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 hover:bg-[#2D1F23]/50 transition-colors flex items-start gap-4 ${
        !notification.read ? 'bg-[#7C2D3E]/5' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${config.bg}`}>
        <Icon size={18} className={config.color} />
      </div>
      
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className={`text-sm font-medium truncate ${!notification.read ? 'text-[#F5E6EA]' : 'text-[#F5E6EA]/80'}`}>
            {notification.title}
          </h4>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-[#9B3A4D] flex-shrink-0 mt-1.5" />
          )}
        </div>
        
        <p className={`text-xs line-clamp-2 mb-1.5 ${!notification.read ? 'text-[#8B7078]' : 'text-[#8B7078]/80'}`}>
          {notification.message}
        </p>
        
        <span className="text-[10px] text-[#8B7078]/60 font-medium">
          {notification.timestamp}
        </span>
      </div>
    </button>
  );
}
