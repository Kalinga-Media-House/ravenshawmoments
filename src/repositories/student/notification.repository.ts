import { BaseRepository } from "../base.repository";
import type { Database } from "../../lib/supabase/database.types";
import { DatabaseError } from "../../lib/errors";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type Notification = NotificationRow;

export class NotificationRepository extends BaseRepository<NotificationRow> {
  protected tableName: keyof Database["public"]["Tables"] = "notifications";

  async findByUserId(userId: string, page: number = 1, limit: number = 20): Promise<{ data: NotificationRow[]; count: number }> {
    const offset = (page - 1) * limit;

    const { data, error, count } = await this.supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("profile_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new DatabaseError(`Failed to fetch notifications: ${error.message}`, error);
    }

    return { data: data || [], count: count || 0 };
  }

  async markAsRead(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      throw new DatabaseError(`Failed to mark notification as read: ${error.message}`, error);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("profile_id", userId)
      .eq("is_read", false);

    if (error) {
      throw new DatabaseError(`Failed to mark all notifications as read: ${error.message}`, error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", userId)
      .eq("is_read", false);

    if (error) {
      throw new DatabaseError(`Failed to get unread notification count: ${error.message}`, error);
    }

    return count || 0;
  }
}
