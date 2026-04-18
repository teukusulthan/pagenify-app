import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { uploadImage } from "@/lib/services/upload.service";
import { UPLOAD_CONFIG } from "@/lib/constants/app";
import {
  apiSuccess,
  apiError,
  apiUnauthorized,
} from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No file provided", "VALIDATION_ERROR", 422);
    }

    if (!UPLOAD_CONFIG.acceptedMimeTypes.includes(file.type as never)) {
      return apiError(
        "Only JPEG, PNG, and WebP images are allowed",
        "VALIDATION_ERROR",
        422
      );
    }

    if (file.size > UPLOAD_CONFIG.maxFileSize) {
      return apiError(
        "File size must be less than 4MB",
        "VALIDATION_ERROR",
        422
      );
    }

    const url = await uploadImage(file);

    return apiSuccess("Image uploaded", { url });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Upload failed", "UNKNOWN_ERROR", 500);
  }
}
