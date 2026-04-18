import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { archivePage } from "@/lib/services/page.service";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    const page = await archivePage(id, user.id);
    return apiSuccess("Page archived", { page });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Failed to archive page", "UNKNOWN_ERROR", 500);
  }
}
