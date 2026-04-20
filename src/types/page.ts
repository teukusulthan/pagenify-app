export type PageStatus = "ACTIVE" | "ARCHIVED";

export interface PageFormData {
  title: string;
  description: string;
  targetAudience: string[];
  priceDisplay: string[];
  keyFeatures: string[];
  uniqueSellingPoints: string[];
  productImageUrl?: string | null;
}

export interface PageItem {
  id: string;
  slug: string;
  status: PageStatus;
  title: string;
  description: string;
  targetAudience: string[];
  priceDisplay: string[];
  keyFeatures: string[];
  uniqueSellingPoints: string[];
  productImageUrl: string | null;
  generatedHtml: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export type PageListItem = Pick<
  PageItem,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "generatedHtml"
  | "status"
  | "createdAt"
  | "updatedAt"
>;
