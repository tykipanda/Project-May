"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { PlusIcon, ChatBubbleIcon } from "@radix-ui/react-icons";

export function Sidebar() {
 const { conversations, createConversation } = useChatStore();
 const pathname = usePathname();

 const handleNew = () => {
    const id = createConversation();
    // router.push lo maneja el store
  };

  return (
    <aside className="w-64 flex flex-col bg-gray-900 border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">⚡ Mi IA</h1>
      </div>

    {/* Botón nueva conversación */}
    <div className="p-3">
        <button
          onClick={handleNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                     bg-indigo-600 hover:bg-indigo-500 text-white text-sm
                     transition-colors"
        >
        <PlusIcon /> Nueva conversación
        </button>
      </div>

    {/* Lista de conversaciones */}
    <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conv) => {
          const isActive = pathname === `/chat/${conv.id}`;
          return (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                         transition-colors truncate
                         ${isActive
                           ? "bg-indigo-600 text-white"
                           : "text-gray-400 hover:bg-gray-800 hover:text-white"
                         }`}
            >







