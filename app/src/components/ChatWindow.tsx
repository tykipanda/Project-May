"use client";

import { useState, useRef, useEffect } from "react";
import { Conversation } from "@/lib/types";
import { useSendMessage } from "@/hooks/useSendMessage";

export function ChatWindow({ conversation }: { conversation: Conversation }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { sendMessage, status } = useSendMessage(conversation.id);
  const isGenerating = status === "loading" || status === "streaming";
