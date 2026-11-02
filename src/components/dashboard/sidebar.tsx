"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LogOutIcon,
  ArrowUpRightIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "cn";
import { userProfile } from "@/data/bookings";
import { img } from "@/lib/images";
import { toast } from "@/components/ui/toast";
import { Logo } from "@/components/brand/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon }],
  },
  {
    label: "Manage",
    items: [
      { label: "My listings", href: "/dashboard/listings", icon: LayoutGridIcon },
      { label: "My bookings", href: "/dashboard/bookings", icon: CalendarIcon },
      { label: "Profile settings", href: "/dashboard/profile", icon: UserIcon },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

/** Sidebar navigation for the host/creator dashboard. */
export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
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
                          active && "bg-primary/10 text-primary",
                        )}
                      >
                        <Icon className="size-4 shrink-0" strokeWidth={1.75} />
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

      <SidebarFooter className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1">
          <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={img(userProfile.avatar, "avatar")}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-medium">{userProfile.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {userProfile.email}
            </p>
          </div>
          <button
            type="button"
            aria-label="Log out"
            onClick={() =>
              toast.add({
                type: "info",
                title: "Signed out",
                description: "This is a demo — you're still browsing.",
              })
            }
            className="hidden size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 group-data-[collapsible=icon]:flex"
          >
            <LogOutIcon className="size-3.5" />
          </button>
        </div>

        <Link
          href="/"
          className="mt-1 hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 group-data-[collapsible=icon]:hidden"
        >
          <ArrowUpRightIcon className="size-3.5" />
          Back to site
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
