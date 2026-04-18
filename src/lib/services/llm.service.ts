import OpenAI from "openai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/constants/prompts";
import { OFFER_TYPE_KEYWORDS } from "@/lib/constants/app";
import { GenerationError } from "@/lib/utils/errors";

const client = new OpenAI({
  apiKey: process.env.ZAI_API_KEY,
  baseURL: "https://api.z.ai/api/paas/v4/",
});

function inferOfferType(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  for (const keyword of OFFER_TYPE_KEYWORDS.digital_product) {
    if (text.includes(keyword)) return "digital_product";
  }

  for (const keyword of OFFER_TYPE_KEYWORDS.service) {
    if (text.includes(keyword)) return "service";
  }

  return "general";
}

export async function generateSalesHtml(input: {
  title: string;
  description: string;
  targetAudience: string;
  priceDisplay: string;
  keyFeatures: string[];
  uniqueSellingPoints: string[];
  productImageUrl: string | null;
}): Promise<string> {
  const offerType = inferOfferType(input.title, input.description);

  const userPrompt = buildUserPrompt({
    offerType,
    title: input.title,
    description: input.description,
    targetAudience: input.targetAudience,
    priceDisplay: input.priceDisplay,
    keyFeatures: input.keyFeatures,
    uniqueSellingPoints: input.uniqueSellingPoints,
    productImageUrl: input.productImageUrl,
  });

  try {
    const completion = await client.chat.completions.create({
      model: process.env.ZAI_GLM_MODEL!,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new GenerationError("Empty response from GLM");
    }

    // Strip markdown code fences if present
    let html = content.trim();
    if (html.startsWith("```")) {
      html = html.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
    }

    return html;
  } catch (error) {
    if (error instanceof GenerationError) throw error;

    const message =
      error instanceof Error ? error.message : "Unknown generation error";
    throw new GenerationError(message);
  }
}
