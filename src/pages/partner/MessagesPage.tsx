import { useEffect, useRef, useState } from "react";
import { chatApi } from "@/api/chat/chat.api";
import { ConversationItem, ChatMessage } from "@/api/chat/types";
import { useAppSelector } from "@/store/hooks";
import io from "socket.io-client";
import { User } from "@/types/auth";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const MessagesPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách cuộc trò chuyện
  useEffect(() => {
    if (!user) return;
    chatApi.getConversations().then((res) => {
      setConversations(res.data);
      if (res.data.length > 0) setSelectedUserId(res.data[0]._id);
    });
  }, [user]);

  // Lấy lịch sử chat khi chọn user
  useEffect(() => {
    if (selectedUserId && user) {
      chatApi.getChatHistory(selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId, user]);

  // Kết nối socket
  useEffect(() => {
    if (!user) return;
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current.emit("join", user.id);

    socketRef.current.on("newMessage", (msg: ChatMessage) => {
      // Nếu đang chat với user này thì thêm vào messages
      if (
        msg.senderId === selectedUserId ||
        msg.receiverId === selectedUserId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      // Cập nhật lại danh sách cuộc trò chuyện (có thể làm mới lại)
      chatApi.getConversations().then((res) => setConversations(res.data));
    });

    socketRef.current.on("messageSent", (msg: ChatMessage) => {
      if (
        msg.senderId === selectedUserId ||
        msg.receiverId === selectedUserId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, selectedUserId]);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = () => {
    if (!input.trim() || !user || !selectedUserId) return;
    socketRef.current?.emit("sendMessage", {
      receiverId: selectedUserId,
      message: input,
    });
    setInput("");
  };

  // Hàm lấy id thực tế của sender (string hoặc object)
  const getSenderId = (msg: ChatMessage) =>
    typeof msg.senderId === "string"
      ? msg.senderId
      : (msg.senderId as User)?._id || (msg.senderId as User)?.id;

  return (
    <div className="flex h-[80vh] bg-background rounded-lg shadow border">
      {/* Danh sách cuộc trò chuyện */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Khách hàng</h2>
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv._id}
              className={`p-3 rounded-lg cursor-pointer mb-2 ${
                selectedUserId === conv._id
                  ? "bg-primary text-white"
                  : "hover:bg-secondary"
              }`}
              onClick={() => setSelectedUserId(conv._id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{conv.name}</span>
                {conv.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {conv.lastMessage}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Khung chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {messages.map((msg) => {
              const isMe = getSenderId(msg) === user?.id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-[70%] break-words text-sm ${
                      isMe
                        ? "bg-primary text-white"
                        : "bg-secondary text-foreground border border-border"
                    }`}
                  >
                    {!isMe && (
                      <div className="text-xs text-muted-foreground mb-1">
                        {typeof msg.senderId === "object" && msg.senderId?.name
                          ? msg.senderId.name
                          : "Khách"}
                      </div>
                    )}
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t p-4 bg-card">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-background border border-input rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-accent transition-colors text-sm font-medium"
              onClick={handleSend}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
