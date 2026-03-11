'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
              <span className="text-black font-bold text-xs">LC</span>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">
              Campus Rank
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/leaderboard">Leaderboard</NavLink>
                <NavLink href="/profile">Profile</NavLink>
                <div className="w-px h-5 bg-white/10 mx-3" />
                <span className="text-[13px] text-white/40 mr-3">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-[13px] text-white/40 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink href="/login">Login</NavLink>
                <Link
                  href="/signup"
                  className="ml-2 px-4 py-1.5 text-[13px] font-medium text-black bg-white rounded-md hover:bg-white/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/60 hover:text-white p-1"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-white/[0.06] mt-2 pt-3 space-y-1">
            {isAuthenticated ? (
              <>
                <MobileLink href="/dashboard" onClick={() => setOpen(false)}>Dashboard</MobileLink>
                <MobileLink href="/leaderboard" onClick={() => setOpen(false)}>Leaderboard</MobileLink>
                <MobileLink href="/profile" onClick={() => setOpen(false)}>Profile</MobileLink>
                <button onClick={() => { logout(); setOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-white/40 hover:text-white rounded-md">Logout</button>
              </>
            ) : (
              <>
                <MobileLink href="/login" onClick={() => setOpen(false)}>Login</MobileLink>
                <MobileLink href="/signup" onClick={() => setOpen(false)}>Sign Up</MobileLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3 py-1.5 text-[13px] text-white/50 hover:text-white transition-colors rounded-md hover:bg-white/[0.04]">
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] rounded-md">
      {children}
    </Link>
  );
}
