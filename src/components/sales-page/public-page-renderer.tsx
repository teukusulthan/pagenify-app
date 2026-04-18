interface PublicPageRendererProps {
  html: string;
}

export function PublicPageRenderer({ html }: PublicPageRendererProps) {
  return (
    <iframe
      srcDoc={html}
      className="h-screen w-full border-0"
      title="Sales Page"
      sandbox="allow-same-origin"
    />
  );
}
