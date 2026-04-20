"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignOut, Trash, Plus, Sparkle } from "@phosphor-icons/react/dist/ssr";
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
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15">
            <Sparkle className="h-3.5 w-3.5 text-primary" weight="fill" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Pagenify</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/dashboard/archived">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Trash className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Trash</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>View deleted pages</TooltipContent>
          </Tooltip>

          <Link href="/dashboard/pages/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" weight="bold" />
              <span className="hidden sm:inline">New Page</span>
              <span className="sm:hidden">New</span>
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
                <span className="hidden sm:inline text-sm">{username}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{username}</p>
                    <p className="text-xs text-muted-foreground">Free plan</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>
                <SignOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
