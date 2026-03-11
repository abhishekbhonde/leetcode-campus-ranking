interface StatsCardProps {
  label: string;
  value: number | string;
  subtext?: string;
}

export default function StatsCard({ label, value, subtext }: StatsCardProps) {
  return (
    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
      <p className="text-[11px] font-medium uppercase tracking-widest text-white/30">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white tracking-tight">
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-[12px] text-white/20">{subtext}</p>
      )}
    </div>
  );
}
