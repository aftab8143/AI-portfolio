// store/useEvaStore.js
// EVA's conversation, kept outside the chat window so closing it (or moving
// between pages) doesn't wipe the chat. Saved to sessionStorage: it survives
// reloads but clears when the visitor closes the tab. Nothing goes to a server.
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_STORED = 40; // keep the stored chat small

export const useEvaStore = create(
  persist(
    (set) => ({
      open: false,
      messages: [], // { role: "user" | "assistant", text }

      setOpen: (open) => set({ open }),
      toggle: () => set((s) => ({ open: !s.open })),

      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg].slice(-MAX_STORED) })),

      // Replace the text of the last assistant message (used while streaming)
      updateLastAssistant: (text) =>
        set((s) => {
          const msgs = [...s.messages];
          const last = msgs[msgs.length - 1];
          if (last?.role === "assistant") msgs[msgs.length - 1] = { ...last, text };
          else msgs.push({ role: "assistant", text });
          return { messages: msgs.slice(-MAX_STORED) };
        }),

      reset: () => set({ messages: [] }),
    }),
    {
      name: "eva-chat",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ messages: s.messages }), // the panel starts closed on reload
    }
  )
);
