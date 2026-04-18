import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/constants/prompts";
import { OFFER_TYPE_KEYWORDS } from "@/lib/constants/app";
import { GenerationError } from "@/lib/utils/errors";

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

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL!;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new GenerationError(
        `Gemini API returned ${response.status}: ${errorBody}`
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new GenerationError("Empty response from Gemini");
    }

    // Strip markdown code fences if present
    let html = content.trim();
    if (html.startsWith("```")) {
      html = html.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
    }

    return html;
  } catch (error) {
    if (error instanceof GenerationError) throw error;
    throw new GenerationError(
      error instanceof Error ? error.message : "Unknown generation error"
    );
  }
}
