import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PublicPageRenderer } from "@/components/sales-page/public-page-renderer";
import { stripPreHeroContent } from "@/lib/services/html.service";

export const revalidate = 60;
export const dynamicParams = true;

interface PublicPageProps {
  params: Promise<{ username: string; slug: string }>;
}

const getPublicPageData = cache(async (username: string, slug: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!user) return null;

  return prisma.page.findUnique({
    where: { userId_slug: { userId: user.id, slug } },
    select: {
      title: true,
      description: true,
      generatedHtml: true,
      status: true,
    },
  });
});

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const page = await getPublicPageData(username, slug);

  if (!page || page.status !== "ACTIVE") return {};

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { username, slug } = await params;
  const page = await getPublicPageData(username, slug);

  if (!page || page.status !== "ACTIVE") {
    notFound();
  }

  const cleanHtml = stripPreHeroContent(page.generatedHtml);

  return <PublicPageRenderer html={cleanHtml} />;
}
