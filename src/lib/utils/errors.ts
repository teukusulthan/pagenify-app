export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details: unknown = null
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super("Validation failed", "VALIDATION_ERROR", 422, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
  }
}

export class GenerationError extends AppError {
  constructor(message = "Generation failed") {
    super(message, "GENERATION_FAILED", 500);
  }
}

export class UploadError extends AppError {
  constructor(message = "Upload failed") {
    super(message, "UPLOAD_FAILED", 500);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database error") {
    super(message, "DATABASE_ERROR", 500);
  }
}
