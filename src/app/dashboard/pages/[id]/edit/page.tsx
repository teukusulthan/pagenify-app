"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Page</h1>
        </div>

        <PageBuilderForm
          initialData={page}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          submitLoadingLabel="Saving..."
        />
      </div>
    </div>
  );
}
