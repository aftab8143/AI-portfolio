"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import roboto from "three/examples/fonts/helvetiker_regular.typeface.json";

extend({ TextGeometry });

export default function ProductViewerContent({ color = "#60A5FA", highlight }) {
  const meshRef = useRef(null);
  const edgesRef = useRef(null);
  const textRef = useRef(null);
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [font, setFont] = useState(null);

  // Load font
  useEffect(() => {
    const loader = new FontLoader();
    const loadedFont = loader.parse(roboto);
    setFont(loadedFont);
  }, []);

  // Initial animations
  useEffect(() => {
    if (!meshRef.current || !loaded || !font) return;

    // Initial entrance animation
    const tl = gsap.timeline();

    tl.fromTo(
      meshRef.current.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.4)",
        onComplete: () => setLoaded(true),
      }
    );

    tl.fromTo(
      meshRef.current.rotation,
      { y: Math.PI * 1.5 },
      { y: Math.PI / 4, duration: 1.8, ease: "power3.out" },
      0
    );

    // Pulsing animation for highlighted feature
    if (highlight) {
      gsap.to(meshRef.current.material, {
        emissiveIntensity: 0.8,
        duration: 0.5,
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => tl.kill();
  }, [loaded, font, highlight]);

  // Hover effects
  useEffect(() => {
    if (!meshRef.current) return;

    if (hovered) {
      gsap.to(meshRef.current.scale, {
        x: 1.05,
        y: 1.05,
        z: 1.05,
        duration: 0.3,
      });
      gsap.to(meshRef.current.material, {
        emissiveIntensity: 0.5,
        duration: 0.3,
      });
    } else {
      gsap.to(meshRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
      });
      gsap.to(meshRef.current.material, {
        emissiveIntensity: 0.2,
        duration: 0.3,
      });
    }
  }, [hovered]);

  // Continuous animation
  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // Gentle rotation and float
    meshRef.current.rotation.y += hovered ? 0.01 : 0.002;
    meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.05;

    // Edge highlight animation
    if (edgesRef.current) {
      edgesRef.current.rotation.copy(meshRef.current.rotation);
      edgesRef.current.position.copy(meshRef.current.position);
      edgesRef.current.scale.copy(meshRef.current.scale);
    }

    // Text face camera
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
    }
  });

  // Color change effect
  useEffect(() => {
    if (!meshRef.current) return;

    gsap.to(meshRef.current.material, {
      color: new THREE.Color(color),
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, [color]);

  if (!font) return null;

  return (
    <group>
      {/* Main cube */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.2}
          emissive="#ffffff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Edges highlight */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.21, 1.21, 1.21)]} />
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          linewidth={2}
        />
      </lineSegments>

      {/* Floating product name */}
      {loaded && (
        <group ref={textRef} position={[0, 1.8, 0]}>
          <mesh>
            <textGeometry
              args={[
                "QUANTUM X",
                {
                  font,
                  size: 0.2,
                  height: 0.02,
                },
              ]}
            />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#3b82f6"
              emissiveIntensity={0.5}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      )}

      {/* Feature highlight indicators */}
      {highlight === "material" && (
        <mesh position={[0, 0, 0.61]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#10b981"
            emissiveIntensity={1}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Ambient light effect */}
      <mesh position={[0, 0, -2]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
