import { cn } from "cn"

const Skeleton = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
};

const SkeletonText = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted h-4 w-full", className)} />
  );
};

const SkeletonTextSm = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted h-3 w-3/4", className)} />
  );
};

const SkeletonTextXs = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted h-2 w-1/2", className)} />
  );
};

const SkeletonAvatar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-full bg-muted size-10", className)} />
  );
};

const SkeletonImage = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-xl bg-muted aspect-[4/3]", className)} />
  );
};

const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
        <div className="mt-2 h-10 w-full animate-pulse rounded-md bg-muted" />
        <div className="mt-4 h-5 w-1/2 max-w-lg animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
};

export {
  Skeleton,
  SkeletonText,
  SkeletonTextSm,
  SkeletonTextXs,
  SkeletonAvatar,
  SkeletonImage,
  SkeletonCard,
}
