import { useState } from "react";
import { BsChatDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "react-i18next";

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Box */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] h-[500px] bg-card rounded-lg shadow-lg border border-border overflow-hidden transition-all duration-200 ease-in-out">
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
          <div className="p-4 h-[380px] overflow-y-auto bg-background">
            <div className="flex flex-col gap-4">
              <div className="text-center text-muted-foreground text-sm bg-secondary/20 py-2 rounded-lg">
                {t("footer.support.welcome")}
              </div>

              {/* Tin nhắn mẫu */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="min-w-8 min-h-8 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm shrink-0">
                    CS
                  </div>
                  <div className="bg-secondary p-3 rounded-lg rounded-tl-none">
                    <p className="text-sm text-foreground">
                      {t("footer.support.agent_greeting")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-border bg-card p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("footer.support.input_placeholder")}
                className="flex-1 bg-background border border-input rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-accent transition-colors text-sm font-medium">
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
