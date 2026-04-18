import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PageList } from "@/components/dashboard/page-list";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const pages = await prisma.page.findMany({
    where: { userId: user.id, status: "ACTIVE" },
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
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-4 text-xl font-bold">Your Pages</h1>
        <PageList pages={serializedPages} username={user.username} />
      </main>
    </div>
  );
}
