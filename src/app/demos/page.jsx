"use client";

import { Suspense } from "react";
import ProjectCard from "@/app/components/ProjectCard";
import dynamic from "next/dynamic";
import ProjectDashboard from "../components/playground/ProjectManagement";

const CubeSceneMini = dynamic(
  () => import("@/app/components/ProjectPreviewComponents/CubeSceneMini"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] w-full bg-[var(--surface)] animate-pulse rounded-t-xl" />
    ),
  }
);

const ScrollStoryMini = dynamic(
  () => import("@/app/components/ProjectPreviewComponents/ScrollStoryMini"),
  { ssr: false }
);

export default function DemosPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DemosGrid />
    </Suspense>
  );
}

const uiExperiments = [
  {
    title: "Project Management Dashboard",
    slug: "playground/project-dashboard",
    description:
      "Live, interactive project management dashboard — built with React and Next.js.",
    image: "/images/3d-viewer-demo.gif",
    link: "/playground/project-dashboard",
    tags: ["React", "Next.js", "Tailwind CSS", "Project Management"],
    liveComponent: <ProjectDashboard />,
  },
  {
    title: "Scroll Storytelling",
    slug: "playground/scroll-storytelling",
    description: "Scroll-driven parallax and pinning.",
    image: "/images/scroll-storytelling.gif",
    link: "/playground/scroll-storytelling",
    tags: ["Framer Motion", "ScrollTrigger"],
    liveComponent: <ScrollStoryMini />,
  },
  {
    title: "3D Product Viewer",
    slug: "playground/product-demo",
    description: "Interactive 3D scene using react-three-fiber.",
    image: "/images/3d-viewer-demo.gif",
    link: "/playground/3d-viewer",
    tags: ["Three.js", "React Three Fiber", "WebGL"],
    liveComponent: <CubeSceneMini />,
  },
];

function DemosGrid() {
  return (
    <section
      id="demos-section"
      className="relative min-h-screen pt-12 px-4 md:px-8 max-w-6xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Interactive Demos
        </h1>
        <p className="max-w-2xl mx-auto [color:var(--text-muted)]">
          A few live, hands-on builds — hover or interact with each card
          directly, no video needed.
        </p>
      </div>
      <div className="project-grid mb-6">
        <div className="project-grid">
          {uiExperiments.map((proj, idx) => (
            <ProjectCard key={idx} {...proj} target="_self" />
          ))}
        </div>
      </div>
    </section>
  );
}
