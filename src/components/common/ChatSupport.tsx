import { useEffect, useRef, useState } from "react";
import { BsChatDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { chatApi } from "@/api/chat/chat.api";
import { ChatMessage } from "@/api/chat/types";
import { useAppSelector } from "@/store/hooks";
import io from "socket.io-client";
import { User } from "@/types/auth";

interface ChatSupportProps {
  receiverId: string;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const getSenderId = (msg: ChatMessage) =>
  typeof msg.senderId === "string"
    ? msg.senderId
    : (msg.senderId as User)?._id || (msg.senderId as User)?.id;

const ChatSupport = ({ receiverId }: ChatSupportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Kết nối socket khi mở chat
  useEffect(() => {
    if (!isOpen || !user) return;
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current.emit("join", user.id);
    socketRef.current.on("newMessage", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    // Lắng nghe messageSent cho chính mình
    socketRef.current.on("messageSent", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, [isOpen, user]);

  // Lấy lịch sử chat khi mở chat
  useEffect(() => {
    if (isOpen && user) {
      chatApi.getChatHistory(receiverId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [isOpen, receiverId, user]);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = () => {
    if (!input.trim() || !user) return;
    socketRef.current?.emit("sendMessage", { receiverId, message: input });
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Box */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] h-[500px] bg-card rounded-lg shadow-lg border border-border overflow-hidden transition-all duration-200 ease-in-out flex flex-col">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold">
                {t("footer.support.customer_support")}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:text-secondary transition-colors"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4 h-[380px] overflow-y-auto bg-background flex-1">
            <div className="flex flex-col gap-2">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm bg-secondary/20 py-2 rounded-lg mb-2">
                  {t("footer.support.welcome")}
                </div>
              )}
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
                          {typeof msg.senderId === "object" &&
                          msg.senderId?.name
                            ? msg.senderId.name
                            : "Đối tác"}
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

          {/* Chat Input */}
          <div className="border-t border-border bg-card p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("footer.support.input_placeholder")}
                className="flex-1 bg-background border border-input rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-accent transition-colors text-sm font-medium"
                onClick={handleSend}
              >
                {t("footer.support.send_button")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-accent text-primary-foreground p-3.5 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label={t("footer.support.open_chat")}
      >
        <BsChatDots size={22} />
      </button>
    </div>
  );
};

export default ChatSupport;
