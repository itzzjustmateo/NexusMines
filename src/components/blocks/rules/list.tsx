"use client";

import { rules } from "@/data/rules";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldAlert, 
  UserCheck, 
  BugOff, 
  MegaphoneOff, 
  Gavel,
  AlertCircle,
  Clock,
  Heart,
  Star,
  Zap,
  Hammer,
  Lock,
  MessageSquare,
  Globe,
  Ghost,
  Sword,
  Axe
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert,
  UserCheck,
  BugOff,
  MegaphoneOff,
  Gavel,
  AlertCircle,
  Clock,
  Heart,
  Star,
  Zap,
  Hammer,
  Lock,
  MessageSquare,
  Globe,
  Ghost,
  Sword,
  Axe
};

export function List() {
  return (
    <div className="mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
      {rules.map((rule, i) => {
        const Icon = (rule.icon && ICON_MAP[rule.icon]) || AlertCircle;
        
        return (
          <Card 
            key={rule.id} 
            className="group hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-500 overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:shadow-md"
          >
            <CardContent className="p-6 flex items-start gap-5">
              <div className="relative mt-1">
                <div className="absolute -inset-2 bg-brand-accent/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group-hover:border-brand-accent/50 transition-colors duration-500">
                  <Icon className="h-5 w-5 text-brand-accent" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Text size="xs" weight="black" className="text-zinc-400/50 tabular-nums">
                    {(i + 1).toString().padStart(2, '0')}
                  </Text>
                  <Text size="md" weight="extrabold" className="text-zinc-900 dark:text-zinc-100">
                    {rule.title}
                  </Text>
                </div>
                <Text size="sm" variant="muted" className="leading-relaxed">
                  {rule.desc}
                </Text>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
