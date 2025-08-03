// components/DebugTargetView.jsx
"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { GridHelper, AxesHelper } from "three";
import { useGameStore } from "@/app/store/useGameStore";
import Target from "../components/Archery/Target";
import Arrow from "../components/Archery/Arrow";
import Scoreboard from "../components/Archery/Scoreboard";
import * as THREE from "three";

export default function DebugTargetView() {
  const addArrow = useGameStore((s) => s.addArrow);
  const arrows = useGameStore((s) => s.arrows);

  const handleShoot = () => {
    const direction = new THREE.Vector3(0, 0, -1);
    const position = new THREE.Vector3(0, 1.5, 0);
    addArrow({ direction, position });
  };

  return (
    <>
      <Canvas
        shadows
        style={{ width: "100vw", height: "100vh", display: "block" }}
        onCreated={({ camera, scene }) => {
          // Position camera at eye‑level, back 8 units
          camera.position.set(0, 1.5, 8);
          camera.lookAt(0, 1.5, -10);

          // Add ground grid and world axes
          scene.add(new GridHelper(20, 20));
          //   scene.add(new AxesHelper(5));
        }}
        camera={{ fov: 50 }}
      >
        {/* Lights for visibility */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />

        {/* Moving target and arrows */}
        <Target />
        {arrows.map((arrow) => (
          <Arrow key={arrow.id} {...arrow} />
        ))}
      </Canvas>

      {/* Scoreboard and Shoot Button Overlay */}
      <Scoreboard />
      <button
        onClick={handleShoot}
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 24px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        🏹 Shoot
      </button>
    </>
  );
}
