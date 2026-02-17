"use client";

import { SunMedium } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="px-6 py-24 max-w-4xl mx-auto flex flex-col items-center">
      <div className="rounded-xl border border-border bg-card shadow-md w-full max-w-2xl p-8 flex flex-col items-center">
        <header className="flex items-center gap-3 mb-4">
          {/* NexusMines logo could go here */}
          <SunMedium className="h-8 w-8 text-yellow-400 dark:text-yellow-300 transition-all" />
          <h1 className="text-3xl font-bold tracking-tight">About NexusMines</h1>
        </header>
        <p className="text-md text-zinc-500 dark:text-zinc-400 leading-relaxed text-center mb-4">
          <span className="font-semibold text-zinc-800 dark:text-zinc-50">NexusMines</span> is built around long-term progression, fair gameplay, and systems that respect your time.<br />
          <span className="block mt-2">No pay-to-win tricks. No bloated mechanics. Just mining, perfected.</span>
        </p>
        <section className="mb-4 mt-2 w-full">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-50 mb-2">Features</h2>
          <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400 text-sm space-y-1">
            <li>Unique mining mechanics designed for skillful and efficient play</li>
            <li>Custom progression system with ranks, upgrades, and unlockables</li>
            <li>Balanced economy with fair rewards and meaningful choices</li>
            <li>Community-driven events and seasonal competitions</li>
            <li>No pay-to-win, cosmetics and boosters only earnable through gameplay</li>
            <li>Constant updates and new content based on player feedback</li>
          </ul>
        </section>
        <section className="mb-4 w-full">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-50 mb-2">Our Philosophy</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            We believe in transparency and respect for the player’s time and effort.<br />
            NexusMines is built without microtransactions that affect gameplay, excessive grind, or paywalls—so progression feels rewarding at every stage.
          </p>
        </section>
        <section className="mb-4 w-full">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-50 mb-2">Meet the Team</h2>
          <div className="text-zinc-600 dark:text-zinc-400 text-sm">
            <p>
              <span className="font-medium text-primary">DraftierMovie66</span> – Owner, Developer
            </p>
            <p>
              <span className="font-medium text-primary">ItzzMateo</span> – Co-Owner, Lead Developer & Designer
            </p>
            <p>
              <span className="font-medium text-primary">NexusMines Community</span> – Feedback, Testing & Inspiration
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <Link
              href="/staff"
              tabIndex={0}
              className={`
                group relative flex items-center
                rounded-xl transition-all duration-300
                hover:bg-zinc-100 dark:hover:bg-zinc-800
                px-4 py-2
                outline-none
                focus-visible:ring-2 focus-visible:ring-brand-accent
                text-xs font-semibold text-zinc-900 dark:text-white
                bg-transparent
              `}
              aria-label="See more staff"
            >
              <span className="tracking-tight transition-colors">
                See more
              </span>
              <span
                className={`
                  absolute -bottom-9 left-1/2 -translate-x-1/2
                  text-[10px] px-2 py-px rounded
                  bg-zinc-100 dark:bg-zinc-900/60
                  text-zinc-500 dark:text-zinc-400
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  transition-all duration-300
                `}
              >
                Full staff list
              </span>
            </Link>
          </div>
        </section>
        <div className="mt-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Made with ❤️ by <span className="font-medium text-primary">TechNova</span>
          </p>
          <div className="mt-2 text-xs text-zinc-400">
            Want to contribute or have feedback? Reach out on our Discord or open an issue on GitHub.
          </div>
        </div>
      </div>
    </section>
  );
}
