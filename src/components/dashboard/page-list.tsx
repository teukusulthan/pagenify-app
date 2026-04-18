import { PageCard } from "./page-card";
import { EmptyState } from "./empty-state";
import type { PageItem } from "@/types/page";

interface PageListProps {
  pages: PageItem[];
  username: string;
}

export function PageList({ pages, username }: PageListProps) {
  if (pages.length === 0) {
    return (
      <EmptyState
        title="No pages yet"
        description="Create your first sales page to get started."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <PageCard key={page.id} page={page} username={username} />
      ))}
    </div>
  );
}
