"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const config = {
  bookings: { label: "Bookings", color: "var(--primary)" },
} satisfies ChartConfig;

/** Monthly booking trend — area chart with a soft brand gradient. */
export function BookingTrendChart({
  data,
}: {
  data: { month: string; bookings: number }[];
}) {
  return (
    <ChartContainer
      config={config}
      className="h-64 w-full aspect-auto [&_.recharts-text]:fill-muted-foreground"
    >
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          width={40}
          allowDecimals={false}
          fontSize={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="bookings"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#bookingsFill)"
          activeDot={{ r: 5, strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
