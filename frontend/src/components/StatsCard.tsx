import { cn } from "@/lib/utils";
import { CardSpotlight } from "@/components/aceternity/spotlight";

interface StatsCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  className?: string;
}

export default function StatsCard({ label, value, subtext, className }: StatsCardProps) {
  return (
    <CardSpotlight className={cn("p-5", className)}>
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-foreground tracking-tight">
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-[12px] text-muted-foreground/50">{subtext}</p>
      )}
    </CardSpotlight>
  );
}
