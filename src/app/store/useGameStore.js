// store/useGameStore.js
import { create } from "zustand";

let id = 0;

export const useGameStore = create((set) => ({
  arrows: [],
  score: 0,

  addArrow: ({ position, direction }) =>
    set((state) => ({
      arrows: [
        ...state.arrows,
        { id: id++, position, direction, launchedAt: Date.now() },
      ],
    })),

  markHit: (arrowId) =>
    set((state) => ({
      score: state.score + 10, // or calculate based on hit position
      arrows: state.arrows.map((arrow) =>
        arrow.id === arrowId ? { ...arrow, hit: true } : arrow
      ),
    })),
}));
