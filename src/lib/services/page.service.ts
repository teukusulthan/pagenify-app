import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "./slug.service";
import { NotFoundError, ForbiddenError } from "@/lib/utils/errors";
import type {
  CreatePageInput,
  UpdatePageInput,
} from "@/lib/validations/page.schema";

export async function getActivePages(userId: string) {
  return prisma.page.findMany({
    where: { userId, status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getArchivedPages(userId: string) {
  return prisma.page.findMany({
    where: { userId, status: "ARCHIVED" },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPageById(id: string, userId: string) {
  const page = await prisma.page.findUnique({ where: { id } });

  if (!page) throw new NotFoundError("Page not found");
  if (page.userId !== userId) throw new ForbiddenError();

  return page;
}

export async function createPage(userId: string, input: CreatePageInput) {
  const slug = await generateUniqueSlug(userId, input.title);

  return prisma.page.create({
    data: {
      userId,
      slug,
      title: input.title,
      description: input.description,
      targetAudience: input.targetAudience,
      priceDisplay: input.priceDisplay,
      keyFeatures: input.keyFeatures,
      uniqueSellingPoints: input.uniqueSellingPoints,
      productImageUrl: input.productImageUrl ?? null,
      generatedHtml: input.generatedHtml,
    },
  });
}

export async function updatePage(
  id: string,
  userId: string,
  input: UpdatePageInput,
) {
  await getPageById(id, userId);

  return prisma.page.update({
    where: { id },
    data: input,
  });
}

export async function archivePage(id: string, userId: string) {
  const page = await getPageById(id, userId);

  if (page.status !== "ACTIVE") {
    throw new ForbiddenError("Page is not active");
  }

  return prisma.page.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
}

export async function recoverPage(id: string, userId: string) {
  const page = await getPageById(id, userId);

  if (page.status !== "ARCHIVED") {
    throw new ForbiddenError("Page is not in trash");
  }

  return prisma.page.update({
    where: { id },
    data: { status: "ACTIVE" },
  });
}
