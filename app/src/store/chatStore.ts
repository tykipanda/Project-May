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

  // Acciones - conversaciones
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveId: (id: string) => void;

  // Acciones - mensajes
  addMessage: (convId: string, msg: Omit<Message, "id" | "createdAt">) => void;
  appendToLastMessage: (convId: string, text: string) => void;

  // Acciones - estado IA (state machine)
  setStatus: (status: AIStatus) => void;
  setError: (error: string | null) => void;
  resetStatus: () => void;
}

// ── Helper para generar IDs únicos ───────────────────────
const genId = () => Math.random().toString(36).slice(2, 11);

// ── Store con persistencia en localStorage ───────────────
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      conversations: [],
      activeId: null,
      status: "idle",
      error: null,

    //Crear conversación nueva y devolver su id
    createConversation: () => {
        const id = genId();
        const now = Date.now();
        const newConv: Conversation = {
          id,
          title: "Nueva conversación",
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({
          conversations: [newConv, ...state.conversations],
          activeId: id,
        }));
        return id;
      },
      deleteConversation: (id) =>
        set(state => ({
          conversations: state.conversations.filter(c => c.id !== id),
          activeId: state.activeId === id ? null : state.activeId,
        })),

      setActiveId: (id) => set({ activeId: id }),

      // Añadir mensaje a una conversación
      addMessage: (convId, msg) =>
        set(state => ({
          conversations: state.conversations.map(c => {
            if (c.id !== convId) return c;
            const newMsg: Message = {
              ...msg,
              id: genId(),
              createdAt: Date.now(),
            };
            // Auto-título: primera pregunta del usuario
            const title = c.messages.length === 0 && msg.role === "user"
              ? msg.content.slice(0, 40)
              : c.title;
            return {
              ...c,
              title,
              messages: [...c.messages, newMsg],
              updatedAt: Date.now(),
            };
          }),
        })),
