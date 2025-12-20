"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { openCommandPalette } from "@/lib/command-palette";

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    platform?: string;
  };
};

function isMacOS(): boolean {
  if (typeof navigator === "undefined") return false;

  const nav = navigator as NavigatorWithUAData;

  if (nav.userAgentData?.platform) {
    return nav.userAgentData.platform === "macOS";
  }

  return /Mac/i.test(navigator.userAgent);
}

export function Navbar() {
  const mac = isMacOS();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
      <Link href="/" className="font-bold text-lg">
        Nexus<span className="text-[rgb(var(--accent))]">Mines</span>
      </Link>

      <div className="flex items-center gap-6 text-sm">
        <button
          onClick={openCommandPalette}
          aria-label="Open command palette"
          className="group flex flex-col items-center text-zinc-400 hover:text-white transition"
        >
          <Search className="h-4 w-4" />
          <span className="mt-1 text-[10px] text-zinc-500 group-hover:text-zinc-300">
            {mac ? "⌘ K" : "Ctrl K"}
          </span>
        </button>

        <Link href="/vote">Vote</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  );
}
