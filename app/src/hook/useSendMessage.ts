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

    // 3. Añadir placeholder del assistant
    addMessage(convId, { role: "assistant", content: "" });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...conversation.messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content },
          ],
        }),
      });

      if (!response.ok) throw new Error("Error en el servidor");
      if (!response.body) throw new Error("Sin respuesta");

      // 4. Estado → streaming
      setStatus("streaming");

      // 5. Leer el stream token a token
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
