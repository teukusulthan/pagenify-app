import { z } from "zod";
import { UPLOAD_CONFIG } from "@/lib/constants/app";

export const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= UPLOAD_CONFIG.maxFileSize,
      "File size must be less than 4MB"
    )
    .refine(
      (file) =>
        UPLOAD_CONFIG.acceptedMimeTypes.includes(
          file.type as (typeof UPLOAD_CONFIG.acceptedMimeTypes)[number]
        ),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});
