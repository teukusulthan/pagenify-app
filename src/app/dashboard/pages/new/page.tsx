"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageBuilderForm } from "@/components/page-builder/page-builder-form";
import { usePreviewStore } from "@/store/preview.store";
import type { PageFormInput } from "@/lib/validations/page.schema";

export default function NewPagePage() {
  const router = useRouter();
  const { clearPreview } = usePreviewStore();

  useEffect(() => {
    clearPreview();
  }, [clearPreview]);

  async function handleSubmit(
    data: PageFormInput & { generatedHtml: string }
  ) {
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Page created");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to save page");
    }
  }

  return (
    <PageBuilderForm
      onSubmit={handleSubmit}
      submitLabel="Save Page"
      submitLoadingLabel="Saving..."
      headerTitle="Create New Page"
    />
  );
}
