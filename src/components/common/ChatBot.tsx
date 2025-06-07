import { useEffect, useRef, useState } from "react";
import { BsRobot } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { chatBotApi } from "@/api/chat-bot/chat-bot.api";
import { v4 as uuidv4 } from "uuid";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const [messages, setMessages] = useState<
    Array<{ text: string; isBot: boolean }>
  >([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => uuidv4());
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await chatBotApi.sendMessage({
        message: userMessage,
        sessionId,
      });

      if (response.success && response.response.responseText) {
        const botResponse = response.response.responseText;
        setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      }
    } catch (error) {
      console.error("ChatBot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: t("chatbot.error_message"),
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
                {t("chatbot.title", "Trợ lý ảo")}
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
                  {t(
                    "chatbot.welcome",
                    "Xin chào! Tôi có thể giúp gì cho bạn?"
                  )}
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-[70%] break-words text-sm ${
                      msg.isBot
                        ? "bg-secondary text-foreground border border-border"
                        : "bg-primary text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-2 rounded-lg bg-secondary text-foreground border border-border">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
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
                placeholder={t(
                  "chatbot.input_placeholder",
                  "Nhập tin nhắn của bạn..."
                )}
                className="flex-1 bg-background border border-input rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
              />
              <button
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-accent transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={isLoading}
              >
                {t("chatbot.send_button", "Gửi")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-accent text-primary-foreground p-3.5 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label={t("chatbot.open_chat", "Mở trợ lý ảo")}
      >
        <BsRobot size={22} />
      </button>
    </div>
  );
};

export default ChatBot;
