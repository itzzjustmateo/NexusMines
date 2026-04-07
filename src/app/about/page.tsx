"use client";

import Link from "next/link";
import { Users, Pickaxe, Shield, Zap, Crown, MessageCircle } from "lucide-react";

function HeroSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          About NexusMines
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          The ultimate Minecraft experience with custom gameplay, real progression, and zero pay-to-win.
        </p>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Our Story</h2>
        <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
          <p>
            NexusMines started with a simple vision: create a Minecraft server that prioritizes player experience above all else. 
            We wanted to build something different—a server where your time and skills truly matter.
          </p>
          <p>
            Tired of servers filled with pay-to-win mechanics, aggressive monetization, and toxic communities, we set out 
            to create our own space. One where players can genuinely progress, connect with others, and enjoy Minecraft the way 
            it was meant to be.
          </p>
          <p>
            Today, NexusMines continues to grow thanks to our amazing community. Every update, every event, and every feature 
            is shaped by player feedback. We believe in building something together.
          </p>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Pickaxe,
    title: "Custom Mines",
    description: "Hand-crafted mines with unique layouts, hidden treasures, and exclusive resources waiting to be discovered.",
    size: "large",
  },
  {
    icon: Crown,
    title: "Rank Progression",
    description: "Earn ranks through pure gameplay. No pay-to-win—just skills and dedication.",
    size: "normal",
  },
  {
    icon: Users,
    title: "Active Community",
    description: "Join thousands of players in a welcoming, toxic-free environment.",
    size: "normal",
  },
  {
    icon: Shield,
    title: "Fair Play",
    description: "24/7 anti-cheat protection and active moderation ensure a level field.",
    size: "tall",
  },
  {
    icon: Zap,
    title: "Optimized Performance",
    description: "Dedicated hardware for smooth 20+ TPS.",
    size: "normal",
  },
  {
    icon: MessageCircle,
    title: "Weekly Events",
    description: "Tournaments and competitions with exclusive rewards.",
    size: "normal",
  },
];

function FeaturesSection() {
  return (
    <section className="px-4 py-12 bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-8 text-center">What Makes Us Different</h2>
        
        <div className="grid grid-cols-4 grid-rows-3 gap-3 h-[600px]">
          {FEATURES.map((feature, index) => {
            const gridClasses = {
              large: "col-span-2 row-span-2",
              tall: "col-span-1 row-span-2",
              normal: "col-span-1 row-span-1",
            }[feature.size] || "col-span-1 row-span-1";
            
            return (
              <div 
                key={feature.title}
                className={`${gridClasses} group relative p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/50 to-transparent dark:from-zinc-700/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  <feature.icon className="h-16 w-16 text-zinc-300 dark:text-zinc-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "2.5K+", label: "Active Players" },
    { value: "50K+", label: "Monthly Votes" },
    { value: "99.9%", label: "Uptime" },
    { value: "20+", label: "TPS" },
  ];

  return (
    <section className="px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="px-4 py-12 bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
          Join Our Community
        </h2>
        <p className="text-zinc-500 mb-6">
          Whether you have questions, feedback, or just want to chat—we&apos;d love to hear from you!
        </p>
        <div className="flex justify-center gap-3">
          <Link 
            href="https://discord.gg/nexusmines" 
            className="px-4 py-2 rounded-lg bg-[#5865F2] text-white font-medium hover:bg-[#4752C4] transition-colors"
          >
            Join Discord
          </Link>
          <Link 
            href="https://github.com/itzzjustmateo/NexusMines" 
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSection />
      <StorySection />
      <FeaturesSection />
      <StatsSection />
      <ContactSection />
    </div>
  );
}
