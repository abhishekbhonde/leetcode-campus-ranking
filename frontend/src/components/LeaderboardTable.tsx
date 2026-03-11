import { LeaderboardEntry } from '@/types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: number;
}

export default function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-widest text-white/30">#</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-widest text-white/30">User</th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-widest text-white/30">Total</th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-widest text-white/20">Easy</th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-widest text-white/20">Med</th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-widest text-white/20">Hard</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-white/20 text-sm">
                  No users found yet.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
                    currentUserId === entry.id ? 'bg-white/[0.03]' : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <RankBadge rank={entry.rank} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {entry.avatar ? (
                        <img
                          src={entry.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full bg-white/5"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-[11px] font-semibold text-white/40">
                          {entry.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white/90">{entry.name}</p>
                        <p className="text-[11px] text-white/25">@{entry.leetcodeUsername}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-base font-semibold text-white">{entry.totalSolved}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm text-emerald-400/70">{entry.easySolved}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm text-amber-400/70">{entry.mediumSolved}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm text-red-400/70">{entry.hardSolved}</span>
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
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black text-xs font-bold">
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
    <span className="inline-flex items-center justify-center w-7 h-7 text-xs text-white/30 font-medium">
      {rank}
    </span>
  );
}
