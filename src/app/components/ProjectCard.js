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
        className="project-card group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top Preview */}
        <div className="project-image-wrapper flex items-center justify-center">
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
          <h3
            className="text-lg font-semibold mb-1 leading-tight line-clamp-1"
            style={{ color: "var(--text-light)" }}
          >
            {title}
          </h3>
          <p
            className="text-sm mb-3 line-clamp-3"
            style={{ color: "var(--text-muted)" }}
          >
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag, i) => (
              <span key={i} className="tag text-xs">
                {tag}
              </span>
            ))}
          </div>

          <div
            className="mt-4 flex items-center gap-1 text-sm font-medium group-hover:underline"
            style={{ color: "var(--accent)" }}
          >
            View Project <ExternalLink size={14} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
