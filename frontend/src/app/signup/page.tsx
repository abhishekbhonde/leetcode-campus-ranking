'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup, getColleges, discoverUser } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { College } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    collegeId: '',
    leetcodeUsername: '',
  });
  const [colleges, setColleges] = useState<College[]>([]);
  const [detectedSchool, setDetectedSchool] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const router = useRouter();
  const { loginUser } = useAuth();

  useEffect(() => {
    getColleges().then((res) => setColleges(res.data)).catch(() => {});
  }, []);

  const handleDiscover = async () => {
    if (!form.leetcodeUsername) return;
    setDiscovering(true);
    setDetectedSchool(null);
    try {
      const res = await discoverUser(form.leetcodeUsername);
      if (res.data.school) {
        setDetectedSchool(res.data.school);
        if (res.data.matchedCollege) {
          setForm({ ...form, collegeId: String(res.data.matchedCollege.id) });
        }
      }
    } catch {
      /* ignore */
    } finally {
      setDiscovering(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        password: form.password,
        leetcodeUsername: form.leetcodeUsername,
      };
      if (form.collegeId) payload.collegeId = parseInt(form.collegeId);
      const res = await signup(payload as Parameters<typeof signup>[0]);
      loginUser(res.data.token, res.data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create account</CardTitle>
            <CardDescription>Link your LeetCode and start competing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                      LeetCode Username
                    </label>
                    <div className="flex gap-2">
                      <Input
                        required
                        value={form.leetcodeUsername}
                        onChange={(e) => setForm({ ...form, leetcodeUsername: e.target.value })}
                        placeholder="your_leetcode_id"
                        className="bg-secondary/50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDiscover}
                        disabled={discovering || !form.leetcodeUsername}
                        className="shrink-0"
                      >
                        {discovering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {detectedSchool && (
                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                      <p className="text-[11px] text-emerald-500/60 uppercase tracking-wider font-medium">
                        Detected School
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-foreground">{detectedSchool}</p>
                        <Badge variant="success" className="text-[10px]">matched</Badge>
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!form.leetcodeUsername}
                    className="w-full"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Name</label>
                    <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                    <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Password</label>
                    <Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" minLength={6} className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                      College {detectedSchool && <span className="text-muted-foreground/40">(auto-detected)</span>}
                    </label>
                    <select
                      value={form.collegeId}
                      onChange={(e) => setForm({ ...form, collegeId: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none"
                    >
                      <option value="">Auto-detect from LeetCode</option>
                      {colleges.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {loading ? 'Creating...' : 'Create Account'}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-foreground hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
