"use client";

interface GeneratedPageIframeProps {
  html: string;
}

export function GeneratedPageIframe({ html }: GeneratedPageIframeProps) {
  if (!html) return null;

  return (
    <iframe
      srcDoc={html}
      className="h-full min-h-[600px] w-full rounded-md border"
      title="Page Preview"
      sandbox="allow-same-origin"
    />
  );
}
