import { Users, Trophy, Zap, Clock } from "lucide-react";

const STATS = [
  { value: "2.5K+", label: "Active Players", icon: Users },
  { value: "50K+", label: "Monthly Votes", icon: Trophy },
  { value: "99.9%", label: "Uptime", icon: Clock },
  { value: "20", label: "TPS", icon: Zap },
];

export function StatsSection() {
  return (
    <section id="stats" className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <stat.icon className="h-5 w-5 text-zinc-400 dark:text-zinc-500 mb-3" />
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
