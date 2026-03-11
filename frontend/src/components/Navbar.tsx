'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              LC
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">
              Campus <span className="text-amber-400">Rank</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  Dashboard
                </Link>
                <Link
                  href="/leaderboard"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  Profile
                </Link>
                <div className="w-px h-6 bg-gray-700 mx-2" />
                <span className="text-sm text-gray-400 mr-2">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">Dashboard</Link>
                <Link href="/leaderboard" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">Leaderboard</Link>
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">Profile</Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">Login</Link>
                <Link href="/signup" className="block px-4 py-2 text-sm text-amber-400 hover:bg-gray-800 rounded-lg">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
