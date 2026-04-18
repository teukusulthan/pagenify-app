import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/types/api";

export function apiSuccess<T>(message: string, data: T, status = 200) {
  return NextResponse.json(successResponse(message, data), { status });
}

export function apiError(
  message: string,
  code: string,
  status = 500,
  details: unknown = null
) {
  return NextResponse.json(errorResponse(message, code, details), { status });
}

export function apiValidationError(details: unknown) {
  return apiError("Validation failed", "VALIDATION_ERROR", 422, details);
}

export function apiUnauthorized(message = "Unauthorized") {
  return apiError(message, "UNAUTHORIZED", 401);
}

export function apiForbidden(message = "Forbidden") {
  return apiError(message, "FORBIDDEN", 403);
}

export function apiNotFound(message = "Not found") {
  return apiError(message, "NOT_FOUND", 404);
}

export function apiConflict(message: string) {
  return apiError(message, "CONFLICT", 409);
}
