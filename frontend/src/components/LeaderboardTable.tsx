import { LeaderboardEntry } from '@/types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: number;
}

export default function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-900 font-bold text-sm shadow-lg shadow-yellow-500/30">
          1
        </span>
      );
    if (rank === 2)
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 font-bold text-sm shadow-lg">
          2
        </span>
      );
    if (rank === 3)
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-white font-bold text-sm shadow-lg">
          3
        </span>
      );
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-400 font-medium text-sm">
        {rank}
      </span>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/80">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                User
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                Total
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-emerald-500">
                Easy
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-amber-500">
                Medium
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-red-500">
                Hard
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No users found. Be the first to join!
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className={`transition-colors hover:bg-gray-800/50 ${
                    currentUserId === entry.id
                      ? 'bg-amber-500/5 border-l-2 border-l-amber-500'
                      : ''
                  }`}
                >
                  <td className="px-6 py-4">{getRankBadge(entry.rank)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{entry.name}</p>
                      <p className="text-xs text-gray-500">@{entry.leetcodeUsername}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-white">
                      {entry.totalSolved}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
                      {entry.easySolved}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">
                      {entry.mediumSolved}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">
                      {entry.hardSolved}
                    </span>
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
