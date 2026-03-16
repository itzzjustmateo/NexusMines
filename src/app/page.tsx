"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddressCopy } from "@/components/ui/address-copy";
import { config } from "@/data/config";
import { Text } from "@/components/ui/text";
import { 
  Play, Users, Trophy, Zap, Shield, Pickaxe, 
  Crown, Heart, Star, ArrowRight, MessageCircle, 
  Gift, Clock, TrendingUp
} from "lucide-react";

const FEATURES = [
  {
    icon: Pickaxe,
    title: "Custom Mines",
    description: "Explore hand-crafted mines with unique layouts, hidden treasures, and exclusive resources.",
    color: "bg-amber-500",
  },
  {
    icon: Trophy,
    title: "Rank Progression",
    description: "Earn ranks through gameplay. No pay-to-win—pure skill and dedication rewarded.",
    color: "bg-purple-500",
  },
  {
    icon: Users,
    title: "Friendly Community",
    description: "Join thousands of players in a welcoming, toxic-free environment.",
    color: "bg-blue-500",
  },
  {
    icon: Zap,
    title: "Lag-Free",
    description: "Optimized 1.21.11 server with dedicated hardware for smooth 20+ TPS gameplay.",
    color: "bg-yellow-500",
  },
  {
    icon: Shield,
    title: "Active Moderation",
    description: "24/7 anti-cheat and watchful staff team keep griefing and toxicity away.",
    color: "bg-red-500",
  },
  {
    icon: Crown,
    title: "Weekly Events",
    description: "Participate in tournaments, competitions, and seasonal events for exclusive rewards.",
    color: "bg-emerald-500",
  },
];

const STATS = [
  { label: "Players Online", value: "150+", icon: Users },
  { label: "Total Votes", value: "12.5K", icon: Trophy },
  { label: "Uptime", value: "99.9%", icon: Clock },
  { label: "TPS", value: "20", icon: Zap },
];

export default function HomePage() {
  const javaIp = config.javaIp;
  const bedrockIp = config.bedrockIp;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-28 bg-zinc-50/70 dark:bg-zinc-950/70 transition-colors duration-300">
        {/* Background Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] opacity-50 dark:opacity-30 pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-120 h-120 bg-indigo-500/10 rounded-full blur-[120px] opacity-50 dark:opacity-30 pointer-events-none" />
        
        <div className="z-10 w-full max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Server IPs */}
          <div className="mb-10 flex flex-wrap justify-center items-center gap-3">
            <AddressCopy value={javaIp} label="Java" type="java" />
            <AddressCopy value={bedrockIp} label="Bedrock" type="bedrock" />
          </div>

          {/* Main Title */}
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-white flex flex-wrap items-center justify-center gap-x-3 transition-colors duration-300">
            Nexus<span className="text-brand-accent">Mines</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-medium transition-colors duration-300 px-2">
            The ultimate Minecraft experience. Custom gameplay. Real progression. Zero nonsense.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <Button asChild className="h-12 px-8 rounded-xl text-base font-bold shadow-lg shadow-brand-accent/25 hover:shadow-xl hover:shadow-brand-accent/30 transition-all hover:-translate-y-0.5">
              <Link href="/play">
                <Play className="mr-2 h-5 w-5" />
                Play Now
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 px-8 rounded-xl text-base font-bold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
              <Link href="/vote">
                <Trophy className="mr-2 h-5 w-5" />
                Vote
              </Link>
            </Button>
          </div>

          {/* Version Badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Text size="sm" variant="muted" className="font-medium">Java 1.21.11 • Bedrock Supported</Text>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white/50 dark:bg-zinc-950/50 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="p-3 rounded-2xl bg-brand-accent/10 text-brand-accent mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">{stat.value}</span>
                <Text size="sm" variant="muted">{stat.label}</Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-zinc-50/70 dark:bg-zinc-950/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white">
              Why Choose <span className="text-brand-accent">NexusMines</span>
            </h2>
            <Text variant="muted" className="mt-3 max-w-xl mx-auto">
              We go beyond vanilla Minecraft. Experience a server built for players who want more.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <Card key={feature.title} className="group hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-300 border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`p-3 rounded-2xl ${feature.color}/10 text-${feature.color.split('-')[1]}-500 dark:text-${feature.color.split('-')[1]}-400 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                  <Text variant="muted">{feature.description}</Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Discord CTA */}
      <section className="py-20 px-4 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-[#5865F2]/10 text-[#5865F2] mb-6">
            <MessageCircle className="h-10 w-10" />
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white">
            Join Our <span className="text-[#5865F2]">Discord</span>
          </h2>
          <Text variant="muted" className="mt-3 max-w-lg mx-auto">
            Connect with the community, get updates, participate in events, and chat with the staff team.
          </Text>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild className="h-12 px-8 rounded-xl text-base font-bold bg-[#5865F2] hover:bg-[#4752C4] shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              <Link href="https://discord.gg/nexusmines" target="_blank">
                <ArrowRight className="mr-2 h-5 w-5" />
                Join Discord
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 px-8 rounded-xl text-base font-bold border-zinc-200 dark:border-zinc-800">
              <Link href="/apply">
                <Heart className="mr-2 h-5 w-5" />
                Apply for Staff
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Vote CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-50/70 to-zinc-100/70 dark:from-zinc-950/70 dark:to-zinc-900/70">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-amber-500/10 text-amber-500 mb-6">
            <Gift className="h-10 w-10" />
          </div>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white">
            Vote for <span className="text-amber-500">NexusMines</span>
          </h2>
          <Text variant="muted" className="mt-3 max-w-lg mx-auto">
            Support the server and earn exclusive rewards. Voting helps us grow and attract new players.
          </Text>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild className="h-12 px-8 rounded-xl text-base font-bold bg-amber-500 hover:bg-amber-600 shadow-lg hover:shadow-amber-500/25 transition-all hover:-translate-y-0.5">
              <Link href="/vote">
                <Star className="mr-2 h-5 w-5" />
                Vote Now
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 px-8 rounded-xl text-base font-bold">
              <Link href="/vote">
                <TrendingUp className="mr-2 h-5 w-5" />
                View Rewards
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
