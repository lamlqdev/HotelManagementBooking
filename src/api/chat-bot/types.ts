// Định nghĩa các kiểu dữ liệu cơ bản cho parameters
export type ChatBotParameter = string | number | boolean | null | undefined;

export interface ChatBotParameters {
  [key: string]: ChatBotParameter | ChatBotParameter[] | ChatBotParameters;
}

// Định nghĩa kiểu dữ liệu cho payload
export interface ChatBotPayload {
  [key: string]:
    | ChatBotParameter
    | ChatBotParameter[]
    | ChatBotParameters
    | ChatBotPayload;
}

export interface ChatBotMessage {
  message: string;
  sessionId: string;
}

export interface ChatBotEvent {
  eventName: string;
  sessionId: string;
  parameters?: ChatBotParameters;
}

export interface ChatBotResponse {
  success: boolean;
  sessionId: string;
  response: {
    responseText?: string;
    intent?: string;
    parameters?: ChatBotParameters;
    richContent?: ChatBotRichContent[];
  };
}

export interface ChatBotEventResponse {
  success: boolean;
  sessionId: string;
  event: string;
  response: {
    text?: string;
    payload?: ChatBotPayload;
  };
}

export interface ChatBotHealthResponse {
  success: boolean;
  status: "healthy" | "unhealthy";
  error?: string;
}

export interface ChatBotSessionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type ChatBotRichContent = {
  title: string;
  subtitle?: string;
  text?: string[];
  button?: {
    text: string;
    link: string;
  };
};
