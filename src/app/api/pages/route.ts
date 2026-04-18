import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import {
  getActivePages,
  createPage,
} from "@/lib/services/page.service";
import { createPageSchema, pageFormSchema } from "@/lib/validations/page.schema";
import {
  apiSuccess,
  apiError,
  apiValidationError,
  apiUnauthorized,
} from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";

// GET /api/pages — active pages
export async function GET() {
  try {
    const user = await requireAuth();
    const pages = await getActivePages(user.id);
    return apiSuccess("Active pages", { pages });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Failed to fetch pages", "UNKNOWN_ERROR", 500);
  }
}

// POST /api/pages — create page
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = createPageSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const page = await createPage(user.id, parsed.data);
    return apiSuccess("Page created", { page }, 201);
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Failed to create page", "UNKNOWN_ERROR", 500);
  }
}
