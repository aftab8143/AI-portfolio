"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useProgress,
  PerspectiveCamera,
  Float,
} from "@react-three/drei";
import { Loader } from "@/components/ui/loader";
import ProductSidebar from "@/app/components/playground/ProductSidebar";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

function RendererSetup() {
  const { gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
  }, [gl]);

  return null;
}

function CustomLoader() {
  const { progress } = useProgress();
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ delay: progress === 100 ? 0.5 : 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
    >
      <div className="text-center space-y-4">
        <Loader className="h-12 w-12 mx-auto text-emerald-400" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full max-w-xs mx-auto"
        />
        <p className="text-sm text-white/80">
          Loading 3D model... {Math.round(progress)}%
        </p>
      </div>
    </motion.div>
  );
}

function ProductViewer({ color = "#3b82f6", highlight }) {
  const meshRef = useRef();
  const edgesRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    meshRef.current.rotation.y += 0.005;
    meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
  });

  return (
    <group>
      {/* Main cube with enhanced material */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.1}
          thickness={1}
          ior={1.5}
          envMapIntensity={1}
          emissive="#111111"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Edge highlights */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.51, 1.51, 1.51)]} />
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          linewidth={2}
        />
      </lineSegments>
    </group>
  );
}

export default function ProductDemoPage() {
  const [activeColor, setActiveColor] = useState("#3b82f6");
  const [activeFeature, setActiveFeature] = useState(null);
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleColorChange = (color) => {
    setActiveColor(color);
    if (isMobile && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="container mx-auto px-4 py-8 h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-[60vh] w-full lg:h-[80vh] lg:w-1/2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-gray-900/20 to-black/30 pointer-events-none z-10" />

          <Canvas
            ref={canvasRef}
            shadows
            gl={{
              antialias: true,
              alpha: true,
            }}
            className="absolute inset-0"
          >
            <RendererSetup />
            <PerspectiveCamera makeDefault fov={45} position={[0, 1.5, 4]} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize={2048}
              shadow-camera-far={50}
              color="#ffffff"
            />
            <Environment preset="studio" />
            <OrbitControls
              enableZoom={!isMobile}
              enablePan={false}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.8}
              autoRotate
              autoRotateSpeed={0.8}
              enableDamping
              dampingFactor={0.05}
            />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <ProductViewer color={activeColor} highlight={activeFeature} />
            </Float>
          </Canvas>
          <CustomLoader />

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-400/20 text-xs flex items-center gap-2 z-20"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              3D Interactive Viewer
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/2 max-w-lg"
        >
          <ProductSidebar
            activeColor={activeColor}
            onColorChange={handleColorChange}
            onFeatureHover={setActiveFeature}
          />
        </motion.div>
      </div>

      {isMobile && (
        <AnimatePresence>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="fixed bottom-4 left-0 right-0 flex justify-center z-30 px-4"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-black/80 backdrop-blur-lg px-4 py-3 rounded-xl border border-white/10 text-sm flex items-center gap-2 shadow-lg"
            >
              <div className="h-8 w-8 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>
              <span className="text-white">Touch and drag to rotate</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
}
