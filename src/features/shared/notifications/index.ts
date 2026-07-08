// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/notifications/index.ts
// Purpose   : Shared Platform Layer — Universal Notifications & System Alerts
// =============================================================================

export type SharedNotificationChannel = "in_app" | "email" | "push";
export type SharedNotificationPriority = "normal" | "high" | "urgent";

export interface SharedNotificationPayload {
  id: string;
  recipient_id: string;
  sender_id?: string;
  title: string;
  body: string;
  action_url?: string;
  priority: SharedNotificationPriority;
  channels: SharedNotificationChannel[];
  is_read: boolean;
  created_at: string;
}

/**
 * Creates a standard notification payload object.
 */
export function createNotificationPayload(
  recipientId: string,
  title: string,
  body: string,
  options?: Partial<SharedNotificationPayload>
): SharedNotificationPayload {
  return {
    id: options?.id ?? crypto.randomUUID(),
    recipient_id: recipientId,
    sender_id: options?.sender_id,
    title,
    body,
    action_url: options?.action_url,
    priority: options?.priority ?? "normal",
    channels: options?.channels ?? ["in_app"],
    is_read: options?.is_read ?? false,
    created_at: options?.created_at ?? new Date().toISOString(),
  };
}
