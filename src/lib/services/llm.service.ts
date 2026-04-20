// import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/constants/prompts";
// import { OFFER_TYPE_KEYWORDS } from "@/lib/constants/app";
// import { GenerationError } from "@/lib/utils/errors";

// function inferOfferType(title: string, description: string): string {
//   const text = `${title} ${description}`.toLowerCase();

//   for (const keyword of OFFER_TYPE_KEYWORDS.digital_product) {
//     if (text.includes(keyword)) return "digital_product";
//   }

//   for (const keyword of OFFER_TYPE_KEYWORDS.service) {
//     if (text.includes(keyword)) return "service";
//   }

//   return "general";
// }

// export async function generateSalesHtml(input: {
//   title: string;
//   description: string;
//   targetAudience: string;
//   priceDisplay: string;
//   keyFeatures: string[];
//   uniqueSellingPoints: string[];
//   productImageUrl: string | null;
// }): Promise<string> {
//   const offerType = inferOfferType(input.title, input.description);

//   const userPrompt = buildUserPrompt({
//     offerType,
//     title: input.title,
//     description: input.description,
//     targetAudience: input.targetAudience,
//     priceDisplay: input.priceDisplay,
//     keyFeatures: input.keyFeatures,
//     uniqueSellingPoints: input.uniqueSellingPoints,
//     productImageUrl: input.productImageUrl,
//   });

//   const apiKey = process.env.GEMINI_API_KEY;
//   const model = process.env.GEMINI_MODEL!;

//   const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         systemInstruction: {
//           parts: [{ text: SYSTEM_PROMPT }],
//         },
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: userPrompt }],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.7,
//         },
//       }),
//     });

//     if (!response.ok) {
//       const errorBody = await response.text();
//       throw new GenerationError(
//         `Gemini API returned ${response.status}: ${errorBody}`,
//       );
//     }

//     const data = await response.json();
//     const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!content) {
//       throw new GenerationError("Empty response from Gemini");
//     }

//     // Strip markdown code fences if present
//     let html = content.trim();
//     if (html.startsWith("```")) {
//       html = html.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
//     }

//     return html;
//   } catch (error) {
//     if (error instanceof GenerationError) throw error;
//     throw new GenerationError(
//       error instanceof Error ? error.message : "Unknown generation error",
//     );
//   }
// }

import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/constants/prompts";
import { OFFER_TYPE_KEYWORDS } from "@/lib/constants/app";
import { GenerationError } from "@/lib/utils/errors";
import type { ModelTier } from "@/lib/constants/models";

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

function normalizeMessageContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (
          part &&
          typeof part === "object" &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return part.text;
        }
        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

function stripCodeFences(value: string): string {
  let output = value.trim();

  if (output.startsWith("```")) {
    output = output.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
  }

  return output.trim();
}

export async function generateSalesHtmlWisgate(input: {
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

  const apiKey = process.env.WISGATE_API_KEY;
  const model = process.env.WISGATE_MODEL || "deepseek-v3";
  const baseUrl = process.env.WISGATE_BASE_URL || "https://wisgate.ai/v1";

  if (!apiKey) {
    throw new GenerationError("Missing WISGATE_API_KEY");
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new GenerationError(
        `Wisgate API returned ${response.status}: ${errorBody}`,
      );
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;
    const content = normalizeMessageContent(rawContent);

    if (!content) {
      throw new GenerationError("Empty response from Wisgate");
    }

    return stripCodeFences(content);
  } catch (error) {
    if (error instanceof GenerationError) throw error;
    throw new GenerationError(
      error instanceof Error ? error.message : "Unknown generation error",
    );
  }
}

export async function generateSalesHtml(
  input: {
    title: string;
    description: string;
    targetAudience: string;
    priceDisplay: string;
    keyFeatures: string[];
    uniqueSellingPoints: string[];
    productImageUrl: string | null;
  },
  options: { reasoning?: boolean } = { reasoning: true }
): Promise<string> {
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

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  const baseUrl =
    process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

  if (!apiKey) {
    throw new GenerationError("Missing OPENROUTER_API_KEY");
  }

  if (!model) {
    throw new GenerationError("Missing OPENROUTER_MODEL");
  }

  const url = `${baseUrl}/chat/completions`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(process.env.OPENROUTER_SITE_URL
          ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL }
          : {}),
        ...(process.env.OPENROUTER_APP_NAME
          ? { "X-Title": process.env.OPENROUTER_APP_NAME }
          : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        ...(options.reasoning !== false && { reasoning: { enabled: true } }),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new GenerationError(
        `OpenRouter API returned ${response.status}: ${errorBody}`,
      );
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;
    const content = normalizeMessageContent(rawContent);

    if (!content) {
      throw new GenerationError("Empty response from OpenRouter");
    }

    return stripCodeFences(content);
  } catch (error) {
    if (error instanceof GenerationError) {
      throw error;
    }

    throw new GenerationError(
      error instanceof Error ? error.message : "Unknown generation error",
    );
  }
}

type GenerateInput = {
  title: string;
  description: string;
  targetAudience: string;
  priceDisplay: string;
  keyFeatures: string[];
  uniqueSellingPoints: string[];
  productImageUrl: string | null;
};

export async function generateWithTier(
  input: GenerateInput,
  tier: ModelTier
): Promise<string> {
  if (tier === "fast") return generateSalesHtmlWisgate(input);
  if (tier === "think") return generateSalesHtml(input, { reasoning: true });
  return generateSalesHtml(input, { reasoning: false });
}
