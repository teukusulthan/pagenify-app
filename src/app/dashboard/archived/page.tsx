import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getArchivedPages } from "@/lib/services/page.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ArchivedPageList } from "@/components/dashboard/archived-page-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "@phosphor-icons/react/dist/ssr";

export default async function ArchivedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const pages = await getArchivedPages(user.id);

  const serializedPages = pages.map((p) => ({
    ...p,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader username={user.username} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" weight="bold" />
              Back
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Trash className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-bold">Trash Bin</h1>
          </div>
        </div>

        <ArchivedPageList pages={serializedPages} />
      </main>
    </div>
  );
}
