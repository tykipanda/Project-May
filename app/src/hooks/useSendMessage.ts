"use client";
import { useChatStore } from "@/store/chatStore";

export function useSendMessage(convId: string) {
  const { addMessage, appendToLastMessage, setStatus, setError } =
    useChatStore();
      const conversation = useChatStore(s =>
    s.conversations.find(c => c.id === convId)
  );
