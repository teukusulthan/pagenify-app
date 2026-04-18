import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ArchivedPageList } from "@/components/dashboard/archived-page-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ArchivedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const pages = await prisma.page.findMany({
    where: { userId: user.id, status: "ARCHIVED" },
    orderBy: { updatedAt: "desc" },
  });

  const serializedPages = pages.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader username={user.username} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Archived Pages</h1>
        </div>
        <ArchivedPageList pages={serializedPages} />
      </main>
    </div>
  );
}
