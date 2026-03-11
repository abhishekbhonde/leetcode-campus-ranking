import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl glow-pulse" />
      <div className="absolute top-40 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl glow-pulse" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Campus Competitive Programming
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            Climb the{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              LeetCode
            </span>
            <br />
            Rankings at Your College
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Track your LeetCode progress, compete with peers from your campus,
            and rise through the leaderboard. See where you stand among the best
            coders at your college.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl hover:from-amber-300 hover:to-orange-400 shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-300 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800 hover:text-white transition-all"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why <span className="text-amber-400">Campus Rank</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏆',
                title: 'College Leaderboards',
                description:
                  'See your rank among all LeetCoders at your campus. Compete and stay motivated.',
              },
              {
                icon: '📊',
                title: 'Real-Time Stats',
                description:
                  'Your LeetCode stats sync automatically every 6 hours. Easy, Medium, Hard — all tracked.',
              },
              {
                icon: '🎯',
                title: 'Difficulty Breakdown',
                description:
                  'Understand your strengths. Detailed breakdown across Easy, Medium, and Hard problems.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-amber-500/30 hover:bg-gray-900/80 transition-all"
              >
                <span className="text-4xl">{feature.icon}</span>
                <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 border border-amber-500/20">
            <h2 className="text-3xl font-bold">
              Ready to compete?
            </h2>
            <p className="mt-4 text-gray-400">
              Join hundreds of students already tracking their LeetCode journey on Campus Rank.
            </p>
            <Link
              href="/signup"
              className="inline-block mt-8 px-8 py-4 text-base font-semibold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl hover:from-amber-300 hover:to-orange-400 shadow-xl shadow-amber-500/20 transition-all"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 Campus Rank. Built for competitive programmers.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://leetcode.com" target="_blank" className="hover:text-amber-400 transition-colors">LeetCode</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
