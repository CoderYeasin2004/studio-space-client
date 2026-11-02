import Link from "next/link";
import { cn } from "cn";

/**
 * StudioSpace brand mark — an aperture/lens iris drawn as six blades.
 * Pure SVG so it inherits currentColor and works at any size.
 */
export function ApertureMark({
  className,
  title = "StudioSpace",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("size-8", className)}
    >
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-90"
      />
      {/* Six aperture blades converging on the centre */}
      <g fill="currentColor" opacity="0.92">
        <path d="M24 9.5 31.4 22H24V9.5Z" />
        <path d="M36.8 16.7 33 29.7 26.9 19.3l9.9-2.6Z" />
        <path d="M36.8 31.3 24 31.3 27.5 21.6l6.3 1.2 3 8.5Z" />
        <path d="M24 38.5 16.6 26H24v12.5Z" />
        <path d="M11.2 31.3 15 18.3l6.1 10.4-9.9 2.6Z" />
        <path d="M11.2 16.7H24L20.5 26.4l-6.3-1.2-3-8.5Z" />
      </g>
      <circle cx="24" cy="24" r="3.4" className="fill-background" />
    </svg>
  );
}

/**
 * Lockup used in the navbar, footer and auth screens.
 */
export function Logo({
  className,
  markClassName,
  href = "/",
  size = "md",
}: {
  className?: string;
  markClassName?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { mark: "size-6", text: "text-base" },
    md: { mark: "size-8", text: "text-lg" },
    lg: { mark: "size-11", text: "text-2xl" },
  } as const;

  return (
    <Link
      href={href}
      aria-label="StudioSpace home"
      className={cn(
        "group/logo inline-flex items-center gap-2.5 text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <ApertureMark
        className={cn(
          sizes[size].mark,
          "text-primary transition-transform duration-500 group-hover/logo:rotate-45",
          markClassName,
        )}
      />
      <span
        className={cn(
          "font-heading font-semibold tracking-[-0.03em]",
          sizes[size].text,
        )}
      >
        Studio
        <span className="text-primary">Space</span>
      </span>
    </Link>
  );
}
