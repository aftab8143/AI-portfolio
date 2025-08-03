"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ProductSidebar({
  activeColor,
  onColorChange,
  onFeatureHover,
}) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: "material",
      label: "Premium Material",
      description: "Aerospace-grade aluminum alloy with nano-coating",
    },
    {
      id: "display",
      label: "4K Display",
      description: "Retina-quality 3840×2160 resolution at 120Hz",
    },
    {
      id: "processor",
      label: "Quantum Processor",
      description: "12-core neural engine with 24-thread processing",
    },
  ];

  const colors = [
    { name: "Cosmic Black", value: "black", hex: "#1a1a1a" },
    { name: "Lunar Silver", value: "silver", hex: "#e0e0e0" },
    { name: "Nebula Blue", value: "blue", hex: "#3b82f6" },
    { name: "Solar Gold", value: "gold", hex: "#f59e0b" },
  ];

  const handleFeatureClick = (featureId) => {
    setSelectedFeature(selectedFeature === featureId ? null : featureId);
    onFeatureHover(selectedFeature === featureId ? null : featureId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="max-w-md w-full space-y-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-white/10 shadow-xl"
    >
      {/* Product Title */}
      <div className="space-y-2">
        <motion.h1
          whileHover={{ x: 2 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500"
        >
          QuantumX Cube
        </motion.h1>
        <motion.p whileHover={{ x: 2 }} className="text-lg text-white/80">
          The next evolution in computational design
        </motion.p>
      </div>

      {/* Feature Highlights */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Key Features
        </h3>
        <ul className="space-y-3">
          {features.map((feature) => (
            <motion.li
              key={feature.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFeatureClick(feature.id)}
              onMouseEnter={() => onFeatureHover(feature.id)}
              onMouseLeave={() => onFeatureHover(null)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedFeature === feature.id
                  ? "bg-white/10 border border-emerald-400/30"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full flex-shrink-0 ${
                    selectedFeature === feature.id
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-white/30"
                  }`}
                />
                <div>
                  <h4 className="font-medium">{feature.label}</h4>
                  {selectedFeature === feature.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-white/60 mt-1"
                    >
                      {feature.description}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Color Selector */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Colors
        </h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <motion.button
              key={color.value}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onColorChange(color.value)}
              className={`h-10 w-10 rounded-full border-2 transition-all ${
                activeColor === color.value
                  ? "border-emerald-400 shadow-lg scale-110"
                  : "border-white/20 hover:border-white/40"
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            >
              {activeColor === color.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-full w-full flex items-center justify-center"
                >
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price & CTA */}
      <div className="pt-4 space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-white">$1,299</span>
          <span className="text-sm text-white/60 line-through">$1,599</span>
          <span className="ml-auto px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
            18% OFF
          </span>
        </div>

        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 20px rgba(52, 211, 153, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold text-lg shadow-lg"
        >
          Add to Cart
        </motion.button>

        <div className="flex items-center gap-2 text-sm text-white/60">
          <svg
            className="h-5 w-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Free worldwide shipping</span>
        </div>
      </div>
    </motion.div>
  );
}
