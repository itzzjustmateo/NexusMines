"use client";

import { rules } from "@/data/rules";
import { ShieldAlert, AlertCircle, BugOff, UserCheck, MegaphoneOff, Gavel, Zap, MessageSquare, Brain, Coins, Shield, Gamepad2 } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert,
  UserCheck,
  BugOff,
  MegaphoneOff,
  Gavel,
  AlertCircle,
  Zap,
  MessageSquare,
  Brain,
  Coins,
  Shield,
  Gamepad2
};

function HeroSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Server Rules
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          Follow these guidelines to ensure a fair experience for everyone.
        </p>
      </div>
    </section>
  );
}

function RulesList() {
  return (
    <section className="px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-3xl mx-auto space-y-12">
        {rules.map((category) => {
          const CategoryIcon = ICON_MAP[category.icon] || Shield;
          
          return (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700">
                  <CategoryIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {category.title}
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {category.rules.map((rule, ruleIndex) => {
                  const Icon = (rule.icon && ICON_MAP[rule.icon]) || AlertCircle;
                  
                  return (
                    <div 
                      key={rule.id}
                      className="flex gap-3 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    >
                      <Icon className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-zinc-400">
                            {rule.id}
                          </span>
                          <h3 className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                            {rule.title}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2">
                          {rule.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSection />
      <RulesList />
    </div>
  );
}
