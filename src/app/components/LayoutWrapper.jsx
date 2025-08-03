"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ResumeButton from "./ResumeButton";
import AssistantWrapper from "./AssistantWrapper";
import BackButton from "./common/BackButton";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Routes that should render full screen without layout elements
  const fullScreenRoutes = [
    "/archery",
    "/test",
    "/projects/playground/project-dashboard",
  ];

  const isFullScreen = fullScreenRoutes.includes(pathname);

  // Theme logic based on route
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("test-theme");

    if (
      pathname.startsWith("/test") ||
      pathname === "/playground/project-dashboard"
    ) {
      root.classList.add("test-theme");
    }
  }, [pathname]);

  return (
    <>
      {!isFullScreen && <Navbar />}
      {!isFullScreen && <BackButton label="Back" />}
      {!isFullScreen && <AssistantWrapper />}
      {!isFullScreen && <ResumeButton />}
      <main
        className={isFullScreen ? "h-screen w-screen overflow-hidden" : "pt-20"}
      >
        {children}
      </main>
      {!isFullScreen && <Footer />}
    </>
  );
}
