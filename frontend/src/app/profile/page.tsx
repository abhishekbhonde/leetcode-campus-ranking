'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProfile, fetchLeetcodeStats } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { User } from '@/types';

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) loadProfile();
  }, [isAuthenticated, authLoading]);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!profile?.leetcodeUsername || refreshing) return;
    setRefreshing(true);
    try {
      await fetchLeetcodeStats(profile.leetcodeUsername);
      await loadProfile();
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = profile?.leetcodeStats;

  const progressBars = [
    { label: 'Easy', solved: stats?.easySolved || 0, total: 830, color: 'bg-emerald-500' },
    { label: 'Medium', solved: stats?.mediumSolved || 0, total: 1744, color: 'bg-white' },
    { label: 'Hard', solved: stats?.hardSolved || 0, total: 778, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen px-5 py-10 animate-fadeIn">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-14 h-14 rounded-xl bg-white/[0.06] flex items-center justify-center text-xl font-bold text-white/40 overflow-hidden shrink-0">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              profile?.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight">{profile?.name}</h1>
            <p className="mt-0.5 text-sm text-white/25">
              @{profile?.leetcodeUsername} · {profile?.college?.name} · {profile?.email}
            </p>
            {profile?.collegeRank && (
              <p className="mt-2 text-[12px] text-white/30">
                Rank #{profile.collegeRank} of {profile.totalInCollege} at{' '}
                {profile.college?.name}
              </p>
            )}
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 rounded-lg text-[13px] font-medium bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-colors shrink-0"
          >
            {refreshing ? 'Syncing...' : 'Refresh Stats'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard label="Total Solved" value={stats?.totalSolved || 0} subtext="of ~3,352" />
          <StatsCard label="Easy" value={stats?.easySolved || 0} />
          <StatsCard label="Medium" value={stats?.mediumSolved || 0} />
          <StatsCard label="Hard" value={stats?.hardSolved || 0} />
        </div>

        {/* Progress bars */}
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-5">
          <h2 className="text-[12px] font-medium text-white/30 uppercase tracking-wider">
            Distribution
          </h2>

          {progressBars.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-white/50">{item.label}</span>
                <span className="text-white/20">{item.solved}/{item.total}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                  style={{ width: `${Math.min((item.solved / item.total) * 100, 100)}%`, opacity: 0.6 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Extra stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatsCard
            label="Global Ranking"
            value={stats?.globalRanking ? `#${stats.globalRanking.toLocaleString()}` : '—'}
          />
          <StatsCard
            label="Last Synced"
            value={stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : '—'}
            subtext="Every 6 hours"
          />
        </div>
      </div>
    </div>
  );
}
