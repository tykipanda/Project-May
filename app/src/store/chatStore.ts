import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Conversation, Message, AIStatus } from "@/lib/types";

// ── Tipos del store ──────────────────────────────────────
interface ChatState {
  // Estado
  conversations: Conversation[];
  activeId: string | null;
  status: AIStatus;
  error: string | null;
