"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageBuilderForm } from "@/components/page-builder/page-builder-form";
import { usePreviewStore } from "@/store/preview.store";
import type { PageFormInput } from "@/lib/validations/page.schema";
import type { PageItem } from "@/types/page";

interface EditPageClientProps {
  page: PageItem;
}

export function EditPageClient({ page }: EditPageClientProps) {
  const router = useRouter();
  const { setGeneratedHtml } = usePreviewStore();

  useEffect(() => {
    if (page.generatedHtml) setGeneratedHtml(page.generatedHtml);
  }, [page.generatedHtml, setGeneratedHtml]);

  async function handleSubmit(data: PageFormInput & { generatedHtml: string }) {
    try {
      const res = await fetch(`/api/pages/${page.id}`, {
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
