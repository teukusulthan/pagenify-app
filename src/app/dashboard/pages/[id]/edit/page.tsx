"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!page) return null;

  return (
    <PageBuilderForm
      initialData={page}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
      submitLoadingLabel="Saving..."
      headerTitle={`Edit: ${page.title}`}
    />
  );
}
