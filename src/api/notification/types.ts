import { Notification } from "@/types/notification";

export interface GetNotificationsResponse {
  success: boolean;
  data: Notification[];
}

export interface MarkAsReadResponse {
  success: boolean;
  data: Notification;
}

export interface MarkAllAsReadResponse {
  success: boolean;
  message: string;
}

export interface SendAdminNotificationRequest {
  userIds: string[];
  title: string;
  message: string;
}

export interface SendAdminNotificationResponse {
  success: boolean;
  data: Notification[];
}
