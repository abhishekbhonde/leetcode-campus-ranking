import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/aceternity/spotlight";
import { GlowCard } from "@/components/aceternity/glow-card";

export default function Home() {
  const features = [
    {
      title: "Auto-detect College",
      desc: "We fetch your school from your LeetCode profile and auto-match you to your campus leaderboard.",
      icon: "🔍",
    },
    {
      title: "Live Rankings",
      desc: "Stats sync every 6 hours. Easy, Medium, Hard — everything tracked and ranked automatically.",
      icon: "📊",
    },
    {
      title: "Campus Leaderboard",
      desc: "See your rank among all LeetCoders at your college. Compete, improve, and stay motivated.",
      icon: "🏆",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Spotlight effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[88vh] px-5">
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Open for all campuses
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight">
              LeetCode rankings{" "}
              <span className="text-muted-foreground">for your campus.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Track your progress, compete with peers, and climb the leaderboard
              at your college.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto text-sm px-8">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-sm px-8">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 pb-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground text-center mb-10">
            Why Campus Rank
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <GlowCard key={i} className="p-6">
                <div style={{ transform: "translateZ(20px)" }}>
                  <span className="text-3xl">{f.icon}</span>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-28">
        <div className="max-w-xl mx-auto text-center px-8 py-14 rounded-2xl border border-border bg-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.01]" />
          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight">Ready to compete?</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Join students already tracking their LeetCode journey.
            </p>
            <Button asChild size="lg" className="mt-8 px-8 text-sm">
              <Link href="/signup">Create Your Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground/50">Campus Rank</p>
          <a href="https://leetcode.com" target="_blank" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            LeetCode
          </a>
        </div>
      </footer>
    </div>
  );
}
