"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
  getUnreadCount,
} from "@/actions/student/notification.actions";

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  link?: string;
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const result = await getNotifications();
      if (result.success && result.data) {
        // @ts-ignore
        const items = result.data.data || result.data || [];
        setNotifications(
          items.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type || "system",
            read: n.is_read ?? n.read ?? false,
            created_at: n.created_at || n.createdAt,
            link: n.link,
          }))
        );
      }

      const countResult = await getUnreadCount();
      if (countResult.success) {
        // @ts-ignore
        setUnreadCount(countResult.data || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = useCallback(
    async (notificationId: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      const result = await markNotificationRead(notificationId);
      if (!result.success) {
        fetchNotifications();
      }
    },
    [fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    const result = await markAllRead();
    if (!result.success) {
      fetchNotifications();
    }
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    markRead,
    markAllRead: markAllAsRead,
    isLoading,
    refetch: fetchNotifications,
  };
}
