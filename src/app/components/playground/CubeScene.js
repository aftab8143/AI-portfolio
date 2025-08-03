'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

function InteractiveCube({ position, color }) {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Initial scale animation
  useEffect(() => {
    gsap.fromTo(
      meshRef.current.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        delay: Math.random() * 0.5,
      }
    );
  }, []);

  // Hover effect
  useEffect(() => {
    gsap.to(meshRef.current.scale, {
      x: hovered ? 1.2 : 1,
      y: hovered ? 1.2 : 1,
      z: hovered ? 1.2 : 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [hovered]);

  // Click effect: spin the cube
  useEffect(() => {
    if (clicked) {
      gsap.to(meshRef.current.rotation, {
        y: meshRef.current.rotation.y + Math.PI * 2,
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => setClicked(false),
      });
    }
  }, [clicked]);

  // Floating animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      receiveShadow
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(true)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={hovered ? color : 'black'} emissiveIntensity={0.6} />
    </mesh>
  );
}

const Cube = memo(InteractiveCube);

export default function CubeScene() {
  const colors = ['#4ADE80', '#60A5FA', '#F472B6', '#FACC15', '#A78BFA'];
  const positions = [-3, -1.5, 0, 1.5, 3];

  return (
    <div className="h-screen w-full bg-black">
      <Canvas shadows camera={{ position: [0, 2, 7], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <Environment preset="sunset" />

        {/* Grid of Cubes */}
        {positions.map((x, i) =>
          positions.map((z, j) => (
            <Cube key={`${i}-${j}`} position={[x, 0, z]} color={colors[(i + j) % colors.length]} />
          ))
        )}

        {/* Camera Interaction */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
