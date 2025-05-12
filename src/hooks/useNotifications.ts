import { useEffect, useRef, useState, useCallback } from "react";
import { notificationApi } from "@/api/notification/notification.api";
import io from "socket.io-client";
import { Notification } from "@/types/notification";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  // Lấy danh sách thông báo
  const fetchNotifications = useCallback(async () => {
    const res = await notificationApi.getNotifications();
    setNotifications(res.data);
    setUnreadCount(res.data.filter((n) => n.status === "unread").length);
  }, []);

  // Kết nối websocket
  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      query: { userId },
    });
    socketRef.current.on("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, fetchNotifications]);

  // Đánh dấu tất cả là đã đọc
  const markAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    fetchNotifications();
  };

  // Đánh dấu 1 thông báo là đã đọc
  const markAsRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    fetchNotifications();
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    fetchNotifications,
  };
}
