"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageBuilderForm } from "@/components/page-builder/page-builder-form";
import { usePreviewStore } from "@/store/preview.store";
import type { PageFormInput } from "@/lib/validations/page.schema";
import type { PageItem } from "@/types/page";

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const [page, setPage] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { setGeneratedHtml } = usePreviewStore();

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/pages/${params.id}`);
        const result = await res.json();

        if (result.success) {
          const pageData = result.data.page;
          setPage(pageData);
          if (pageData.generatedHtml) {
            setGeneratedHtml(pageData.generatedHtml);
          }
        } else {
          toast.error(result.message);
          router.push("/dashboard");
        }
      } catch {
        toast.error("Failed to load page");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [params.id, router, setGeneratedHtml]);

  async function handleSubmit(
    data: PageFormInput & { generatedHtml: string }
  ) {
    try {
      const res = await fetch(`/api/pages/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Page updated");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update page");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-3 text-sm text-gray-500">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-md">
        <div className="flex h-14 items-center gap-4 px-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <FileText className="h-3.5 w-3.5 text-primary" />
            </div>
            <h1 className="text-sm font-semibold text-gray-900">
              Edit: {page.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Builder Layout */}
      <PageBuilderForm
        initialData={page}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        submitLoadingLabel="Saving..."
      />
    </div>
  );
}
