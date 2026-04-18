"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, FileText, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function DashboardHeader({ username }: { username: string }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        toast.success("Logged out");
        router.push("/login");
        router.refresh();
      }
    } catch {
      toast.error("Logout failed");
    }
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/dashboard" className="text-xl font-bold">
          Pagenify
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/dashboard/archived">
            <Button variant="ghost" size="sm">
              <Archive className="mr-2 h-4 w-4" />
              Archived
            </Button>
          </Link>
          <Link href="/dashboard/pages/new">
            <Button size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          </Link>

          <Separator orientation="vertical" className="h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm">
                  {username}
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
