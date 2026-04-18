"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";

const IFRAME_W = 1067;
const IFRAME_H = 600;

interface PageThumbnailProps {
  html: string;
}

/**
 * Injects inline styles directly on hero elements so overrides
 * always win regardless of CSS specificity.
 */
function compactHero(html: string): string {
  // Strip decorative pseudo-elements by adding a class override
  let out = html;

  // Inject style="padding:0;margin:0;..." on the hero section tag
  out = out.replace(
    /<section([^>]*class=["'][^"']*hero["'][^>]*)>/i,
    '<section$1 style="padding:0 20px 14px !important;margin:0 !important;min-height:auto !important;">'
  );

  // Zero out container padding
  out = out.replace(
    /class="container"/gi,
    'class="container" style="padding:0 !important;"'
  );

  // Zero out hero-inner gap
  out = out.replace(
    /class="hero-inner"/gi,
    'class="hero-inner" style="gap:12px !important;"'
  );

  // Hide hero-image entirely
  out = out.replace(
    /class="hero-image"/gi,
    'class="hero-image" style="display:none !important;"'
  );

  return out;
}

export function PageThumbnail({ html }: PageThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.27);

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

  const heroHtml = useMemo(() => {
    if (!html) return null;

    // Extract <style> CSS
    const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    const css = styleMatches
      ? styleMatches
          .map((m) => {
            const inner = m.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            return inner ? inner[1] : "";
          })
          .join("\n")
      : "";

    // Extract hero section
    const heroMatch = html.match(
      /<section[^>]*class=["'][^"']*hero["'][^>]*>([\s\S]*?)<\/section>/i
    );
    const fallbackMatch = !heroMatch
      ? html.match(/<section[^>]*>([\s\S]*?)<\/section>/i)
      : null;

    const rawHero = heroMatch
      ? heroMatch[0]
      : fallbackMatch
        ? fallbackMatch[0]
        : null;

    if (!rawHero) return null;

    const compacted = compactHero(rawHero);

    return buildThumbnailDoc(css, compacted);
  }, [html]);

  if (!heroHtml) {
    return (
      <div className="flex h-40 items-center justify-center bg-gray-100 text-sm text-gray-400">
        No preview available
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gray-100"
      style={{ height: IFRAME_H * scale }}
    >
      <iframe
        srcDoc={heroHtml}
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

function buildThumbnailDoc(css: string, heroContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${IFRAME_W}">
<style>
${css}
html, body { margin: 0 !important; padding: 0 !important; overflow: hidden !important; }
.hero::before, .hero::after { display: none !important; }
.hero-badge { margin-bottom: 6px !important; padding: 3px 10px !important; font-size: 11px !important; }
.hero-title { font-size: 22px !important; margin-bottom: 4px !important; }
.hero-subtitle { font-size: 11px !important; margin-bottom: 8px !important; line-height: 1.4 !important; }
.hero-actions { gap: 6px !important; margin: 0 !important; }
.btn { padding: 6px 14px !important; font-size: 11px !important; }
</style>
</head>
<body>
${heroContent}
</body>
</html>`;
}
