import Image from "next/image";
import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { CurrentYear } from "@/components/shared/current-year";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { img } from "@/lib/images";

const promises = [
  "Browse hundreds of visited studios",
  "Save favourites and request bookings",
  "List your own space in minutes",
];

/**
 * Auth shell for /login and /register: a photographic brand panel on the
 * left (desktop) and a quiet, focused form column on the right. Deliberately
 * sits outside the marketing navbar/footer so nothing competes with the form.
 */
const AuthLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.2fr_1fr]">
      {/* ---------- Brand panel ---------- */}
      <aside className="relative hidden overflow-hidden bg-[#171326] lg:block">
        <Image
          src={img("1560787313-5dff3307e257", "hero")}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover opacity-60"
        />
        {/* Scrim keeps the type readable over any photograph */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-tr from-[#171326] via-[#171326]/85 to-[#171326]/40"
        />

        <div className="relative z-10 flex h-full flex-col justify-between gap-10 p-10 xl:p-14">
          <Logo size="lg" className="w-fit text-white" markClassName="text-brand-lavender" />

          <div className="flex flex-col gap-7">
            <span className="eyebrow text-brand-lavender">Find your space</span>
            <h1 className="font-heading text-[clamp(2rem,3.4vw,3rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-white">
              Every great frame starts with the right room.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-white/70 text-balance">
              Daylight lofts, cycloramas, podcast booths and recording suites —
              photographed, rated and booked by the people who use them.
            </p>

            <ul className="flex flex-col gap-2.5">
              {promises.map((promise) => (
                <li
                  key={promise}
                  className="inline-flex items-center gap-3 text-sm text-white/85"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-violet text-white">
                    <CheckIcon className="size-3" strokeWidth={3} />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/50">
            © <CurrentYear /> StudioSpace · London · Remote-first
          </p>
        </div>
      </aside>

      {/* ---------- Form column ---------- */}
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="hidden lg:block" aria-hidden />
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-12">
          <div className="w-full max-w-[26rem]">{children}</div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 px-5 pb-8 text-xs text-muted-foreground sm:px-8">
          <p>Need a hand? Our team replies within a day.</p>
          <Link
            href="/"
            className="outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Back to home
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
