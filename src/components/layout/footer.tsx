import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { CurrentYear } from "@/components/shared/current-year";
import { categories } from "@/data/categories";
import { cn } from "cn";

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/#about" },
];

const supportLinks = [
  { label: "Help Centre", href: "/#about" },
  { label: "Cancellation policy", href: "/#about" },
  { label: "Safety & trust", href: "/#about" },
  { label: "Contact us", href: "/#about" },
];

const hostLinks = [
  { label: "List your studio", href: "/dashboard/listings/new" },
  { label: "Host dashboard", href: "/dashboard" },
  { label: "My bookings", href: "/dashboard/bookings" },
  { label: "Profile settings", href: "/dashboard/profile" },
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
        <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.9-6.4L5.1 21H2l7.3-8.3L2.5 3h6.4l4.4 5.8L17.5 3Zm-1.1 16.2h1.7L7.7 4.7H5.9l10.5 14.5Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="m10.5 9.8 4.5 2.7-4.5 2.7V9.8Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
        <path d="M6.2 9.5H3.1V21h3.1V9.5ZM4.65 3A1.8 1.8 0 1 0 4.65 6.6 1.8 1.8 0 0 0 4.65 3ZM21 14.1c0-3.2-1.7-4.7-4-4.7-1.85 0-2.68 1.02-3.14 1.74V9.5H9.75V21h3.1v-5.7c0-1.5.28-2.96 2.15-2.96 1.84 0 1.87 1.72 1.87 3.05V21H21v-6.9Z" />
      </svg>
    ),
  },
];

/**
 * Marketing footer: brand statement + newsletter, then four link columns
 * (site, categories, hosts, support) over a hairline, socials and legal.
 */
export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border bg-muted/40 dark:bg-muted/20">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 pb-8 sm:px-8 lg:px-12">
        {/* ---------- Top: brand + newsletter ---------- */}
        <div className="grid grid-cols-1 gap-10 border-b border-border pb-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Logo size="lg" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground text-balance">
              Find Your Space. Create Your Vision. A curated marketplace of
              creative studios for the people who make things worth looking at.
            </p>

            <div className="flex items-center gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground outline-none transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter — client wrapper handles the mock submit */}
          <div className="flex flex-col gap-4 lg:col-span-7 lg:items-end">
            <div className="w-full max-w-md">
              <p className="font-heading text-base font-semibold tracking-[-0.01em]">
                The weekly studio dispatch
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                New spaces, host stories and lighting notes. No noise.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* ---------- Link columns ---------- */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-4">
          <FooterColumn
            heading="StudioSpace"
            links={siteLinks}
            className="col-span-2 sm:col-span-1"
          />
          <FooterColumn
            heading="Popular categories"
            links={categories.map((c) => ({
              label: c.name,
              href: `/studios?category=${c.id}`,
            }))}
          />
          <FooterColumn heading="For hosts" links={hostLinks} />
          <FooterColumn heading="Support" links={supportLinks} />
        </div>

        {/* ---------- Legal ---------- */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-7 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © <CurrentYear /> StudioSpace. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/#about" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/#about" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/#about" className="transition-colors hover:text-foreground">
              Cookies
            </Link>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <span>London · Remote-first</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  heading,
  links,
  className,
}: {
  heading: string;
  links: { label: string; href: string }[];
  className?: string;
}) => {
  return (
    <nav aria-label={heading} className={cn("flex flex-col gap-3", className)}>
      <p className="eyebrow text-foreground">{heading}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label + link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
