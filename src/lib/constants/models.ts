export type ModelTier = "fast" | "medium" | "think";

export interface ModelOption {
  id: ModelTier;
  label: string;
  description: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "fast",
    label: "Fast",
    description: "deepseek-v3 · Quick output, great for drafts",
  },
  {
    id: "medium",
    label: "Medium",
    description: "OpenRouter · Balanced quality, no reasoning",
  },
  {
    id: "think",
    label: "Think",
    description: "OpenRouter · Deep reasoning, best output",
  },
];
