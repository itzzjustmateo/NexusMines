"use client";

import Link from "next/link";
import { Search, Home, Users, Shield, Play, Info } from "lucide-react";

import { ModeToggle } from "@/components/ui/theme-toggle";
import { openCommandPalette } from "@/lib/command-palette";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Staff", path: "/staff", icon: Users },
  { label: "Rules", path: "/rules", icon: Shield },
  { label: "Play", path: "/play", icon: Play },
  { label: "About", path: "/about", icon: Info },
];

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/70 dark:supports-[backdrop-filter]:bg-zinc-950/70 z-40">
      {/* Logo */}
        <Link
          href="/"
          className="font-black text-xl tracking-tight select-none flex items-center gap-1 group"
          tabIndex={0}
        >
          <span className="text-zinc-900 dark:text-white transition-colors">Nexus</span>
          <span className="text-brand-accent transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(var(--brand-accent-rgb),0.5)]">Mines</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            className="rounded-xl relative transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 group h-10 w-10 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          >
            <Search className="h-[1.1rem] w-[1.1rem] transition-colors" />
            <span className="sr-only">Search</span>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] px-2 py-px rounded bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50">
              Search - Ctrl K
            </span>
          </Button>

          {/* Theme toggle */}
          <ModeToggle />

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 hidden md:block" />

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-2">
            {NAV_LINKS.map(({ label, path, icon: Icon }, index) => (
              <Link
                key={label}
                href={path}
                style={{ animationDelay: `${index * 50}ms` }}
                className="
                  group relative
                  rounded-xl px-4 py-2 flex items-center gap-2
                  text-zinc-600 dark:text-zinc-400
                  hover:bg-zinc-100 dark:hover:bg-zinc-800
                  hover:text-zinc-900 dark:hover:text-white
                  transition-all duration-300
                  font-semibold text-xs tracking-tight
                  border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800
                  animate-in fade-in slide-in-from-right-2
                "
                tabIndex={0}
              >
                <Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
    </nav>
  );
}
