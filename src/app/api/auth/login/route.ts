import { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations/auth.schema";
import { loginUser } from "@/lib/services/auth.service";
import { apiSuccess, apiError, apiValidationError } from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const { user } = await loginUser(parsed.data);

    return apiSuccess("Login successful", { user });
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Login failed", "UNKNOWN_ERROR", 500);
  }
}
