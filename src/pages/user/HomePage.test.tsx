import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";
import { vi, describe, it, beforeEach, expect } from "vitest";
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

// Mock các component con để đơn giản hóa test
vi.mock("@/components/common/SearchBox", () => ({
  __esModule: true,
  default: ({
    onSearch,
  }: {
    onSearch: (params: {
      locationName: string;
      checkIn: string;
      checkOut: string;
      capacity: number;
    }) => void;
  }) => (
    <button
      onClick={() =>
        onSearch({
          locationName: "Hà Nội",
          checkIn: "2024-06-01",
          checkOut: "2024-06-02",
          capacity: 2,
        })
      }
    >
      MockSearchBox
    </button>
  ),
}));
vi.mock("@/components/common/HeroBanner", () => ({
  __esModule: true,
  default: (props: {
    title: string;
    description: string;
    imageUrl: string;
  }) => <div>MockHeroBanner {props.title}</div>,
}));
vi.mock("@/components/user/home/PopularDestinations", () => ({
  __esModule: true,
  default: () => <div>MockPopularDestinations</div>,
}));
vi.mock("@/components/user/home/HotelDeals", () => ({
  __esModule: true,
  default: () => <div>MockHotelDeals</div>,
}));
vi.mock("@/components/user/home/FavouriteHotels", () => ({
  __esModule: true,
  default: () => <div>MockFavouriteHotels</div>,
}));
vi.mock("@/components/user/home/TravelInspiration", () => ({
  __esModule: true,
  default: () => <div>MockTravelInspiration</div>,
}));

describe("HomePage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("display main sections", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(
      screen.getByText("MockHeroBanner banner.home.title")
    ).toBeInTheDocument();
    expect(screen.getByText("MockSearchBox")).toBeInTheDocument();
    expect(screen.getByText("MockPopularDestinations")).toBeInTheDocument();
    expect(screen.getByText("MockHotelDeals")).toBeInTheDocument();
    expect(screen.getByText("MockFavouriteHotels")).toBeInTheDocument();
    expect(screen.getByText("MockTravelInspiration")).toBeInTheDocument();
  });

  it("call navigate with correct params when search", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    screen.getByText("MockSearchBox").click();
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    const calledUrl = mockNavigate.mock.calls[0][0];
    const url = new URL(calledUrl, "http://localhost");
    const params = url.searchParams;
    expect(params.get("locationName")).toBe("Hà Nội");
    expect(params.get("checkIn")).toBe("2024-06-01");
    expect(params.get("checkOut")).toBe("2024-06-02");
    expect(params.get("capacity")).toBe("2");
  });
});
