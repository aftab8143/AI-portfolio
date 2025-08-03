// components/HeroOverlay.tsx
export default function HeroOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center px-6 pointer-events-none">
      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-300 drop-shadow-lg">
        Building immersive interfaces with <strong>React, GSAP</strong>, and <strong>Three.js</strong>.
      </h1>
    
    </div>
  );
}
