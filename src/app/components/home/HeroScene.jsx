"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GOLD = "#c9a24b";
const GOLD_LIGHT = "#f2da8c";

// Points scattered on a sphere shell
function useShellPoints(count, radius, jitter) {
  return useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * jitter;
      const s = Math.sqrt(1 - u * u);
      arr[i * 3] = r * s * Math.cos(t);
      arr[i * 3 + 1] = r * u;
      arr[i * 3 + 2] = r * s * Math.sin(t);
    }
    return arr;
  }, [count, radius, jitter]);
}

function Orb() {
  const group = useRef();
  const wire = useRef();
  const ring = useRef();
  const dust = useShellPoints(1400, 2.6, 0.5);
  const ringPts = useMemo(() => {
    const n = 600;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = 3.4 + (Math.random() - 0.5) * 0.35;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const { pointer } = state;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.3 + scroll * 0.4, 0.05);
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pointer.x * 0.3, 0.05);
      const s = 1 + scroll * 0.25;
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, s, 0.08));
    }
    if (wire.current) wire.current.rotation.z -= delta * 0.05;
    if (ring.current) ring.current.rotation.y -= delta * 0.2;
  });

  return (
    <group ref={group}>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.25, 3]} />
        <meshBasicMaterial color={GOLD_LIGHT} wireframe transparent opacity={0.12} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial color={GOLD_LIGHT} size={0.018} transparent opacity={0.8} sizeAttenuation depthWrite={false} />
      </points>
      <group rotation={[0.45, 0, 0.2]}>
        <points ref={ring}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ringPts, 3]} />
          </bufferGeometry>
          <pointsMaterial color={GOLD} size={0.025} transparent opacity={0.9} sizeAttenuation depthWrite={false} />
        </points>
      </group>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Orb />
    </Canvas>
  );
}
