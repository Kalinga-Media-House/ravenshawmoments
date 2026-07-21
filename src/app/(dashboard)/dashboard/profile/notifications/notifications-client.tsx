"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
} from "@/actions/student/notification.actions";
import {
  Bell,
  BellOff,
  CheckCheck,
  Loader2,
  ShieldCheck,
  Trophy,
  Image as ImageIcon,
  GraduationCap,
  MessageSquare,
  Info,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  link?: string;
}

const typeIcons: Record<string, typeof Bell> = {
  verification: ShieldCheck,
  achievement: Trophy,
  gallery: ImageIcon,
  education: GraduationCap,
  message: MessageSquare,
  system: Info,
};

const typeColors: Record<string, string> = {
  verification: "text-emerald-500 bg-emerald-500/10",
  achievement: "text-amber-500 bg-amber-500/10",
  gallery: "text-purple-500 bg-purple-500/10",
  education: "text-blue-500 bg-blue-500/10",
  message: "text-sky-500 bg-sky-500/10",
  system: "text-muted-foreground bg-muted/20",
};

interface Props {
  userId: string;
}

export function NotificationsPageClient({ userId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    const result = await getNotifications();
    if (result.success) {
      // @ts-ignore
      setNotifications(result.data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      const result = await markNotificationRead(id);
      if (result.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    });
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      const result = await markAllRead();
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success("All notifications marked as read");
      }
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted/20" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <div className="flex rounded-lg border border-input overflow-hidden">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === "unread"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCheck size={14} />
              )}
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card">
          <BellOff size={32} className="text-muted-foreground" />
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {filter === "unread"
              ? "You're all caught up! Switch to 'All' to see your notification history."
              : "Notifications about verifications, achievements, and updates will appear here."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {filtered.map((notification) => {
            const type = notification.type || "system";
            const IconComp = typeIcons[type] || Bell;
            const colorClass = typeColors[type] || typeColors.system;

            return (
              <div
                key={notification.id}
                onClick={() => !notification.read && handleMarkRead(notification.id)}
                className={`flex items-start gap-4 p-4 transition-colors cursor-pointer hover:bg-accent/5 ${
                  !notification.read ? "bg-primary/[0.02]" : ""
                }`}
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                >
                  <IconComp size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm ${
                        !notification.read
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground/80"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">
                  {formatTime(notification.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
