"use client";

import { useParams } from "next/navigation";
import { ChatWindow } from "@/components/ChatWindow";
import { useChatStore } from "@/store/chatStore";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const conversation = useChatStore(s =>
    s.conversations.find(c => c.id === id)
  );

    if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Conversación no encontrada
      </div>
    );
  }

  return <ChatWindow conversation={conversation} />;
}
