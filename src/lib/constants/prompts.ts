export const SYSTEM_PROMPT = `You are an expert direct-response copywriter and landing page strategist.

Your job is to generate structured sales page copy for a product, digital product, service, or commercial offer.

Important rules:
1. Return STRICT JSON only.
2. Do not return markdown.
3. Do not return HTML.
4. Do not wrap the JSON in code fences.
5. Do not include explanations outside the JSON.
6. Write persuasive, clear, concise copy.
7. Do not invent fake claims that are impossible to support.
8. Do not invent real testimonials. Use safe placeholder-style social proof text when needed.
9. Keep the output aligned with this JSON structure exactly.

Required JSON structure:
{
  "headline": "string",
  "subheadline": "string",
  "descriptionParagraphs": ["string", "string"],
  "benefits": ["string", "string", "string"],
  "featuresBreakdown": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "pricingText": "string",
  "ctaText": "string",
  "socialProofTitle": "string",
  "socialProofBody": "string",
  "faqPlaceholderTitle": "string",
  "faqPlaceholderBody": "string"
}

The content must be suitable for a modern sales page.`;

export function buildUserPrompt(input: {
  offerType: string;
  title: string;
  description: string;
  targetAudience: string;
  priceDisplay: string;
  keyFeatures: string[];
  uniqueSellingPoints: string[];
  hasImage: boolean;
}): string {
  return `Generate structured sales page copy for the following offer.

Offer type:
${input.offerType}

Title:
${input.title}

Description:
${input.description}

Target audience:
${input.targetAudience}

Price display:
${input.priceDisplay}

Key features:
${input.keyFeatures.join("\n")}

Unique selling points:
${input.uniqueSellingPoints.join("\n")}

Product image exists:
${input.hasImage ? "yes" : "no"}

Additional instructions:
- The audience should immediately understand what the offer is.
- The headline should be specific and compelling.
- The subheadline should reinforce value clearly.
- Benefits should focus on user outcomes, not just raw features.
- Features breakdown should explain what is included.
- Pricing text should make the offer feel understandable and clear.
- CTA text should be short and action-oriented.
- Social proof content must be safe placeholder copy, not fabricated testimonials.
- FAQ placeholder content should be generic and ready for future customization.

Return strict JSON only.`;
}
