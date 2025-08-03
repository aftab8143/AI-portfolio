"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function ProjectCard({
  slug,
  title,
  description,
  displayImage,
  images = [],
  tags = [],
  liveComponent = null,
}) {
  const [hovered, setHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Start slideshow on hover if no liveComponent
  useEffect(() => {
    if (!liveComponent && hovered && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setCurrentImageIndex(0);
    }
  }, [hovered, images, liveComponent]);

  const imageToShow =
    hovered && images.length > 0 ? images[currentImageIndex] : displayImage;

  return (
    <Link href={`/projects/${slug}`}>
      <motion.div
        className="group bg-slate-800 rounded-xl overflow-hidden shadow-md transition hover:shadow-lg hover:bg-slate-700 cursor-pointer flex flex-col h-full"
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top Preview */}
        <div className="relative w-full aspect-[4/3] bg-slate-900 flex items-center justify-center rounded-t-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 z-0" />
          {liveComponent ? (
            <div className="w-full h-full relative z-10">{liveComponent}</div>
          ) : (
            <Image
              src={imageToShow}
              alt={title}
              fill
              className="object-contain p-2 z-10"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 px-4 py-5">
          <h3 className="text-white text-lg font-semibold mb-1 leading-tight line-clamp-1">
            {title}
          </h3>
          <p className="text-slate-400 text-sm mb-3 line-clamp-3">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="bg-slate-700 text-white text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 text-pink-400 flex items-center gap-1 text-sm font-medium group-hover:underline">
            View Project <ExternalLink size={14} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
