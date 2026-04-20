"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const IFRAME_W = 1280;
const IFRAME_H = 720;

interface PageThumbnailProps {
  html: string;
}

export function PageThumbnail({ html }: PageThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.23);

  const computeScale = useCallback(() => {
    if (containerRef.current) {
      setScale(containerRef.current.offsetWidth / IFRAME_W);
    }
  }, []);

  useEffect(() => {
    computeScale();
    const observer = new ResizeObserver(computeScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [computeScale]);

  if (!html) {
    return (
      <div className="flex h-40 items-center justify-center bg-muted text-sm text-muted-foreground">
        No preview available
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-muted"
      style={{ height: IFRAME_H * scale }}
    >
      <iframe
        srcDoc={html}
        className="pointer-events-none absolute inset-0"
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
    </div>
  );
}
