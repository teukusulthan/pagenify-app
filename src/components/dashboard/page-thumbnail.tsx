"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const IFRAME_W = 1280;
const IFRAME_H = 720;

interface PageThumbnailProps {
  html: string;
}

export function PageThumbnail({ html }: PageThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const computeScale = useCallback(() => {
    if (containerRef.current) {
      setScale(containerRef.current.offsetWidth / IFRAME_W);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          visibilityObserver.disconnect();
        }
      },
      { threshold: 0.05 },
    );

    visibilityObserver.observe(el);
    return () => visibilityObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    computeScale();
    const resizeObserver = new ResizeObserver(computeScale);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isVisible, computeScale]);

  if (!html) {
    return (
      <div
        className="relative w-full bg-muted"
        style={{ paddingBottom: `${(IFRAME_H / IFRAME_W) * 100}%` }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          No preview
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-muted"
      style={{ paddingBottom: `${(IFRAME_H / IFRAME_W) * 100}%` }}
    >
      {isVisible && scale > 0 && (
        <iframe
          srcDoc={html}
          className="pointer-events-none absolute top-0 left-0"
          style={{
            width: IFRAME_W,
            height: IFRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          title="Page thumbnail"
          sandbox="allow-same-origin"
          loading="lazy"
        />
      )}
    </div>
  );
}
