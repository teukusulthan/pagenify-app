export const APP_NAME = "Pagenify";

export const COOKIE_NAME = "pagenify_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export const UPLOAD_CONFIG = {
  maxFileSize: 4 * 1024 * 1024, // 4MB
  acceptedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  acceptedExtensions: ["jpg", "jpeg", "png", "webp"],
};

export const OFFER_TYPE_KEYWORDS = {
  digital_product: ["course", "ebook", "template", "download"],
  service: ["service", "consulting", "agency", "coaching"],
} as const;
