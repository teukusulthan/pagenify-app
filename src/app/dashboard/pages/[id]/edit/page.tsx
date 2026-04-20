import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getPageById } from "@/lib/services/page.service";
import { EditPageClient } from "./edit-client";
import type { PageItem } from "@/types/page";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: EditPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let page: PageItem;

  try {
    const raw = await getPageById(id, user.id);
    page = {
      ...raw,
      status: raw.status as PageItem["status"],
      targetAudience: raw.targetAudience as unknown as string[],
      priceDisplay: raw.priceDisplay as unknown as string[],
      keyFeatures: raw.keyFeatures as unknown as string[],
      uniqueSellingPoints: raw.uniqueSellingPoints as unknown as string[],
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    };
  } catch {
    notFound();
  }

  return <EditPageClient page={page} />;
}
