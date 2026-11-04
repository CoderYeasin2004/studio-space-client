import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

/**
 * Shared "nothing to show" panel — used by search results, dashboard lists
 * and any filtered collection.
 */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center sm:py-20",
        className,
      )}
    >
      <span className="inline-flex size-14 items-center justify-center rounded-full border border-border bg-card text-primary">
        <Icon className="size-6" strokeWidth={1.75} />
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-heading text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground text-balance sm:text-base">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
};
