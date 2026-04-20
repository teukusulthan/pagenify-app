export type ModelTier = "fast" | "medium" | "think";

export interface ModelOption {
  id: ModelTier;
  label: string;
  description: string;
  estimate: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "fast",
    label: "Fast",
    description: "Gemini · Quick output, great for drafts",
    estimate: "~30 sec",
  },
  {
    id: "medium",
    label: "Medium",
    description: "OpenRouter · Balanced quality, no reasoning",
    estimate: "~2 min",
  },
  {
    id: "think",
    label: "Think",
    description: "OpenRouter · Deep reasoning, best output",
    estimate: "~4 min",
  },
];
