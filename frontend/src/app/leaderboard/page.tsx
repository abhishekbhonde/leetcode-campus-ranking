'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getColleges, getLeaderboard } from '@/lib/api';
import LeaderboardTable from '@/components/LeaderboardTable';
import { College, LeaderboardEntry } from '@/types';
import { Loader2 } from 'lucide-react';

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
    <div className="min-h-screen px-5 py-10 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
            {collegeName && (
              <p className="mt-1 text-sm text-muted-foreground">
                {collegeName} · {leaderboard.length} member{leaderboard.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <select
            value={selectedCollege || ''}
            onChange={(e) => setSelectedCollege(parseInt(e.target.value))}
            className="flex h-10 rounded-md border border-input bg-secondary/50 px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none min-w-[220px]"
          >
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <LeaderboardTable entries={leaderboard} currentUserId={user?.id} />
        )}
      </div>
    </div>
  );
}
