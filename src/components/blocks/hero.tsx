"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, MoonStar, SunMedium } from "lucide-react";
import { AddressCopy } from "@/components/ui/address-copy";
import { config } from "@/data/config";

export function Hero() {
  const javaIp = config.javaIp;
  const bedrockIp = config.bedrockIp;

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 bg-zinc-50/70 dark:bg-zinc-950/70 transition-colors duration-300">
      {/* Server IP Display */}
      <div className="mb-12 flex flex-wrap justify-center items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <AddressCopy value={javaIp} label="Java" type="java" />
        <AddressCopy value={bedrockIp} label="Bedrock" type="bedrock" />
      </div>

      {/* Main title */}
      <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 px-4">
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-white flex flex-wrap items-center justify-center gap-x-3 transition-colors duration-300">
          Nexus
          <span className="text-brand-accent">Mines</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-zinc-600 dark:text-zinc-400 text-base sm:text-lg font-medium transition-colors duration-300 px-2">
          The best Mine-Server experience. Custom gameplay. <br className="hidden sm:block" />
          Real progression. Zero nonsense.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-6 mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <Button asChild variant="ghost" className="w-full sm:w-auto h-auto py-3 px-8 rounded-xl flex flex-col items-center group relative border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm transition-all duration-300">
          <Link href="/vote">
            <span className="text-base font-bold tracking-tight">Vote now!</span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] px-2 py-px rounded bg-zinc-100 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap">
              Boost the server
            </span>
          </Link>
        </Button>

        <Button asChild variant="ghost" className="h-auto py-3 px-8 rounded-xl flex flex-col items-center group relative border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm transition-all duration-300">
          <Link href="/about">
            <span className="text-base font-bold tracking-tight">Learn More</span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] px-2 py-px rounded bg-zinc-100 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap">
              Explore features
            </span>
          </Link>
        </Button>
      </div>

      {/* Feature cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
        {/* Custom Mines */}
        <Card className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-500 group cursor-default border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1">
          <CardContent className="flex flex-col items-center py-10">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 mb-4 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors duration-300">
              <SunMedium className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Custom Mines</h3>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
              Crafted worlds, custom-built for legends.<br />
              Unique maps you won&apos;t find anywhere else.
            </p>
          </CardContent>
        </Card>

        {/* Active Economy */}
        <Card className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-500 group cursor-default border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1">
          <CardContent className="flex flex-col items-center py-10">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 mb-4 group-hover:bg-white dark:group-hover:bg-emerald-900/20 transition-colors duration-300">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Active Economy</h3>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
              Player-driven market, pure progression.<br />
              Trade, earn, and dominate the leaderboard.
            </p>
          </CardContent>
        </Card>

        {/* Lag-Free Experience */}
        <Card className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-500 group cursor-default border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1">
          <CardContent className="flex flex-col items-center py-10">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 mb-4 group-hover:bg-white dark:group-hover:bg-blue-900/20 transition-colors duration-300">
              <MoonStar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Lag-Free</h3>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
              Optimized for performance—no lag, just play.<br />
              Dedicated hardware for smooth gameplay.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
