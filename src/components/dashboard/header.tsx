"use client";

import { usePathname } from "next/navigation";
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";

export const DashboardHeader = () => {
  const pathname = usePathname();
  let title = "Dashboard";
  let crumb = "Overview";

  if (pathname === "/dashboard") {
    title = "Dashboard";
    crumb = "Overview";
  } else if (pathname.endsWith("/listings/new")) {
    title = "New listing";
    crumb = "My listings / New";
  } else if (pathname.includes("/listings/") && pathname.endsWith("/edit")) {
    title = "Edit listing";
    crumb = "My listings / Edit";
  } else if (pathname.startsWith("/dashboard/my-listings")) {
    title = "My listings";
    crumb = "Manage";
  } else if (pathname.startsWith("/dashboard/my-bookings")) {
    title = "My bookings";
    crumb = "Manage";
  } else if (pathname.startsWith("/dashboard/profile")) {
    title = "Profile settings";
    crumb = "Account";
  }

  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.add({
        type: "success",
        title: "Logged out successfully",
      });
    } catch {
      toast.add({
        type: "warning",
        title: "Logout failed",
        description: "Please try again.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">
          {crumb}
        </p>
        <h1 className="truncate font-heading text-base font-semibold tracking-[-0.01em]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-1"
                aria-label="Open profile menu"
              >
                <UserAvatar image={user.image} name={user.name} size="default" className="border border-border" />

                <ChevronDownIcon
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-muted"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup className="p-1.5">
                  <DropdownMenuLabel>
                    <p className="font-medium">{user.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="p-1"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  <ArrowUpRightIcon className="mr-2 h-4 w-4" />
                  Back to Site
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-1"
                  onClick={() => {
                    window.location.href = "/dashboard/my-listings";
                  }}
                >
                  My Listings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-1"
                  onClick={() => {
                    window.location.href = "/dashboard/my-bookings";
                  }}
                >
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-1"
                  onClick={() => {
                    window.location.href = "/dashboard/profile";
                  }}
                >
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="p-1"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </div>
    </header>
  );
};
