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
      const defaultId = user?.collegeId || res.data[0]?.id;
      if (defaultId) setSelectedCollege(defaultId);
    });
  }, [user]);

  useEffect(() => {
    if (!selectedCollege) return;
    setLoading(true);
    const college = colleges.find((c) => c.id === selectedCollege);
    setCollegeName(college?.name || '');
    getLeaderboard(selectedCollege)
      .then((res) => setLeaderboard(res.data.leaderboard))
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
  }, [selectedCollege, colleges]);

  return (
    <div className="min-h-screen px-5 py-10 animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
            {collegeName && (
              <p className="mt-1 text-sm text-white/25">
                {collegeName} · {leaderboard.length} members
              </p>
            )}
          </div>

          <select
            value={selectedCollege || ''}
            onChange={(e) => setSelectedCollege(parseInt(e.target.value))}
            className="px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/20 appearance-none min-w-[220px] transition-colors"
          >
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-5 h-5 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
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
