"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          Pagenify
        </Link>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/dashboard/archived">
                <Button variant="ghost" size="sm">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Trash Bin
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>View deleted pages</TooltipContent>
          </Tooltip>

          <Link href="/dashboard/pages/new">
            <Button size="sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create Page
            </Button>
          </Link>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 px-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary/15 text-[10px] font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{username}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{username}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

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
