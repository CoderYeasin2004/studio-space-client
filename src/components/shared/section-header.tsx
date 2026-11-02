import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: { label: string; href: string };
  align?: "start" | "center";
  className?: string;
  /** Inverts the palette for dark photographic sections. */
  tone?: "default" | "on-dark";
}

/**
 * Consistent editorial section header: eyebrow, expressive title,
 * optional supporting copy and an optional trailing link.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  tone = "default",
  className,
}: SectionHeaderProps) {
  const onDark = tone === "on-dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center justify-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex max-w-2xl flex-col gap-4",
          align === "center" && "items-center",
        )}
      >
        {eyebrow && (
          <span
            className={cn(
              "eyebrow flex items-center gap-3",
              onDark ? "text-brand-lavender" : "text-primary",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "inline-block h-px w-8",
                onDark ? "bg-brand-lavender/60" : "bg-primary/50",
              )}
            />
            {eyebrow}
          </span>
        )}
        <h2
          className={cn(
            "font-heading text-3xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl",
            onDark ? "text-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "max-w-xl text-base leading-relaxed text-balance sm:text-lg",
              onDark ? "text-foreground/70" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            "group/action inline-flex shrink-0 items-center gap-1.5 border-b pb-1 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
            onDark
              ? "border-foreground/30 text-foreground hover:border-foreground"
              : "border-border text-foreground hover:border-primary hover:text-primary",
          )}
        >
          {action.label}
          <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}
