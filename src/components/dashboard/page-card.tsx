"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Pencil, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";
import { PageThumbnail } from "./page-thumbnail";
import type { PageItem } from "@/types/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PageCardProps {
  page: PageItem;
  username: string;
}

export function PageCard({ page, username }: PageCardProps) {
  const router = useRouter();
  const publicUrl = `/u/${username}/${page.slug}`;

  async function handleArchive() {
    try {
      const res = await fetch(`/api/pages/${page.id}/archive`, {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Page archived");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Archive failed");
    }
  }

  return (
    <Card className="group overflow-hidden p-0 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-gray-300">
      {/* Thumbnail */}
      <Link href={publicUrl} target="_blank">
        <PageThumbnail html={page.generatedHtml} />
      </Link>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-tight">
            {page.title}
          </CardTitle>
          <Badge variant="default" className="shrink-0 text-[11px]">
            Active
          </Badge>
        </div>

        <p className="mb-1 text-xs text-muted-foreground truncate">
          {publicUrl}
        </p>
        <p className="mb-3 text-[11px] text-muted-foreground">
          Created {formatDate(page.createdAt)} · Updated{" "}
          {formatDate(page.updatedAt)}
        </p>

        <div className="flex gap-1.5">
          <Link href={publicUrl} target="_blank">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <ExternalLink className="mr-1 h-3 w-3" />
              View
            </Button>
          </Link>
          <Link href={`/dashboard/pages/${page.id}/edit`}>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Archive className="mr-1 h-3 w-3" />
                  Archive
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive this page?</AlertDialogTitle>
                <AlertDialogDescription>
                  This page will be removed from your active list and its public
                  URL will return 404. You can recover it later from the
                  archived pages section.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleArchive}>
                  Archive
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
