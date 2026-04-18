import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { getPageById } from "@/lib/services/page.service";
import { pageFormSchema } from "@/lib/validations/page.schema";
import { generateSalesCopy } from "@/lib/services/llm.service";
import { composeHtml } from "@/lib/services/html.service";
import {
  apiSuccess,
  apiError,
  apiValidationError,
} from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();

    // Verify ownership
    await getPageById(id, user.id);

    const body = await request.json();
    const parsed = pageFormSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const copy = await generateSalesCopy({
      title: parsed.data.title,
      description: parsed.data.description,
      targetAudience: parsed.data.targetAudience,
      priceDisplay: parsed.data.priceDisplay,
      keyFeatures: parsed.data.keyFeatures,
      uniqueSellingPoints: parsed.data.uniqueSellingPoints,
      hasImage: !!parsed.data.productImageUrl,
    });

    const html = composeHtml(copy, parsed.data.productImageUrl);

    return apiSuccess("Preview generated", { html });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Generation failed", "GENERATION_FAILED", 500);
  }
}
