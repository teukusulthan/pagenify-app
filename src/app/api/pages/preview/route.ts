import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { pageFormSchema } from "@/lib/validations/page.schema";
import { generateWithTier } from "@/lib/services/llm.service";
import { sanitizeHtmlContent } from "@/lib/services/html.service";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import {
  apiSuccess,
  apiError,
  apiValidationError,
} from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";
import type { ModelTier } from "@/lib/constants/models";

const VALID_TIERS: ModelTier[] = ["fast", "medium", "think"];

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!checkRateLimit(`preview:${user.id}`, 5, 60_000)) {
      return apiError("Too many requests. Please wait before generating again.", "RATE_LIMITED", 429);
    }

    const body = await request.json();
    const { modelTier, ...pageData } = body;
    const tier: ModelTier = VALID_TIERS.includes(modelTier) ? modelTier : "medium";

    const parsed = pageFormSchema.safeParse(pageData);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const html = await generateWithTier(
      {
        title: parsed.data.title,
        description: parsed.data.description,
        targetAudience: parsed.data.targetAudience,
        priceDisplay: parsed.data.priceDisplay,
        keyFeatures: parsed.data.keyFeatures,
        uniqueSellingPoints: parsed.data.uniqueSellingPoints,
        productImageUrl: parsed.data.productImageUrl ?? null,
      },
      tier,
    );

    const safeHtml = sanitizeHtmlContent(html);

    return apiSuccess("Preview generated", { html: safeHtml });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Generation failed", "GENERATION_FAILED", 500);
  }
}
