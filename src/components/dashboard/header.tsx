
"use client";

import { usePathname } from "next/navigation";
import { BellIcon } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

const titles: {
  match: (p: string) => boolean;
  title: string;
  crumb: string;
}[] = [
  {
    match: (p) => p === "/dashboard",
    title: "Dashboard",
    crumb: "Overview",
  },
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

export const DashboardHeader = () => {
  const pathname = usePathname();
  const active = titles.find((t) => t.match(pathname)) ?? titles[0];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <SidebarTrigger className="shrink-0 lg:hidden" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">
          {active.crumb}
        </p>

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
    </header>
  );
};
