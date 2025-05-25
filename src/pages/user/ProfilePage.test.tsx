import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "./ProfilePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { useAppSelector } from "@/store/hooks";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock redux hooks
vi.mock("@/store/hooks", () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: () => vi.fn(),
}));

// Mock userApi
vi.mock("@/api/user/user.api", () => ({
  userApi: {
    uploadAvatar: vi.fn(),
    updateMe: vi.fn(),
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

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppSelector as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        name: "Test User",
        email: "test@example.com",
        phone: "0123456789",
        avatar: {
          url: "/images/default-avatar.png",
          publicId: "",
          filename: "",
        },
      },
    });
  });

  it("display title", () => {
    renderWithProviders(<Profile />);
    expect(screen.getByText("profile.title")).toBeInTheDocument();
  });

  it("display edit button and switch to edit mode when click", () => {
    renderWithProviders(<Profile />);
    const editBtn = screen.getByText("profile.edit");
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);
    expect(screen.getByText("profile.cancel")).toBeInTheDocument();
    expect(screen.getByText("profile.save_changes")).toBeInTheDocument();
  });

  it("display correct personal information", () => {
    renderWithProviders(<Profile />);
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0123456789")).toBeInTheDocument();
  });
});
