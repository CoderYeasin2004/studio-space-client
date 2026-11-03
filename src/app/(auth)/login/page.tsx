import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Sign in to StudioSpace to manage your bookings, favourites and listings.",
};

/** Log in screen — mock submission only, no auth backend is wired up. */
export default function LoginPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        <span className="eyebrow text-primary">Welcome back</span>
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
          Pick up where you left off.
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Your saved studios, pending requests and listings are waiting.
        </p>
      </div>

      <AuthForm mode="login" />

      <p className="text-center text-sm text-muted-foreground">
        New to StudioSpace?{" "}
        <Link
          href="/register"
          className="font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
