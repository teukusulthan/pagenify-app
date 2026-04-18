import { z } from "zod";

export const pageFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),
  targetAudience: z.string().min(1, "Target audience is required"),
  priceDisplay: z
    .string()
    .max(50, "Price display must be at most 50 characters"),
  keyFeatures: z
    .array(z.string())
    .min(1, "At least one key feature is required"),
  uniqueSellingPoints: z
    .array(z.string())
    .min(1, "At least one unique selling point is required"),
  productImageUrl: z.string().url().nullable().optional(),
});

export type PageFormInput = z.infer<typeof pageFormSchema>;

export const createPageSchema = pageFormSchema.extend({
  generatedHtml: z.string().min(1, "Generated HTML is required"),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;

export const updatePageSchema = pageFormSchema.partial();

export type UpdatePageInput = z.infer<typeof updatePageSchema>;
