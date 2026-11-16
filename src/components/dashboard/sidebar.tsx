
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  UserRoundIcon,
} from "lucide-react";

import { cn } from "cn";
import { Logo } from "@/components/brand/logo";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


const groups = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboardIcon,
      },
    ],
  },
  {
    label: "Manage",
    items: [
      {
        label: "My listings",
        href: "/dashboard/my-listings",
        icon: LayoutGridIcon,
      },
      {
        label: "My bookings",
        href: "/dashboard/my-bookings",
        icon: CalendarDaysIcon,
      },
      {
        label: "Profile settings",
        href: "/dashboard/profile",
        icon: UserRoundIcon,
      },
    ],
  },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === "/dashboard") return pathname === "/dashboard";

  return pathname.startsWith(href);
};

/** Sidebar navigation for the host/creator dashboard. */
export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border px-4 py-4">
        <Logo size="sm" />
      </SidebarHeader>

      <SidebarContent className="gap-5 px-2.5 py-4">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="gap-1 p-0">
            <SidebarGroupLabel className="px-2.5 text-[11px] tracking-wider text-muted-foreground uppercase">
              {group.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(pathname, item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.label}
                        render={
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                          />
                        }
                        className={cn(
                          "justify-start gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium",
                          active && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon
                          className="size-4 shrink-0"
                          strokeWidth={1.75}
                        />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

    </Sidebar>
  );
};
