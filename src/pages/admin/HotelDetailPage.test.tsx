import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import HotelDetailPage from "./HotelDetailPage";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useParams, useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>(
    "react-router"
  );
  return {
    ...actual,
    useParams: () => ({ id: "hotel123" }),
    useNavigate: () => mockNavigate,
  };
});

// Mock các API
vi.mock("@/api/hotel/hotel.api", () => ({
  hotelApi: {
    getHotel: vi.fn(),
  },
}));
vi.mock("@/api/user/user.api", () => ({
  userApi: {
    getUser: vi.fn(),
  },
}));
vi.mock("@/api/review/review.api", () => ({
  reviewApi: {
    getHotelReviews: vi.fn(),
  },
}));
vi.mock("@/api/amenities/amenities.api", () => ({
  amenitiesApi: {
    getAmenities: vi.fn(),
  },
}));
vi.mock("@/api/booking/booking.api", () => ({
  bookingApi: {
    getHotelBookings: vi.fn(),
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

describe("HotelDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hiển thị skeleton khi đang loading", async () => {
    const { hotelApi } = await import("@/api/hotel/hotel.api");
    (hotelApi.getHotel as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {})
    );
    renderWithProviders(<HotelDetailPage />);
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length
    ).toBeGreaterThan(0);
  });

  it("hiển thị không tìm thấy khi không có dữ liệu khách sạn", async () => {
    const { hotelApi } = await import("@/api/hotel/hotel.api");
    (hotelApi.getHotel as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: null,
    });
    renderWithProviders(<HotelDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("admin.hotels.notFound")).toBeInTheDocument();
    });
  });

  it("hiển thị chi tiết khách sạn", async () => {
    const { hotelApi } = await import("@/api/hotel/hotel.api");
    const { userApi } = await import("@/api/user/user.api");
    const { reviewApi } = await import("@/api/review/review.api");
    const { amenitiesApi } = await import("@/api/amenities/amenities.api");
    const { bookingApi } = await import("@/api/booking/booking.api");
    (hotelApi.getHotel as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        _id: "hotel123",
        name: "Hotel Test",
        address: "Hà Nội",
        status: "active",
        rating: 4.5,
        featuredImage: { url: "img.jpg" },
        lowestPrice: 1000000,
        favoriteCount: 10,
        description: "Khách sạn đẹp",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        amenities: ["a1"],
        policies: {
          checkInTime: "14:00",
          checkOutTime: "12:00",
          cancellationPolicy: "flexible",
          childrenPolicy: "yes",
          petPolicy: "no",
          smokingPolicy: "yes",
        },
        ownerId: "user1",
      },
    });
    (userApi.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        _id: "user1",
        name: "Đối tác A",
        email: "a@email.com",
        phone: "0123",
        createdAt: new Date().toISOString(),
        role: "partner",
        partnerInfo: {},
      },
    });
    (reviewApi.getHotelReviews as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [],
    });
    (amenitiesApi.getAmenities as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [{ _id: "a1", name: "Wifi", icon: "wifi" }],
    });
    (bookingApi.getHotelBookings as ReturnType<typeof vi.fn>).mockResolvedValue(
      { data: [] }
    );
    renderWithProviders(<HotelDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Hotel Test")).toBeInTheDocument();
      expect(screen.getByText("Hà Nội")).toBeInTheDocument();
      expect(screen.getByText("Wifi")).toBeInTheDocument();
      expect(screen.getByText("Đối tác A")).toBeInTheDocument();
    });
  });

  it("click nút quay lại gọi navigate", async () => {
    const { hotelApi } = await import("@/api/hotel/hotel.api");
    (hotelApi.getHotel as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        _id: "hotel123",
        name: "Hotel Test",
        address: "Hà Nội",
        status: "active",
        rating: 4.5,
        featuredImage: { url: "img.jpg" },
        lowestPrice: 1000000,
        favoriteCount: 10,
        description: "Khách sạn đẹp",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        amenities: ["a1"],
        policies: {
          checkInTime: "14:00",
          checkOutTime: "12:00",
          cancellationPolicy: "flexible",
          childrenPolicy: "yes",
          petPolicy: "no",
          smokingPolicy: "yes",
        },
        ownerId: "user1",
      },
    });
    renderWithProviders(<HotelDetailPage />);
    await waitFor(() => {
      expect(screen.getByText("Hotel Test")).toBeInTheDocument();
    });
    const backBtn = screen.getByText("common.back");
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/hotels");
  });
});
