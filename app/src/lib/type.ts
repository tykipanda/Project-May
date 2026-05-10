// src/lib/types.ts

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;  // timestamp unix
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// Estados posibles del generador de IA
export type AIStatus =
  | "idle"        // Esperando input
  | "loading"     // Enviando request
  | "streaming"   // Recibiendo tokens
  | "done"        // Completado
  | "error";      // Error
