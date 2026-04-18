import slugify from "slugify";

export function generateSlug(title: string, uniqueSuffix: string): string {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  return `${base}-${uniqueSuffix}`;
}

export function generateUniqueSuffix(): string {
  return Math.random().toString(36).substring(2, 6);
}
