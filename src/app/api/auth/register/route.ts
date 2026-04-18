import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validations/auth.schema";
import { registerUser } from "@/lib/services/auth.service";
import { apiSuccess, apiError, apiValidationError } from "@/lib/utils/api-response";
import { AppError } from "@/lib/utils/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten());
    }

    const { user } = await registerUser(parsed.data);

    return apiSuccess("Registration successful", { user }, 201);
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.statusCode);
    }
    return apiError("Registration failed", "UNKNOWN_ERROR", 500);
  }
}
