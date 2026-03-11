'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProfile, getLeaderboard } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import LeaderboardTable from '@/components/LeaderboardTable';
import { User, LeaderboardEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
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
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = profile?.leetcodeStats;

  return (
    <div className="min-h-screen px-5 py-10 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{profile?.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.college?.name} · @{profile?.leetcodeUsername}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/profile')}>
            View Profile <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard label="Total Solved" value={stats?.totalSolved || 0} />
          <StatsCard label="Easy" value={stats?.easySolved || 0} subtext="problems" />
          <StatsCard label="Medium" value={stats?.mediumSolved || 0} subtext="problems" />
          <StatsCard label="Hard" value={stats?.hardSolved || 0} subtext="problems" />
        </div>

        {/* Rank row */}
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
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Campus Leaderboard
            </p>
            <Button variant="ghost" size="sm" onClick={() => router.push('/leaderboard')} className="text-xs text-muted-foreground">
              View all <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <LeaderboardTable entries={leaderboard.slice(0, 10)} currentUserId={profile?.id} />
        </div>
      </div>
    </div>
  );
}
