import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Join StudioSpace to book creative studios, save favourites and list your own space.",
};

/** Registration screen — mock submission only, no auth backend is wired up. */


const RegisterPage = () => {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        <span className="eyebrow text-primary">Join StudioSpace</span>
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
          Start creating today.
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          One account for booking, hosting and keeping your favourite spaces
          close.
        </p>
      </div>

      <AuthForm mode="register" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
