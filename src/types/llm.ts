export interface LlmStructuredOutput {
  headline: string;
  subheadline: string;
  descriptionParagraphs: string[];
  benefits: string[];
  featuresBreakdown: Array<{
    title: string;
    description: string;
  }>;
  pricingText: string;
  ctaText: string;
  socialProofTitle: string;
  socialProofBody: string;
  faqPlaceholderTitle: string;
  faqPlaceholderBody: string;
}

export interface LlmGenerateInput {
  title: string;
  description: string;
  targetAudience: string;
  priceDisplay: string;
  keyFeatures: string[];
  uniqueSellingPoints: string[];
  hasImage: boolean;
}
