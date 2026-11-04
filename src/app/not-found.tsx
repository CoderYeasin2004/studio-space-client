import Link from "next/link";
import {
  ArrowLeftIcon,
  CompassIcon,
  HomeIcon,
  SearchIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/**
 * Global 404. Self-contained (renders inside the root layout only, so it
 * carries its own header rather than the marketing navbar/footer).
 */
const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Logo size="sm" />
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-5 py-16 text-center sm:px-8">
        {/* Big code, quietly set */}
        <div className="relative">
          <span
            aria-hidden
            className="font-heading text-[clamp(5rem,22vw,11rem)] leading-none font-semibold tracking-[-0.06em] text-primary/10 select-none"
          >
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex size-16 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm sm:size-20">
              <SearchIcon className="size-7" strokeWidth={1.75} />
            </span>
          </span>
        </div>

        <div className="flex max-w-lg flex-col gap-3">
          <h1 className="font-heading text-2xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-3xl">
            This room doesn&apos;t exist.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-balance sm:text-base">
            The page you&apos;re after has been moved, renamed, or was never
            built. The studios, however, are very real.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            render={<Link href="/" />}
            size="lg"
            className="h-12 w-full rounded-full px-7 sm:w-auto"
          >
            <HomeIcon className="size-4" />
            Back to home
          </Button>
          <Button
            render={<Link href="/studios" />}
            variant="outline"
            size="lg"
            className="h-12 w-full rounded-full px-7 sm:w-auto"
          >
            <CompassIcon className="size-4" />
            Explore studios
          </Button>
        </div>

        <nav
          aria-label="Quick links"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-border pt-7 text-sm text-muted-foreground"
        >
          <Link
            href="/dashboard"
            className="outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/bookings"
            className="outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            My bookings
          </Link>
          <Link
            href="/login"
            className="outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Create account
          </Link>
        </nav>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ArrowLeftIcon className="size-3.5" />
          Or press back to return to where you were.
        </p>
      </main>
    </div>
  );
};

export default NotFound;
