"use client";
import { useGameStore } from "@/app/store/useGameStore";

export default function Scoreboard() {
  const score = useGameStore((s) => s.score);

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        color: "white",
        fontSize: "24px",
        fontFamily: "monospace",
      }}
    >
      🎯 Score: {score}
    </div>
  );
}
