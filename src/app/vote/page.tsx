"use client";

import Link from "next/link";
import { voteSites } from "@/data/vote";
import { Star, Rocket, ExternalLink, Gift, Zap, Heart, MessageSquare } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Star,
  Rocket,
  Gift,
  Zap,
  Heart,
  MessageSquare,
};

function HeroSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Vote for NexusMines
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          Support our server and earn in-game rewards!
        </p>
      </div>
    </section>
  );
}

function VoteList() {
  const enabledSites = voteSites.filter(s => s.enabled);
  
  if (enabledSites.length === 0) {
    return (
      <section className="px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-zinc-500">No voting links available at the moment. Check back later!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-2xl mx-auto">
        <div className="grid gap-4 sm:grid-cols-2">
          {enabledSites.map((site) => {
            const Icon = ICON_MAP[site.icon] || Star;
            return (
              <div 
                key={site.name}
                className="flex flex-col p-6 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-5 w-5 ${site.color}`} />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{site.name}</h3>
                </div>
                <p className="text-sm text-zinc-500 mb-4 flex-1">{site.desc}</p>
                <Link
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-zinc-900 dark:bg-zinc-700 text-white font-medium hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
                >
                  Vote
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RewardsSection() {
  return (
    <section className="px-4 py-12 bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Voting Rewards
        </h2>
        <p className="mt-2 text-zinc-500 text-sm">
          Vote daily to earn exclusive in-game items and currency.
        </p>
      </div>
    </section>
  );
}

export default function VotePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSection />
      <VoteList />
      <RewardsSection />
    </div>
  );
}
