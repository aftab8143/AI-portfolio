// components/Archery/Arrow.jsx
"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/app/store/useGameStore";

export default function Arrow({ id, position, direction, speed = 60 }) {
  const ref = useRef();
  const velocity = useRef(
    new THREE.Vector3().copy(direction).normalize().multiplyScalar(speed)
  );
  const pos = useRef(new THREE.Vector3().copy(position));
  const gravity = new THREE.Vector3(0, -9.8, 0);

  const markHit = useGameStore((s) => s.markHit);
  const [hasHit, setHasHit] = useState(false);

  useFrame((_, delta) => {
    if (hasHit) return;

    // Apply gravity for realistic arc
    velocity.current.addScaledVector(gravity, delta);

    // Update position
    pos.current.addScaledVector(velocity.current, delta);
    ref.current.position.copy(pos.current);

    // Rotate in flight direction
    ref.current.lookAt(pos.current.clone().add(velocity.current));

    // Detect target hit
    const dz = Math.abs(pos.current.z + 10);
    const dy = Math.abs(pos.current.y - 1.5);
    if (dz < 0.5 && dy < 1.0) {
      setHasHit(true);
      markHit(id);
      velocity.current.set(0, 0, 0); // stop
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Arrow shaft */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      {/* Arrow fletching */}
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.15, 0.3, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}
