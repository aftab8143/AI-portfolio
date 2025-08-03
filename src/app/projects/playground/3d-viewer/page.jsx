// app/page.tsx or wherever you're showcasing it
import CubeScene from "@/app/components/playground/CubeScene";
import HeroOverlay from "@/app/components/playground/HeroOverlay";

export default function HomePage() {
  return (
    <main className="relative h-screen w-full">
      <CubeScene />
      <HeroOverlay />
    </main>
  );
}
