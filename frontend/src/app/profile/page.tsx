'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProfile, fetchLeetcodeStats } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (isAuthenticated) loadProfile();
  }, [isAuthenticated, authLoading]);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    if (!profile?.leetcodeUsername || refreshing) return;
    setRefreshing(true);
    try {
      await fetchLeetcodeStats(profile.leetcodeUsername);
      await loadProfile();
    } catch { /* ignore */ }
    finally { setRefreshing(false); }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = profile?.leetcodeStats;
  const bars = [
    { label: 'Easy', solved: stats?.easySolved || 0, total: 830, cls: 'bg-emerald-500' },
    { label: 'Medium', solved: stats?.mediumSolved || 0, total: 1744, cls: 'bg-amber-500' },
    { label: 'Hard', solved: stats?.hardSolved || 0, total: 778, cls: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen px-5 py-10 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile header */}
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground overflow-hidden shrink-0">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile?.name?.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold tracking-tight">{profile?.name}</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  @{profile?.leetcodeUsername} · {profile?.college?.name} · {profile?.email}
                </p>
                {profile?.collegeRank && (
                  <Badge variant="secondary" className="mt-3">
                    🏆 Rank #{profile.collegeRank} of {profile.totalInCollege}
                  </Badge>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                )}
                {refreshing ? 'Syncing...' : 'Refresh'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard label="Total Solved" value={stats?.totalSolved || 0} subtext="of ~3,352" />
          <StatsCard label="Easy" value={stats?.easySolved || 0} />
          <StatsCard label="Medium" value={stats?.mediumSolved || 0} />
          <StatsCard label="Hard" value={stats?.hardSolved || 0} />
        </div>

        {/* Progress bars */}
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
              Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {bars.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-muted-foreground/50 font-mono text-xs">
                    {item.solved}/{item.total}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.cls} transition-all duration-1000`}
                    style={{ width: `${Math.min((item.solved / item.total) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Extra */}
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
