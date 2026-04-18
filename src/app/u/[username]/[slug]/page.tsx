import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicPageRenderer } from "@/components/sales-page/public-page-renderer";
import { sanitizeHtmlContent } from "@/lib/services/html.service";

interface PublicPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { username, slug } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    notFound();
  }

  const page = await prisma.page.findUnique({
    where: {
      userId_slug: { userId: user.id, slug },
    },
  });

  if (!page || page.status !== "ACTIVE") {
    notFound();
  }

  const safeHtml = sanitizeHtmlContent(page.generatedHtml);

  return <PublicPageRenderer html={safeHtml} />;
}
