'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup, getColleges, discoverUser } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { College } from '@/types';

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
    getColleges()
      .then((res) => setColleges(res.data))
      .catch(() => {});
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
      // ignore
    } finally {
      setDiscovering(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        password: form.password,
        leetcodeUsername: form.leetcodeUsername,
      };
      if (form.collegeId) payload.collegeId = parseInt(form.collegeId);

      const res = await signup(payload);
      loginUser(res.data.token, res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors';

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="mt-1.5 text-sm text-white/30">
            Link your LeetCode and start competing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400/80 text-[13px]">
              {error}
            </div>
          )}

          {/* Step 1: LeetCode username first */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  LeetCode Username
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.leetcodeUsername}
                    onChange={(e) =>
                      setForm({ ...form, leetcodeUsername: e.target.value })
                    }
                    className={inputClass}
                    placeholder="your_leetcode_id"
                  />
                  <button
                    type="button"
                    onClick={handleDiscover}
                    disabled={discovering || !form.leetcodeUsername}
                    className="px-4 py-2.5 rounded-lg text-[13px] font-medium bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 transition-colors shrink-0"
                  >
                    {discovering ? '...' : 'Detect'}
                  </button>
                </div>
              </div>

              {detectedSchool && (
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-[12px] text-emerald-400/60 uppercase tracking-wider font-medium">
                    Detected School
                  </p>
                  <p className="mt-1 text-sm text-white/80">{detectedSchool}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.leetcodeUsername}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 disabled:opacity-30 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Account details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  College {detectedSchool && <span className="text-white/15">(auto-detected)</span>}
                </label>
                <select
                  value={form.collegeId}
                  onChange={(e) => setForm({ ...form, collegeId: e.target.value })}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Auto-detect from LeetCode</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-lg text-sm text-white/40 border border-white/[0.08] hover:text-white/60 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-black bg-white hover:bg-white/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-[13px] text-white/20">
          Already have an account?{' '}
          <Link href="/login" className="text-white/50 hover:text-white transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
