"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddressCopy } from "@/components/ui/address-copy";
import { config as defaultConfig } from "@/data/config";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Play, Users, Trophy, Zap, Shield, Pickaxe, 
  Crown, Heart, Star, ArrowRight, MessageCircle, 
  Gift, Sparkles, Swords, Gem, ChevronDown, Mountain
} from "lucide-react";

const FEATURES = [
  {
    icon: Pickaxe,
    title: "Custom Mines",
    description: "Hand-crafted mines with unique layouts, hidden treasures, and exclusive resources waiting to be discovered.",
    color: "amber",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Trophy,
    title: "Rank Progression",
    description: "Earn ranks through gameplay. No pay-to-win—just pure skill and dedication rewarded.",
    color: "purple",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Users,
    title: "Friendly Community",
    description: "Join thousands of players in a welcoming, toxic-free environment where everyone belongs.",
    color: "blue",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Zap,
    title: "Lag-Free",
    description: "Optimized 1.21.11 server with dedicated hardware for smooth, consistent 20+ TPS.",
    color: "yellow",
    gradient: "from-yellow-500/20 to-amber-500/20",
  },
  {
    icon: Shield,
    title: "Active Moderation",
    description: "24/7 anti-cheat protection and watchful staff keep griefing and toxicity away.",
    color: "red",
    gradient: "from-red-500/20 to-rose-500/20",
  },
  {
    icon: Crown,
    title: "Weekly Events",
    description: "Tournaments, competitions, and seasonal events with exclusive rewards up for grabs.",
    color: "emerald",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
];

const STATS = [
  { value: "2.5K+", label: "Active Players", icon: Users },
  { value: "50K+", label: "Monthly Votes", icon: Trophy },
  { value: "99.9%", label: "Uptime", icon: Zap },
  { value: "20", label: "TPS", icon: Mountain },
];

export default function HomePage() {
  const [javaIp, setJavaIp] = useState(defaultConfig.javaIp);
  const [bedrockIp, setBedrockIp] = useState(defaultConfig.bedrockIp);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/config")
      .then(res => res.json())
      .then((data) => {
        if (data.javaIp) setJavaIp(data.javaIp);
        if (data.bedrockIp) setBedrockIp(data.bedrockIp);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating Icons */}
          <Gem className="absolute top-32 right-20 h-6 w-6 text-brand-accent/10 animate-bounce" style={{ animationDuration: '3s' }} />
          <Sparkles className="absolute top-40 left-1/4 h-5 w-5 text-amber-500/10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          <Swords className="absolute bottom-40 left-20 h-6 w-6 text-red-500/10 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-20 pb-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="h-4 w-4" />
            <span>Now on Minecraft 1.21.11</span>
          </div>

          {/* Main Title */}
          <h1 className="font-black text-5xl sm:text-6xl md:text-8xl tracking-tight text-zinc-900 dark:text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Welcome to
          </h1>
          <div className="mt-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <span className="font-black text-6xl sm:text-7xl md:text-9xl tracking-tight bg-gradient-to-r from-brand-accent via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              NexusMines
            </span>
          </div>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            The ultimate Minecraft experience. Custom gameplay. Real progression. Zero nonsense.
          </p>

          {/* Server IPs */}
          {mounted && (
            <div className="mt-10 flex flex-wrap justify-center items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <AddressCopy value={javaIp} label="Java" type="java" />
              <AddressCopy value={bedrockIp} label="Bedrock" type="bedrock" />
            </div>
          )}

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-brand-accent/25 hover:shadow-2xl hover:shadow-brand-accent/30 transition-all hover:-translate-y-1 group">
              <Link href="/play">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Play Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all hover:-translate-y-1">
              <Link href="/vote">
                <Trophy className="mr-2 h-5 w-5" />
                Vote for Us
              </Link>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <button 
              onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-zinc-400 hover:text-brand-accent transition-colors cursor-pointer"
            >
              <ChevronDown className="h-8 w-8 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div 
                key={stat.label} 
                className="flex flex-col items-center text-center group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-brand-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-brand-accent/10 transition-colors">
                    <stat.icon className="h-8 w-8 text-brand-accent" />
                  </div>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">{stat.value}</span>
                <Text variant="muted" className="font-medium">{stat.label}</Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-accent font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="mt-4 font-black text-4xl sm:text-5xl text-zinc-900 dark:text-white">
              Everything You Need
            </h2>
            <Text variant="muted" className="mt-4 max-w-xl mx-auto text-lg">
              Experience the best Minecraft server with features built for players, by players.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div 
                key={feature.title}
                className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-transparent shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  feature.gradient
                )} />
                
                <div className="relative z-10">
                  <div className={cn(
                    "inline-flex p-3 rounded-2xl mb-6 bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                    `bg-${feature.color}-500/10 text-${feature.color}-500 dark:text-${feature.color}-400`
                  )}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
                  <Text variant="muted">{feature.description}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent via-indigo-600 to-purple-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Crown className="h-16 w-16 mx-auto text-white/80 mb-6" />
          <h2 className="font-black text-4xl sm:text-5xl md:text-6xl text-white">
            Ready to Play?
          </h2>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
            Join thousands of players already experiencing the best Minecraft server. Your adventure starts now.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold bg-white text-brand-accent hover:bg-zinc-100 shadow-xl transition-all hover:-translate-y-1 group">
              <Link href="/play">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start Playing
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all">
              <Link href="https://discord.gg/nexusmines" target="_blank">
                <MessageCircle className="mr-2 h-5 w-5" />
                Join Discord
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Vote Section */}
      <section className="py-24 px-4 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-amber-500/10 mb-8">
            <Gift className="h-14 w-14 text-amber-500" />
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-zinc-900 dark:text-white">
            Support NexusMines
          </h2>
          <Text variant="muted" className="mt-4 text-lg max-w-xl mx-auto">
            Vote for us on top server lists and help us grow. In return, unlock exclusive rewards!
          </Text>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild className="h-12 px-8 rounded-xl text-base font-bold bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-1">
              <Link href="/vote">
                <Star className="mr-2 h-5 w-5" />
                Vote Now
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 px-8 rounded-xl text-base font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30">
              <Link href="/vote">
                <Trophy className="mr-2 h-5 w-5" />
                View Rewards
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
