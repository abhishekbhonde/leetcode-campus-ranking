interface StatsCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  subtext?: string;
}

export default function StatsCard({ label, value, icon, color, subtext }: StatsCardProps) {
  const colorMap: Record<string, string> = {
    green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
  };

  const classes = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${classes} p-5 transition-transform hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtext && (
            <p className="mt-1 text-xs text-gray-500">{subtext}</p>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
