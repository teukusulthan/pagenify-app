"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Pencil, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{page.title}</CardTitle>
        <Badge variant="default">Active</Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm text-muted-foreground truncate">
          {publicUrl}
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          Created {formatDate(page.createdAt)} · Updated{" "}
          {formatDate(page.updatedAt)}
        </p>
        <div className="flex gap-2">
          <Link href={publicUrl} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-1 h-3 w-3" />
              View
            </Button>
          </Link>
          <Link href={`/dashboard/pages/${page.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Archive className="mr-1 h-3 w-3" />
                Archive
              </Button>
            </AlertDialogTrigger>
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
      </CardContent>
    </Card>
  );
}
