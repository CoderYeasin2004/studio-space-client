export interface IDashboardStat {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  icon: string;
}

export interface IActivityEvent {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
  icon: string;
}
