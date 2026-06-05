"use client";

import { useState, useRef, useEffect } from "react";
import { Conversation } from "@/lib/types";
import { useSendMessage } from "@/hooks/useSendMessage";

export function ChatWindow({ conversation }: { conversation: Conversation }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { sendMessage, status } = useSendMessage(conversation.id);
  const isGenerating = status === "loading" || status === "streaming";

    // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    const msg = input;
    setInput("");
    await sendMessage(msg);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map(msg => (
          <div key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-2xl rounded-2xl px-4 py-3 text-sm
              ${msg.role === "user"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-100"
              }`}
            >
              {msg.content || (isGenerating ? "▌" : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
