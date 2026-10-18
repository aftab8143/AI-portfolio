"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BackButton({ label = "Back" }) {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === "/" || pathname.includes("/blogs/")) {
    return null; // Don't show back button on the archery page
  }

  return (
    <button
      onClick={() => router.back()}
      className="glass !rounded-full fixed left-4 top-[calc(var(--nav-h)+24px)] z-[52] flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-mid transition-colors hover:text-hi"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
