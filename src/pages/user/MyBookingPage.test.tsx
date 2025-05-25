import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MyBookingPage from "./MyBookingPage";
import { bookingApi } from "@/api/booking/booking.api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { MemoryRouter } from "react-router";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock bookingApi
vi.mock("@/api/booking/booking.api", () => ({
  bookingApi: {
    getMyBookings: vi.fn(),
  },
}));

// Helper to render with React Query context and MemoryRouter
function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  );
}

const mockBooking = {
  _id: "123",
  userId: "user1",
  roomId: "room1",
  room: { roomName: "Room 101" },
  bookingFor: "self" as const,
  contactInfo: {
    name: "Test User",
    email: "test@example.com",
    phone: "0123456789",
  },
  checkIn: new Date("2024-06-01T14:00:00Z"),
  checkOut: new Date("2024-06-02T12:00:00Z"),
  originalPrice: 1200000,
  discountAmount: 200000,
  finalPrice: 1000000,
  status: "confirmed" as const,
  paymentMethod: "vnpay" as const,
  paymentStatus: "paid" as const,
  createdAt: new Date("2024-05-01T10:00:00Z"),
  updatedAt: new Date("2024-05-01T10:00:00Z"),
};

describe("MyBookingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading skeletons while fetching data", async () => {
    (bookingApi.getMyBookings as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {})
    );
    renderWithQueryClient(<MyBookingPage />);
    expect(screen.getAllByRole("cell").length).toBeGreaterThan(0);
  });

  it("renders the booking list when data is available", async () => {
    (bookingApi.getMyBookings as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [mockBooking],
    });
    renderWithQueryClient(<MyBookingPage />);
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("123"))
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) =>
          content.includes("booking.myBookingPage.status.confirmed")
        )
      ).toBeInTheDocument();
    });
  });

  it("shows a message when there are no bookings", async () => {
    (bookingApi.getMyBookings as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [],
    });
    renderWithQueryClient(<MyBookingPage />);
    await waitFor(() => {
      // Lấy tất cả các dòng trong tbody
      const rows = screen.getAllByRole("row");
      // 1 dòng header + 1 dòng thông báo
      expect(rows.length).toBe(2);
      // Kiểm tra dòng thông báo có colSpan=7
      const emptyCell = screen.getByRole("cell", {
        name: /booking\.myBookingPage\.noBooking/,
      });
      expect(emptyCell).toHaveAttribute("colspan", "7");
    });
  });
});
