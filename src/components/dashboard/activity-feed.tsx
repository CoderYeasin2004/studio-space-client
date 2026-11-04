import {
  CalendarCheckIcon,
  HeartIcon,
  PencilIcon,
  ReceiptIcon,
  StarIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import type { ActivityEvent } from "@/types/studio";

const icons: Record<string, LucideIcon> = {
  "calendar-check": CalendarCheckIcon,
  heart: HeartIcon,
  star: StarIcon,
  pencil: PencilIcon,
  receipt: ReceiptIcon,
};

/** Vertical activity timeline for the dashboard. */
export const ActivityFeed = ({ events }: { events: ActivityEvent[] }) => {
  return (
    <ol className="relative flex flex-col">
      {events.map((event, index) => {
        const Icon = icons[event.icon] ?? StarIcon;
        const isLast = index === events.length - 1;
        return (
          <li key={event.id} className="relative flex gap-3.5 pb-5 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-8 bottom-0 left-[15px] w-px bg-border"
              />
            )}
            <span
              className={cn(
                "relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary",
              )}
            >
              <Icon className="size-3.5" strokeWidth={1.75} />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
              <p className="truncate text-sm font-medium">{event.label}</p>
              <p className="truncate text-xs text-muted-foreground">
                {event.detail}
              </p>
              <p className="text-[11px] text-muted-foreground/70">
                {event.timestamp}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
