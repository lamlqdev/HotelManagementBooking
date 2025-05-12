import { User } from "@/types/auth";

export interface ChatMessage {
  _id: string;
  senderId: string | User;
  receiverId: string | User;
  message: string;
  status: "read" | "unread";
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  receiverId: string;
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  data: ChatMessage;
}

export interface GetChatHistoryResponse {
  success: boolean;
  data: ChatMessage[];
}

export interface ConversationItem {
  _id: string; // id của user đối phương
  name: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export interface GetConversationsResponse {
  success: boolean;
  data: ConversationItem[];
}

export interface MarkAsReadResponse {
  success: boolean;
  data: ChatMessage;
}
