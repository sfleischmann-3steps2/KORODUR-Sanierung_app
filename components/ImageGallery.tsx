"use client";

import { useState } from "react";
import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className="relative overflow-hidden cursor-pointer group"
            style={{ borderRadius: 10, aspectRatio: "4/3", border: "none", padding: 0, background: "#f5f5f6" }}
          >
            <Image
              src={withBasePath(src)}
              alt={`${alt} – Bild ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={() => setSelectedIndex(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedIndex(null);
            if (e.key === "ArrowRight") setSelectedIndex((selectedIndex + 1) % images.length);
            if (e.key === "ArrowLeft") setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
          }}
          role="dialog"
          tabIndex={0}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white cursor-pointer z-10"
            style={{ background: "none", border: "none", fontSize: 32, lineHeight: 1 }}
            aria-label="Schließen"
          >
            ✕
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-4 text-white cursor-pointer z-10"
            style={{ background: "none", border: "none", fontSize: 40, lineHeight: 1, top: "50%", transform: "translateY(-50%)" }}
            aria-label="Vorheriges Bild"
          >
            ‹
          </button>

          {/* Image */}
          <div
            className="relative"
            style={{ width: "90vw", height: "80vh", maxWidth: 1200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={withBasePath(images[selectedIndex])}
              alt={`${alt} – Bild ${selectedIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((selectedIndex + 1) % images.length);
            }}
            className="absolute right-4 text-white cursor-pointer z-10"
            style={{ background: "none", border: "none", fontSize: 40, lineHeight: 1, top: "50%", transform: "translateY(-50%)" }}
            aria-label="Nächstes Bild"
          >
            ›
          </button>

          {/* Counter */}
          <div
            className="absolute bottom-4 left-1/2 text-white text-sm"
            style={{ transform: "translateX(-50%)", fontWeight: 600, opacity: 0.7 }}
          >
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
