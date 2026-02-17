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
        className="font-extrabold text-lg tracking-tight select-none flex items-center gap-1"
        tabIndex={0}
      >
        Nexus
        <span className="text-[rgb(var(--accent))]">Mines</span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={openCommandPalette}
          aria-label="Open command palette"
          className="
            rounded-xl relative
            transition-all duration-300
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            group
          "
        >
          <Search className="h-[1.2rem] w-[1.2rem] transition-colors" />
          <span className="sr-only">Search</span>
          <span
            className="
              absolute -bottom-5 left-1/2 -translate-x-1/2
              text-[10px] px-2 py-px rounded
              bg-zinc-100 dark:bg-zinc-900/70
              text-zinc-500 dark:text-zinc-400
              opacity-0 group-hover:opacity-100 pointer-events-none
              transition-all duration-300
            "
          >
            Ctrl K
          </span>
        </Button>

        {/* Theme toggle, same style */}
        <ModeToggle />

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2 ml-2">
          {NAV_LINKS.map(({ label, path, icon: Icon }) => (
            <Link
              key={label}
              href={path}
              className={`
                group
                rounded-xl px-4 py-2 flex items-center gap-1
                text-zinc-600 dark:text-zinc-400
                hover:bg-zinc-100 dark:hover:bg-zinc-800
                hover:text-zinc-900 dark:hover:text-white
                transition-all duration-300
                font-medium
              `}
              tabIndex={0}
            >
              <Icon className="h-[1.1rem] w-[1.1rem]" />
              <span className="hidden sm:inline text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
