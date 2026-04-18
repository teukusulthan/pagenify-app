import { create } from "zustand";

interface PreviewState {
  generatedHtml: string | null;
  setGeneratedHtml: (html: string | null) => void;
  clearPreview: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  generatedHtml: null,
  setGeneratedHtml: (html) => set({ generatedHtml: html }),
  clearPreview: () => set({ generatedHtml: null }),
}));
