import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[85vh] px-5">
        {/* Subtle gradient orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] text-[12px] text-white/40 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open for all campuses
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            LeetCode rankings
            <br />
            <span className="text-white/40">for your campus.</span>
          </h1>

          <p className="mt-5 text-base text-white/30 max-w-md mx-auto leading-relaxed">
            Track your progress, compete with peers, and see where you stand
            among the best coders at your college.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/90 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white/50 border border-white/[0.08] rounded-lg hover:text-white hover:border-white/20 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.06]">
            {[
              {
                title: 'Auto-detect College',
                desc: 'We fetch your school from your LeetCode profile and auto-match you to your campus.',
              },
              {
                title: 'Live Rankings',
                desc: 'Stats sync every 6 hours. Easy, Medium, Hard — everything tracked automatically.',
              },
              {
                title: 'Campus Leaderboard',
                desc: 'See your rank among all LeetCoders at your college. Compete and stay motivated.',
              },
            ].map((f, i) => (
              <div key={i} className="p-7 bg-black">
                <p className="text-sm font-medium text-white/80">{f.title}</p>
                <p className="mt-2 text-[13px] text-white/25 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-6 px-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-[12px] text-white/15">Campus Rank</p>
          <a href="https://leetcode.com" target="_blank" className="text-[12px] text-white/15 hover:text-white/30 transition-colors">
            LeetCode
          </a>
        </div>
      </footer>
    </div>
  );
}
