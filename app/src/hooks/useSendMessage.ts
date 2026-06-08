"use client";
import { useChatStore } from "@/store/chatStore";

export function useSendMessage(convId: string) {
  const { addMessage, appendToLastMessage, setStatus, setError } =
    useChatStore();
      const conversation = useChatStore(s =>
    s.conversations.find(c => c.id === convId)
  );

    const sendMessage = async (content: string) => {
    if (!conversation) return;

    // 1. Estado → loading
    setStatus("loading");

    // 2. Añadir mensaje del usuario al store
    addMessage(convId, { role: "user", content });
