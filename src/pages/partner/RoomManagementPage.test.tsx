import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import RoomManagementPage from "./RoomManagementPage";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock redux
vi.mock("@/store/hooks", () => ({
  useAppSelector: vi.fn(),
}));

// Mock roomApi
vi.mock("@/api/room/room.api", () => ({
  roomApi: {
    getRooms: vi.fn(),
    createRoom: vi.fn(),
  },
}));

// Mock toast
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// Mock AddRoomDialog
vi.mock("@/components/partner/room-management/dialog/AddRoomDialog", () => ({
  AddRoomDialog: () => <button>MockAddRoomDialog</button>,
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  );
}

describe("RoomManagementPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hiển thị skeleton khi đang loading", async () => {
    const { useAppSelector } = await import("@/store/hooks");
    (useAppSelector as ReturnType<typeof vi.fn>).mockReturnValue({
      currentHotel: { _id: "hotel1" },
    });
    const { roomApi } = await import("@/api/room/room.api");
    (roomApi.getRooms as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {})
    );
    renderWithProviders(<RoomManagementPage />);
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length
    ).toBeGreaterThan(0);
  });

  it("hiển thị lỗi khi API trả về lỗi", async () => {
    const { useAppSelector } = await import("@/store/hooks");
    (useAppSelector as ReturnType<typeof vi.fn>).mockReturnValue({
      currentHotel: { _id: "hotel1" },
    });
    const { roomApi } = await import("@/api/room/room.api");
    (roomApi.getRooms as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("API error")
    );
    renderWithProviders(<RoomManagementPage />);
    await waitFor(() => {
      expect(
        screen.getByText((t) => t.includes("error.title"))
      ).toBeInTheDocument();
      expect(
        screen.getByText((t) => t.includes("error.loadRoomsFailed"))
      ).toBeInTheDocument();
    });
  });

  it("hiển thị thông báo chưa chọn khách sạn", async () => {
    const { useAppSelector } = await import("@/store/hooks");
    (useAppSelector as ReturnType<typeof vi.fn>).mockReturnValue({
      currentHotel: null,
    });
    renderWithProviders(<RoomManagementPage />);
    await waitFor(() => {
      expect(screen.getByText("info.noHotelSelected")).toBeInTheDocument();
    });
  });

  it("hiển thị thông báo không có phòng nào", async () => {
    const { useAppSelector } = await import("@/store/hooks");
    (useAppSelector as ReturnType<typeof vi.fn>).mockReturnValue({
      currentHotel: { _id: "hotel1" },
    });
    const { roomApi } = await import("@/api/room/room.api");
    (roomApi.getRooms as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [],
    });
    renderWithProviders(<RoomManagementPage />);
    await waitFor(() => {
      expect(screen.getByText("info.noRoomsFound")).toBeInTheDocument();
    });
  });

  it("hiển thị thông báo không có phòng nào sau khi lọc", async () => {
    const { useAppSelector } = await import("@/store/hooks");
    (useAppSelector as ReturnType<typeof vi.fn>).mockReturnValue({
      currentHotel: { _id: "hotel1" },
    });
    const { roomApi } = await import("@/api/room/room.api");
    (roomApi.getRooms as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        {
          _id: "r1",
          roomName: "Phòng 1",
          roomType: "Standard",
          floor: 1,
          price: 100000,
          discountPercent: 0,
          images: [],
        },
      ],
    });
    renderWithProviders(<RoomManagementPage />);
    await waitFor(() => {
      expect(
        screen.getByText((t) => t.includes("info.noRoomsMatchFilter"))
      ).toBeInTheDocument();
    });
  });

  it("hiển thị danh sách phòng", async () => {
    const { useAppSelector } = await import("@/store/hooks");
    (useAppSelector as ReturnType<typeof vi.fn>).mockReturnValue({
      currentHotel: { _id: "hotel1" },
    });
    const { roomApi } = await import("@/api/room/room.api");
    (roomApi.getRooms as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        {
          _id: "r1",
          roomName: "Phòng 1",
          roomType: "Standard",
          floor: 1,
          price: 100000,
          discountPercent: 0,
          images: [],
        },
        {
          _id: "r2",
          roomName: "Phòng 2",
          roomType: "Deluxe",
          floor: 2,
          price: 200000,
          discountPercent: 10,
          images: [{ url: "img.jpg" }],
        },
      ],
    });
    renderWithProviders(<RoomManagementPage />);
    await waitFor(() => {
      expect(screen.getByText("Phòng 1")).toBeInTheDocument();
      expect(screen.getByText("Phòng 2")).toBeInTheDocument();
    });
  });
});
