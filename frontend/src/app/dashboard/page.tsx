'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProfile, getLeaderboard } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import LeaderboardTable from '@/components/LeaderboardTable';
import { User, LeaderboardEntry } from '@/types';

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) loadData();
  }, [isAuthenticated, authLoading]);

  const loadData = async () => {
    try {
      const profileRes = await getProfile();
      setProfile(profileRes.data);
      if (profileRes.data.collegeId) {
        const lbRes = await getLeaderboard(profileRes.data.collegeId);
        setLeaderboard(lbRes.data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen px-5 py-10 animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile?.name}
          </h1>
          <p className="mt-1 text-sm text-white/25">
            {profile?.college?.name} · @{profile?.leetcodeUsername}
          </p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard label="Total Solved" value={stats?.totalSolved || 0} />
          <StatsCard label="Easy" value={stats?.easySolved || 0} subtext="problems" />
          <StatsCard label="Medium" value={stats?.mediumSolved || 0} subtext="problems" />
          <StatsCard label="Hard" value={stats?.hardSolved || 0} subtext="problems" />
        </div>

        {/* Rank cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatsCard
            label="College Rank"
            value={profile?.collegeRank ? `#${profile.collegeRank}` : '—'}
            subtext={profile?.totalInCollege ? `of ${profile.totalInCollege} students` : undefined}
          />
          <StatsCard
            label="Global Ranking"
            value={stats?.globalRanking ? `#${stats.globalRanking.toLocaleString()}` : '—'}
            subtext="LeetCode Global"
          />
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">
              Campus Leaderboard
            </h2>
            <button
              onClick={() => router.push('/leaderboard')}
              className="text-[13px] text-white/25 hover:text-white/50 transition-colors"
            >
              View all →
            </button>
          </div>
          <LeaderboardTable
            entries={leaderboard.slice(0, 10)}
            currentUserId={profile?.id}
          />
        </div>
      </div>
    </div>
  );
}
