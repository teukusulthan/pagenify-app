"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FileText,
  Users,
  Sparkle,
  Image as ImageIcon,
  CircleNotch,
  Monitor,
  DownloadSimple,
  Lightning,
  Gauge,
  Lightbulb,
  ArrowSquareOut,
} from "@phosphor-icons/react/dist/ssr";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  pageFormSchema,
  type PageFormInput,
} from "@/lib/validations/page.schema";
import { MODEL_OPTIONS, type ModelTier } from "@/lib/constants/models";
import { cn } from "@/lib/utils";
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

const SPINNER_VERBS = [
  "Accomplishing","Actioning","Actualizing","Architecting","Baking","Beaming",
  "Beboppin'","Befuddling","Billowing","Blanching","Bloviating","Boogieing",
  "Boondoggling","Booping","Bootstrapping","Brewing","Bunning","Burrowing",
  "Calculating","Canoodling","Caramelizing","Cascading","Catapulting","Cerebrating",
  "Channeling","Channelling","Choreographing","Churning","Clauding","Coalescing",
  "Cogitating","Combobulating","Composing","Computing","Concocting","Considering",
  "Contemplating","Cooking","Crafting","Creating","Crunching","Crystallizing",
  "Cultivating","Deciphering","Deliberating","Determining","Dilly-dallying",
  "Discombobulating","Doing","Doodling","Drizzling","Ebbing","Effecting",
  "Elucidating","Embellishing","Enchanting","Envisioning","Evaporating","Fermenting",
  "Fiddle-faddling","Finagling","Flambéing","Flibbertigibbeting","Flowing",
  "Flummoxing","Fluttering","Forging","Forming","Frolicking","Frosting",
  "Gallivanting","Galloping","Garnishing","Generating","Gesticulating","Germinating",
  "Gitifying","Grooving","Gusting","Harmonizing","Hashing","Hatching","Herding",
  "Honking","Hullaballooing","Hyperspacing","Ideating","Imagining","Improvising",
  "Incubating","Inferring","Infusing","Ionizing","Jitterbugging","Julienning",
  "Kneading","Leavening","Levitating","Lollygagging","Manifesting","Marinating",
  "Meandering","Metamorphosing","Misting","Moonwalking","Moseying","Mulling",
  "Mustering","Musing","Nebulizing","Nesting","Newspapering","Noodling","Nucleating",
  "Orbiting","Orchestrating","Osmosing","Perambulating","Percolating","Perusing",
  "Philosophising","Photosynthesizing","Pollinating","Pondering","Pontificating",
  "Pouncing","Precipitating","Prestidigitating","Processing","Proofing","Propagating",
  "Puttering","Puzzling","Quantumizing","Razzle-dazzling","Razzmatazzing",
  "Recombobulating","Reticulating","Roosting","Ruminating","Sautéing","Scampering",
  "Schlepping","Scurrying","Seasoning","Shenaniganing","Shimmying","Simmering",
  "Skedaddling","Sketching","Slithering","Smooshing","Sock-hopping","Spelunking",
  "Spinning","Sprouting","Stewing","Sublimating","Swirling","Swooping","Symbioting",
  "Synthesizing","Tempering","Thinking","Thundering","Tinkering","Tomfoolering",
  "Topsy-turvying","Transfiguring","Transmuting","Twisting","Undulating","Unfurling",
  "Unravelling","Vibing","Waddling","Wandering","Warping","Whatchamacalliting",
  "Whirlpooling","Whirring","Whisking","Wibbling","Working","Wrangling","Zesting",
  "Zigzagging",
];

interface PageBuilderFormProps {
  initialData?: Partial<PageItem>;
  onSubmit: (data: PageFormInput & { generatedHtml: string }) => Promise<void>;
  submitLabel: string;
  submitLoadingLabel: string;
  headerTitle: string;
}

const SparkleIcon = Sparkle;
const Sparkles = Sparkle;

export function PageBuilderForm({
  initialData,
  onSubmit,
  submitLabel,
  submitLoadingLabel,
  headerTitle,
}: PageBuilderFormProps) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modelTier, setModelTier] = useState<ModelTier>("medium");
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [verbIndex, setVerbIndex] = useState(0);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const { generatedHtml, setGeneratedHtml } = usePreviewStore();
  const initialHtmlRef = useRef<string | null>(generatedHtml);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    if (!generating) return;
    setVerbIndex(Math.floor(Math.random() * SPINNER_VERBS.length));
    const id = setInterval(() => {
      setVerbIndex((i) => (i + 1) % SPINNER_VERBS.length);
    }, 2000);
    return () => clearInterval(id);
  }, [generating]);

  const computeScale = useCallback(() => {
    if (previewRef.current) {
      const width = previewRef.current.offsetWidth;
      setScale((width / PREVIEW_WIDTH) * 0.88);
    }
  }, []);

  useEffect(() => {
    computeScale();
    const observer = new ResizeObserver(computeScale);

    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    return () => observer.disconnect();
  }, [computeScale]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<PageFormInput>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      targetAudience: initialData?.targetAudience ?? [],
      priceDisplay: initialData?.priceDisplay ?? [],
      keyFeatures: initialData?.keyFeatures ?? [],
      uniqueSellingPoints: initialData?.uniqueSellingPoints ?? [],
      productImageUrl: initialData?.productImageUrl ?? null,
    },
  });

  const title = watch("title");

  const hasUnsavedChanges = isDirty || generatedHtml !== initialHtmlRef.current;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  async function handleGeneratePreview(data: PageFormInput) {
    setGenerating(true);

    try {
      const endpoint = initialData?.id
        ? `/api/pages/${initialData.id}/preview`
        : "/api/pages/preview";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, modelTier }),
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

  const filename = title
    ? title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()
    : "sales-page";

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-30 shrink-0 border-b bg-background/95 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <button
                  type="button"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => {
                    if (hasUnsavedChanges) {
                      setShowLeaveDialog(true);
                    } else {
                      router.push("/dashboard");
                    }
                  }}
                >
                  Pagenify
                </button>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{headerTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={!generatedHtml || generating}
                  onClick={() => {
                    const blob = new Blob([generatedHtml!], { type: "text/html" });
                    const url = URL.createObjectURL(blob);
                    window.open(url, "_blank");
                  }}
                >
                  <ArrowSquareOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Full Preview</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open full preview in new tab</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={!generatedHtml || generating}
                  onClick={() => {
                    exportHtmlAsFile(generatedHtml!, filename);
                  }}
                >
                  <DownloadSimple className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export HTML</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download as .html file</TooltipContent>
            </Tooltip>

            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              disabled={submitting || generating || !generatedHtml}
              onClick={handleSubmit(handleFormSubmit)}
            >
              {submitting ? (
                <>
                  <CircleNotch className="h-3.5 w-3.5 animate-spin" />
                  {submitLoadingLabel}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex shrink-0 border-b bg-background lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("form")}
          className={cn(
            "flex-1 py-2.5 text-xs font-medium transition-colors",
            mobileTab === "form"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Form
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={cn(
            "flex-1 py-2.5 text-xs font-medium transition-colors",
            mobileTab === "preview"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Preview
        </button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className={cn(
          "flex w-full shrink-0 flex-col border-r bg-card lg:w-[530px]",
          mobileTab === "preview" && "hidden lg:flex"
        )}>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-4 p-6">
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

              <FormSection icon={Users} title="Target Market">
                <Controller
                  name="targetAudience"
                  control={control}
                  render={({ field }) => (
                    <MultiInputField
                      label="Target Audience"
                      values={field.value}
                      onChange={field.onChange}
                      error={errors.targetAudience?.message}
                      placeholder="e.g. Small business owners"
                    />
                  )}
                />

                <Controller
                  name="priceDisplay"
                  control={control}
                  render={({ field }) => (
                    <MultiInputField
                      label="Price Display"
                      values={field.value}
                      onChange={field.onChange}
                      error={errors.priceDisplay?.message}
                      placeholder="e.g. $49 one-time"
                    />
                  )}
                />
              </FormSection>

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

          <div className="shrink-0 border-t bg-card px-6 py-4 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">AI Model</span>
                <span className="text-xs text-muted-foreground/60">
                  Est. {MODEL_OPTIONS.find((m) => m.id === modelTier)?.estimate}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 rounded-lg border bg-muted/50 p-1">
                {MODEL_OPTIONS.map(({ id, label, estimate }) => {
                  const Icon = id === "fast" ? Lightning : id === "think" ? Lightbulb : Gauge;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setModelTier(id)}
                      className={cn(
                        "flex flex-col items-center gap-0.5 rounded-md px-2 py-2 text-xs font-medium transition-all",
                        modelTier === id
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {label}
                      </div>
                      <span className={cn(
                        "text-[10px] font-normal",
                        modelTier === id ? "text-muted-foreground" : "text-muted-foreground/50"
                      )}>
                        {estimate}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {MODEL_OPTIONS.find((m) => m.id === modelTier)?.description}
              </p>
            </div>
            <Button
              type="button"
              className="w-full gap-2"
              disabled={generating}
              onClick={handleSubmit(handleGeneratePreview)}
            >
              {generating ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" />
                  {SPINNER_VERBS[verbIndex]}...
                </>
              ) : generatedHtml ? (
                <>
                  <SparkleIcon className="h-4 w-4" />
                  Regenerate Preview
                </>
              ) : (
                <>
                  <SparkleIcon className="h-4 w-4" />
                  Generate Preview
                </>
              )}
            </Button>
          </div>
        </aside>

        <main className={cn(
          "flex-1 overflow-hidden bg-muted/30",
          mobileTab === "form" ? "hidden lg:block" : "block"
        )}>
          <div className="flex h-full flex-col items-center justify-center p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Monitor className="h-4 w-4" />
                Live Preview
                <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-normal text-muted-foreground">
                  1920 × 1080
                </span>
                {generating && (
                  <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-normal text-primary">
                    <CircleNotch className="h-3 w-3 animate-spin" />
                    {SPINNER_VERBS[verbIndex]}...
                  </span>
                )}
              </div>
            </div>

            <div ref={previewRef} className="w-full">
              {generating ? (
                <PreviewSkeleton scale={scale} />
              ) : generatedHtml ? (
                <div
                  className="mx-auto overflow-hidden rounded-xl border border-border bg-zinc-900 shadow-2xl"
                  style={{ width: PREVIEW_WIDTH * scale }}
                >
                  <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                      <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                      <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="ml-3 flex-1 rounded-md bg-zinc-800 px-3 py-1">
                      <span className="text-xs text-zinc-500">
                        yourpage.com
                      </span>
                    </div>
                  </div>

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
                  className="mx-auto flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-card"
                  style={{
                    width: PREVIEW_WIDTH * scale,
                    height: PREVIEW_HEIGHT * scale,
                  }}
                >
                  <div className="text-center">
                    <Monitor className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Fill in the form and generate a preview
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      Your page will appear here at 1920 × 1080
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. If you leave now, your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/dashboard")}>
              Leave anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PreviewSkeleton({ scale }: { scale: number }) {
  return (
    <div
      className="mx-auto overflow-hidden rounded-xl border border-border bg-zinc-900 shadow-2xl"
      style={{ width: PREVIEW_WIDTH * scale }}
    >
      <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="h-3 w-3 rounded-full bg-zinc-700" />
        </div>
        <div className="ml-3 h-6 flex-1 rounded-md bg-zinc-800" />
      </div>

      <div
        className="bg-white"
        style={{
          height: PREVIEW_HEIGHT * scale,
          overflow: "hidden",
        }}
      >
        <div
          className="animate-pulse bg-white"
          style={{
            width: PREVIEW_WIDTH,
            height: PREVIEW_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div className="space-y-10 p-16">
            <div className="space-y-5">
              <div className="h-12 w-40 rounded-md bg-zinc-200" />
              <div className="h-20 w-3/5 rounded-xl bg-zinc-200" />
              <div className="h-6 w-4/5 rounded-md bg-zinc-100" />
              <div className="h-6 w-2/3 rounded-md bg-zinc-100" />
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-36 rounded-lg bg-zinc-200" />
                <div className="h-12 w-36 rounded-lg bg-zinc-100" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-8 w-48 rounded-md bg-zinc-200" />
                <div className="h-5 w-full rounded-md bg-zinc-100" />
                <div className="h-5 w-11/12 rounded-md bg-zinc-100" />
                <div className="h-5 w-3/4 rounded-md bg-zinc-100" />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="h-28 rounded-xl bg-zinc-100" />
                  <div className="h-28 rounded-xl bg-zinc-100" />
                </div>
              </div>

              <div className="h-[320px] rounded-2xl bg-zinc-200" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="h-36 rounded-2xl bg-zinc-100" />
              <div className="h-36 rounded-2xl bg-zinc-100" />
              <div className="h-36 rounded-2xl bg-zinc-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="rounded-xl border border-border bg-muted/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
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
        <Label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
