"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  FileText,
  Users,
  Sparkles,
  ImageIcon,
  Loader2,
  Monitor,
  Download,
} from "lucide-react";
import {
  pageFormSchema,
  type PageFormInput,
} from "@/lib/validations/page.schema";
import { usePreviewStore } from "@/store/preview.store";
import { exportHtmlAsFile } from "@/lib/utils/export-html";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MultiInputField } from "./multi-input-field";
import { ImageUploadField } from "./image-upload-field";
import type { PageItem } from "@/types/page";

const PREVIEW_WIDTH = 1920;
const PREVIEW_HEIGHT = 1080;

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
  const { generatedHtml, setGeneratedHtml } = usePreviewStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  const computeScale = useCallback(() => {
    if (previewRef.current) {
      const width = previewRef.current.offsetWidth;
      setScale((width / PREVIEW_WIDTH) * 0.88);
    }
  }, []);

  useEffect(() => {
    computeScale();
    const observer = new ResizeObserver(computeScale);
    if (previewRef.current) observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [computeScale]);

  const {
    register,
    handleSubmit,
    control,
    watch,
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

  const title = watch("title");

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
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left Panel — Form */}
      <aside className="flex w-full shrink-0 flex-col border-r bg-white lg:w-[530px]">
        <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-1 p-6">
          {/* Section: Basic Information */}
          <FormSection icon={FileText} title="Basic Information">
            <FormField
              label="Title"
              htmlFor="title"
              hint="Your product or service name"
              error={errors.title?.message}
            >
              <Input
                id="title"
                placeholder="e.g. Ultimate Marketing Toolkit"
                {...register("title")}
              />
            </FormField>

            <FormField
              label="Description"
              htmlFor="description"
              hint="A brief overview of what you offer"
              error={errors.description?.message}
            >
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe your product or service in a few sentences..."
                {...register("description")}
              />
            </FormField>
          </FormSection>

          {/* Section: Target Market */}
          <FormSection icon={Users} title="Target Market">
            <FormField
              label="Target Audience"
              htmlFor="targetAudience"
              hint="Who is this for?"
              error={errors.targetAudience?.message}
            >
              <Input
                id="targetAudience"
                placeholder="e.g. Small business owners, freelancers"
                {...register("targetAudience")}
              />
            </FormField>

            <FormField
              label="Price Display"
              htmlFor="priceDisplay"
              hint="How should the price appear?"
              error={errors.priceDisplay?.message}
            >
              <Input
                id="priceDisplay"
                placeholder="e.g. $49 one-time, $19/mo"
                {...register("priceDisplay")}
              />
            </FormField>
          </FormSection>

          {/* Section: Product Details */}
          <FormSection icon={Sparkles} title="Product Details">
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
          </FormSection>

          {/* Section: Media */}
          <FormSection icon={ImageIcon} title="Media">
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
          </FormSection>

        </div>
        </div>
        {/* Actions — pinned at bottom, never scrolls */}
        <div className="shrink-0 border-t bg-white px-6 py-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={generating}
              onClick={handleSubmit(handleGeneratePreview)}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Preview"
              )}
            </Button>

            <Button
              type="button"
              className="flex-1"
              disabled={submitting || !generatedHtml}
              onClick={handleSubmit(handleFormSubmit)}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {submitLoadingLabel}
                </>
              ) : (
                submitLabel
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!generatedHtml}
              onClick={() => {
                const filename = title
                  ? title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()
                  : "sales-page";
                exportHtmlAsFile(generatedHtml!, filename);
              }}
              title="Export HTML"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Right Panel — Preview */}
      <main className="hidden flex-1 overflow-hidden bg-gray-100 lg:block">
        <div className="flex h-full flex-col items-center justify-center p-6">
          {/* Preview header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Monitor className="h-4 w-4" />
              Live Preview
              <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-normal text-gray-500">
                1920 × 1080
              </span>
            </div>
          </div>

          {/* Preview container */}
          <div ref={previewRef} className="w-full">
            {generatedHtml ? (
              <div
                className="mx-auto overflow-hidden rounded-xl border border-gray-200 bg-gray-800 shadow-2xl"
                style={{ width: PREVIEW_WIDTH * scale }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-2 bg-gray-800 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                    <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="ml-3 flex-1 rounded-md bg-gray-700 px-3 py-1">
                    <span className="text-xs text-gray-400">
                      yourpage.com
                    </span>
                  </div>
                </div>
                {/* Scaled 1920x1080 viewport */}
                <div
                  style={{
                    height: PREVIEW_HEIGHT * scale,
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      width: PREVIEW_WIDTH,
                      height: PREVIEW_HEIGHT,
                      transform: `scale(${scale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <iframe
                      srcDoc={generatedHtml}
                      style={{
                        width: PREVIEW_WIDTH,
                        height: PREVIEW_HEIGHT,
                        border: "none",
                      }}
                      title="Page Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="mx-auto flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white"
                style={{
                  width: PREVIEW_WIDTH * scale,
                  height: PREVIEW_HEIGHT * scale,
                }}
              >
                <div className="text-center">
                  <Monitor className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                  <p className="text-sm font-medium text-gray-400">
                    Fill in the form and generate a preview
                  </p>
                  <p className="mt-1 text-xs text-gray-300">
                    Your page will appear here at 1920 × 1080
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sectioned form layout ── */

function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
