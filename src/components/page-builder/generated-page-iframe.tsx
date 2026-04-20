"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Monitor } from "@phosphor-icons/react/dist/ssr";

const PREVIEW_WIDTH = 1920;
const PREVIEW_HEIGHT = 1080;

interface GeneratedPageIframeProps {
  html: string;
}

export function GeneratedPageIframe({ html }: GeneratedPageIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  const computeScale = useCallback(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setScale(width / PREVIEW_WIDTH);
    }
  }, []);

  useEffect(() => {
    computeScale();
    const observer = new ResizeObserver(computeScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [computeScale]);

  if (!html) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Monitor className="h-4 w-4" />
        Live Preview
        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-normal text-muted-foreground">
          1920 × 1080
        </span>
      </div>

      <div ref={containerRef} className="w-full">
        <div className="overflow-hidden rounded-xl border border-border bg-zinc-900 shadow-2xl">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="ml-3 flex-1 rounded-md bg-zinc-800 px-3 py-1">
              <span className="text-xs text-zinc-500">yourpage.com</span>
            </div>
          </div>
          {/* Scaled 1920x1080 viewport */}
          <div
            style={{
              height: PREVIEW_HEIGHT * scale,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <div
              style={{
                width: PREVIEW_WIDTH,
                height: PREVIEW_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <iframe
                srcDoc={html}
                style={{
                  width: PREVIEW_WIDTH,
                  height: PREVIEW_HEIGHT,
                  border: "none",
                }}
                title="Page Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
