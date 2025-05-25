import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HotelsManagementPage from "./HotelsManagementPage";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>(
    "react-router"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock hotelApi
vi.mock("@/api/hotel/hotel.api", () => ({
  hotelApi: {
    getHotels: vi.fn(),
  },
}));

// Helper render
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  );
}

describe("HotelsManagementPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hiển thị loading skeleton khi đang tải dữ liệu", async () => {
    const { hotelApi } = await import("@/api/hotel/hotel.api");
    (hotelApi.getHotels as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {})
    );
    renderWithProviders(<HotelsManagementPage />);
    expect(screen.getAllByRole("row").length).toBeGreaterThan(0); // Có skeleton
  });

  it("hiển thị danh sách khách sạn", async () => {
    const { hotelApi } = await import("@/api/hotel/hotel.api");
    (hotelApi.getHotels as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        {
          _id: "1",
          name: "Hotel A",
          address: "Hà Nội",
          status: "active",
          rating: 4.5,
          policies: {
            checkInTime: "14:00",
            checkOutTime: "12:00",
            childrenPolicy: "yes",
            petPolicy: "no",
            smokingPolicy: "yes",
          },
        },
      ],
      pagination: { totalPages: 1 },
    });
    renderWithProviders(<HotelsManagementPage />);
    await waitFor(() => {
      expect(screen.getByText("Hotel A")).toBeInTheDocument();
      expect(screen.getByText("Hà Nội")).toBeInTheDocument();
      expect(screen.getByText("14:00 - 12:00")).toBeInTheDocument();
    });
  });

  it("lọc khách sạn theo trạng thái", async () => {
    const { hotelApi } = await import("@/api/hotel/hotel.api");
    (hotelApi.getHotels as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        {
          _id: "1",
          name: "Hotel A",
          address: "Hà Nội",
          status: "active",
          rating: 4.5,
          policies: {
            checkInTime: "14:00",
            checkOutTime: "12:00",
            childrenPolicy: "yes",
            petPolicy: "no",
            smokingPolicy: "yes",
          },
        },
        {
          _id: "2",
          name: "Hotel B",
          address: "Đà Nẵng",
          status: "inactive",
          rating: 4,
          policies: {
            checkInTime: "13:00",
            checkOutTime: "11:00",
            childrenPolicy: "no",
            petPolicy: "yes",
            smokingPolicy: "no",
          },
        },
      ],
      pagination: { totalPages: 1 },
    });
    renderWithProviders(<HotelsManagementPage />);
    await waitFor(() => {
      expect(screen.getByText("Hotel A")).toBeInTheDocument();
      expect(screen.getByText("Hotel B")).toBeInTheDocument();
    });
    // Chọn filter inactive
    const filterBtn = screen.getByText("admin.hotels.status.all");
    fireEvent.click(filterBtn);
    // Lấy tất cả các phần tử có text "admin.hotels.status.inactive"
    const allInactive = screen.getAllByText("admin.hotels.status.inactive");
    // Chọn option trong dropdown (không phải badge)
    const option = allInactive.find(
      (el) => el.tagName === "SPAN" && el.getAttribute("data-slot") !== "badge"
    );
    if (option) fireEvent.click(option);
  });

  it("chuyển trang chi tiết khi click vào row", async () => {
    const { hotelApi } = await import("@/api/hotel/hotel.api");
    (hotelApi.getHotels as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        {
          _id: "1",
          name: "Hotel A",
          address: "Hà Nội",
          status: "active",
          rating: 4.5,
          policies: {
            checkInTime: "14:00",
            checkOutTime: "12:00",
            childrenPolicy: "yes",
            petPolicy: "no",
            smokingPolicy: "yes",
          },
        },
      ],
      pagination: { totalPages: 1 },
    });
    renderWithProviders(<HotelsManagementPage />);
    await waitFor(() => {
      expect(screen.getByText("Hotel A")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Hotel A"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/hotels/1");
  });
});
