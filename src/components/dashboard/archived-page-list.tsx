"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./empty-state";
import { formatDate } from "@/lib/utils/date";
import type { PageItem } from "@/types/page";

interface ArchivedPageListProps {
  pages: PageItem[];
}

export function ArchivedPageList({ pages }: ArchivedPageListProps) {
  const router = useRouter();

  if (pages.length === 0) {
    return (
      <EmptyState
        title="No archived pages"
        description="Archived pages will appear here."
      />
    );
  }

  async function handleRecover(pageId: string) {
    try {
      const res = await fetch(`/api/pages/${pageId}/recover`, {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Page recovered");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Recovery failed");
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <Card key={page.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">
              {page.title}
            </CardTitle>
            <Badge variant="secondary">Archived</Badge>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-muted-foreground">
              Updated {formatDate(page.updatedAt)}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRecover(page.id)}
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              Recover
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
