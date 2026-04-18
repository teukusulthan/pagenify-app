export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  details: unknown;
}

export function successResponse<T>(
  message: string,
  data: T
): ApiResponse<T> {
  return { success: true, message, data, error: null };
}

export function errorResponse(
  message: string,
  code: string,
  details: unknown = null
): ApiResponse<null> {
  return {
    success: false,
    message,
    data: null,
    error: { code, details },
  };
}
