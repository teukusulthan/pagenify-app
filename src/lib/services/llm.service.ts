import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/constants/prompts";
import { llmResponseSchema } from "@/lib/validations/llm.schema";
import { OFFER_TYPE_KEYWORDS } from "@/lib/constants/app";
import { GenerationError } from "@/lib/utils/errors";
import type { LlmGenerateInput, LlmStructuredOutput } from "@/types/llm";

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

export async function generateSalesCopy(
  input: LlmGenerateInput
): Promise<LlmStructuredOutput> {
  const offerType = inferOfferType(input.title, input.description);

  const userPrompt = buildUserPrompt({
    offerType,
    title: input.title,
    description: input.description,
    targetAudience: input.targetAudience,
    priceDisplay: input.priceDisplay,
    keyFeatures: input.keyFeatures,
    uniqueSellingPoints: input.uniqueSellingPoints,
    hasImage: input.hasImage,
  });

  try {
    const response = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ZAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.ZAI_GLM_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 429) {
        throw new GenerationError(
          "Rate limited by GLM API — please wait a moment and try again"
        );
      }
      throw new GenerationError(
        `GLM API returned ${response.status}: ${errorBody}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new GenerationError("Empty response from GLM");
    }

    // Strip markdown code fences if present
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);
    const validated = llmResponseSchema.safeParse(parsed);

    if (!validated.success) {
      throw new GenerationError("Invalid AI response structure");
    }

    return validated.data;
  } catch (error) {
    if (error instanceof GenerationError) throw error;
    throw new GenerationError(
      error instanceof Error ? error.message : "Unknown generation error"
    );
  }
}
