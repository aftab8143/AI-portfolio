"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const GOLD = "#c9a24b";
const GOLD_LIGHT = "#f2da8c";
const GLOW = "#ffd77a";
const HEAD = "#fff1c9";

const TUBULAR = 480;
const RADIAL = 10;

// A winding path through space; the camera flies along it as you scroll
const PATH = [
  [-10, -5, 8],
  [-5, -2, 3],
  [0, 0, -2],
  [5, 3, -7],
  [4, 7, -13],
  [-2, 7, -18],
  [-6, 4, -24],
  [-3, 0, -30],
  [3, -2, -35],
  [8, 1, -41],
  [10, 5, -47],
];

// Scroll progress (0 → 1) maps onto this stretch of the path
const START_T = 0.04;
const END_T = 0.92;

// Process.jsx gives each of the five steps an equal fifth of the scroll; a
// node sits just after the start of its step so it lights up as the card appears
const NODE_T = [0, 1, 2, 3, 4].map((i) => START_T + (END_T - START_T) * (i * 0.2 + 0.06));

function Pipeline({ progressRef }) {
  const { camera } = useThree();
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(PATH.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.5),
    []
  );

  const baseGeo = useMemo(() => new THREE.TubeGeometry(curve, TUBULAR, 0.07, RADIAL, false), [curve]);
  const glowGeo = useMemo(() => new THREE.TubeGeometry(curve, TUBULAR, 0.08, RADIAL, false), [curve]);

  // Node + ring placement, rings face along the path so it threads through them
  const nodes = useMemo(
    () =>
      NODE_T.map((t, i) => {
        const pos = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
        return { t, pos, quat, ring: i % 2 === 0 };
      }),
    [curve]
  );

  const head = useRef();
  const headLight = useRef();
  const nodeRefs = useRef([]);
  const ringRefs = useRef([]);
  const t = useRef(START_T);
  const camPos = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const offset = useMemo(() => new THREE.Vector3(4, 3, 10), []);

  useFrame((state, delta) => {
    const target = START_T + (END_T - START_T) * (progressRef.current ?? 0);
    // Ease towards the scroll position so motion feels weighted
    t.current = THREE.MathUtils.damp(t.current, target, 4, delta);
    const headT = t.current;

    // Bright segment grows along the tube up to the head
    const segs = Math.floor(headT * TUBULAR);
    glowGeo.setDrawRange(0, segs * RADIAL * 6);

    const headPos = curve.getPointAt(headT);
    if (head.current) {
      head.current.position.copy(headPos);
      head.current.rotation.x += delta * 1.2;
      head.current.rotation.y += delta * 0.8;
    }
    if (headLight.current) headLight.current.position.copy(headPos);

    // Camera trails the head from the side and looks slightly ahead
    tmp.copy(headPos).add(offset);
    if (camPos.current.lengthSq() === 0) camPos.current.copy(tmp);
    camPos.current.lerp(tmp, 1 - Math.exp(-3 * delta));
    camera.position.copy(camPos.current);
    const ahead = curve.getPointAt(Math.min(headT + 0.04, 1));
    if (lookAt.current.lengthSq() === 0) lookAt.current.copy(ahead);
    lookAt.current.lerp(ahead, 1 - Math.exp(-3 * delta));
    camera.lookAt(lookAt.current);

    // Nodes light up once the glow reaches them; the current one pulses
    const time = state.clock.elapsedTime;
    nodes.forEach((n, i) => {
      const mesh = nodeRefs.current[i];
      if (!mesh) return;
      const reached = headT >= n.t - 0.005;
      const near = Math.max(0, 1 - Math.abs(headT - n.t) / 0.06);
      const s = 1 + near * (0.35 + Math.sin(time * 4) * 0.05);
      mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, s, 6, delta));
      mesh.material.emissiveIntensity = THREE.MathUtils.damp(
        mesh.material.emissiveIntensity,
        reached ? 1.4 + near * 1.6 : 0.05,
        5,
        delta
      );
      const ring = ringRefs.current[i];
      if (ring) {
        ring.rotation.z += delta * (0.25 + near);
        ring.material.emissiveIntensity = THREE.MathUtils.damp(
          ring.material.emissiveIntensity,
          reached ? 0.9 : 0.05,
          5,
          delta
        );
      }
    });
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 8]} intensity={1.6} color={GOLD_LIGHT} />
      <directionalLight position={[-8, -4, -6]} intensity={0.5} color="#6b7bb3" />

      {/* Full path in matte gold */}
      <mesh geometry={baseGeo}>
        <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.38} flatShading />
      </mesh>

      {/* Glowing travelled segment (bright enough to bloom) */}
      <mesh geometry={glowGeo}>
        <meshBasicMaterial color={GLOW} toneMapped={false} />
      </mesh>

      {/* Head of the glow with its own light */}
      <mesh ref={head}>
        <icosahedronGeometry args={[0.22, 1]} />
        <meshBasicMaterial color={HEAD} toneMapped={false} />
      </mesh>
      <pointLight ref={headLight} color={HEAD} intensity={40} distance={12} decay={2} />

      {nodes.map((n, i) => (
        <group key={i} position={n.pos} quaternion={n.quat}>
          <mesh ref={(el) => (nodeRefs.current[i] = el)}>
            <icosahedronGeometry args={[0.55, 1]} />
            <meshStandardMaterial
              color={GOLD_LIGHT}
              emissive={GOLD_LIGHT}
              emissiveIntensity={0.05}
              metalness={0.4}
              roughness={0.35}
              flatShading
              toneMapped={false}
            />
          </mesh>
          {n.ring && (
            <mesh ref={(el) => (ringRefs.current[i] = el)}>
              <torusGeometry args={[1.5, 0.11, 10, 48]} />
              <meshStandardMaterial
                color={GOLD_LIGHT}
                emissive={GOLD}
                emissiveIntensity={0.05}
                metalness={0.5}
                roughness={0.3}
                flatShading
              />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

export default function PipelineScene({ progressRef, active = true }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 10], fov: 42, near: 0.1, far: 120 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Pipeline progressRef={progressRef} />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.7} luminanceSmoothing={0.25} radius={0.65} />
      </EffectComposer>
    </Canvas>
  );
}
