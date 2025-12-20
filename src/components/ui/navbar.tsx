"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { ModeToggle } from "@/components/ui/theme-toggle";
import { openCommandPalette } from "@/lib/command-palette";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
      {/* Logo */}
      <Link href="/" className="font-bold text-lg">
        Nexus<span className="text-[rgb(var(--accent))]">Mines</span>
      </Link>

      <div className="flex items-center gap-6 text-sm">
        {/* Search */}
        <button
          onClick={openCommandPalette}
          aria-label="Open command palette"
          className="
            group flex flex-col items-center
            text-zinc-500 hover:text-zinc-900
            dark:text-zinc-400 dark:hover:text-white
            transition
          "
        >
          <Search className="h-4 w-4" />
          <span className="mt-1 text-[10px] text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300">
            Ctrl K
          </span>
        </button>

        {/* Theme toggle */}
        <ModeToggle />

        <Link
          href="/vote"
          className="hover:text-zinc-900 dark:hover:text-white transition"
        >
          Vote
        </Link>

        <Link
          href="/about"
          className="hover:text-zinc-900 dark:hover:text-white transition"
        >
          About
        </Link>
      </div>
    </nav>
  );
}
