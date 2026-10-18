"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AssistantWrapper from "./AssistantWrapper";
import BackButton from "./common/BackButton";
import SiteEffects from "./fx/SiteEffects";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Routes that should render full screen without layout elements
  const fullScreenRoutes = [
    "/archery",
    "/projects/playground/project-dashboard",
  ];

  const isFullScreen = fullScreenRoutes.includes(pathname);
  const isHome = pathname === "/";

  if (isFullScreen) {
    return <main className="h-screen w-screen overflow-hidden">{children}</main>;
  }

  return (
    <>
      {isHome && (
        <div className="intro-cover" aria-hidden="true">
          <span className="intro-mark">AA</span>
        </div>
      )}
      <SiteEffects />
      <Navbar />
      <BackButton label="Back" />
      <AssistantWrapper />
      {/* The home hero sits under the floating nav; other pages clear it */}
      <main id="main" className={isHome ? "" : "pt-[calc(var(--nav-h)+48px)]"}>
        {children}
      </main>
      <Footer />
    </>
  );
}
