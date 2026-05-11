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



