
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LogOutIcon,
  UserRoundIcon,
  ChevronDownIcon,
} from "lucide-react";

import { cn } from "cn";
import { toast } from "@/components/ui/toast";
import { signOut, useSession } from "@/lib/auth-client";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { ApertureMark } from "@/components/brand/logo";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


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
        href: "/dashboard/listings",
        icon: LayoutGridIcon,
      },
      {
        label: "My bookings",
        href: "/dashboard/bookings",
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
  const router = useRouter();

  const { data: session } = useSession();
const user = session?.user;

  const { isMobile, setOpen, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const { error } = await signOut();

      if (error) {
        toast.add({
          type: "warning",
          title: "Logout failed",
          description: error.message,
        });

        return;
      }

      toast.add({
        type: "success",
        title: "Signed out",
        description: "You have successfully logged out.",
      });

      router.replace("/login");
      router.refresh();
    } catch {
      toast.add({
        type: "warning",
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigateTo = (href: string) => {
    router.push(href);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border"
      onMouseEnter={!isMobile ? () => setOpen(true) : undefined}
      onMouseLeave={!isMobile ? () => setOpen(false) : undefined}
    >
      <SidebarHeader
        className={cn(
          "border-b border-border px-4 py-4",
          "group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1"
        )}
      >
        {isCollapsed ? (
          <ApertureMark className="size-6 shrink-0 mx-auto text-primary" />
        ) : (
          <Logo size="sm" />
        )}
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

     <SidebarFooter className="border-t border-border p-3">
  <div className={cn(
    "flex items-center gap-2",
    "group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1.5"
  )}>
    {/* Dynamic User Profile */}
    <div
      className="relative size-8 shrink-0 overflow-hidden rounded-full border border-border bg-primary/10"
      onClick={() => setDropdownOpen(true)}
    >
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name || "Profile"}
          width={32}
          height={32}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
          {user?.name?.trim().charAt(0).toUpperCase() || "U"}
        </span>
      )}
    </div>

    <div className="min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
      <p className="truncate text-xs font-medium">
        {user?.name || "User"}
      </p>
      <p className="truncate text-[11px] text-muted-foreground">
        {user?.email || ""}
      </p>
    </div>

    {/* Dropdown */}
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
          "group-data-[collapsible=icon]:hidden"
        )}
      >
        <ChevronDownIcon className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={8}
        className="w-56"
      >
        <DropdownMenuGroup>
  <DropdownMenuLabel>
    <p className="font-medium">{user?.name || "User"}</p>
    <p className="text-xs text-muted-foreground">
      {user?.email}
    </p>
  </DropdownMenuLabel>
</DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigateTo("/dashboard/bookings")}>
          <CalendarDaysIcon />
          My Bookings
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigateTo("/dashboard/listings")}>
          <LayoutGridIcon />
          My Listings
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigateTo("/dashboard/profile")}>
          <UserRoundIcon />
          Profile Settings
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigateTo("/")}>
          <ArrowUpRightIcon />
          Back to Site
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          <LogOutIcon />
          {isLoggingOut ? "Signing out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
