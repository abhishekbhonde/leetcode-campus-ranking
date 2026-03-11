import { LeaderboardEntry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: number;
}

export default function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                #
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                User
              </th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Total
              </th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Easy
              </th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Medium
              </th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Hard
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground text-sm">
                  No users found yet — be the first to join!
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className={cn(
                    "border-b border-border/50 transition-colors hover:bg-secondary/30",
                    currentUserId === entry.id && "bg-secondary/40"
                  )}
                >
                  <td className="px-5 py-4">
                    <RankBadge rank={entry.rank} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {entry.avatar ? (
                        <img src={entry.avatar} alt="" className="w-8 h-8 rounded-full bg-secondary object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold text-muted-foreground">
                          {entry.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{entry.name}</p>
                        <p className="text-[11px] text-muted-foreground/60">@{entry.leetcodeUsername}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-base font-semibold text-foreground">{entry.totalSolved}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant="success" className="font-mono">{entry.easySolved}</Badge>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant="warning" className="font-mono">{entry.mediumSolved}</Badge>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant="danger" className="font-mono">{entry.hardSolved}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black text-xs font-bold shadow-sm shadow-white/20">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white text-xs font-bold">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/80 text-xs font-bold">
        3
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 text-xs text-muted-foreground font-medium">
      {rank}
    </span>
  );
}
