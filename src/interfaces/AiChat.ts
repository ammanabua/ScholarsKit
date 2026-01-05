export interface AiChatProps {
  hasDocument?: boolean;
  userId?: string;
  fileId?: string;
}

type MessageType = "system" | "user" | "assistant";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  status?: "sending" | "thinking" | "done" | "error";
  sources?: { chunkIndex: number; score?: number }[];
}

export interface ConversationHistoryItem {
  role: string;
  content: string;
  ts?: string | number;
  sources?: { chunkIndex: number; score?: number }[];
}

export interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

