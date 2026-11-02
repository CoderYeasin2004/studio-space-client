import {
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
  MinusIcon,
} from "lucide-react";
import { cn } from "cn";
import type { DashboardStat } from "@/types/studio";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  calendar: CalendarIcon,
  clock: ClockIcon,
  heart: HeartIcon,
  wallet: WalletIcon,
};

/** One KPI tile on the dashboard overview. */
export function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = icons[stat.icon] ?? CalendarIcon;
  const Trend =
    stat.trend === "up"
      ? TrendingUpIcon
      : stat.trend === "down"
        ? TrendingDownIcon
        : MinusIcon;

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
            stat.trend === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            stat.trend === "down" && "bg-rose-500/10 text-rose-500 dark:text-rose-400",
            stat.trend === "neutral" && "bg-muted text-muted-foreground",
          )}
        >
          <Trend className="size-3" />
          {stat.delta}
        </span>
      </div>
      <div>
        <p className="font-heading text-2xl font-semibold tracking-[-0.02em] tabular-nums sm:text-3xl">
          {stat.value}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
      </div>
    </div>
  );
}
