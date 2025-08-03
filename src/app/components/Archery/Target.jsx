// components/Archery/Target.jsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Target() {
  const ref = useRef();

  useFrame(() => {
    const time = Date.now() * 0.001;
    ref.current.position.x = Math.sin(time) * 2.5;
  });

  return (
    <mesh
      ref={ref}
      position={[0, 1.5, -10]}
      rotation={[Math.PI / 2, 0, 0]} // disc faces along ±Z
      castShadow
      receiveShadow
    >
      {/* A slightly thicker disc makes it easier to see */}
      <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />

      <meshStandardMaterial
        color="red"
        side={THREE.DoubleSide} // render both faces
        roughness={0.6} // give it a bit of matte shading
        metalness={0.1}
      />
    </mesh>
  );
}
