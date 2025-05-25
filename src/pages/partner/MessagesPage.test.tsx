import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MessagesPage from "./MessagesPage";
import { vi, describe, it, beforeEach, expect, beforeAll } from "vitest";
import { MemoryRouter } from "react-router";

interface GlobalTestMocks {
  mockOn: ReturnType<typeof vi.fn>;
  mockEmit: ReturnType<typeof vi.fn>;
  mockDisconnect: ReturnType<typeof vi.fn>;
  mockIo: ReturnType<typeof vi.fn>;
}

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock redux
const mockUser = { id: "u1", name: "Admin" };
vi.mock("@/store/hooks", () => ({
  useAppSelector: vi.fn(() => ({ user: mockUser })),
}));

// Mock chatApi trực tiếp trong callback
vi.mock("@/api/chat/chat.api", () => ({
  chatApi: {
    getConversations: vi.fn(),
    getChatHistory: vi.fn(),
  },
}));

// Mock socket.io-client, gán mock function vào globalThis
vi.mock("socket.io-client", () => {
  const mockOn = vi.fn();
  const mockEmit = vi.fn();
  const mockDisconnect = vi.fn();
  const mockIo = vi.fn(() => ({
    on: mockOn,
    emit: mockEmit,
    disconnect: mockDisconnect,
  }));
  (globalThis as unknown as GlobalTestMocks).mockOn = mockOn;
  (globalThis as unknown as GlobalTestMocks).mockEmit = mockEmit;
  (globalThis as unknown as GlobalTestMocks).mockDisconnect = mockDisconnect;
  (globalThis as unknown as GlobalTestMocks).mockIo = mockIo;
  return {
    __esModule: true,
    default: mockIo,
  };
});

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

function renderWithProviders(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("MessagesPage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { chatApi } = await import("@/api/chat/chat.api");
    (chatApi.getConversations as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        {
          _id: "c1",
          name: "Khách 1",
          unreadCount: 2,
          lastMessage: "Xin chào",
        },
        {
          _id: "c2",
          name: "Khách 2",
          unreadCount: 0,
          lastMessage: "Hỏi giá",
        },
      ],
    });
    (chatApi.getChatHistory as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        {
          _id: "m1",
          senderId: "u1",
          receiverId: "c1",
          message: "Xin chào khách 1",
        },
        {
          _id: "m2",
          senderId: "c1",
          receiverId: "u1",
          message: "Chào admin",
        },
      ],
    });
    (globalThis as unknown as GlobalTestMocks).mockOn.mockImplementation(
      () => {}
    );
  });

  it("hiển thị danh sách cuộc trò chuyện", async () => {
    renderWithProviders(<MessagesPage />);
    await waitFor(() => {
      expect(screen.getByText("Khách 1")).toBeInTheDocument();
      expect(screen.getByText("Khách 2")).toBeInTheDocument();
      expect(screen.getByText("Xin chào")).toBeInTheDocument();
      expect(screen.getByText("Hỏi giá")).toBeInTheDocument();
    });
  });

  it("chọn cuộc trò chuyện và hiển thị tin nhắn", async () => {
    renderWithProviders(<MessagesPage />);
    await waitFor(() => {
      expect(screen.getByText("Khách 1")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Khách 2"));
    // Giả lập API trả về lịch sử chat mới
    const { chatApi } = await import("@/api/chat/chat.api");
    (chatApi.getChatHistory as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: [
        {
          _id: "m3",
          senderId: "u1",
          receiverId: "c2",
          message: "Xin chào khách 2",
        },
      ],
    });
    // Gọi lại useEffect
    await waitFor(() => {
      expect(
        chatApi.getChatHistory as ReturnType<typeof vi.fn>
      ).toHaveBeenCalledWith("c2");
    });
  });

  it("gửi tin nhắn", async () => {
    renderWithProviders(<MessagesPage />);
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Nhập tin nhắn...")
      ).toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập tin nhắn..."), {
      target: { value: "Nội dung test" },
    });
    fireEvent.click(screen.getByText("Gửi"));
    expect(
      (globalThis as unknown as GlobalTestMocks).mockEmit
    ).toHaveBeenCalledWith("sendMessage", {
      receiverId: "c1",
      message: "Nội dung test",
    });
  });

  it("nhận tin nhắn mới qua socket", async () => {
    let newMsgCb: (msg: unknown) => void = () => {};
    (globalThis as unknown as GlobalTestMocks).mockOn.mockImplementation(
      (event: string, cb: (msg: unknown) => void) => {
        if (event === "newMessage") newMsgCb = cb;
      }
    );
    renderWithProviders(<MessagesPage />);
    await waitFor(() => {
      expect(screen.getByText("Khách 1")).toBeInTheDocument();
    });
    // Gửi tin nhắn mới từ socket
    newMsgCb({
      _id: "m4",
      senderId: "c1",
      receiverId: "u1",
      message: "Tin nhắn mới",
    });
    await waitFor(() => {
      expect(screen.getByText("Tin nhắn mới")).toBeInTheDocument();
    });
  });
});
