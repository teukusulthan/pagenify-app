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

const MAX_RETRIES = 3;
const RETRY_DELAYS = [3000, 6000, 10000]; // ms

async function callGlmApi(userPrompt: string): Promise<Response> {
  return fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
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
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    let response: Response;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      response = await callGlmApi(userPrompt);

      if (response.status === 429) {
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAYS[attempt]);
          continue;
        }
        throw new GenerationError(
          "Rate limited by GLM API — all retries exhausted. Please wait and try again."
        );
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new GenerationError(
          `GLM API returned ${response.status}: ${errorBody}`
        );
      }

      // Success path
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new GenerationError("Empty response from GLM");
      }

      let jsonStr = content.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "");
      }

      const parsed = JSON.parse(jsonStr);
      const validated = llmResponseSchema.safeParse(parsed);

      if (!validated.success) {
        throw new GenerationError("Invalid AI response structure");
      }

      return validated.data;
    }

    throw new GenerationError("Failed after maximum retries");
  } catch (error) {
    if (error instanceof GenerationError) throw error;
    throw new GenerationError(
      error instanceof Error ? error.message : "Unknown generation error"
    );
  }
}
