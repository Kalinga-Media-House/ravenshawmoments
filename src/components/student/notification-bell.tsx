'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { NotificationItem } from './notification-item';
import { useNotifications } from '@/hooks/student/use-notifications';

export interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Simulated hook call, will be implemented with real hook
  const { notifications, unreadCount, markRead, markAllRead, isLoading } = useNotifications(userId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C2D3E]"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#7C2D3E] text-white text-[10px] font-bold rounded-full px-1 border-2 border-[#0F0A0B]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#1A1214] border border-[#2D1F23] rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-[#2D1F23] flex items-center justify-between bg-[#1A1214] sticky top-0 z-10">
            <h3 className="font-semibold text-[#F5E6EA]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs text-[#9B3A4D] hover:text-[#F5E6EA] font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center text-[#8B7078]">
                <div className="animate-spin w-6 h-6 border-2 border-[#9B3A4D] border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-[#8B7078]">
                <Bell size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-[#2D1F23]">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    // @ts-ignore
                    notification={notification}
                    onClick={() => {
                      if (!notification.read) {
                        markRead(notification.id);
                      }
                      // Handle navigation if needed
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#2D1F23] text-center bg-[#1A1214]/95 backdrop-blur">
              <button className="text-sm text-[#8B7078] hover:text-[#F5E6EA] font-medium transition-colors">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
