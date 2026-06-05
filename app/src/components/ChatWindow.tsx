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
