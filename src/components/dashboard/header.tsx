"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BellIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { userProfile } from "@/data/bookings";
import { img } from "@/lib/images";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const titles: { match: (p: string) => boolean; title: string; crumb: string }[] =
  [
    { match: (p) => p === "/dashboard", title: "Dashboard", crumb: "Overview" },
    {
      match: (p) => p.endsWith("/listings/new"),
      title: "New listing",
      crumb: "My listings / New",
    },
    {
      match: (p) => p.includes("/listings/") && p.endsWith("/edit"),
      title: "Edit listing",
      crumb: "My listings / Edit",
    },
    {
      match: (p) => p.startsWith("/dashboard/listings"),
      title: "My listings",
      crumb: "Manage",
    },
    {
      match: (p) => p.startsWith("/dashboard/bookings"),
      title: "My bookings",
      crumb: "Manage",
    },
    {
      match: (p) => p.startsWith("/dashboard/profile"),
      title: "Profile settings",
      crumb: "Account",
    },
  ];

/** Dashboard top bar: page title, sidebar toggle (mobile) and account menu. */
export const DashboardHeader = () => {
  const pathname = usePathname();
  const active = titles.find((t) => t.match(pathname)) ?? titles[0];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <SidebarTrigger className="shrink-0 lg:hidden" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">{active.crumb}</p>
        <h1 className="truncate font-heading text-base font-semibold tracking-[-0.01em]">
          {active.title}
        </h1>
      </div>

      <ThemeToggle />

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Notifications"
        onClick={() =>
          toast.add({
            type: "info",
            title: "You're all caught up",
            description: "No new notifications.",
          })
        }
      >
        <BellIcon />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label="Account menu"
              className="relative size-8 shrink-0 overflow-hidden rounded-full bg-muted outline-none ring-ring/50 transition-shadow focus-visible:ring-3"
            />
          }
        >
          <Image
            src={img(userProfile.avatar, "avatar")}
            alt=""
            fill
            sizes="32px"
            className="object-cover"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-medium">{userProfile.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {userProfile.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={<Link href="/dashboard/profile" />}
            className="gap-2"
          >
            <UserIcon className="size-4" />
            Profile settings
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href="/dashboard/listings" />}
            className="gap-2"
          >
            <SettingsIcon className="size-4" />
            Manage listings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2"
            onClick={() =>
              toast.add({
                type: "info",
                title: "Signed out",
                description: "This is a demo — you're still browsing.",
              })
            }
          >
            <LogOutIcon className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
