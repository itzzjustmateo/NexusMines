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
  Zap,
  MessageSquare,
  Brain,
  Coins,
  Shield,
  Gamepad2
} from "lucide-react";

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

export function List() {
  return (
    <div className="mt-16 space-y-16">
      {rules.map((category, categoryIndex) => {
        const CategoryIcon = (ICON_MAP[category.icon]) || Shield;
        
        return (
          <div 
            key={category.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${categoryIndex * 150}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-brand-accent/10 border border-brand-accent/20">
                <CategoryIcon className="h-5 w-5 text-brand-accent" />
              </div>
              <Text size="xl" weight="extrabold" className="text-zinc-900 dark:text-white tracking-tight">
                {category.title}
              </Text>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {category.rules.map((rule, ruleIndex) => {
                const Icon = (rule.icon && ICON_MAP[rule.icon]) || AlertCircle;
                
                return (
                  <Card 
                    key={rule.id} 
                    className="group hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-500 overflow-hidden border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm hover:shadow-md hover:border-brand-accent/30"
                  >
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="relative mt-0.5">
                        <div className="absolute -inset-1.5 bg-brand-accent/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative p-2 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 group-hover:border-brand-accent/40 transition-colors duration-500">
                          <Icon className="h-4 w-4 text-brand-accent" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Text size="xs" weight="black" className="text-zinc-400/60 tabular-nums">
                            {categoryIndex + 1}.{ruleIndex + 1}
                          </Text>
                          <Text size="sm" weight="bold" className="text-zinc-900 dark:text-zinc-100 truncate">
                            {rule.title}
                          </Text>
                        </div>
                        <Text size="xs" variant="muted" className="leading-relaxed line-clamp-2">
                          {rule.desc}
                        </Text>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}