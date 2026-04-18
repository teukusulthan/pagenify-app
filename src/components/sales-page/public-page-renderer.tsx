interface PublicPageRendererProps {
  html: string;
}

export function PublicPageRenderer({ html }: PublicPageRendererProps) {
  return (
    <div className="min-h-screen bg-white">
      <div
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
