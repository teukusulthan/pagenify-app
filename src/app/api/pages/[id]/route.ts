import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { getPageById, updatePage } from "@/lib/services/page.service";
import { updatePageSchema } from "@/lib/validations/page.schema";
import {
  apiSuccess,
  apiError,
  apiValidationError,
} from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";

// GET /api/pages/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    const page = await getPageById(id, user.id);
    return apiSuccess("Page found", { page });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Failed to fetch page", "UNKNOWN_ERROR", 500);
  }
}

// PATCH /api/pages/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    const body = await request.json();
    const parsed = updatePageSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const page = await updatePage(id, user.id, parsed.data);
    return apiSuccess("Page updated", { page });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Failed to update page", "UNKNOWN_ERROR", 500);
  }
}
