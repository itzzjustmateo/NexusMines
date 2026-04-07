"use client";

import { useEffect, useState } from "react";
import { AddressCopy } from "@/components/ui/address-copy";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { config as defaultConfig } from "@/data/config";
import Link from "next/link";
import { Play, Monitor, Smartphone, WifiOff, Copy, Rocket, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    description: "Click on your preferred edition below to copy the server address.",
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

function HeroSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white">
          How to Play
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          Get started in minutes. Follow these simple steps.
        </p>
      </div>
    </section>
  );
}

function ServerCards({
  javaIp,
  bedrockIp,
  status,
  statusLoading
}: {
  javaIp: string;
  bedrockIp: string;
  status: ServerStatus | null;
  statusLoading: boolean;
}) {
  return (
    <section className="px-4 py-16 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-xl mx-auto">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-700">
                <Monitor className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-900 dark:text-white">Java</h3>
                <p className="text-xs text-zinc-500">PC / Mac</p>
              </div>
              {statusLoading ? (
                <Skeleton className="ml-auto h-5 w-14 rounded-full shrink-0" />
              ) : (
                <div className={cn(
                  "ml-auto text-xs px-2 py-1 rounded-full shrink-0",
                  status?.online 
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
                    : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500"
                )}>
                  {status?.online ? `${status.players?.online || 0}` : "Offline"}
                </div>
              )}
            </div>
            <AddressCopy value={javaIp} label="Java" type="java" />
            <p className="mt-2 text-xs text-zinc-500">Port: 25565</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-700">
                <Smartphone className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-900 dark:text-white">Bedrock</h3>
                <p className="text-xs text-zinc-500">Mobile / Console</p>
              </div>
            </div>
            <AddressCopy value={bedrockIp} label="Bedrock" type="bedrock" />
            <p className="mt-2 text-xs text-zinc-500">Port: 19132</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="px-4 py-16 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white text-center mb-10">
          Quick Setup
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div 
              key={step.number}
              className="text-center"
            >
              <div className="inline-flex p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                <step.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{step.title}</h3>
              <p className="text-sm text-zinc-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-4 py-16 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Ready to play?
        </h2>
        <p className="mt-2 text-zinc-500 mb-6">
          Join thousands of players in our custom mines.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="h-11 px-6 rounded-lg font-medium">
            <Link href="https://www.minecraft.net/download" target="_blank">
              Get Minecraft
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-6 rounded-lg font-medium">
            <Link href="/rules">
              Read Rules
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function PlayPage() {
  const [javaIp, setJavaIp] = useState(defaultConfig.javaIp);
  const [bedrockIp, setBedrockIp] = useState(defaultConfig.bedrockIp);
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then((data: ServerConfig) => {
        if (data.javaIp) setJavaIp(data.javaIp);
        if (data.bedrockIp) setBedrockIp(data.bedrockIp);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
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
  }, [javaIp]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSection />
      <ServerCards 
        javaIp={javaIp} 
        bedrockIp={bedrockIp} 
        status={status} 
        statusLoading={statusLoading} 
      />
      <StepsSection />
      <CTASection />
    </div>
  );
}
