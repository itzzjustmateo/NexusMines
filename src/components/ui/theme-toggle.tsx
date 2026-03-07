"use client";

import * as React from "react";
import { SunMedium, MoonStar, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl border border-transparent bg-zinc-100/50 dark:bg-zinc-800/50 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-10 w-10 rounded-xl",
            "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md",
            "border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800",
            "transition-colors duration-200 outline-none"
          )}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <MoonStar className="h-[1.1rem] w-[1.1rem] text-brand-accent" />
          ) : (
            <SunMedium className="h-[1.1rem] w-[1.1rem] text-zinc-900 dark:text-white" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl min-w-[120px] p-1.5 shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "rounded-lg flex items-center gap-2 px-2.5 py-2 text-xs font-semibold cursor-pointer transition-colors focus:bg-zinc-100 dark:focus:bg-zinc-900",
            theme === "light" ? "text-brand-accent" : "text-zinc-600 dark:text-zinc-400"
          )}
        >
          <SunMedium className="h-3.5 w-3.5" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "rounded-lg flex items-center gap-2 px-2.5 py-2 text-xs font-semibold cursor-pointer transition-colors focus:bg-zinc-100 dark:focus:bg-zinc-900",
            theme === "dark" ? "text-brand-accent" : "text-zinc-600 dark:text-zinc-400"
          )}
        >
          <MoonStar className="h-3.5 w-3.5" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "rounded-lg flex items-center gap-2 px-2.5 py-2 text-xs font-semibold cursor-pointer transition-colors focus:bg-zinc-100 dark:focus:bg-zinc-900",
            theme === "system" ? "text-brand-accent" : "text-zinc-600 dark:text-zinc-400"
          )}
        >
          <Monitor className="h-3.5 w-3.5" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
