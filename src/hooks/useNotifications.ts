import { useEffect, useRef, useState, useCallback } from "react";
import { notificationApi } from "@/api/notification/notification.api";
import io from "socket.io-client";
import { Notification } from "@/types/notification";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

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

    try {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        query: { userId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");
      });

      socketRef.current.on("connect_error", (error: Error) => {
        console.error("Socket connection error:", error);
      });

      socketRef.current.on("notification", (data: Notification) => {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    } catch (error) {
      console.error("Socket initialization error:", error);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
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
