import { create } from "zustand";
import { SYSTEM_PROMPT } from "../utils/constants";

export type Message = {
  id: string;
  text: string;
  from: "user" | "bot";
  streaming?: boolean;
  renderKey?: number;
};

export type ChatTurn = {
  role: "system" | "user" | "assistant";
  content: string;
};

interface ChatState {
  messages: Message[];
  chatHistory: ChatTurn[];
  suggestionsUsed: boolean;

  addMessage: (msg: Message) => void;
  updateMessage: (id: string, newMsg: Partial<Message>) => void;

  addTurn: (turn: ChatTurn) => void;

  setSuggestionsUsed: (value: boolean) => void;

  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],

  chatHistory: [
    { role: "system", content: SYSTEM_PROMPT }
  ],

  suggestionsUsed: false,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateMessage: (id, newMsg) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...newMsg } : m
      ),
    })),

  addTurn: (turn) =>
    set((state) => ({ chatHistory: [...state.chatHistory, turn] })),
  resetSuggestions: () => set({ suggestionsUsed: false }),

  setSuggestionsUsed: (value) => set({ suggestionsUsed: value }),

  resetChat: () =>
    set({
      messages: [],
      chatHistory: [{ role: "system", content: SYSTEM_PROMPT }],
      suggestionsUsed: false,
    }),
}));
