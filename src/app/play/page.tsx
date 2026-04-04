"use client";

import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { AddressCopy } from "@/components/ui/address-copy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { config as defaultConfig } from "@/data/config";
import { 
  Play, Monitor, Smartphone, Wifi, WifiOff,
  Users, Copy, Check, Rocket, Sparkles, ChevronRight,
  Gamepad2, RefreshCcw, Loader2
} from "lucide-react";
import Link from "next/link";

interface ServerConfig {
  javaIp: string;
  bedrockIp: string;
  javaPort: number;
  bedrockPort: number;
}

interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
}

const STEPS = [
  {
    number: 1,
    icon: Copy,
    title: "Copy the IP",
    description: "Click on your preferred edition below to copy the server address instantly.",
  },
  {
    number: 2,
    icon: Rocket,
    title: "Launch Game",
    description: "Open Minecraft 1.21 or higher on your device.",
  },
  {
    number: 3,
    icon: Gamepad2,
    title: "Add Server",
    description: "Go to Multiplayer → Add Server and paste the IP.",
  },
];

export default function PlayPage() {
  const [javaIp, setJavaIp] = useState(defaultConfig.javaIp);
  const [bedrockIp, setBedrockIp] = useState(defaultConfig.bedrockIp);
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/config")
      .then(res => res.json())
      .then((data: ServerConfig) => {
        if (data.javaIp) setJavaIp(data.javaIp);
        if (data.bedrockIp) setBedrockIp(data.bedrockIp);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${javaIp}`);
        const data = await res.json();
        setStatus({
          online: data.online,
          players: data.players,
        });
      } catch {
        setStatus({ online: false });
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [javaIp, mounted]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Join the Adventure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tight">
            How to <span className="text-brand-accent">Play</span>
          </h1>
          
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Get started in minutes. Follow these simple steps and join our community.
          </p>
        </div>
      </section>

      {/* Server Cards Section */}
      <section className="px-4 pb-20 -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Java Edition Card */}
            <div className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Gradient Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-emerald-500/10">
                    <Monitor className="h-7 w-7 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Java Edition</h3>
                    <p className="text-sm text-zinc-500">PC / Mac</p>
                  </div>
                  {statusLoading ? (
                    <Skeleton className="ml-auto h-6 w-16 rounded-full" />
                  ) : (
                    <div className={cn(
                      "ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                      status?.online 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                    )}>
                      {status?.online ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span>{status.players?.online || 0} online</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-3 w-3" />
                          <span>Offline</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Server IP</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white font-mono">{javaIp}</p>
                    </div>
                    {/* {mounted && <AddressCopy value={javaIp} label="Java" type="java" showLabel={false} />} */}
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Port</p>
                    <p className="font-bold text-zinc-900 dark:text-white font-mono">25565</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bedrock Edition Card */}
            <div className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Gradient Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-blue-500/10">
                    <Smartphone className="h-7 w-7 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Bedrock Edition</h3>
                    <p className="text-sm text-zinc-500">Mobile / Console / Windows</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Server IP</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white font-mono">{bedrockIp}</p>
                    </div>
                    {/* {mounted && <AddressCopy value={bedrockIp} label="Bedrock" type="bedrock" showLabel={false} />} */}
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Port</p>
                    <p className="font-bold text-zinc-900 dark:text-white font-mono">19132</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Quick Setup Guide
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Follow these steps to join in minutes
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div 
                key={step.number}
                className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 text-center group hover:border-brand-accent/30 hover:shadow-lg transition-all duration-300"
              >
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="w-6 h-6 rounded-full bg-brand-accent text-white text-sm font-bold flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="inline-flex p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-brand-accent/10 transition-colors mb-4">
                    <step.icon className="h-6 w-6 text-zinc-500 group-hover:text-brand-accent transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{step.description}</p>
                </div>

                {/* Arrow Connector (hidden on mobile and last item) */}
                {i < STEPS.length - 1 && (
                  <ChevronRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300 dark:text-zinc-600 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-brand-accent via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-center text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIiBzdHJva2Utd2lkdGg9IjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
            </div>

            <div className="relative">
              <Play className="h-14 w-14 mx-auto mb-6 opacity-90" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Ready to Start Your Adventure?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8">
                Join thousands of players exploring our custom mines. Create your account and start playing today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 rounded-xl text-base font-bold bg-white text-brand-accent hover:bg-zinc-100 shadow-xl">
                  <Link href="https://www.minecraft.net/download">
                    <Rocket className="mr-2 h-5 w-5" />
                    Get Minecraft
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-xl text-base font-bold border-2 border-white/30 text-white hover:bg-white/10">
                  <Link href="/rules">
                    Read Rules
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
