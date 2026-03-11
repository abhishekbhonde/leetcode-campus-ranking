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

    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated, authLoading]);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
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
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const stats = profile?.leetcodeStats;
  const totalProblems = 3352; // Approx total problems on LeetCode

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile header */}
        <div className="p-8 rounded-2xl bg-gray-900/70 border border-gray-800 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-gray-900 shadow-xl shadow-amber-500/20">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile?.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span>@{profile?.leetcodeUsername}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span>{profile?.college?.name}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span>{profile?.email}</span>
              </div>
              {profile?.collegeRank && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
                  🏆 College Rank #{profile.collegeRank} of{' '}
                  {profile.totalInCollege}
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {refreshing ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Syncing...
                </span>
              ) : (
                '🔄 Refresh Stats'
              )}
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Solved"
            value={stats?.totalSolved || 0}
            icon="🎯"
            color="blue"
            subtext={`of ~${totalProblems} problems`}
          />
          <StatsCard
            label="Easy"
            value={stats?.easySolved || 0}
            icon="🟢"
            color="green"
          />
          <StatsCard
            label="Medium"
            value={stats?.mediumSolved || 0}
            icon="🟡"
            color="amber"
          />
          <StatsCard
            label="Hard"
            value={stats?.hardSolved || 0}
            icon="🔴"
            color="red"
          />
        </div>

        {/* Progress bars */}
        <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-6">
          <h2 className="text-lg font-semibold">Problem Distribution</h2>

          {[
            {
              label: 'Easy',
              solved: stats?.easySolved || 0,
              total: 830,
              color: 'bg-emerald-500',
              bgColor: 'bg-emerald-500/10',
            },
            {
              label: 'Medium',
              solved: stats?.mediumSolved || 0,
              total: 1744,
              color: 'bg-amber-500',
              bgColor: 'bg-amber-500/10',
            },
            {
              label: 'Hard',
              solved: stats?.hardSolved || 0,
              total: 778,
              color: 'bg-red-500',
              bgColor: 'bg-red-500/10',
            },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{item.label}</span>
                <span className="text-gray-500">
                  {item.solved} / {item.total}
                </span>
              </div>
              <div className={`h-2.5 rounded-full ${item.bgColor} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                  style={{
                    width: `${Math.min(
                      (item.solved / item.total) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard
            label="Global Ranking"
            value={
              stats?.globalRanking
                ? `#${stats.globalRanking.toLocaleString()}`
                : 'N/A'
            }
            icon="🌍"
            color="purple"
          />
          <StatsCard
            label="Last Updated"
            value={
              stats?.lastUpdated
                ? new Date(stats.lastUpdated).toLocaleDateString()
                : 'Never'
            }
            icon="🕐"
            color="blue"
            subtext="Stats sync every 6 hours"
          />
        </div>
      </div>
    </div>
  );
}
