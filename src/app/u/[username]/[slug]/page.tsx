import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicPageRenderer } from "@/components/sales-page/public-page-renderer";
import sanitizeHtml from "sanitize-html";

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

  // Re-sanitize before render as an extra safety measure
  const safeHtml = sanitizeHtml(page.generatedHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "style"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "style"],
      a: ["href", "class"],
      section: ["class", "style"],
      div: ["class", "style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      p: ["style"],
      ul: ["style"],
      li: ["style"],
      span: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  return <PublicPageRenderer html={safeHtml} />;
}
