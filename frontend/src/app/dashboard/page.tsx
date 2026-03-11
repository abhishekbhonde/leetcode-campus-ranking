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

    if (isAuthenticated) {
      loadData();
    }
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
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome header */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back,{' '}
            <span className="text-amber-400">{profile?.name}</span> 👋
          </h1>
          <p className="mt-1 text-gray-400">
            {profile?.college?.name} • @{profile?.leetcodeUsername}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Solved"
            value={profile?.leetcodeStats?.totalSolved || 0}
            icon="🎯"
            color="blue"
          />
          <StatsCard
            label="Easy"
            value={profile?.leetcodeStats?.easySolved || 0}
            icon="🟢"
            color="green"
          />
          <StatsCard
            label="Medium"
            value={profile?.leetcodeStats?.mediumSolved || 0}
            icon="🟡"
            color="amber"
          />
          <StatsCard
            label="Hard"
            value={profile?.leetcodeStats?.hardSolved || 0}
            icon="🔴"
            color="red"
          />
        </div>

        {/* Rank + Global info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard
            label="College Rank"
            value={
              profile?.collegeRank
                ? `#${profile.collegeRank} / ${profile.totalInCollege}`
                : 'N/A'
            }
            icon="🏆"
            color="orange"
            subtext={profile?.college?.name}
          />
          <StatsCard
            label="Global Ranking"
            value={
              profile?.leetcodeStats?.globalRanking
                ? `#${profile.leetcodeStats.globalRanking.toLocaleString()}`
                : 'N/A'
            }
            icon="🌍"
            color="purple"
            subtext="LeetCode Global"
          />
        </div>

        {/* College leaderboard preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {profile?.college?.name} Leaderboard
            </h2>
            <button
              onClick={() => router.push('/leaderboard')}
              className="text-sm text-amber-400 hover:text-amber-300"
            >
              View Full →
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
