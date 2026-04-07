import { Pickaxe, Trophy, Users, Zap, Shield, Crown } from "lucide-react";

const FEATURES = [
  {
    icon: Pickaxe,
    title: "Custom Mines",
    description: "Hand-crafted mines with unique layouts, hidden treasures, and exclusive resources.",
  },
  {
    icon: Trophy,
    title: "Rank Progression",
    description: "Earn ranks through gameplay. No pay-to-win—just pure skill and dedication.",
  },
  {
    icon: Users,
    title: "Friendly Community",
    description: "Join thousands of players in a welcoming, toxic-free environment.",
  },
  {
    icon: Zap,
    title: "Lag-Free",
    description: "Optimized 1.21.11 server with dedicated hardware for smooth 20+ TPS.",
  },
  {
    icon: Shield,
    title: "Active Moderation",
    description: "24/7 anti-cheat protection and watchful staff keep griefing away.",
  },
  {
    icon: Crown,
    title: "Weekly Events",
    description: "Tournaments, competitions, and seasonal events with exclusive rewards.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Features</span>
          <h2 className="mt-4 font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-white">
            Everything you need
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div 
              key={feature.title}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            >
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-700 w-fit mb-4">
                <feature.icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
