'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getColleges, getLeaderboard } from '@/lib/api';
import LeaderboardTable from '@/components/LeaderboardTable';
import { College, LeaderboardEntry } from '@/types';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);
  const [collegeName, setCollegeName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getColleges().then((res) => {
      setColleges(res.data);
      // Auto-select user's college or first available
      const defaultId = user?.collegeId || res.data[0]?.id;
      if (defaultId) {
        setSelectedCollege(defaultId);
      }
    });
  }, [user]);

  useEffect(() => {
    if (selectedCollege) {
      setLoading(true);
      const college = colleges.find((c) => c.id === selectedCollege);
      setCollegeName(college?.name || '');
      getLeaderboard(selectedCollege)
        .then((res) => setLeaderboard(res.data.leaderboard))
        .catch(() => setLeaderboard([]))
        .finally(() => setLoading(false));
    }
  }, [selectedCollege, colleges]);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              🏆 Campus Leaderboard
            </h1>
            <p className="mt-1 text-gray-400">
              See who&apos;s leading the LeetCode charge at your college
            </p>
          </div>

          <select
            value={selectedCollege || ''}
            onChange={(e) => setSelectedCollege(parseInt(e.target.value))}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 appearance-none min-w-[240px]"
          >
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* College badge */}
        {collegeName && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {collegeName}
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{leaderboard.length} members</span>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-[3px] border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <LeaderboardTable
            entries={leaderboard}
            currentUserId={user?.id}
          />
        )}
      </div>
    </div>
  );
}
