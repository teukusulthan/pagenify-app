import { z } from "zod";

export const llmResponseSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  descriptionParagraphs: z.array(z.string()),
  benefits: z.array(z.string()),
  featuresBreakdown: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
  pricingText: z.string(),
  ctaText: z.string(),
  socialProofTitle: z.string(),
  socialProofBody: z.string(),
  faqPlaceholderTitle: z.string(),
  faqPlaceholderBody: z.string(),
});

export type LlmResponse = z.infer<typeof llmResponseSchema>;
