"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CubeContent() {
  const meshRef = useRef(null);

  useFrame(({ clock }) => {
    meshRef.current.rotation.y += 0.01;
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#60A5FA" metalness={0.5} roughness={0.1} />
    </mesh>
  );
}

export default function CubeSceneMini() {
  return (
    <div className="h-[250px] w-full">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Environment preset="sunset" />
        <CubeContent />
      </Canvas>
    </div>
  );
}
