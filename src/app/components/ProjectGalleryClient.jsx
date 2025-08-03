// components/ProjectGalleryClient.jsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the SwiperGallery with SSR disabled
const SwiperGallery = dynamic(() => import("./SwiperGallery"), {
  ssr: false,
});

export default function ProjectGalleryClient({ images }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <SwiperGallery images={images} />;
}
