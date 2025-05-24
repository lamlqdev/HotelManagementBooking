import { renderHook, act } from "@testing-library/react";
import { useNotifications } from "./useNotifications";
import { notificationApi } from "@/api/notification/notification.api";
import { vi, describe, beforeEach, it, expect } from "vitest";

// Mock notificationApi
vi.mock("@/api/notification/notification.api", () => ({
  notificationApi: {
    getNotifications: vi.fn(),
    markAllAsRead: vi.fn(),
    markAsRead: vi.fn(),
  },
}));

// Mock socket.io-client
vi.mock("socket.io-client", () => {
  const onMock = vi.fn();
  const disconnectMock = vi.fn();
  const ioMock = vi.fn(() => ({
    on: onMock,
    disconnect: disconnectMock,
  }));
  return {
    default: ioMock,
    __esModule: true,
  };
});

type MockNotification = {
  id: string;
  status: "unread" | "read";
  content: string;
};

const mockNotifications: MockNotification[] = [
  { id: "1", status: "unread", content: "Test 1" },
  { id: "2", status: "read", content: "Test 2" },
];

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (
      notificationApi.getNotifications as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: mockNotifications,
    });
  });

  it("fetches notifications and sets state", async () => {
    const { result } = renderHook(() => useNotifications("user123"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(notificationApi.getNotifications).toHaveBeenCalled();
    expect(result.current.notifications).toEqual(mockNotifications);
    expect(result.current.unreadCount).toBe(1);
  });

  it("markAllAsRead calls API and refetches", async () => {
    (
      notificationApi.markAllAsRead as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({});
    const { result } = renderHook(() => useNotifications("user123"));

    await act(async () => {
      await Promise.resolve();
      await result.current.markAllAsRead();
      await Promise.resolve();
    });

    expect(notificationApi.markAllAsRead).toHaveBeenCalled();
    expect(notificationApi.getNotifications).toHaveBeenCalledTimes(2);
  });

  it("markAsRead calls API and refetches", async () => {
    (
      notificationApi.markAsRead as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({});
    const { result } = renderHook(() => useNotifications("user123"));

    await act(async () => {
      await Promise.resolve();
      await result.current.markAsRead("1");
      await Promise.resolve();
    });

    expect(notificationApi.markAsRead).toHaveBeenCalledWith("1");
    expect(notificationApi.getNotifications).toHaveBeenCalledTimes(2);
  });

  it("should not connect socket or fetch if no userId", () => {
    renderHook(() => useNotifications(undefined));
    expect(notificationApi.getNotifications).not.toHaveBeenCalled();
  });
});
