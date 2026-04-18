import { requireAuth } from "@/lib/auth/guards";
import { getArchivedPages } from "@/lib/services/page.service";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";

export async function GET() {
  try {
    const user = await requireAuth();
    const pages = await getArchivedPages(user.id);
    return apiSuccess("Archived pages", { pages });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Failed to fetch archived pages", "UNKNOWN_ERROR", 500);
  }
}
