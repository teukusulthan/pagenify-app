import { prisma } from "@/lib/prisma";
import { generateSlug, generateUniqueSuffix } from "@/lib/utils/slugify";

export async function generateUniqueSlug(
  userId: string,
  title: string
): Promise<string> {
  let slug = generateSlug(title, generateUniqueSuffix());
  let attempts = 0;

  while (attempts < 10) {
    const existing = await prisma.page.findUnique({
      where: { userId_slug: { userId, slug } },
    });
    if (!existing) return slug;
    slug = generateSlug(title, generateUniqueSuffix());
    attempts++;
  }

  throw new Error("Failed to generate unique slug");
}
