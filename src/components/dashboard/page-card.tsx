"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowSquareOut,
  CircleNotch,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";
import { PageThumbnail } from "./page-thumbnail";
import type { PageListItem } from "@/types/page";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PageCardProps {
  page: PageListItem;
  username: string;
}

export function PageCard({ page, username }: PageCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const publicUrl = `/u/${username}/${page.slug}`;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pages/${page.id}/archive`, {
        method: "POST",
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Page moved to trash");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex h-full w-full flex-col overflow-hidden rounded-xl border bg-card p-0 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="shrink-0 p-2 pb-0">
          <div className="overflow-hidden rounded-lg border bg-background">
            <PageThumbnail html={page.generatedHtml} />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-semibold leading-tight">
              {page.title}
            </CardTitle>
            <Badge variant="default" className="shrink-0 text-[11px]">
              Active
            </Badge>
          </div>

          <p className="line-clamp-3 text-xs text-muted-foreground">
            {page.description}
          </p>

          <p className="mt-3 text-[11px] text-muted-foreground">
            Created {formatDate(page.createdAt)} · Updated{" "}
            {formatDate(page.updatedAt)}
          </p>
        </div>
      </button>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!isDeleting) setOpen(val);
        }}
      >
        <DialogContent
          className="max-w-xl p-0 sm:max-w-xl"
          showCloseButton={false}
        >
          <div className="border-b bg-background p-3">
            <div className="overflow-hidden rounded-lg border bg-background">
              <PageThumbnail html={page.generatedHtml} />
            </div>
          </div>

          <div className="px-4 pb-4 pt-3">
            <DialogHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-sm font-semibold leading-5">
                    {page.title}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-xs leading-5 text-muted-foreground">
                    {page.description}
                  </DialogDescription>
                </div>

                <Badge variant="default" className="shrink-0 text-[10px]">
                  Active
                </Badge>
              </div>
            </DialogHeader>

            <div className="mt-3 grid gap-3 rounded-lg border bg-muted/20 p-3 sm:grid-cols-2">
              <div className="min-w-0 sm:col-span-2">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Public URL
                </p>
                <p className="truncate text-xs text-foreground">{publicUrl}</p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Created
                </p>
                <p className="text-xs text-foreground">
                  {formatDate(page.createdAt)}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Updated
                </p>
                <p className="text-xs text-foreground">
                  {formatDate(page.updatedAt)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Link href={publicUrl} target="_blank">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full text-xs sm:w-auto"
                >
                  <ArrowSquareOut className="mr-1.5 h-3.5 w-3.5" />
                  View
                </Button>
              </Link>

              <Link href={`/dashboard/pages/${page.id}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full text-xs sm:w-auto"
                >
                  <PencilSimple className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 w-full text-xs sm:w-auto"
                    >
                      <Trash className="mr-1.5 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this page?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This page will be moved to the Trash Bin and removed from
                      your active list. Its public URL will return 404, and you
                      can restore it later from the Trash Bin.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={handleDelete}
                      className="min-w-24 gap-1.5"
                    >
                      {isDeleting ? (
                        <>
                          <CircleNotch className="h-3.5 w-3.5 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash className="h-3.5 w-3.5" />
                          Delete
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
