"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddressCopy } from "@/components/ui/address-copy";
import { config as defaultConfig } from "@/data/config";
import { useEffect, useState } from "react";
import { Play, Trophy, ChevronDown, Map, Rocket, Users } from "lucide-react";

const QUICK_LINKS = [
  { icon: Trophy, label: "Vote", href: "/vote", color: "text-amber-500" },
  { icon: Map, label: "Rules", href: "/rules", color: "text-blue-500" },
  { icon: Users, label: "Staff", href: "/staff", color: "text-purple-500" },
  { icon: Rocket, label: "Apply", href: "/apply", color: "text-emerald-500" },
];

export function HeroSection() {
  const [javaIp, setJavaIp] = useState(defaultConfig.javaIp);
  const [bedrockIp, setBedrockIp] = useState(defaultConfig.bedrockIp);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then((data) => {
        setJavaIp(data.javaIp || defaultConfig.javaIp);
        setBedrockIp(data.bedrockIp || defaultConfig.bedrockIp);
      })
      .catch(console.error)
      .finally(() => setMounted(true));
  }, []);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-zinc-950">
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 via-transparent to-zinc-50/50 dark:from-zinc-950/50 dark:via-transparent dark:to-zinc-950/50" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center pt-28">
        <h1 className="font-black text-5xl sm:text-6xl md:text-7xl tracking-tight text-zinc-900 dark:text-white mb-4">
          NexusMines
        </h1>
        
        <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
          The ultimate Minecraft experience. Custom gameplay. Real progression. Zero nonsense.
        </p>

        {mounted && (
          <div className="mt-10 flex flex-wrap justify-center items-center gap-3">
            <AddressCopy value={javaIp} label="Java" type="java" />
            <AddressCopy value={bedrockIp} label="Bedrock" type="bedrock" />
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-3">
          <Button asChild size="lg" className="h-12 px-8 rounded-xl text-base font-semibold">
            <Link href="/play">
              <Play className="mr-2 h-4 w-4" />
              Play Now
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-xl text-base font-semibold">
            <Link href="/vote">
              <Trophy className="mr-2 h-4 w-4" />
              Vote
            </Link>
          </Button>
        </div>

        <div className="mt-12 flex justify-center items-center gap-6">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <link.icon className={link.color + " h-4 w-4"} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <button 
            onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-500 transition-colors cursor-pointer"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
