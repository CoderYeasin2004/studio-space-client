"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MenuIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  CalendarDaysIcon,
  UserRoundIcon,
  LogOutIcon,
  Plus,
  HeartIcon,
} from "lucide-react";

import { useSession, signOut } from "@/lib/auth-client";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "@/components/ui/toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/#about" },
];

/**
 * Sticky marketing navbar: transparent over the hero, frosted with a hairline
 * border once the page scrolls. Collapses into a Sheet on mobile.
 */
export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const handleLogout = async () => {
  try {
    await signOut();

    toast.add({
      type: "success",
      title: "Logged out successfully",
    });

    router.push("/login");
    router.refresh();
  } catch {
    toast.add({
      type: "warning",
      title: "Logout failed",
      description: "Please try again.",
    });
  }
};

  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { count } = useFavorites();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mobile Sheet closes itself from each control's onClick — no
  // route-change effect needed (avoids a sync setState-in-effect).

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-background/0",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:h-[72px] lg:px-12">
        <Logo />

        {/* ---------- Desktop links ---------- */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive(link.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------- Actions ---------- */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          <Button
            render={<Link href="/favorites" />}
            variant="ghost"
            size="icon-sm"
            aria-label={`Favourites (${count})`}
            className="relative"
          >
            <HeartIcon className="size-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white border border-border text-[9px] font-semibold rounded-full flex items-center justify-center ring-1 ring-inset">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Button>

          {user ? (
    <div className="hidden items-center gap-2 sm:flex">
      <DropdownMenu>
        <div className="flex items-center gap-1">
          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "Profile"}
                width={36}
                height={36}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>

          {/* Chevron */}
          <DropdownMenuTrigger
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Open profile menu"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
  onClick={() => router.push("/dashboard")}
>
  <LayoutDashboardIcon className="mr-2 h-4 w-4" />
  Dashboard
</DropdownMenuItem>
  <DropdownMenuItem
    onClick={() => router.push("/dashboard/listings")}
  >
    
    <LayoutGridIcon className="mr-2 h-4 w-4" />
    My Listings
  </DropdownMenuItem>

  <DropdownMenuItem
    onClick={() => router.push("/dashboard/bookings")}
  >
    <CalendarDaysIcon className="mr-2 h-4 w-4" />
    My Bookings
  </DropdownMenuItem>

  <DropdownMenuItem
    onClick={() => router.push("/dashboard/profile")}
  >
    <UserRoundIcon className="mr-2 h-4 w-4" />
    Profile Settings
  </DropdownMenuItem>

  <DropdownMenuSeparator />

  <DropdownMenuItem
    onClick={() => router.push("/dashboard/listings/new")}
  >
    <Plus className="mr-2 h-4 w-4" />
    Create New Studio
  </DropdownMenuItem>

  <DropdownMenuSeparator />

  <DropdownMenuItem
    variant="destructive"
    onClick={handleLogout}
  >
    <LogOutIcon className="mr-2 h-4 w-4" />
    Logout
  </DropdownMenuItem>
</DropdownMenuContent>
      </DropdownMenu>
    </div>
) : (
  <>
    <Button
      render={<Link href="/login" />}
      variant="ghost"
      className="hidden text-muted-foreground sm:inline-flex"
    >
      Log in
    </Button>

    <Button
      render={<Link href="/register" />}
      className="hidden rounded-full px-5 sm:inline-flex"
    >
      Sign up
    </Button>
  </>
)}

          {/* ---------- Mobile trigger ---------- */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="w-[19rem] gap-0 p-0">
              <SheetHeader className="border-b border-border px-5 py-4">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Primary navigation
                </SheetDescription>
                <Logo size="sm" />
              </SheetHeader>

              <nav aria-label="Mobile" className="flex flex-col gap-1 px-3 py-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-base font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                      isActive(link.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

             <div className="mt-auto flex flex-col gap-2 border-t border-border p-5">
  {user ? (
    <>
      <Button
        render={<Link href="/dashboard/listings" />}
        variant="outline"
        className="h-11 w-full"
        onClick={() => setOpen(false)}
      >
        My Listings
      </Button>

      <Button
        render={<Link href="/dashboard/bookings" />}
        variant="outline"
        className="h-11 w-full"
        onClick={() => setOpen(false)}
      >
        My Bookings
      </Button>

      <Button
        render={<Link href="/dashboard/profile" />}
        variant="outline"
        className="h-11 w-full"
        onClick={() => setOpen(false)}
      >
        Profile Settings
      </Button>

      <Button
        variant="destructive"
        className="h-11 w-full"
        onClick={() => {
          setOpen(false);
          handleLogout();
        }}
      >
        Log out
      </Button>
    </>
  ) : (
    <>
      <Button
        render={<Link href="/login" />}
        variant="outline"
        className="h-11 w-full"
        onClick={() => setOpen(false)}
      >
        Log in
      </Button>

      <Button
        render={<Link href="/register" />}
        className="h-11 w-full rounded-full"
        onClick={() => setOpen(false)}
      >
        Create account
      </Button>
    </>
  )}
</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
