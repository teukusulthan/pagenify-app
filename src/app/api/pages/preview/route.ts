import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { pageFormSchema } from "@/lib/validations/page.schema";
import { generateSalesHtml } from "@/lib/services/llm.service";
import { sanitizeHtmlContent } from "@/lib/services/html.service";
import {
  apiSuccess,
  apiError,
  apiValidationError,
} from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const parsed = pageFormSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const html = await generateSalesHtml({
      title: parsed.data.title,
      description: parsed.data.description,
      targetAudience: parsed.data.targetAudience,
      priceDisplay: parsed.data.priceDisplay,
      keyFeatures: parsed.data.keyFeatures,
      uniqueSellingPoints: parsed.data.uniqueSellingPoints,
      productImageUrl: parsed.data.productImageUrl ?? null,
    });

    const safeHtml = sanitizeHtmlContent(html);

    return apiSuccess("Preview generated", { html: safeHtml });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Generation failed", "GENERATION_FAILED", 500);
  }
}
