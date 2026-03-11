'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup, getColleges } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { College } from '@/types';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    collegeId: '',
    leetcodeUsername: '',
  });
  const [colleges, setColleges] = useState<College[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { loginUser } = useAuth();

  useEffect(() => {
    getColleges()
      .then((res) => setColleges(res.data))
      .catch(() => setError('Failed to load colleges.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signup({
        ...form,
        collegeId: parseInt(form.collegeId),
      });
      loginUser(res.data.token, res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Glow */}
      <div className="absolute top-20 right-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl glow-pulse" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-gray-400">
            Join the campus leaderboard and start competing
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-8 rounded-2xl bg-gray-900/70 border border-gray-800 backdrop-blur-sm"
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              College
            </label>
            <select
              required
              value={form.collegeId}
              onChange={(e) => setForm({ ...form, collegeId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 appearance-none"
            >
              <option value="">Select your college</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              LeetCode Username
            </label>
            <input
              type="text"
              required
              value={form.leetcodeUsername}
              onChange={(e) =>
                setForm({ ...form, leetcodeUsername: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              placeholder="your_leetcode_id"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
