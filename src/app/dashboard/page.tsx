import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getActivePages } from "@/lib/services/page.service";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PageList } from "@/components/dashboard/page-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { PageListItem } from "@/types/page";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const pages = await getActivePages(user.id);

  const serializedPages = pages.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  })) as PageListItem[];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader username={user.username} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Your Pages</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {serializedPages.length === 0
                ? "No pages yet"
                : `${serializedPages.length} active ${serializedPages.length === 1 ? "page" : "pages"}`}
            </p>
          </div>
          {serializedPages.length > 0 && (
            <Link href="/dashboard/pages/new">
              <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
                <Plus className="h-3.5 w-3.5" weight="bold" />
                New Page
              </Button>
            </Link>
          )}
        </div>
        <PageList pages={serializedPages} username={user.username} />
      </main>
    </div>
  );
}
