"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { pageFormSchema, type PageFormInput } from "@/lib/validations/page.schema";
import { usePreviewStore } from "@/store/preview.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MultiInputField } from "./multi-input-field";
import { ImageUploadField } from "./image-upload-field";
import type { PageItem } from "@/types/page";

interface PageBuilderFormProps {
  initialData?: Partial<PageItem>;
  onSubmit: (data: PageFormInput & { generatedHtml: string }) => Promise<void>;
  submitLabel: string;
  submitLoadingLabel: string;
}

export function PageBuilderForm({
  initialData,
  onSubmit,
  submitLabel,
  submitLoadingLabel,
}: PageBuilderFormProps) {
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { generatedHtml, setGeneratedHtml, clearPreview } = usePreviewStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PageFormInput>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      targetAudience: initialData?.targetAudience ?? "",
      priceDisplay: initialData?.priceDisplay ?? "",
      keyFeatures: initialData?.keyFeatures ?? [],
      uniqueSellingPoints: initialData?.uniqueSellingPoints ?? [],
      productImageUrl: initialData?.productImageUrl ?? null,
    },
  });

  async function handleGeneratePreview(data: PageFormInput) {
    setGenerating(true);
    try {
      const endpoint = initialData?.id
        ? `/api/pages/${initialData.id}/preview`
        : "/api/pages/preview";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setGeneratedHtml(result.data.html);
        toast.success("Preview generated");
      } else {
        toast.error(result.message || "Generation failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setGenerating(false);
    }
  }

  async function handleFormSubmit(data: PageFormInput) {
    if (!generatedHtml) {
      toast.error("Generate a preview first");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...data, generatedHtml });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input id="targetAudience" {...register("targetAudience")} />
          {errors.targetAudience && (
            <p className="text-sm text-red-500">
              {errors.targetAudience.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceDisplay">Price Display</Label>
          <Input id="priceDisplay" {...register("priceDisplay")} />
          {errors.priceDisplay && (
            <p className="text-sm text-red-500">
              {errors.priceDisplay.message}
            </p>
          )}
        </div>

        <Controller
          name="keyFeatures"
          control={control}
          render={({ field }) => (
            <MultiInputField
              label="Key Features"
              values={field.value}
              onChange={field.onChange}
              error={errors.keyFeatures?.message}
              placeholder="Add a feature..."
            />
          )}
        />

        <Controller
          name="uniqueSellingPoints"
          control={control}
          render={({ field }) => (
            <MultiInputField
              label="Unique Selling Points"
              values={field.value}
              onChange={field.onChange}
              error={errors.uniqueSellingPoints?.message}
              placeholder="Add a selling point..."
            />
          )}
        />

        <Controller
          name="productImageUrl"
          control={control}
          render={({ field }) => (
            <ImageUploadField
              value={field.value ?? null}
              onChange={field.onChange}
            />
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={generating}
            onClick={handleSubmit(handleGeneratePreview)}
          >
            {generating ? "Generating..." : "Generate Preview"}
          </Button>

          <Button
            type="button"
            disabled={submitting || !generatedHtml}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {submitting ? submitLoadingLabel : submitLabel}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <h3 className="mb-4 text-lg font-semibold">Preview</h3>
        {generatedHtml ? (
          <iframe
            srcDoc={generatedHtml}
            className="h-[600px] w-full rounded-md border"
            title="Page Preview"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="flex h-[600px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
            Generate a preview to see your page
          </div>
        )}
      </div>
    </div>
  );
}
