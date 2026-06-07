"use client";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/store/chatStore";

export function useSendMessage(convId: string) {
  // Selectores específicos → evita re-render en cada token del streaming
  const { addMessage, appendToLastMessage, setStatus, setError } = useChatStore(
    useShallow(s => ({
      addMessage: s.addMessage,
      appendToLastMessage: s.appendToLastMessage,
      setStatus: s.setStatus,
      setError: s.setError,
    }))
  );

  const status = useChatStore(s => s.status);

  const sendMessage = async (content: string, signal?: AbortSignal) => {
    // Lee el estado fresco en el momento del envío (no el del último render)
    const conv = useChatStore
      .getState()
      .conversations.find(c => c.id === convId);
    if (!conv) return;

    // 1. Estado → loading
    setStatus("loading");

    // 2. Añadir mensaje del usuario al store
    addMessage(convId, { role: "user", content });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          messages: [
            ...conv.messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content },
          ],
        }),
      });

      if (!response.ok) throw new Error("Error en el servidor");
      if (!response.body) throw new Error("Sin respuesta");

      // 3. Añadir placeholder del assistant solo cuando la respuesta es válida
      addMessage(convId, { role: "assistant", content: "" });

      // 4. Estado → streaming
      setStatus("streaming");

      // 5. Leer el stream token a token
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // { stream: true } evita romper caracteres multibyte (ñ, acentos, emojis)
          const text = decoder.decode(value, { stream: true });
          if (text) appendToLastMessage(convId, text);
        }
        // Vaciar cualquier byte residual del decoder
        const tail = decoder.decode();
        if (tail) appendToLastMessage(convId, tail);
      } finally {
        reader.releaseLock();
      }

      // 6. Estado → done
      setStatus("done");
    } catch (err) {
      // Cancelación deliberada → no es un error real
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("done");
        return;
      }
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    }
  };

  return { sendMessage, status };
}