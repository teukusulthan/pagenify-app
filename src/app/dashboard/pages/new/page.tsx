"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageBuilderForm } from "@/components/page-builder/page-builder-form";
import { usePreviewStore } from "@/store/preview.store";
import type { PageFormInput } from "@/lib/validations/page.schema";

export default function NewPagePage() {
  const router = useRouter();
  const { clearPreview } = usePreviewStore();

  // Clear stale preview from previous sessions
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
              Create New Page
            </h1>
          </div>
        </div>
      </header>

      {/* Builder Layout */}
      <PageBuilderForm
        onSubmit={handleSubmit}
        submitLabel="Save Page"
        submitLoadingLabel="Saving..."
      />
    </div>
  );
}
